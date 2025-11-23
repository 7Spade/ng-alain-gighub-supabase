# Core 模組開發規範（GitHub Copilot Agent 優化版）

> 📖 **目的**：為 Core 模組開發提供 AI 助手友善的規範指引。本模組規範已整合到 Cursor 規則系統（`.cursor/rules/core-specific.mdc`），規則會自動應用到 `src/app/core/` 目錄。

## 🎯 Core 模組職責

Core 模組是應用程式的**核心基礎設施層**，提供：
- 🌐 **網路請求攔截**：HTTP Interceptors、認證 token、錯誤處理、重試邏輯
- 🌍 **國際化服務**：i18n、多語言資源管理、動態語言切換
- 🚀 **應用啟動邏輯**：初始化配置、認證恢復、資源預加載
- 🛡️ **路由守衛**：canActivate/canActivateChild、認證驗證、權限檢查
- 🗄️ **Supabase 整合**：資料庫操作、RLS 策略、Repository 模式

## ⚡ 快速參考

### 依賴關係
```typescript
❌ 禁止依賴：core 不可依賴 routes 或 shared
```

### 關鍵原則
- **單例服務**：使用 `@Injectable({ providedIn: 'root' })`
- **錯誤處理**：`ErrorStateService` 統一管理，明確分類
- **狀態管理**：使用 Signals，暴露 `ReadonlySignal`
- **安全第一**：Supabase RLS 策略、Token 管理、環境變數

## 📋 核心規範檢查清單

### HTTP 攔截器（Interceptors）
- [ ] 統一添加認證 token（from `@delon/auth TokenService`）
- [ ] 統一錯誤處理（轉發到 `ErrorStateService`）
- [ ] 實現重試邏輯（3 次，指數退避）
- [ ] 設定請求超時（30 秒）
- [ ] 記錄請求日誌（開發環境）

```typescript
// ✅ 正確範例
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.get()?.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

### 錯誤處理服務
- [ ] 使用 Signals 管理錯誤狀態
- [ ] 分類錯誤：網路錯誤、認證錯誤、業務錯誤
- [ ] 提供重試機制
- [ ] 友善的用戶錯誤訊息
- [ ] 記錄錯誤日誌

```typescript
// ✅ 正確範例
@Injectable({ providedIn: 'root' })
export class ErrorStateService {
  private errorSignal = signal<AppError | null>(null);
  readonly error = this.errorSignal.asReadonly();

  setError(error: AppError): void {
    this.errorSignal.set(error);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
```

### 應用啟動服務
- [ ] 初始化應用配置
- [ ] 恢復用戶認證狀態
- [ ] 預加載必要資源
- [ ] 錯誤處理與降級策略
- [ ] 啟動進度反饋

### 路由守衛
- [ ] 檢查認證狀態（使用 `@delon/auth`）
- [ ] 檢查用戶權限（基於 Supabase RLS）
- [ ] 未認證時導向登入頁
- [ ] 無權限時顯示 403 頁面
- [ ] 記錄導航日誌

### Supabase 操作
- [ ] 啟用 RLS 策略
- [ ] 使用 Repository 模式
- [ ] 類型安全（使用 `database.types.ts`）
- [ ] 錯誤處理與重試
- [ ] 連接池管理

## 🧪 測試要求

### 覆蓋率標準
- **服務層**：≥80% 覆蓋率（必須）
- **關鍵邏輯**：100% 覆蓋率（必須）
- **HTTP 攔截器**：100% 覆蓋率（推薦）
- **路由守衛**：100% 覆蓋率（推薦）

### 測試重點
- [ ] HTTP 攔截器：token 添加、錯誤處理、重試邏輯
- [ ] 錯誤處理服務：分類、重試、清除
- [ ] 應用啟動服務：初始化流程、錯誤降級
- [ ] 路由守衛：認證檢查、權限驗證、導航邏輯

## 📚 相關 Cursor 規則

### 模組特定規則
- [Core 模組特定規範](../../../.cursor/rules/core-specific.mdc) ⭐ 自動應用

### 通用規則（自動應用）
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc)
- [錯誤處理](../../../.cursor/rules/error-handling.mdc)
- [API 設計](../../../.cursor/rules/api-design.mdc)
- [安全規範](../../../.cursor/rules/security.mdc)
- [測試規範](../../../.cursor/rules/testing.mdc)

## 🔗 相關文檔

### 必讀文檔
- [完整開發規範](../../../AGENTS.md) - AI 助手總覽
- [錯誤處理指南](../../../docs/37-錯誤處理指南.md)
- [測試指南](../../../docs/38-測試指南.md)
- [RLS策略開發指南](../../../docs/50-RLS策略開發指南.md)

### 參考文檔
- [架構說明](../../../docs/fyi-architecture.md) - 系統架構設計
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型、設計決策
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語、業務背景

## 💡 AI 助手使用建議

### 適合使用的 AI 助手
- **GitHub Copilot**：日常開發、代碼補全
- **Cursor IDE**：即時規則檢查、代碼建議
- **Claude AI**：複雜服務設計、錯誤處理策略
- **Gemini**：搜尋最新安全實踐、API 更新

### 常見 Prompt 範例
請為 Core 模組創建一個 HTTP 攔截器，要求：
```text
2. 統一錯誤處理
3. 實現 3 次重試（指數退避）
4. 遵循 .cursor/rules/core-specific.mdc 規範
```

- --

**最後更新**：2025-11-20
**架構版本**：v2.0
**維護者**：開發團隊
**適用**：GitHub Copilot Agent Mode

