# 安全檢查清單


> **📚 目的**: 提供完整的安全檢查清單，確保應用程式符合安全標準

## 目標讀者 (Audience)

- 所有開發者
- 安全工程師
- 技術主管

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [Git-like / 暫存安全檢查](#git-like--暫存安全檢查)
- [安全檢查概述](#安全檢查概述)
  - [檢查頻率](#檢查頻率)
  - [檢查範圍](#檢查範圍)
- [RLS 策略檢查](#rls-策略檢查)
  - [1. 基本檢查](#1-基本檢查)
  - [2. 策略驗證](#2-策略驗證)
    - [使用 Supabase MCP 工具檢查](#使用-supabase-mcp-工具檢查)
    - [手動驗證](#手動驗證)
  - [3. 權限矩陣對照](#3-權限矩陣對照)
  - [4. 測試檢查](#4-測試檢查)
- [API 認證檢查](#api-認證檢查)
  - [1. JWT Token 驗證](#1-jwt-token-驗證)
  - [2. 認證流程檢查](#2-認證流程檢查)
  - [3. 授權檢查](#3-授權檢查)
- [敏感資料處理](#敏感資料處理)
  - [1. 資料儲存](#1-資料儲存)
  - [2. 資料傳輸](#2-資料傳輸)
  - [3. 資料顯示](#3-資料顯示)
- [XSS/CSRF 防護](#xsscsrf-防護)
  - [1. XSS (Cross-Site Scripting) 防護](#1-xss-cross-site-scripting-防護)
    - [Angular 自動防護](#angular-自動防護)
    - [輸入驗證](#輸入驗證)
  - [2. CSRF (Cross-Site Request Forgery) 防護](#2-csrf-cross-site-request-forgery-防護)
    - [Supabase 自動防護](#supabase-自動防護)
    - [額外防護](#額外防護)
- [依賴套件安全檢查](#依賴套件安全檢查)
  - [1. 定期檢查](#1-定期檢查)
  - [2. 自動化檢查](#2-自動化檢查)
  - [3. 更新策略](#3-更新策略)
- [定期安全審計](#定期安全審計)
  - [1. 每月審計檢查清單](#1-每月審計檢查清單)
  - [2. 安全測試](#2-安全測試)
  - [3. 安全監控](#3-安全監控)
- [安全檢查清單（快速參考）](#安全檢查清單快速參考)
  - [開發階段](#開發階段)
  - [程式碼審查](#程式碼審查)
  - [部署前](#部署前)
  - [定期審計](#定期審計)
- [常見安全問題與解決方案](#常見安全問題與解決方案)
  - [問題 1：RLS 策略未啟用](#問題-1rls-策略未啟用)
  - [問題 2：敏感資料在前端顯示](#問題-2敏感資料在前端顯示)
  - [問題 3：XSS 漏洞](#問題-3xss-漏洞)
  - [問題 4：依賴套件漏洞](#問題-4依賴套件漏洞)
- [安全最佳實踐](#安全最佳實踐)
  - [1. 最小權限原則](#1-最小權限原則)
  - [2. 深度防禦](#2-深度防禦)
  - [3. 安全預設](#3-安全預設)
  - [4. 持續監控](#4-持續監控)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：提供完整的安全檢查清單，確保應用程式的安全性

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [安全檢查概述](#安全檢查概述)
- [RLS 策略檢查](#rls-策略檢查)
- [API 認證檢查](#api-認證檢查)
- [敏感資料處理](#敏感資料處理)
- [XSS/CSRF 防護](#xsscsrf-防護)
- [依賴套件安全檢查](#依賴套件安全檢查)
- [定期安全審計](#定期安全審計)

**參考文檔**：
- [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md) - RLS 策略詳細說明
- [開發作業指引](./specs/00-development-guidelines.md) - 安全規範

- --

## Git-like / 暫存安全檢查

- [ ] `branch_roles` / `branch_permissions` 僅授權承攬欄位（不可寫入任務結構、排程欄位）。
- [ ] Edge Functions `branch-merge`、`staging-finalize` 部署於 Supabase 並僅允許 Service Role 呼叫，金鑰存放於 CI/CD Secret。
- [ ] `staging_submissions` RLS 限制提交者 + Blueprint 擁有者，並驗證 `expires_at` 自動逾時。
- [ ] PR Payload 經 JSON Schema 驗證，若欄位未列入 `allowed_columns` 立即回傳 `branch.payload.missing`。
- [ ] `branch_metrics` / `organization_collaborations` 查詢僅主分支擁有者可存取；承攬組織僅能查詢自身資料。
- [ ] Supabase Logs 監控 `branch.merge.conflict`、`branch.role.forbidden`、`staging.expired` 事件。

- --

## 安全檢查概述

### 檢查頻率

- **開發階段**：每次提交前檢查
- **程式碼審查**：PR 審查時檢查
- **部署前**：部署前完整檢查
- **定期審計**：每月一次完整審計

### 檢查範圍

- RLS 策略
- API 認證與授權
- 敏感資料處理
- XSS/CSRF 防護
- 依賴套件安全

- --

## RLS 策略檢查

### 1. 基本檢查

- [ ] 所有表都已啟用 RLS
- [ ] 每個表都有適當的 SELECT 策略
- [ ] 每個表都有適當的 INSERT 策略
- [ ] 每個表都有適當的 UPDATE 策略
- [ ] 每個表都有適當的 DELETE 策略

### 2. 策略驗證

#### 使用 Supabase MCP 工具檢查

```bash
# 列出所有表
@SUPABASE 列出所有資料庫表

# 檢查 RLS 策略
# 在 Supabase Dashboard 中檢查每個表的 RLS 策略
```

#### 手動驗證

```sql
-- 檢查表是否啟用 RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 檢查策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 3. 權限矩陣對照

參考 [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md) 檢查：

- [ ] 藍圖/專案權限正確
- [ ] 任務權限正確
- [ ] 每日報表權限正確
- [ ] 品質驗收權限正確
- [ ] 問題追蹤權限正確
- [ ] 協作通訊權限正確

### 4. 測試檢查

- [ ] 測試不同角色的權限
- [ ] 測試跨專案存取（應被拒絕）
- [ ] 測試未授權存取（應被拒絕）
- [ ] 測試邊界條件

- --

## API 認證檢查

### 1. JWT Token 驗證

- [ ] 所有 API 請求都需要 JWT Token（除公開端點）
- [ ] Token 驗證在 Supabase 層級自動處理
- [ ] Token 過期時正確處理（401 Unauthorized）
- [ ] Token 刷新機制正常運作

### 2. 認證流程檢查

- [ ] 登入流程安全（HTTPS）
- [ ] 密碼符合強度要求
- [ ] 登入失敗有適當的限制（防止暴力破解）
- [ ] 登出時 Token 正確清除

### 3. 授權檢查

- [ ] 用戶只能存取有權限的資源
- [ ] 角色權限正確實作
- [ ] 跨專案存取被正確阻止

- --

## 敏感資料處理

### 1. 資料儲存

- [ ] 敏感資料不在前端儲存
- [ ] 密碼使用安全的雜湊演算法（Supabase Auth 自動處理）
- [ ] API Keys 使用環境變數管理
- [ ] 敏感資料不在日誌中記錄
- [ ] Storage Bucket 權限符合 [docs/26-Storage-Bucket結構視圖.mermaid.md](./26-Storage-Bucket結構視圖.mermaid.md) 設計
- [ ] 暫存資料（staging_submissions）僅存放 48h，逾期由 Edge Function 清除

### 2. 資料傳輸

- [ ] 所有 API 請求使用 HTTPS
- [ ] WebSocket 連線使用 WSS
- [ ] 敏感資料不在 URL 參數中傳遞
- [ ] 敏感資料不在 Cookie 中儲存（除 Session）

### 3. 資料顯示

- [ ] 敏感資料不在 UI 中顯示（如完整密碼）
- [ ] 敏感資料有適當的遮罩（如部分顯示）
- [ ] 錯誤訊息不洩露敏感資訊

- --

## XSS/CSRF 防護

### 1. XSS (Cross-Site Scripting) 防護

#### Angular 自動防護

- [ ] Angular 自動轉義 HTML（預設行為）
- [ ] 使用 `[innerHTML]` 時確保內容安全
- [ ] 使用 `DomSanitizer` 清理不信任的內容

```typescript
// ✅ 好的做法
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

#### 輸入驗證

- [ ] 所有用戶輸入都經過驗證
- [ ] 使用 Angular Forms 驗證
- [ ] 後端也進行驗證（雙重驗證）

### 2. CSRF (Cross-Site Request Forgery) 防護

#### Supabase 自動防護

- [ ] Supabase 使用 JWT Token 防護 CSRF
- [ ] 所有 API 請求都包含有效的 JWT Token
- [ ] Token 不在 URL 中傳遞

#### 額外防護

- [ ] 使用 SameSite Cookie（如果使用 Cookie）
- [ ] 檢查 Origin/Referer Header（可選）

- --

## 依賴套件安全檢查

### 1. 定期檢查

```bash
# 檢查已知漏洞
yarn audit

# 檢查過時的套件
yarn outdated

# 檢查許可證
yarn licenses list
```

### 2. 自動化檢查

- [ ] 在 CI/CD 中整合安全檢查
- [ ] 使用 Dependabot 或類似工具自動更新
- [ ] 定期審查依賴套件

### 3. 更新策略

- [ ] 及時更新有安全漏洞的套件
- [ ] 測試更新後的套件
- [ ] 記錄更新日誌

- --

## 定期安全審計

### 1. 每月審計檢查清單

- [ ] 檢查所有 RLS 策略
- [ ] 檢查 API 認證與授權
- [ ] 檢查敏感資料處理
- [ ] 執行依賴套件安全檢查
- [ ] 檢查錯誤日誌中的安全相關錯誤
- [ ] 檢查用戶權限分配

### 2. 安全測試

- [ ] 執行滲透測試（可選）
- [ ] 檢查常見安全漏洞（OWASP Top 10）
- [ ] 測試權限提升攻擊
- [ ] 測試資料洩露風險

### 3. 安全監控

- [ ] 監控異常登入活動
- [ ] 監控異常 API 請求
- [ ] 監控資料庫查詢異常
- [ ] 設定安全告警

- --

## 安全檢查清單（快速參考）

### 開發階段

- [ ] RLS 策略已實作並測試
- [ ] API 認證正確實作
- [ ] 敏感資料不在前端儲存
- [ ] 輸入驗證已實作
- [ ] 錯誤訊息不洩露敏感資訊

### 程式碼審查

- [ ] 檢查 RLS 策略邏輯
- [ ] 檢查權限驗證
- [ ] 檢查敏感資料處理
- [ ] 檢查 XSS/CSRF 防護
- [ ] 檢查依賴套件更新

### 部署前

- [ ] 執行完整安全檢查
- [ ] 檢查環境變數設定
- [ ] 檢查 RLS 策略部署
- [ ] 執行安全測試
- [ ] 檢查監控與告警設定

### 定期審計

- [ ] 每月執行安全審計
- [ ] 檢查依賴套件安全
- [ ] 檢查用戶權限
- [ ] 檢查安全日誌
- [ ] 更新安全文檔

- --

## 常見安全問題與解決方案

### 問題 1：RLS 策略未啟用

**症狀**：用戶可以存取不應存取的資料

**解決方案**：
```sql
-- 啟用 RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 建立策略
CREATE POLICY "policy_name" ON table_name
FOR SELECT
USING (condition);
```

### 問題 2：敏感資料在前端顯示

**症狀**：API Keys 或敏感資訊在瀏覽器中可見

**解決方案**：
- 使用環境變數管理敏感資料
- 不在前端儲存敏感資料
- 使用後端 API 處理敏感操作

### 問題 3：XSS 漏洞

**症狀**：用戶輸入的 HTML/JavaScript 被執行

**解決方案**：
- 使用 Angular 的預設轉義
- 使用 `DomSanitizer` 清理不信任的內容
- 驗證和清理所有用戶輸入

### 問題 4：依賴套件漏洞

**症狀**：`yarn audit` 發現安全漏洞

**解決方案**：
```bash
# 更新有漏洞的套件
yarn upgrade package-name

# 或使用自動修復
yarn audit fix
```

- --

## 安全最佳實踐

### 1. 最小權限原則

- 用戶只獲得完成工作所需的最小權限
- 定期審查用戶權限
- 移除不再需要的權限

### 2. 深度防禦

- 多層安全防護
- 前端和後端都進行驗證
- 不依賴單一安全機制

### 3. 安全預設

- 預設拒絕存取
- 明確允許才授予權限
- 安全的預設設定

### 4. 持續監控

- 監控異常活動
- 記錄安全事件
- 及時回應安全威脅

- --

## 相關文檔

- [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md)
- [開發作業指引](./specs/00-development-guidelines.md)
- [錯誤處理指南](./37-錯誤處理指南.md)
- [部署指南](./39-部署指南.md)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊


