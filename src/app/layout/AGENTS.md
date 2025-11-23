# Layout 模組開發規範（GitHub Copilot Agent 優化版）

## 📑 目錄

- [🎯 Layout 模組職責](#-layout-模組職責)
- [⚡ 快速參考](#-快速參考)
  - [依賴關係](#依賴關係)
  - [關鍵原則](#關鍵原則)
- [📋 核心規範檢查清單](#-核心規範檢查清單)
  - [響應式設計](#響應式設計)
  - [導航結構](#導航結構)
  - [狀態管理](#狀態管理)
  - [可訪問性（A11y）](#可訪問性a11y)
  - [效能優化](#效能優化)
- [🧪 測試要求](#-測試要求)
  - [覆蓋率標準](#覆蓋率標準)
  - [測試重點](#測試重點)
- [📚 相關 Cursor 規則](#-相關-cursor-規則)
  - [模組特定規則](#模組特定規則)
  - [通用規則（自動應用）](#通用規則自動應用)
- [🔗 相關文檔](#-相關文檔)
  - [必讀文檔](#必讀文檔)
  - [參考文檔](#參考文檔)
- [💡 AI 助手使用建議](#-ai-助手使用建議)
  - [適合使用的 AI 助手](#適合使用的-ai-助手)
  - [常見 Prompt 範例](#常見-prompt-範例)

---


> 📖 **目的**：為 Layout 模組開發提供 AI 助手友善的規範指引。本模組規範已整合到 Cursor 規則系統（`.cursor/rules/layout-specific.mdc`），規則會自動應用到 `src/app/layout/` 目錄。

## 🎯 Layout 模組職責

Layout 模組提供應用程式的**佈局結構**，包括：
- 🏢 **Basic Layout**：側邊欄 + 頂部導航 + 內容區域
- 📄 **Blank Layout**：無側邊欄的簡潔佈局
- 🔐 **Passport Layout**：登入、註冊等認證頁面佈局

## ⚡ 快速參考

### 依賴關係
```typescript
❌ 禁止依賴：layout 不可依賴 routes
```

### 關鍵原則
- **響應式設計**：支援多螢幕尺寸，Grid 系統，側邊欄自動收起
- **狀態管理**：使用 Signals，持久化到 localStorage
- **可訪問性**：ARIA 標籤、鍵盤導航、焦點管理
- **效能優化**：OnPush 策略、`trackBy` 優化、延遲加載

## 📋 核心規範檢查清單

### 響應式設計
- [ ] 支援桌面、平板、手機（≥768px, ≥576px, <576px）
- [ ] 使用 NG-ZORRO Grid 系統（`nz-row`, `nz-col`）
- [ ] 側邊欄在手機版自動收起
- [ ] 觸摸友善的互動元素（≥44px）
- [ ] 流暢的動畫過渡效果

```typescript
// ✅ 正確範例：響應式側邊欄
@Component({
  selector: 'app-basic-layout',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-layout>
      <nz-sider
        [nzCollapsed]="collapsed()"
        [nzBreakpoint]="'lg'"
        (nzCollapsedChange)="onCollapsedChange($event)">
        <app-sidebar />
      </nz-sider>
      <nz-layout>
        <nz-header>
          <app-header (toggleSidebar)="toggleSidebar()" />
        </nz-header>
        <nz-content>
          <router-outlet />
        </nz-content>
      </nz-layout>
    </nz-layout>
  `
})
export class BasicLayoutComponent {
  private layoutService = inject(LayoutService);
  collapsed = this.layoutService.sidebarCollapsed;

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  onCollapsedChange(collapsed: boolean): void {
    this.layoutService.setSidebarCollapsed(collapsed);
  }
}
```

### 導航結構
- [ ] 可配置的菜單結構（JSON 配置）
- [ ] 支援多級菜單（建議最多 3 級）
- [ ] 當前路由高亮顯示
- [ ] 麵包屑導航自動生成
- [ ] 菜單項權限控制

```typescript
// ✅ 正確範例：菜單配置
interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  children?: MenuItem[];
  permissions?: string[];
}

const menuConfig: MenuItem[] = [
  {
    title: '儀表板',
    icon: 'dashboard',
    link: '/dashboard'
  },
  {
    title: '用戶管理',
    icon: 'user',
    children: [
      { title: '用戶列表', link: '/users', permissions: ['user:read'] },
      { title: '角色管理', link: '/roles', permissions: ['role:read'] }
    ]
  }
];
```

### 狀態管理
- [ ] 使用 Signals 管理佈局狀態
- [ ] 側邊欄展開/收起狀態持久化
- [ ] 主題設定持久化
- [ ] 語言設定持久化
- [ ] 暴露 `ReadonlySignal` 給組件

```typescript
// ✅ 正確範例：LayoutService
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private collapsedSignal = signal<boolean>(
    localStorage.getItem('sidebar-collapsed') === 'true'
  );
  readonly sidebarCollapsed = this.collapsedSignal.asReadonly();

  toggleSidebar(): void {
    const newState = !this.collapsedSignal();
    this.setSidebarCollapsed(newState);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.collapsedSignal.set(collapsed);
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }
}
```

### 可訪問性（A11y）
- [ ] ARIA 標籤正確設置（`role`, `aria-label`, `aria-expanded`）
- [ ] 鍵盤導航支援（Tab, Enter, Escape, Arrow keys）
- [ ] 焦點管理（側邊欄打開/關閉時）
- [ ] 螢幕閱讀器友善（有意義的標籤）
- [ ] 高對比度主題支援

```html
<!-- ✅ 正確範例：可訪問的側邊欄 -->
<nz-sider
  role="navigation"
  [attr.aria-label]="'主導航'"
  [attr.aria-expanded]="!collapsed()">
  <nav role="menu">
    @for (item of menuItems(); track item.link) {
      <a
        role="menuitem"
        [routerLink]="item.link"
        [attr.aria-current]="isActive(item.link) ? 'page' : null"
        tabindex="0">
        {{ item.title }}
      </a>
    }
  </nav>
</nz-sider>
```

### 效能優化
- [ ] 使用 `OnPush` 變更檢測策略
- [ ] 菜單列表使用 `trackBy` 函數
- [ ] 延遲加載子菜單（`@defer`）
- [ ] 虛擬滾動大型菜單（`nz-virtual-scroll`）
- [ ] 避免不必要的重新渲染

```typescript
// ✅ 正確範例：trackBy 優化
trackByLink(index: number, item: MenuItem): string {
  return item.link || index.toString();
}
```

## 🧪 測試要求

### 覆蓋率標準
- **Layout 組件**：≥80% 覆蓋率（推薦）
- **LayoutService**：≥80% 覆蓋率（必須）
- **響應式行為**：100% 覆蓋率（推薦）

### 測試重點
- [ ] 側邊欄展開/收起功能
- [ ] 響應式行為（不同螢幕尺寸）
- [ ] 狀態持久化（localStorage）
- [ ] 鍵盤導航功能
- [ ] 菜單路由高亮

## 📚 相關 Cursor 規則

### 模組特定規則
- [Layout 模組特定規範](../../../.cursor/rules/layout-specific.mdc) ⭐ 自動應用

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc)
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc)
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc)
- [可訪問性](../../../.cursor/rules/accessibility.mdc) ⭐ 重要
- [性能優化](../../../.cursor/rules/performance.mdc)

## 🔗 相關文檔

### 必讀文檔
- [完整開發規範](../../../AGENTS.md) - AI 助手總覽
- [SHARED_IMPORTS 使用指南](../../../docs/37-SHARED_IMPORTS-使用指南.md)
- [開發工作流程](../../../docs/35-開發工作流程.md)

### 參考文檔
- [架構說明](../../../docs/fyi-architecture.md) - 系統架構設計
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語

## 💡 AI 助手使用建議

### 適合使用的 AI 助手
- **GitHub Copilot**：佈局組件開發、代碼補全
- **Cursor IDE**：即時規則檢查、響應式建議
- **Claude AI**：複雜導航結構設計
- **Gemini**：UI 設計圖轉佈局代碼、A11y 檢查

### 常見 Prompt 範例
請創建一個響應式的 Basic Layout，要求：
```text
2. 側邊欄在手機版自動收起
3. 狀態持久化到 localStorage
4. 實現鍵盤導航
5. 遵循 .cursor/rules/layout-specific.mdc 規範
```

- --

**最後更新**：2025-11-20
**架構版本**：v2.0
**維護者**：開發團隊
**適用**：GitHub Copilot Agent Mode
