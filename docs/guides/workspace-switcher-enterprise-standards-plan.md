# Workspace Switcher 企業標準實現規劃

## 📋 目錄

- [概述](#概述)
- [現狀分析](#現狀分析)
- [8 大企業標準評估](#8-大企業標準評估)
- [實現規劃](#實現規劃)
- [實施步驟](#實施步驟)
- [驗收標準](#驗收標準)

---

## 概述

本文檔定義 Workspace Switcher 達到企業級標準的實現規劃，確保系統具備清晰的工作區邊界、上下文感知、權限管理、一致性、安全性、性能和可擴展性。

**目標**：將現有的 Workspace Switcher 提升至企業級標準，滿足大型企業多租戶、多角色、跨系統整合的需求。

**適用範圍**：
- WorkspaceContextService
- WorkspaceContextFacade
- Context Switcher Component
- 權限管理系統
- 審計日誌系統
- 性能優化系統

---

## 現狀分析

### ✅ 已實現功能

1. **基本上下文切換**
   - ✅ 支持 USER、ORGANIZATION、TEAM、APP 四種上下文類型
   - ✅ 使用 Signals 管理狀態
   - ✅ 持久化到 localStorage
   - ✅ 自動恢復上下文

2. **數據管理**
   - ✅ WorkspaceDataService 載入工作區數據
   - ✅ 組織和團隊數據管理
   - ✅ 錯誤處理

3. **UI 組件**
   - ✅ Context Switcher 組件
   - ✅ 使用現代 Angular 語法
   - ✅ 響應式設計

### ⚠️ 缺失功能

1. **工作區邊界定義**：缺少明確的範圍提示
2. **智能推薦**：缺少基於歷史活動的推薦
3. **權限即時更新**：切換時未即時驗證權限
4. **狀態保留**：切換工作區時未保留頁面狀態
5. **審計日誌**：切換操作未記錄到審計日誌
6. **預加載/快取**：缺少性能優化
7. **跨系統整合**：未實現
8. **可擴展性**：需要改進以支持新工作區類型

---

## 8 大企業標準評估

### 1. 清晰的工作區邊界 ⚠️ 部分實現

#### 現狀
- ✅ 支持 USER、ORGANIZATION、TEAM、APP 四種類型
- ❌ 缺少明確的範圍定義文檔
- ❌ 切換時未提示用戶將看到的資源和操作權限
- ❌ 缺少工作區範圍的可視化展示

#### 需要實現
- [ ] 定義每個工作區類型的明確範圍
- [ ] 切換時顯示工作區範圍提示（Modal/Tooltip）
- [ ] 顯示用戶在該工作區的角色和權限
- [ ] 顯示可訪問的資源類型（藍圖、任務、文件等）

#### 實現優先級：**高**

---

### 2. 上下文感知切換 ⚠️ 部分實現

#### 現狀
- ✅ 切換時自動更新菜單
- ✅ 組件根據上下文動態顯示內容
- ❌ 缺少自動過濾機制（依賴 RLS，但前端未明確提示）
- ❌ 缺少智能推薦功能
- ❌ 缺少基於歷史活動的優先排序

#### 需要實現
- [ ] 切換時明確提示數據過濾範圍
- [ ] 實現智能推薦算法（基於訪問頻率、最近訪問時間）
- [ ] 工作區列表按推薦優先級排序
- [ ] 顯示工作區訪問統計（最近訪問、訪問次數）

#### 實現優先級：**中**

---

### 3. 權限與身份管理 ⚠️ 部分實現

#### 現狀
- ✅ 有 RLS 策略（資料庫層）
- ✅ 有角色系統（roles、user_roles 表）
- ❌ 切換時未即時更新前端權限檢查
- ❌ 缺少權限變更通知
- ❌ 缺少多重角色映射機制
- ❌ 缺少越權操作防護提示

#### 需要實現
- [ ] 切換時即時載入並驗證用戶權限
- [ ] 實現 WorkspacePermissionService 管理權限狀態
- [ ] 根據權限動態顯示/隱藏功能按鈕
- [ ] 實現權限變更監聽機制
- [ ] 顯示用戶在當前工作區的角色和權限列表
- [ ] 實現越權操作防護（前端驗證 + 後端 RLS）

#### 實現優先級：**高**

---

### 4. 一致性與可預期性 ⚠️ 部分實現

#### 現狀
- ✅ UI 組件位置固定（側邊欄）
- ✅ 切換時更新菜單
- ❌ 切換時未保留頁面狀態（篩選、排序、打開的頁面）
- ❌ 缺少切換動畫/過渡效果
- ❌ 缺少切換進度提示

#### 需要實現
- [ ] 實現狀態保留機制（使用 SessionStorage）
- [ ] 切換時保留頁面篩選、排序、分頁狀態
- [ ] 切換時保留打開的標籤頁（ReuseTab）
- [ ] 實現平滑的切換動畫
- [ ] 顯示切換進度（Loading 狀態）
- [ ] 統一操作入口（確保全局可見）

#### 實現優先級：**中**

---

### 5. 操作安全與審計 ❌ 未實現

#### 現狀
- ✅ 有 activity_logs 表
- ❌ 切換操作未記錄到審計日誌
- ❌ 缺少操作追蹤機制
- ❌ 缺少審計日誌查詢界面

#### 需要實現
- [ ] 切換時記錄到 activity_logs 表
- [ ] 記錄切換前後的工作區信息
- [ ] 記錄切換時間、IP 地址、User Agent
- [ ] 實現審計日誌查詢 Service
- [ ] 實現審計日誌查詢界面（可選）

#### 實現優先級：**高**

---

### 6. 性能與即時性 ⚠️ 部分實現

#### 現狀
- ✅ 使用 Signals 優化變更檢測
- ✅ 使用 OnPush 策略
- ❌ 缺少預加載機制
- ❌ 缺少數據快取策略
- ❌ 切換時可能造成頁面刷新

#### 需要實現
- [ ] 實現工作區數據預加載（預加載常用工作區）
- [ ] 實現數據快取機制（使用 IndexedDB 或 Memory Cache）
- [ ] 優化切換響應時間（目標 < 200ms）
- [ ] 實現增量載入（只載入變更的數據）
- [ ] 使用 Web Worker 處理大量數據

#### 實現優先級：**中**

---

### 7. 跨系統整合 ❌ 未實現

#### 現狀
- ❌ 未實現跨系統上下文保持
- ❌ API 設計未統一支持 Workspace 參數
- ❌ 缺少跨系統單點登入（SSO）整合

#### 需要實現
- [ ] 設計跨系統上下文傳遞機制（JWT Claims）
- [ ] API 統一支持 workspace_id 參數
- [ ] 實現跨系統上下文同步（使用 Event Bus 或 WebSocket）
- [ ] 支持 SSO 整合（未來擴展）

#### 實現優先級：**低**（未來擴展）

---

### 8. 可擴展性 ⚠️ 部分實現

#### 現狀
- ✅ 使用 ContextType 枚舉，易於擴展
- ✅ 使用策略模式管理不同工作區類型
- ❌ 缺少動態工作區類型註冊機制
- ❌ 缺少插件化架構

#### 需要實現
- [ ] 實現工作區類型註冊機制（Registry Pattern）
- [ ] 支持動態權限策略配置
- [ ] 支持自定義工作區類型（如子組織、專案群組）
- [ ] 實現插件化架構（未來擴展）

#### 實現優先級：**低**（未來擴展）

---

## 實現規劃

### 階段 1：核心功能增強（高優先級）⏱️ 2-3 週

#### 1.1 工作區邊界定義與提示

**目標**：明確定義每個工作區的範圍，切換時提示用戶。

**實現內容**：
- [ ] 創建 `WorkspaceScopeService` 定義工作區範圍
- [ ] 實現工作區範圍提示組件（Modal/Tooltip）
- [ ] 在切換時顯示範圍和權限信息
- [ ] 更新文檔說明每個工作區類型的範圍

**文件位置**：
```
src/app/shared/services/account/workspace-scope.service.ts
src/app/shared/components/workspace-scope-tooltip/
```

#### 1.2 權限即時更新機制

**目標**：切換工作區時即時載入並驗證權限。

**實現內容**：
- [ ] 創建 `WorkspacePermissionService` 管理權限狀態
- [ ] 實現權限載入機制（從 user_roles 表載入）
- [ ] 實現權限變更監聽（使用 Signals）
- [ ] 組件根據權限動態顯示/隱藏功能
- [ ] 實現權限提示組件

**文件位置**：
```
src/app/shared/services/account/workspace-permission.service.ts
src/app/core/facades/account/workspace-permission.facade.ts
```

#### 1.3 審計日誌記錄

**目標**：記錄所有工作區切換操作。

**實現內容**：
- [ ] 在 `WorkspaceContextService` 中添加審計日誌記錄
- [ ] 創建 `WorkspaceAuditService` 處理審計日誌
- [ ] 記錄切換前後的工作區信息
- [ ] 記錄 IP 地址、User Agent、時間戳
- [ ] 實現審計日誌查詢 Service

**文件位置**：
```
src/app/shared/services/account/workspace-audit.service.ts
src/app/core/infra/repositories/activity-log.repository.ts
```

---

### 階段 2：用戶體驗優化（中優先級）⏱️ 2 週

#### 2.1 狀態保留機制

**目標**：切換工作區時保留頁面狀態。

**實現內容**：
- [ ] 創建 `WorkspaceStateService` 管理狀態
- [ ] 使用 SessionStorage 存儲頁面狀態
- [ ] 實現狀態恢復機制
- [ ] 支持篩選、排序、分頁狀態保留
- [ ] 支持 ReuseTab 狀態保留

**文件位置**：
```
src/app/shared/services/account/workspace-state.service.ts
```

#### 2.2 智能推薦系統

**目標**：根據用戶歷史活動推薦工作區。

**實現內容**：
- [ ] 創建 `WorkspaceRecommendationService`
- [ ] 實現訪問頻率統計
- [ ] 實現最近訪問時間追蹤
- [ ] 實現推薦算法（加權評分）
- [ ] 工作區列表按推薦優先級排序
- [ ] 顯示推薦標籤

**文件位置**：
```
src/app/shared/services/account/workspace-recommendation.service.ts
src/app/core/infra/repositories/workspace-access-log.repository.ts
```

#### 2.3 切換動畫與進度提示

**目標**：提供流暢的切換體驗。

**實現內容**：
- [ ] 實現切換動畫（使用 Angular Animations）
- [ ] 顯示切換進度（Loading 狀態）
- [ ] 優化切換響應時間
- [ ] 實現錯誤狀態提示

**文件位置**：
```
src/app/layout/basic/widgets/context-switcher.component.ts
src/app/shared/animations/workspace-switch.animation.ts
```

---

### 階段 3：性能優化（中優先級）⏱️ 1-2 週

#### 3.1 數據預加載與快取

**目標**：優化切換響應時間。

**實現內容**：
- [ ] 實現工作區數據預加載（預加載常用工作區）
- [ ] 實現數據快取機制（Memory Cache + IndexedDB）
- [ ] 實現增量載入（只載入變更的數據）
- [ ] 實現快取失效策略
- [ ] 使用 Web Worker 處理大量數據（可選）

**文件位置**：
```
src/app/shared/services/account/workspace-cache.service.ts
src/app/shared/services/account/workspace-preload.service.ts
```

---

### 階段 4：可擴展性與跨系統整合（低優先級）⏱️ 未來擴展

#### 4.1 工作區類型註冊機制

**目標**：支持動態添加新的工作區類型。

**實現內容**：
- [ ] 實現工作區類型註冊機制（Registry Pattern）
- [ ] 支持自定義工作區類型
- [ ] 實現插件化架構

#### 4.2 跨系統整合

**目標**：支持跨系統上下文保持。

**實現內容**：
- [ ] 設計跨系統上下文傳遞機制
- [ ] API 統一支持 workspace_id 參數
- [ ] 實現跨系統上下文同步

---

## 實施步驟

### 步驟 1：準備工作（1 天）

1. **創建數據表**（如需要）
   ```sql
   -- 工作區訪問日誌表（用於推薦系統）
   CREATE TABLE workspace_access_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     account_id UUID NOT NULL REFERENCES accounts(id),
     workspace_type VARCHAR(50) NOT NULL,
     workspace_id UUID NOT NULL,
     accessed_at TIMESTAMPTZ DEFAULT NOW(),
     ip_address INET,
     user_agent TEXT
   );

   CREATE INDEX idx_workspace_access_account ON workspace_access_logs(account_id, accessed_at DESC);
   CREATE INDEX idx_workspace_access_workspace ON workspace_access_logs(workspace_type, workspace_id);
   ```

2. **更新類型定義**
   - 擴展 `ContextType` 枚舉（如需要）
   - 添加工作區範圍類型定義
   - 添加權限類型定義

### 步驟 2：實現核心服務（1 週）

1. **WorkspaceScopeService**
   - 定義工作區範圍
   - 實現範圍查詢方法

2. **WorkspacePermissionService**
   - 實現權限載入
   - 實現權限驗證
   - 實現權限變更監聽

3. **WorkspaceAuditService**
   - 實現審計日誌記錄
   - 實現審計日誌查詢

### 步驟 3：更新現有服務（3 天）

1. **更新 WorkspaceContextService**
   - 集成審計日誌記錄
   - 集成權限驗證
   - 添加範圍提示

2. **更新 WorkspaceContextFacade**
   - 暴露權限相關 Signals
   - 暴露範圍相關 Signals

### 步驟 4：更新 UI 組件（3 天）

1. **更新 Context Switcher 組件**
   - 添加範圍提示
   - 添加權限顯示
   - 添加推薦標籤
   - 添加切換動畫

2. **創建新組件**
   - WorkspaceScopeTooltip 組件
   - WorkspacePermissionBadge 組件

### 步驟 5：實現狀態保留（2 天）

1. **WorkspaceStateService**
   - 實現狀態存儲
   - 實現狀態恢復

2. **集成到現有組件**
   - 更新 Dashboard 組件
   - 更新 Settings 組件

### 步驟 6：實現推薦系統（3 天）

1. **WorkspaceRecommendationService**
   - 實現訪問統計
   - 實現推薦算法

2. **更新 Context Switcher**
   - 按推薦優先級排序
   - 顯示推薦標籤

### 步驟 7：性能優化（3 天）

1. **WorkspaceCacheService**
   - 實現數據快取
   - 實現快取失效策略

2. **WorkspacePreloadService**
   - 實現預加載機制

### 步驟 8：測試與文檔（2 天）

1. **單元測試**
   - 測試所有新服務
   - 測試權限驗證邏輯

2. **整合測試**
   - 測試完整切換流程
   - 測試權限變更場景

3. **更新文檔**
   - 更新開發文檔
   - 更新用戶文檔

---

## 驗收標準

### 1. 清晰的工作區邊界 ✅

- [ ] 每個工作區類型有明確的範圍定義文檔
- [ ] 切換時顯示範圍提示（Modal/Tooltip）
- [ ] 顯示用戶在該工作區的角色和權限
- [ ] 顯示可訪問的資源類型

### 2. 上下文感知切換 ✅

- [ ] 切換時明確提示數據過濾範圍
- [ ] 工作區列表按推薦優先級排序
- [ ] 顯示工作區訪問統計
- [ ] 智能推薦準確率 > 70%

### 3. 權限與身份管理 ✅

- [ ] 切換時即時載入並驗證權限
- [ ] 根據權限動態顯示/隱藏功能
- [ ] 顯示用戶在當前工作區的角色和權限列表
- [ ] 越權操作被正確阻止並提示

### 4. 一致性與可預期性 ✅

- [ ] 切換時保留頁面狀態（篩選、排序、分頁）
- [ ] 切換時保留打開的標籤頁
- [ ] 切換動畫流暢（< 300ms）
- [ ] 切換進度提示清晰

### 5. 操作安全與審計 ✅

- [ ] 所有切換操作記錄到審計日誌
- [ ] 審計日誌包含完整信息（時間、IP、User Agent、前後工作區）
- [ ] 審計日誌可查詢
- [ ] 審計日誌不可篡改

### 6. 性能與即時性 ✅

- [ ] 切換響應時間 < 200ms（無網絡請求）
- [ ] 切換響應時間 < 500ms（有網絡請求）
- [ ] 常用工作區數據預加載
- [ ] 數據快取命中率 > 80%

### 7. 跨系統整合 ✅（未來擴展）

- [ ] API 統一支持 workspace_id 參數
- [ ] 跨系統上下文傳遞機制設計完成
- [ ] 跨系統上下文同步機制實現

### 8. 可擴展性 ✅

- [ ] 支持動態添加新的工作區類型
- [ ] 支持自定義權限策略
- [ ] 插件化架構設計完成

---

## 技術實現細節

### 1. WorkspaceScopeService 設計

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceScopeService {
  /**
   * 獲取工作區範圍定義
   */
  getScope(contextType: ContextType): WorkspaceScope {
    // 返回工作區範圍定義
  }

  /**
   * 獲取可訪問的資源類型
   */
  getAccessibleResources(contextType: ContextType, contextId: string): ResourceType[] {
    // 返回可訪問的資源類型列表
  }
}
```

### 2. WorkspacePermissionService 設計

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspacePermissionService {
  private readonly permissionsState = signal<WorkspacePermissions | null>(null);

  readonly permissions = this.permissionsState.asReadonly();

  /**
   * 載入工作區權限
   */
  async loadPermissions(contextType: ContextType, contextId: string): Promise<void> {
    // 從 user_roles 表載入權限
  }

  /**
   * 檢查權限
   */
  hasPermission(permission: string): boolean {
    // 檢查是否有指定權限
  }
}
```

### 3. WorkspaceAuditService 設計

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceAuditService {
  /**
   * 記錄工作區切換
   */
  async logWorkspaceSwitch(
    fromContext: ContextState,
    toContext: ContextState,
    metadata?: AuditMetadata
  ): Promise<void> {
    // 記錄到 activity_logs 表
  }
}
```

---

## 相關文檔

- [上下文切換器文檔](../../archive/2025/design-docs/CONTEXT_SWITCHER_DOCUMENTATION_GUIDE.md)
- [權限管理文檔](../architecture/09-security-rls-permission-matrix.md)
- [審計日誌設計](../../reference/sql-schema-definition.md#45-activity_logs-活動記錄表)
- [性能優化指南](./performance-optimization-guide.md)

---

**最後更新**：2025-01-20  
**維護者**：開發團隊  
**狀態**：規劃中

