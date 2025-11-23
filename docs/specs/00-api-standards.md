# API 開發規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 API 開發規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

使用 HttpInterceptor 管理 token。

API error 必須 model 化（HttpErrorModel）。

統一 API 呼叫格式（企業格式：Result<T>）。

禁止在任何地方捕捉 error 不處理。

Repository 負責串 API、error handling、轉換 model。

禁止直接在 UI 展示 API DTO。

禁止非必要的 retry / throttle（由 backend 決定）。

使用 Repository 模式封裝資料存取邏輯。

所有資料庫操作必須通過 Supabase MCP 工具。

啟用 Supabase RLS (Row Level Security) 檢查。

支援分頁、排序、過濾查詢參數。

實作請求快取和重試機制。

提供統一的錯誤處理機制。

分支相關 API 需要權限驗證（owner/collaborating organization/viewer）。

PR 相關 API 需要實作審查和合併邏輯。

權限驗證必須在資料庫層 (RLS) 和應用層雙重驗證。

所有 API 請求（除公開端點外）都需要在 Header 中攜帶 JWT Token。

使用 TypeScript 型別定義 API 介面。

API 回應時間 < 500ms（95 百分位）。

使用參數化查詢防止 SQL 注入。

實作速率限制（Rate Limiting）。

監控異常 API 請求。

記錄 API 錯誤日誌。

使用統一回應格式處理成功和錯誤情況。

禁止在 API 回應中洩露敏感資訊。

API 端點命名使用 kebab-case。

使用 HTTP 狀態碼正確表示請求結果。

實作 API 版本控制（如需要）。

提供 API 文檔（OpenAPI/Swagger）。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
