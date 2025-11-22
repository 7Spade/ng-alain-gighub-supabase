# Supabase 設置指南

## 概述

本專案使用 Supabase 作為後端服務，提供：

- PostgreSQL 資料庫
- 即時訂閱（Realtime）
- 身份驗證（Authentication）
- 檔案儲存（Storage）
- Edge Functions

## Supabase 專案設置

### 1. 創建 Supabase 專案

1. 訪問 [Supabase Dashboard](https://app.supabase.com/)
2. 點擊 "New Project"
3. 填寫專案資訊：
   - Project Name: `ng-alain-gighub`
   - Database Password: 選擇強密碼
   - Region: 選擇最近的區域

### 2. 獲取 API 金鑰

在專案 Settings → API 頁面中找到：

- `Project URL`: 你的 Supabase URL
- `anon public` key: 公開 API 金鑰
- `service_role` key: 服務端專用金鑰（保密）

### 3. 配置環境變數

將金鑰添加到 `.env` 檔案：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 資料庫設置

### 執行 Migrations

專案包含初始化的資料庫遷移腳本：

```bash
# 使用 Supabase CLI
supabase db push

# 或手動在 SQL Editor 中執行
# 查看 supabase/migrations/ 目錄
```

### 資料庫結構

主要資料表：

- `users`: 使用者資料
- `profiles`: 使用者個人資料
- `organizations`: 組織資訊
- `projects`: 專案管理

詳細架構見 [資料庫架構文檔](../architecture/database-schema.md)

## Storage 設置

### 創建 Storage Buckets

在 Supabase Dashboard → Storage 中創建以下 buckets：

1. **avatars**: 使用者頭像
   - Public: Yes
   - File size limit: 2MB
   - Allowed mime types: `image/*`

2. **documents**: 文檔檔案
   - Public: No
   - File size limit: 10MB
   - Allowed mime types: `application/pdf`, `application/msword`, etc.

3. **uploads**: 一般上傳
   - Public: No
   - File size limit: 5MB

### Storage Policies

為每個 bucket 設置 Row Level Security (RLS) 政策：

```sql
-- avatars bucket policies
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## 身份驗證設置

### 啟用身份驗證提供者

在 Authentication → Providers 中啟用：

1. **Email/Password**: 預設啟用
2. **Google OAuth**: 配置 Client ID 和 Secret
3. **GitHub OAuth**: 配置 Client ID 和 Secret

### Email Templates

自訂郵件模板：Authentication → Email Templates

- Confirm signup
- Reset password
- Magic link
- Change email address

## 使用 Supabase Service

### 前端整合

```typescript
import { SupabaseService } from '@core/services/supabase.service';

export class YourComponent {
  constructor(private supabase: SupabaseService) {}

  async loadData() {
    const { data, error } = await this.supabase
      .from('your_table')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Data:', data);
  }
}
```

### Storage 操作

```typescript
// 上傳檔案
async uploadFile(file: File) {
  const { data, error } = await this.supabase.storage
    .from('uploads')
    .upload(`user-${userId}/${file.name}`, file);
  
  return { data, error };
}

// 獲取公開 URL
getPublicUrl(bucket: string, path: string) {
  const { data } = this.supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}
```

## 即時訂閱

### 訂閱資料變更

```typescript
const subscription = this.supabase
  .from('your_table')
  .on('*', payload => {
    console.log('Change received!', payload);
  })
  .subscribe();

// 記得取消訂閱
ngOnDestroy() {
  subscription.unsubscribe();
}
```

## 安全性最佳實務

### Row Level Security (RLS)

所有資料表都應該啟用 RLS：

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- 創建政策
CREATE POLICY "Users can view their own data"
ON your_table FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### API 金鑰管理

- **Never** 將 `service_role` key 暴露在前端
- 使用環境變數管理敏感資訊
- 在 CI/CD 中使用 secrets 管理

### 資料驗證

- 使用 Supabase 的 validation 功能
- 在前端和後端都進行驗證
- 使用 TypeScript 類型確保資料安全

## 本地開發

### 使用 Supabase CLI

安裝 Supabase CLI：

```bash
npm install -g supabase
```

啟動本地 Supabase：

```bash
supabase start
```

這會啟動：
- PostgreSQL 資料庫
- Supabase Studio (http://localhost:54323)
- API Gateway

## 疑難排解

### 連線問題

1. 檢查 API URL 和金鑰是否正確
2. 確認網路可以連接到 Supabase
3. 查看瀏覽器控制台的錯誤訊息

### RLS 政策問題

1. 確認資料表已啟用 RLS
2. 檢查政策是否正確設定
3. 使用 Supabase Dashboard 的 SQL Editor 測試政策

### Storage 上傳失敗

1. 檢查 bucket policies
2. 確認檔案大小和類型限制
3. 驗證使用者權限

## 相關資源

- [Supabase 官方文檔](https://supabase.com/docs)
- [Supabase JavaScript 客戶端](https://supabase.com/docs/reference/javascript)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
