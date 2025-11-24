/**
 * Menu Management Service
 *
 * 菜單管理服務（Shared 層）
 * Menu management service (Shared layer)
 *
 * 職責：
 * - 載入和管理菜單配置
 * - 根據上下文動態生成菜單
 * - 支持動態路由參數替換
 * - 權限過濾（未來擴展）
 * - 菜單緩存
 *
 * @module shared/services/menu
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ContextType } from '@core';
import { Menu, MenuService } from '@delon/theme';
import { Observable, of, catchError, map, shareReplay } from 'rxjs';

/**
 * 菜單配置介面
 * Menu configuration interface
 */
export interface MenuConfig {
  app?: Menu[];
  user?: Menu[];
  organization?: Menu[];
  team?: Menu[];
  bot?: Menu[];
}

/**
 * 菜單上下文參數
 * Menu context parameters
 */
export interface MenuContextParams {
  userId?: string;
  organizationId?: string;
  teamId?: string;
  botId?: string;
}

/**
 * 應用數據結構（從 app-data.json 載入）
 * Application data structure (loaded from app-data.json)
 */
interface AppData {
  app?: {
    name?: string;
    description?: string;
  };
  menu?: Menu[]; // 舊格式（向後兼容）
  menus?: MenuConfig; // 新格式
}

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {
  private readonly httpClient = inject(HttpClient);
  private readonly menuService = inject(MenuService);

  // 菜單配置狀態
  private menuConfigState = signal<MenuConfig | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 菜單緩存（按上下文類型）
  private menuCache = new Map<string, Menu[]>();

  // Readonly signals
  readonly menuConfig = this.menuConfigState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 載入菜單配置
   * Load menu configuration from app-data.json
   */
  loadMenuConfig(): Observable<MenuConfig> {
    if (this.menuConfigState()) {
      return of(this.menuConfigState()!);
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    return this.httpClient.get<AppData>('./assets/tmp/app-data.json').pipe(
      map(data => {
        // 支持新格式 (menus) 和舊格式 (menu) - 向後兼容
        const config: MenuConfig = data.menus || {
          app: data.menu || []
        };

        this.menuConfigState.set(config);
        this.loadingState.set(false);
        return config;
      }),
      catchError(error => {
        this.errorState.set(error.message || 'Failed to load menu config');
        this.loadingState.set(false);
        console.error('[MenuManagementService] Failed to load menu config:', error);
        return of({ app: [] });
      }),
      shareReplay(1)
    );
  }

  /**
   * 根據上下文類型獲取菜單
   * Get menu by context type
   */
  getMenuByContext(contextType: ContextType, params?: MenuContextParams): Menu[] {
    const config = this.menuConfigState();
    if (!config) {
      return [];
    }

    // 生成緩存鍵
    const cacheKey = this.generateCacheKey(contextType, params);
    if (this.menuCache.has(cacheKey)) {
      return this.menuCache.get(cacheKey)!;
    }

    // 獲取基礎菜單配置
    let menu: Menu[] = [];
    switch (contextType) {
      case ContextType.APP:
        // APP 菜單已移除，返回空陣列
        menu = [];
        break;
      case ContextType.USER:
        menu = config.user || [];
        break;
      case ContextType.ORGANIZATION:
        menu = config.organization || [];
        break;
      case ContextType.TEAM:
        menu = config.team || [];
        break;
      case ContextType.BOT:
        menu = config.bot || [];
        break;
      default:
        // 預設返回空陣列而非 APP 菜單
        menu = [];
    }

    // 深拷貝並處理動態參數
    const processedMenu = this.processMenuParams(JSON.parse(JSON.stringify(menu)), params);

    // 緩存處理後的菜單
    this.menuCache.set(cacheKey, processedMenu);

    return processedMenu;
  }

  /**
   * 更新菜單（根據上下文）
   * Update menu based on context
   */
  updateMenu(contextType: ContextType, params?: MenuContextParams): void {
    const menu = this.getMenuByContext(contextType, params);
    this.menuService.add(menu);
  }

  /**
   * 處理菜單中的動態參數
   * Process dynamic parameters in menu items
   */
  private processMenuParams(menu: Menu[], params?: MenuContextParams): Menu[] {
    if (!params) return menu;

    return menu.map(item => {
      const processed: Menu = { ...item };

      // 處理 link 中的動態參數
      if (processed.link) {
        processed.link = this.replaceRouteParams(processed.link, params);
      }

      // 遞歸處理子菜單
      if (processed.children && processed.children.length > 0) {
        processed.children = this.processMenuParams(processed.children, params);
      }

      return processed;
    });
  }

  /**
   * 替換路由中的動態參數
   * Replace dynamic parameters in route
   *
   * 支持以下格式：
   * - {userId}, {organizationId}, {teamId}, {botId}
   * - :userId, :organizationId, :teamId, :botId
   * - {orgId} (organizationId 的別名)
   */
  private replaceRouteParams(route: string, params: MenuContextParams): string {
    let result = route;

    if (params.userId) {
      result = result.replace(/\{userId\}/g, params.userId);
      result = result.replace(/:userId/g, params.userId);
    }

    if (params.organizationId) {
      result = result.replace(/\{organizationId\}/g, params.organizationId);
      result = result.replace(/:organizationId/g, params.organizationId);
      result = result.replace(/\{orgId\}/g, params.organizationId);
      result = result.replace(/:orgId/g, params.organizationId);
    }

    if (params.teamId) {
      result = result.replace(/\{teamId\}/g, params.teamId);
      result = result.replace(/:teamId/g, params.teamId);
    }

    if (params.botId) {
      result = result.replace(/\{botId\}/g, params.botId);
      result = result.replace(/:botId/g, params.botId);
    }

    return result;
  }

  /**
   * 生成緩存鍵
   * Generate cache key
   */
  private generateCacheKey(contextType: ContextType, params?: MenuContextParams): string {
    if (!params) return contextType;

    const parts: string[] = [contextType];
    if (params.userId) parts.push(`user:${params.userId}`);
    if (params.organizationId) parts.push(`org:${params.organizationId}`);
    if (params.teamId) parts.push(`team:${params.teamId}`);
    if (params.botId) parts.push(`bot:${params.botId}`);

    return parts.join('|');
  }

  /**
   * 清除菜單緩存
   * Clear menu cache
   */
  clearCache(): void {
    this.menuCache.clear();
  }

  /**
   * 清除特定上下文的緩存
   * Clear cache for specific context
   */
  clearCacheForContext(contextType: ContextType, params?: MenuContextParams): void {
    const cacheKey = this.generateCacheKey(contextType, params);
    this.menuCache.delete(cacheKey);
  }
}
