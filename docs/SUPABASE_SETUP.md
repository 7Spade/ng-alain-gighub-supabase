# Supabase 設置指南 / Supabase Setup Guide

## 問題：註冊時遇到 "Failed to fetch" 錯誤

### Problem: "Failed to fetch" error during registration

### 原因 / Cause

專案中的 Supabase 環境變數尚未配置真實的 Supabase 專案憑證，目前使用的是預設佔位符值。

The Supabase environment variables in the project are not configured with real Supabase project credentials, currently using default placeholder values.

### 解決方案 / Solution

#### 步驟 1: 建立 Supabase 專案 / Step 1: Create Supabase Project

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊 "New Project" 建立新專案
3. 輸入專案名稱、資料庫密碼、選擇區域
4. 等待專案建立完成（約 2 分鐘）

#### 步驟 2: 取得 API 憑證 / Step 2: Get API Credentials

1. 在專案 Dashboard 中，點擊左側選單的 "Project Settings" (齒輪圖標)
2. 選擇 "API" 分頁
3. 複製以下資訊：
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (長字串)
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (另一個長字串，僅在服務端使用)

#### 步驟 3: 更新環境變數 / Step 3: Update Environment Variables

**開發環境 (src/environments/environment.ts)**:
```typescript
export const environment = {
  // ... 其他配置
  supabase: {
    url: 'https://xxycyrsgzjlphohqjpsh.supabase.co', // 替換為你的 Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWN5cnNnemp...', // 替換為你的 anon key
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eWN5cnNn...' // 替換為你的 service_role key
  }
};
```

**生產環境 (src/environments/environment.prod.ts)**:
```typescript
export const environment = {
  production: true,
  // ... 其他配置
  supabase: {
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://xxycyrsgzjlphohqjpsh.supabase.co',
    anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'your-production-anon-key',
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || 'your-production-service-role-key'
  }
};
```

#### 步驟 4: 執行資料庫遷移 / Step 4: Run Database Migrations

資料庫 Schema 與 RLS policies 已透過 Supabase MCP 建立完成，包含：

Database Schema and RLS policies have been created via Supabase MCP, including:

- ✅ `accounts` 表 (User, Bot, Organization 帳戶)
- ✅ `teams` 表 (組織內的團隊)
- ✅ `team_members` 表 (團隊成員關係)
- ✅ `organization_members` 表 (組織成員關係)
- ✅ 21 個 RLS policies (行級安全策略)
- ✅ 2 個 Triggers (自動創建帳戶、更新時間戳)
- ✅ 11 個索引 (效能優化)

如果需要重新建立，請參考專案根目錄的 SQL 遷移檔案。

#### 步驟 5: 設定 Email 認證 / Step 5: Configure Email Authentication

1. 在 Supabase Dashboard 中，前往 "Authentication" → "Providers"
2. 確保 "Email" provider 已啟用
3. 配置 Email 設定：
   - **Enable Email Confirmations**: 建議開啟（使用者需驗證 Email）
   - **Secure Email Change**: 建議開啟
   - **Confirm Email**: 選擇確認模式

4. 配置 Email Templates (可選)：
   - 前往 "Authentication" → "Email Templates"
   - 自訂註冊確認信、密碼重設信等模板

#### 步驟 6: 設定 Site URL 與 Redirect URLs / Step 6: Configure Site URL and Redirect URLs

1. 前往 "Authentication" → "URL Configuration"
2. 設定：
   - **Site URL**: `http://localhost:4200` (開發環境) 或你的生產環境 URL
   - **Redirect URLs**: 
     - `http://localhost:4200/**` (開發環境允許所有子路徑)
     - 你的生產環境 URL 與子路徑

#### 步驟 7: 測試認證流程 / Step 7: Test Authentication Flow

1. 重新啟動開發伺服器：
   ```bash
   npm start
   ```

2. 前往註冊頁面：`http://localhost:4200/passport/register`

3. 輸入測試 Email 和密碼進行註冊

4. 檢查 Email 收件匣是否收到確認信（如果啟用 Email 確認）

5. 使用註冊的帳號在登入頁面登入：`http://localhost:4200/passport/login`

### 常見問題 / FAQ

#### Q1: 仍然顯示 "Failed to fetch" 錯誤

**A:** 檢查以下項目：
- Supabase URL 格式是否正確 (應為 `https://your-project-ref.supabase.co`)
- anon key 是否正確複製（無多餘空格）
- Supabase 專案是否處於活躍狀態（未暫停）
- 瀏覽器控制台是否顯示 CORS 錯誤（檢查 Redirect URLs 設定）

#### Q2: 註冊成功但無法登入

**A:** 可能原因：
- Email 確認功能已啟用，但尚未點擊確認信連結
- 檢查 Supabase Dashboard → "Authentication" → "Users" 確認使用者狀態
- RLS policies 可能阻擋查詢，檢查 `accounts` 表的 RLS 設定

#### Q3: "Invalid API key" 錯誤

**A:** 
- 確認使用的是 **anon public key** 而非 service_role key（前端只能使用 anon key）
- service_role key 僅在伺服器端 (SSR) 使用

#### Q4: 如何停用 Email 確認？

**A:**
1. 前往 Supabase Dashboard → "Authentication" → "Providers"
2. 點擊 "Email" 設定
3. 關閉 "Enable Email Confirmations"
4. 儲存變更

### 安全注意事項 / Security Notes

⚠️ **重要**：
- **永遠不要** 將 `service_role` key 暴露在前端程式碼或公開的 Git repository 中
- `anon` key 可以安全地在前端使用（它受 RLS policies 保護）
- 使用環境變數管理生產環境的金鑰
- 在 `.gitignore` 中排除包含真實憑證的環境檔案

### 參考資源 / References

- [Supabase 官方文檔](https://supabase.com/docs)
- [Supabase Auth 指南](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- 本專案的 [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)

---

## 專案資料庫 Reference ID

根據先前的設定，本專案使用的 Supabase project reference ID 為：`xxycyrsgzjlphohqjpsh`

完整的 Project URL 應為：`https://xxycyrsgzjlphohqjpsh.supabase.co`

請確保在環境變數中使用此 URL 或你自己建立的專案 URL。
