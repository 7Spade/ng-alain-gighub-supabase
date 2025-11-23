# API 接口詳細文檔

## 📑 目錄

- [📋 目錄](#-目錄)
- [API 概覽](#api-概覽)
  - [基礎 URL](#基礎-url)
  - [認證方式](#認證方式)
- [認證與授權](#認證與授權)
  - [1. 用戶註冊](#1-用戶註冊)
  - [2. Email 登入](#2-email-登入)
  - [3. Token 刷新](#3-token-刷新)
  - [4. 獲取用戶資訊](#4-獲取用戶資訊)
  - [5. 登出](#5-登出)
- [PostgREST API](#postgrest-api)
  - [Git-like 分支 / Pull Request API](#git-like-分支--pull-request-api)
    - [1. 建立 Fork 與分支](#1-建立-fork-與分支)
    - [2. 提交 Pull Request](#2-提交-pull-request)
    - [3. 查詢分支績效](#3-查詢分支績效)
  - [暫存區 (staging_submissions) API](#暫存區-staging_submissions-api)
  - [基本查詢語法](#基本查詢語法)
    - [1. 查詢列表](#1-查詢列表)
    - [2. 篩選（Filter）](#2-篩選filter)
    - [3. 排序（Order）](#3-排序order)
    - [4. 分頁（Pagination）](#4-分頁pagination)
    - [5. 關聯查詢（Join）](#5-關聯查詢join)
    - [6. 插入資料](#6-插入資料)
    - [7. 更新資料](#7-更新資料)
    - [8. 刪除資料](#8-刪除資料)
  - [常用 API 端點](#常用-api-端點)
    - [藍圖/專案 APIs](#藍圖專案-apis)
    - [任務管理 APIs](#任務管理-apis)
    - [每日報表 APIs](#每日報表-apis)
    - [品質驗收 APIs](#品質驗收-apis)
    - [問題追蹤 APIs](#問題追蹤-apis)
    - [協作通訊 APIs](#協作通訊-apis)
- [Storage API](#storage-api)
  - [1. 上傳檔案](#1-上傳檔案)
  - [2. 下載檔案](#2-下載檔案)
  - [3. 刪除檔案](#3-刪除檔案)
- [Edge Functions API](#edge-functions-api)
  - [1. 天氣 API 整合](#1-天氣-api-整合)
  - [2. 通知處理](#2-通知處理)
  - [3. 進度計算](#3-進度計算)
- [Realtime API](#realtime-api)
  - [1. 訂閱任務變更](#1-訂閱任務變更)
  - [2. 廣播訊息](#2-廣播訊息)
  - [3. 線上狀態追蹤](#3-線上狀態追蹤)
- [錯誤處理](#錯誤處理)
  - [錯誤回應格式](#錯誤回應格式)
  - [常見錯誤碼](#常見錯誤碼)
- [速率限制](#速率限制)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：提供完整的 API 接口說明，包含請求格式、回應格式、錯誤處理等詳細資訊

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [API 概覽](#api-概覽)
- [認證與授權](#認證與授權)
- [PostgREST API](#postgrest-api)
- [Storage API](#storage-api)
- [Edge Functions API](#edge-functions-api)
- [Realtime API](#realtime-api)
- [錯誤處理](#錯誤處理)
- [速率限制](#速率限制)

**參考文檔**：
- [API介面映射圖](./25-API-介面映射圖.mermaid.md) - API 端點總覽
- [資料模型對照表](./34-資料模型對照表.md) - 資料模型說明

- --

## API 概覽

### 基礎 URL

- **Supabase REST API**：`https://{project-ref}.supabase.co/rest/v1/`
- **Supabase Auth API**：`https://{project-ref}.supabase.co/auth/v1/`
- **Supabase Storage API**：`https://{project-ref}.supabase.co/storage/v1/`
- **Supabase Edge Functions**：`https://{project-ref}.supabase.co/functions/v1/`

### 認證方式

所有 API 請求（除公開端點外）都需要在 Header 中攜帶 JWT Token：

```http
Authorization: Bearer {access_token}
```

**取得 Token**：
1. 透過 Auth API 登入取得 `access_token`
2. 使用 `refresh_token` 刷新 `access_token`
3. Token 有效期：1 小時（可透過 refresh token 延長）

- --

## 認證與授權

### 1. 用戶註冊

**端點**：`POST /auth/v1/signup`

**請求**：
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "options": {
    "data": {
      "display_name": "張三",
      "phone": "+886912345678"
    }
  }
}
```

**回應**（成功）：
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "created_at": "2025-01-15T08:30:00Z"
  }
}
```

**錯誤回應**：
```json
{
  "error": {
    "message": "User already registered",
    "status": 400
  }
}
```

- --

### 2. Email 登入

**端點**：`POST /auth/v1/token?grant_type=password`

**請求**：
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**回應**（成功）：
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { ... }
}
```

- --

### 3. Token 刷新

**端點**：`POST /auth/v1/token?grant_type=refresh_token`

**請求**：
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "..."
}
```

**回應**（成功）：
```json
{
  "access_token": "...",  // 新的 access token
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "..."  // 新的 refresh token
}
```

- --

### 4. 獲取用戶資訊

**端點**：`GET /auth/v1/user`

**請求**：
```http
GET /auth/v1/user
Authorization: Bearer {access_token}
```

**回應**（成功）：
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "user_metadata": {
    "display_name": "張三"
  },
  "created_at": "2025-01-15T08:30:00Z"
}
```

- --

### 5. 登出

**端點**：`POST /auth/v1/logout`

**請求**：
```http
POST /auth/v1/logout
Authorization: Bearer {access_token}
```

**回應**（成功）：
```http
204 No Content
```

- --

## PostgREST API

PostgREST 自動為資料庫表生成 REST API。所有端點遵循相同的模式。

### Git-like 分支 / Pull Request API

> 應用 Git-like 承攬模型時，需要透過以下 REST 端點維護 fork、分支與 PR 生命週期；所有端點均受 RLS + branch_roles 控制。

#### 1. 建立 Fork 與分支

```http
POST /rest/v1/branch_forks
Prefer: return=representation
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "blueprint_id": "1ef42d70-b8fb-4a75-9bb5-6dc4bdcf2d30",
  "contractor_org_id": "7b0b8f54-5f4d-4dd7-8f0f-1fd7e7934c1e",
  "scope": "結構體驗收/水電項"
}
```

建立 fork 後，再呼叫 `POST /rest/v1/blueprint_branches` 建立承攬分支：

```http
POST /rest/v1/blueprint_branches
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "fork_id": "4fae1c6c-6c6f-4f74-8df1-7d3aa4d8b5b3",
  "organization_id": "7b0b8f54-5f4d-4dd7-8f0f-1fd7e7934c1e",
  "branch_type": "org"
}
```

#### 2. 提交 Pull Request

```http
POST /rest/v1/pull_requests
Prefer: return=representation

{
  "branch_id": "2d9a8c9d-4e0c-4ad3-8a6c-0a5f6fd3acb5",
  "blueprint_id": "1ef42d70-b8fb-4a75-9bb5-6dc4bdcf2d30",
  "payload": {
    "daily_reports": [...],
    "quality_checks": [...]
  }
}
```

審查時使用 `POST /rest/v1/pull_request_reviews`，若審核通過會呼叫 Edge Function `POST /functions/v1/branch-merge` 合併承攬欄位。

#### 3. 查詢分支績效

```http
GET /rest/v1/branch_metrics?blueprint_id=eq.{id}
```

回應包含 PR SLA、通過率、撤回次數等資料，用於營運儀表板。

### 暫存區 (staging_submissions) API

> 所有任務輸入先寫入 `staging_submissions`，48h 內可撤回，確認後才寫入正式表。

- 建立暫存提交：`POST /rest/v1/staging_submissions`
- 撤回或確認：`PATCH /rest/v1/staging_submissions?id=eq.{id}`
- 查詢待決提交：`GET /rest/v1/staging_submissions?submitter_id=eq.{uid}&finalized=is.false`

範例：

```http
PATCH /rest/v1/staging_submissions?id=eq.480dd7b3-5aa3-4d6b-a70a-4c7ac9b7f05e
Prefer: return=representation

{
  "finalized": true,
  "expires_at": null
}
```

RLS 確保只有提交者或 Blueprint 擁有者能操作該筆暫存資料；Edge Function 會輪詢逾時紀錄並自動標記 `recalled=true`。

### 基本查詢語法

#### 1. 查詢列表

**端點**：`GET /rest/v1/{table}`

**範例**：查詢藍圖列表
```http
GET /rest/v1/blueprints
Authorization: Bearer {access_token}
```

**回應**：
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "台北101大樓新建工程",
    "status": "active",
    ...
  }
]
```

- --

#### 2. 篩選（Filter）

**語法**：`?{column}={operator}.{value}`

**運算子**：
- `eq` - 等於
- `neq` - 不等於
- `gt` - 大於
- `gte` - 大於等於
- `lt` - 小於
- `lte` - 小於等於
- `like` - 模糊匹配（區分大小寫）
- `ilike` - 模糊匹配（不區分大小寫）
- `in` - 在陣列中
- `is` - IS NULL / IS NOT NULL

**範例**：
```http
# 查詢狀態為 active 的藍圖
GET /rest/v1/blueprints?status=eq.active

# 查詢優先級為 high 或 urgent 的任務
GET /rest/v1/tasks?priority=in.(high,urgent)

# 查詢標題包含「施工」的任務
GET /rest/v1/tasks?title=ilike.*施工*

# 查詢我的藍圖
GET /rest/v1/blueprints?owner_id=eq.{user_id}
```

- --

#### 3. 排序（Order）

**語法**：`?order={column}.{direction}`

**方向**：
- `asc` - 升序
- `desc` - 降序

**範例**：
```http
# 按建立時間降序
GET /rest/v1/blueprints?order=created_at.desc

# 多欄位排序
GET /rest/v1/tasks?order=priority.desc,created_at.asc
```

- --

#### 4. 分頁（Pagination）

**語法**：`?limit={count}&offset={start}`

**或使用 Range Header**：
```http
GET /rest/v1/blueprints
Range: 0-19
Prefer: count=exact
```

**範例**：
```http
# 第一頁（每頁 20 筆）
GET /rest/v1/blueprints?limit=20&offset=0

# 第二頁
GET /rest/v1/blueprints?limit=20&offset=20
```

**回應 Header**：
```text
```

- --

#### 5. 關聯查詢（Join）

**語法**：`?select={columns},{relation}({columns})`

**範例**：
```http
# 查詢任務及其指派資訊
GET /rest/v1/tasks?select=*,task_assignments(account_id,role)

# 查詢藍圖及其任務數量
GET /rest/v1/blueprints?select=*,tasks(count)

# 嵌套關聯
GET /rest/v1/blueprints?select=*,tasks(*,task_assignments(*,accounts(*)))
```

- --

#### 6. 插入資料

**端點**：`POST /rest/v1/{table}`

**請求**：
```http
POST /rest/v1/blueprints
Authorization: Bearer {access_token}
Content-Type: application/json
Prefer: return=representation

{
  "name": "新專案",
  "slug": "new-project",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "planning"
}
```

**回應**（成功）：
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "新專案",
  "slug": "new-project",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "planning",
  "created_at": "2025-01-15T08:30:00Z",
  "updated_at": "2025-01-15T08:30:00Z"
}
```

- --

#### 7. 更新資料

**端點**：`PATCH /rest/v1/{table}?{filter}`

**請求**：
```http
PATCH /rest/v1/blueprints?id=eq.{blueprint_id}
Authorization: Bearer {access_token}
Content-Type: application/json
Prefer: return=representation

{
  "status": "active",
  "progress_percentage": 50
}
```

**回應**（成功）：
```json
{
  "id": "...",
  "status": "active",
  "progress_percentage": 50,
  "updated_at": "2025-01-15T16:30:00Z"
}
```

- --

#### 8. 刪除資料

**端點**：`DELETE /rest/v1/{table}?{filter}`

**請求**：
```http
DELETE /rest/v1/blueprints?id=eq.{blueprint_id}
Authorization: Bearer {access_token}
```

**回應**（成功）：
```http
204 No Content
```

- --

### 常用 API 端點

#### 藍圖/專案 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢列表 | `GET` | `/rest/v1/blueprints` | 查詢藍圖列表，支援篩選/排序 |
| 查詢詳情 | `GET` | `/rest/v1/blueprints?id=eq.{id}` | 查詢單筆藍圖 |
| 建立 | `POST` | `/rest/v1/blueprints` | 建立新藍圖 |
| 更新 | `PATCH` | `/rest/v1/blueprints?id=eq.{id}` | 更新藍圖 |
| 刪除 | `DELETE` | `/rest/v1/blueprints?id=eq.{id}` | 刪除藍圖 |
| 查詢我的 | `GET` | `/rest/v1/blueprints?owner_id=eq.{user_id}` | 查詢我的藍圖 |

- --

#### 任務管理 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢列表 | `GET` | `/rest/v1/tasks?blueprint_id=eq.{id}` | 查詢任務列表 |
| 查詢詳情 | `GET` | `/rest/v1/tasks?id=eq.{id}&select=*,task_assignments(*)` | 查詢任務詳情含指派 |
| 建立 | `POST` | `/rest/v1/tasks` | 建立任務 |
| 更新 | `PATCH` | `/rest/v1/tasks?id=eq.{id}` | 更新任務 |
| 刪除 | `DELETE` | `/rest/v1/tasks?id=eq.{id}` | 刪除任務 |
| 指派 | `POST` | `/rest/v1/task_assignments` | 指派任務 |
| 篩選狀態 | `GET` | `/rest/v1/tasks?status=in.(pending,in_progress)` | 篩選特定狀態 |

- --

#### 每日報表 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢列表 | `GET` | `/rest/v1/daily_reports?task_id=eq.{id}` | 查詢報表列表 |
| 提交 | `POST` | `/rest/v1/daily_reports` | 提交報表 |
| 更新 | `PATCH` | `/rest/v1/daily_reports?id=eq.{id}` | 更新報表 |
| 獲取天氣 | `GET` | `/rest/v1/weather_cache?weather_date=eq.{date}` | 獲取天氣快取 |

- --

#### 品質驗收 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢列表 | `GET` | `/rest/v1/quality_checks?task_id=eq.{id}` | 查詢驗收列表 |
| 建立 | `POST` | `/rest/v1/quality_checks` | 建立驗收 |
| 更新 | `PATCH` | `/rest/v1/quality_checks?id=eq.{id}` | 更新驗收結果 |

- --

#### 問題追蹤 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢列表 | `GET` | `/rest/v1/issues?blueprint_id=eq.{id}` | 查詢問題列表 |
| 查詢詳情 | `GET` | `/rest/v1/issues?id=eq.{id}&select=*,issue_assignments(*)` | 問題詳情 |
| 開立 | `POST` | `/rest/v1/issues` | 開立問題 |
| 更新 | `PATCH` | `/rest/v1/issues?id=eq.{id}` | 更新問題狀態 |
| 指派 | `POST` | `/rest/v1/issue_assignments` | 指派問題 |
| 篩選 | `GET` | `/rest/v1/issues?status=eq.open&severity=eq.high` | 篩選高優先級問題 |

- --

#### 協作通訊 APIs

| 操作 | 方法 | 端點 | 說明 |
|------|------|------|------|
| 查詢留言 | `GET` | `/rest/v1/comments?task_id=eq.{id}` | 查詢留言列表 |
| 發布留言 | `POST` | `/rest/v1/comments` | 發布留言 |
| 編輯留言 | `PATCH` | `/rest/v1/comments?id=eq.{id}` | 編輯留言 |
| 刪除留言 | `DELETE` | `/rest/v1/comments?id=eq.{id}` | 刪除留言 |
| 查詢通知 | `GET` | `/rest/v1/notifications?recipient_id=eq.{user_id}` | 查詢通知 |
| 標記已讀 | `PATCH` | `/rest/v1/notifications?id=eq.{id}` | 標記已讀 |
| 查詢待辦 | `GET` | `/rest/v1/todos?account_id=eq.{user_id}` | 查詢待辦 |

- --

## Storage API

### 1. 上傳檔案

**端點**：`POST /storage/v1/object/{bucket}/{path}`

**請求**：
```http
POST /storage/v1/object/images/{blueprint_id}/daily_reports/photo.jpg
Authorization: Bearer {access_token}
Content-Type: image/jpeg

(binary file data)
```

**或使用 FormData**：
```typescript
const formData = new FormData();
formData.append('file', file);

await fetch(
  `${supabaseUrl}/storage/v1/object/images/${blueprintId}/daily_reports/${filename}`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }
);
```

**回應**（成功）：
```json
{
  "Key": "images/{blueprint_id}/daily_reports/photo.jpg",
  "Id": "...",
  "Bucket": "images"
}
```

- --

### 2. 下載檔案

**公開檔案**：
```http
GET /storage/v1/object/public/images/{path}
```

**私有檔案**（需要簽名 URL）：
```http
GET /storage/v1/object/sign/images/{path}?expiresIn=3600
Authorization: Bearer {access_token}
```

**回應**（成功）：
(binary file data)
```text
```

- --

### 3. 刪除檔案

**端點**：`DELETE /storage/v1/object/{bucket}/{path}`

**請求**：
```http
DELETE /storage/v1/object/images/{path}
Authorization: Bearer {access_token}
```

**回應**（成功）：
```json
{
  "message": "Successfully deleted"
}
```

- --

## Edge Functions API

### 1. 天氣 API 整合

**端點**：`POST /functions/v1/fetch-weather`

**請求**：
```http
POST /functions/v1/fetch-weather
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "blueprint_id": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2025-01-15",
  "location": {
    "lat": 25.0330,
    "lon": 121.5654
  }
}
```

**回應**（成功）：
```json
{
  "weather_date": "2025-01-15",
  "condition": "晴天",
  "temperature": 22.5,
  "humidity": 65,
  "wind_speed": 3.2,
  "cached": false
}
```

- --

### 2. 通知處理

**端點**：`POST /functions/v1/notify-issue`

**請求**：
```http
POST /functions/v1/notify-issue
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "issue_id": "550e8400-e29b-41d4-a716-446655440000",
  "action": "assigned",
  "recipient_ids": ["...", "..."]
}
```

**回應**（成功）：
```json
{
  "notifications_created": 2,
  "emails_sent": 1
}
```

- --

### 3. 進度計算

**端點**：`POST /functions/v1/calculate-progress`

**請求**：
```http
POST /functions/v1/calculate-progress
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "blueprint_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**回應**（成功）：
```json
{
  "completion_rate": 68.5,
  "total_tasks": 50,
  "completed_tasks": 34,
  "pending_issues": 3,
  "calculated_at": "2025-01-15T16:30:00Z"
}
```

- --

## Realtime API

### 1. 訂閱任務變更

**TypeScript 範例**：
```typescript
const channel = supabase
  .channel('tasks-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'tasks',
      filter: 'blueprint_id=eq.' + blueprintId
    },
    (payload) => {
      console.log('Task change:', payload);
      // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
      // payload.new: 新資料
      // payload.old: 舊資料
    }
  )
  .subscribe();
```

- --

### 2. 廣播訊息

**發送廣播**：
```typescript
await channel.send({
  type: 'broadcast',
  event: 'cursor-pos',
  payload: { x: 100, y: 200, user: 'Alice' }
});
```

**接收廣播**：
```typescript
channel.on('broadcast', { event: 'cursor-pos' }, (payload) => {
  console.log('Cursor position:', payload);
});
```

- --

### 3. 線上狀態追蹤

```typescript
const presenceChannel = supabase.channel('online-users', {
  config: { presence: { key: userId } }
});

presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    console.log('Online users:', Object.keys(state));
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({ online_at: new Date().toISOString() });
    }
  });
```

- --

## 錯誤處理

### 錯誤回應格式

```json
{
  "error": {
    "code": "PGRST116",
    "message": "The result contains 0 rows",
    "details": null,
    "hint": null
  }
}
```

### 常見錯誤碼

| HTTP 狀態碼 | 錯誤碼 | 說明 | 解決方案 |
|------------|--------|------|---------|
| 400 | `PGRST116` | 查詢結果為空 | 檢查篩選條件 |
| 401 | `PGRST301` | JWT Token 無效或過期 | 重新登入或刷新 Token |
| 403 | `PGRST301` | RLS Policy 權限拒絕 | 檢查用戶權限 |
| 404 | `PGRST116` | 資源不存在 | 檢查資源 ID |
| 409 | `23505` | 資料衝突（UNIQUE 約束） | 檢查唯一性約束 |
| 500 | `PGRST100` | 伺服器錯誤 | 聯繫管理員 |

- --

## 速率限制

- **認證 API**：5 requests/分鐘/IP
- **一般 API**：100 requests/分鐘/用戶
- **檔案上傳**：10 uploads/分鐘/用戶
- **Realtime**：100 messages/秒/channel

**超過限制時**：
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

- --

## 相關文檔

- [API介面映射圖](./25-API-介面映射圖.mermaid.md)
- [資料模型對照表](./34-資料模型對照表.md)
- [開發作業指引](./specs/00-development-guidelines.md)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊

