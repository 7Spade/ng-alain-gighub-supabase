# 安全規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 安全規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

不能直接存取 DOM → 用 Renderer2。

禁止 eval / Function constructor。

所有 HTML 輸入需 sanitization。

XSS 安全檢查 mandatory。

JWT 必須使用 rotation + refresh flow。

RBAC / ABAC 控制不可只在前端。

所有資料庫操作必須通過 Supabase MCP 工具。

啟用 Supabase RLS (Row Level Security) 檢查。

分支權限必須在資料庫層 (RLS) 和應用層雙重驗證。

敏感資料不在前端儲存或傳輸。

使用環境變數管理 API Keys 和敏感配置。

禁止在程式碼中硬編碼敏感資訊。

PR 合併操作必須驗證擁有者權限。

暫存區回滾操作必須驗證提交者身份。

所有權限驗證必須在服務層實作。

定期檢查依賴套件安全漏洞（使用 `yarn audit`）。

所有表都必須啟用 RLS。

每個表都必須有適當的 SELECT、INSERT、UPDATE、DELETE 策略。

使用 `DomSanitizer` 清理不信任的內容。

使用 Content Security Policy (CSP) 標頭。

使用 SameSite Cookie 防護 CSRF。

API 請求必須包含有效的 JWT Token。

Token 不在 URL 中傳遞。

敏感資料不在 UI 中顯示（如完整密碼）。

錯誤訊息不洩露敏感資訊。

使用參數化查詢防止 SQL 注入（Supabase Client SDK 自動處理）。

所有用戶輸入都經過驗證（前端與後端雙重驗證）。

監控異常登入活動和異常 API 請求。

設定安全告警機制。

定期執行安全審計（每月一次）。

使用 HTTPS/TLS 1.3 加密傳輸。

敏感欄位使用加密儲存（pgcrypto、bcrypt）。

密碼使用 bcrypt 雜湊。

日誌中移除個人資料。

實作速率限制（Rate Limiting）。

監控資料庫查詢異常。

檢查常見安全漏洞（OWASP Top 10）。

測試權限提升攻擊。

測試資料洩露風險。

檢查用戶權限分配。

檢查所有 RLS 策略。

檢查 API 認證與授權。

檢查敏感資料處理。

檢查錯誤日誌中的安全相關錯誤。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
