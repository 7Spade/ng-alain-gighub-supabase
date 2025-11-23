# Shared 模組開發規範（GitHub Copilot Agent 優化版）

## 📑 目錄

- [🎯 Shared 模組職責](#-shared-模組職責)
- [⚡ 快速參考](#-快速參考)
  - [依賴關係](#依賴關係)
  - [關鍵原則](#關鍵原則)
- [📋 核心規範檢查清單](#-核心規範檢查清單)
  - [UI 組件開發](#ui-組件開發)
  - [工具函數開發](#工具函數開發)
  - [共享服務開發](#共享服務開發)
  - [SHARED_IMPORTS 使用](#shared_imports-使用)
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


> 📖 **目的**：為 Shared 模組開發提供 AI 助手友善的規範指引。本模組規範已整合到 Cursor 規則系統（`.cursor/rules/shared-specific.mdc`），規則會自動應用到 `src/app/shared/` 目錄。

## 🎯 Shared 模組職責

Shared 模組提供**可重用的組件、服務和工具**，包括：
- 🎨 **UI 組件**：使用 `SHARED_IMPORTS`，高度可重用
- 🔧 **工具函數**：日期處理、字串操作、數據轉換
- 🌐 **共享服務**：無狀態或輕量級狀態管理
- 📦 **通用 Widget**：卡片、表格、表單組件

## ⚡ 快速參考

### 依賴關係
```typescript
✅ 可依賴：shared 可依賴 core
❌ 禁止依賴：shared 不可依賴 routes
```

### 關鍵原則
- **SHARED_IMPORTS 優先**：所有 UI 層組件必須優先使用
- **高度可重用**：組件、工具、服務都應設計為可重用
- **無狀態優先**：服務使用 Signals，暴露 `ReadonlySignal`
- **OnPush 策略**：所有組件使用 `ChangeDetectionStrategy.OnPush`

## 📋 核心規範檢查清單

### UI 組件開發
- [ ] 使用 Standalone Components
- [ ] 優先使用 `SHARED_IMPORTS`（必須）
- [ ] 使用 `OnPush` 變更檢測策略
- [ ] 使用 Signals 管理組件狀態
- [ ] 使用現代 control flow（`@if`, `@for`, `@switch`, `@defer`）
- [ ] 實現無障礙功能（ARIA 標籤）
- [ ] 響應式設計（支援多種螢幕尺寸）

```typescript
// ✅ 正確範例：Shared Component
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as userData) {
      <nz-card [nzTitle]="userData.name">
        <p>{{ userData.email }}</p>
      </nz-card>
    } @else {
      <nz-spin />
    }
  `
})
export class UserCardComponent {
  user = input.required<User | null>();
  onEdit = output<User>();
}
```

### 工具函數開發
- [ ] 純函數（無副作用）
- [ ] 完整的型別定義
- [ ] 單元測試覆蓋率 100%
- [ ] JSDoc 文檔註解
- [ ] 邊界條件處理

```typescript
// ✅ 正確範例：工具函數
/**
 * 格式化日期為 YYYY-MM-DD
 * @param date - 要格式化的日期
 * @returns 格式化後的字串，失敗返回空字串
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
```

### 共享服務開發
- [ ] 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 Signals 管理狀態
- [ ] 暴露 `ReadonlySignal` 給組件
- [ ] 無狀態或輕量級狀態
- [ ] 完整的錯誤處理
- [ ] 單元測試覆蓋率 ≥80%

```typescript
// ✅ 正確範例：Shared Service
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>('light');
  readonly theme = this.themeSignal.asReadonly();

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.themeSignal.set(savedTheme);
    }
  }
}
```

### SHARED_IMPORTS 使用
- [ ] 所有 UI 組件優先使用 `SHARED_IMPORTS`
- [ ] 不重複導入 `SHARED_IMPORTS` 內已包含的模組
- [ ] 特殊需求才添加額外 imports
- [ ] 遵循 `docs/37-SHARED_IMPORTS-使用指南.md`

```typescript
// ✅ 正確：優先使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared';

@Component({
  imports: [SHARED_IMPORTS],
  // ...
})

// ❌ 錯誤：重複導入
import { SHARED_IMPORTS } from '@shared';
import { CommonModule } from '@angular/common'; // ❌ 已在 SHARED_IMPORTS 中

@Component({
  imports: [SHARED_IMPORTS, CommonModule], // ❌ 重複
  // ...
})
```

## 🧪 測試要求

### 覆蓋率標準
- **UI 組件**：建議測試（可選）
- **工具函數**：100% 覆蓋率（必須）
- **共享服務**：≥80% 覆蓋率（必須）

### 測試重點
- [ ] 工具函數：所有邊界條件、錯誤情況
- [ ] 共享服務：狀態管理、持久化、錯誤處理
- [ ] UI 組件：輸入輸出、事件觸發、響應式行為

## 📚 相關 Cursor 規則

### 模組特定規則
- [Shared 模組特定規範](../../../.cursor/rules/shared-specific.mdc) ⭐ 自動應用

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc)
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc)
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc) ⭐ 必讀
- [代碼質量](../../../.cursor/rules/code-quality.mdc)
- [可訪問性](../../../.cursor/rules/accessibility.mdc)

## 🔗 相關文檔

### 必讀文檔
- [完整開發規範](../../../AGENTS.md) - AI 助手總覽
- [SHARED_IMPORTS 使用指南](../../../docs/37-SHARED_IMPORTS-使用指南.md) ⭐⭐⭐
- [開發最佳實踐指南](../../../docs/42-開發最佳實踐指南.md)

### 參考文檔
- [開發工作流程](../../../docs/35-開發工作流程.md)
- [架構說明](../../../docs/fyi-architecture.md) - 分層架構設計
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語

## 💡 AI 助手使用建議

### 適合使用的 AI 助手
- **GitHub Copilot**：組件開發、代碼補全
- **Cursor IDE**：即時規則檢查、SHARED_IMPORTS 建議
- **Claude AI**：設計可重用組件架構
- **Gemini**：UI 設計圖轉組件代碼

### 常見 Prompt 範例
請創建一個可重用的 UserCard 組件，要求：
```text
2. 接收 user 作為 input signal
3. 發出 onEdit 作為 output
4. 使用 NG-ZORRO nz-card 組件
5. 實現 OnPush 變更檢測
6. 遵循 .cursor/rules/shared-specific.mdc 規範
```

- --

**最後更新**：2025-11-20
**架構版本**：v2.0
**維護者**：開發團隊
**適用**：GitHub Copilot Agent Mode

