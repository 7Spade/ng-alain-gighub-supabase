# 安全與 RLS 權限矩陣

## 📑 目錄

- [1. Row Level Security (RLS) 策略總覽](#1-row-level-security-rls-策略總覽)
  - [系統架構說明](#系統架構說明)
  - [1.1 RLS 核心概念](#11-rls-核心概念)
  - [1.2 策略類型](#12-策略類型)
- [2. 角色系統定義](#2-角色系統定義)
  - [2.1 預設角色](#21-預設角色)
  - [2.2 角色資料表結構](#22-角色資料表結構)
- [3. 權限矩陣](#3-權限矩陣)
  - [3.1 藍圖/專案 (blueprints)](#31-藍圖專案-blueprints)
  - [3.2 任務 (tasks)](#32-任務-tasks)
  - [3.3 每日報表 (daily_reports)](#33-每日報表-daily_reports)
  - [3.4 品質驗收 (quality_checks)](#34-品質驗收-quality_checks)
  - [3.5 問題追蹤 (issues)](#35-問題追蹤-issues)
  - [3.6 討論留言 (comments)](#36-討論留言-comments)
  - [3.7 文件管理 (documents)](#37-文件管理-documents)
  - [3.8 狀態枚舉約定（與 ERD / 狀態圖對齊）](#38-狀態枚舉約定與-erd--狀態圖對齊)
    - [核心實體狀態](#核心實體狀態)
- [4. 安全最佳實踐](#4-安全最佳實踐)
  - [4.1 JWT Token 管理](#41-jwt-token-管理)
  - [4.2 敏感資料保護](#42-敏感資料保護)
  - [4.3 SQL 注入防護](#43-sql-注入防護)
  - [4.4 XSS 防護](#44-xss-防護)
  - [4.5 CSRF 防護](#45-csrf-防護)
  - [4.6 Rate Limiting](#46-rate-limiting)
  - [4.7 審計日誌](#47-審計日誌)
- [5. 多租戶隔離策略](#5-多租戶隔離策略)
  - [5.1 帳戶層隔離](#51-帳戶層隔離)
  - [5.2 藍圖層隔離](#52-藍圖層隔離)
  - [5.3 團隊協作](#53-團隊協作)
- [6. 合規與法規](#6-合規與法規)
  - [6.1 GDPR 合規](#61-gdpr-合規)
  - [6.2 資料保留政策](#62-資料保留政策)
- [7. 緊急事件回應](#7-緊急事件回應)
  - [7.1 安全事件類型](#71-安全事件類型)
  - [7.2 回應流程](#72-回應流程)
  - [7.3 聯絡方式](#73-聯絡方式)
- [JWT 聲明傳播流程](#jwt-聲明傳播流程)
- [角色權限對照表（補充）](#角色權限對照表補充)
- [RLS 政策對照表（補充）](#rls-政策對照表補充)
- [安全政策要點](#安全政策要點)
  - [會話管理](#會話管理)
  - [資料加密](#資料加密)
  - [權限審核](#權限審核)

---


> 📋 **目的**：定義系統的 Row Level Security (RLS) 策略和權限矩陣，確保資料安全與存取控制

**最後更新**：2025-11-16
**維護者**：開發團隊
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）
**技術棧版本**：Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.1.x + Supabase

- --

## 1. Row Level Security (RLS) 策略總覽

### 系統架構說明

- **Git-like 分支模型**：主分支（擁有者控制任務結構）、組織分支（協作組織填寫承攬欄位）、PR 機制
- **51 張資料表**：分為 11 個模組，所有表均啟用 RLS 策略
- **權限分離**：分支權限必須在資料庫層（RLS）與應用層雙重驗證

### 1.1 RLS 核心概念

Supabase 的 Row Level Security (RLS) 基於 PostgreSQL 原生功能，提供細粒度的資料存取控制。每個資料表都可以定義多個策略 (Policy)，策略基於 JWT Token 中的聲明 (Claims) 進行判斷。

**JWT Token 結構範例**:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user_id
  "email": "user@example.com",
  "role": "authenticated",
  "user_metadata": {
    "account_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### 1.2 策略類型

- **SELECT Policy**: 控制讀取權限
- **INSERT Policy**: 控制新增權限
- **UPDATE Policy**: 控制更新權限
- **DELETE Policy**: 控制刪除權限

- --

## 2. 角色系統定義

### 2.1 預設角色

| 角色名稱 | 角色代碼 | 優先級 | 描述 |
|---------|---------|--------|------|
| 系統管理員 | `system_admin` | 1000 | 全系統權限，管理所有專案 |
| 專案經理 | `project_manager` | 800 | 專案管理，任務指派，報表審核 |
| 工地主任 | `site_supervisor` | 600 | 現場管理，日報提交，問題處理 |
| 品管人員 | `quality_controller` | 500 | 品質驗收，問題開立 |
| 施工人員 | `worker` | 300 | 執行任務，提交進度 |
| 觀察者 | `viewer` | 100 | 唯讀權限，查看專案 |

### 2.2 角色資料表結構

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE, -- NULL 表示全域角色
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, role_id, blueprint_id)
);
```

- --

## 3. 權限矩陣

### 3.1 藍圖/專案 (blueprints)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看專案列表 | ✅ 全部 | ✅ 擁有的 | ✅ 成員的 | ✅ 成員的 | ✅ 成員的 | ✅ 成員的 |
| 查看專案詳情 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 建立專案 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 編輯專案 | ✅ | ✅ 擁有的 | ❌ | ❌ | ❌ | ❌ |
| 刪除專案 | ✅ | ✅ 擁有的 | ❌ | ❌ | ❌ | ❌ |
| 管理成員 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**RLS Policy 範例**:
```sql
-- SELECT: 查看專案
CREATE POLICY "Users can view blueprints they are members of"
ON blueprints FOR SELECT
USING (
  -- 系統管理員可以看全部
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'system_admin'))
  OR
  -- 擁有者可以看
  owner_id = auth.uid()
  OR
  -- 團隊成員可以看
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.account_id = auth.uid() AND ur.blueprint_id = blueprints.id
  )
);

-- INSERT: 建立專案
CREATE POLICY "Project managers can create blueprints"
ON blueprints FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager')
  )
);

-- UPDATE: 編輯專案
CREATE POLICY "Owners and admins can update blueprints"
ON blueprints FOR UPDATE
USING (
  owner_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'system_admin'))
);

-- DELETE: 刪除專案
CREATE POLICY "Owners and admins can delete blueprints"
ON blueprints FOR DELETE
USING (
  owner_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'system_admin'))
);
```

### 3.2 任務 (tasks)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看任務 | ✅ | ✅ | ✅ | ✅ | ✅ 指派的 | ✅ |
| 建立任務 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| 編輯任務 | ✅ | ✅ | ✅ | ❌ | ⚠️ 狀態更新 | ❌ |
| 刪除任務 | ✅ | ✅ | ⚠️ 未開始的 | ❌ | ❌ | ❌ |
| 指派任務 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

**RLS Policy 範例**:
```sql
-- SELECT: 查看任務
CREATE POLICY "Users can view tasks in their blueprints"
ON tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM blueprints b
    WHERE b.id = tasks.blueprint_id
    AND (
      b.owner_id = auth.uid()
      OR
      EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = b.id)
    )
  )
);

-- INSERT: 建立任務
CREATE POLICY "Managers and supervisors can create tasks"
ON tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND ur.blueprint_id = tasks.blueprint_id
    AND r.name IN ('system_admin', 'project_manager', 'site_supervisor')
  )
);

-- UPDATE: 編輯任務
CREATE POLICY "Task updates based on role"
ON tasks FOR UPDATE
USING (
  -- 管理員和主任可以完整編輯
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND ur.blueprint_id = tasks.blueprint_id
    AND r.name IN ('system_admin', 'project_manager', 'site_supervisor')
  )
  OR
  -- 被指派的施工人員可以更新狀態
  (
    EXISTS (SELECT 1 FROM task_assignments WHERE task_id = tasks.id AND account_id = auth.uid())
    AND
    -- 限制只能更新狀態欄位 (需應用層邏輯配合)
    TRUE
  )
);
```

### 3.3 每日報表 (daily_reports)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看報表 | ✅ | ✅ | ✅ | ✅ | ✅ 自己的 | ✅ |
| 提交報表 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| 編輯報表 | ✅ | ✅ | ✅ 自己的 | ❌ | ⚠️ 當日的 | ❌ |
| 刪除報表 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**RLS Policy 範例**:
```sql
-- INSERT: 提交報表
CREATE POLICY "Workers and supervisors can submit daily reports"
ON daily_reports FOR INSERT
WITH CHECK (
  reporter_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = daily_reports.task_id
    AND EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.account_id = auth.uid()
      AND ur.blueprint_id = t.blueprint_id
      AND r.name IN ('system_admin', 'project_manager', 'site_supervisor', 'worker')
    )
  )
);

-- UPDATE: 編輯報表
CREATE POLICY "Users can edit their recent reports"
ON daily_reports FOR UPDATE
USING (
  reporter_id = auth.uid()
  AND report_date >= CURRENT_DATE - INTERVAL '1 day' -- 只能編輯 1 天內的報表
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager', 'site_supervisor')
  )
);
```

### 3.4 品質驗收 (quality_checks)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看驗收 | ✅ | ✅ | ✅ | ✅ | ✅ 相關的 | ✅ |
| 建立驗收 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 執行驗收 | ✅ | ✅ | ⚠️ 指派的 | ✅ | ❌ | ❌ |
| 審核結果 | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

**RLS Policy 範例**:
```sql
-- INSERT: 建立驗收
CREATE POLICY "Supervisors and QC can create quality checks"
ON quality_checks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager', 'site_supervisor', 'quality_controller')
  )
);

-- UPDATE: 執行驗收
CREATE POLICY "Assigned QC can update quality checks"
ON quality_checks FOR UPDATE
USING (
  inspector_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager')
  )
);
```

### 3.5 問題追蹤 (issues)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看問題 | ✅ | ✅ | ✅ | ✅ | ✅ 相關的 | ✅ |
| 開立問題 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 指派問題 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 處理問題 | ✅ | ✅ | ✅ | ✅ | ⚠️ 指派的 | ❌ |
| 關閉問題 | ✅ | ✅ | ⚠️ 自己開的 | ✅ | ❌ | ❌ |

**RLS Policy 範例**:
```sql
-- INSERT: 開立問題
CREATE POLICY "Authenticated users can create issues"
ON issues FOR INSERT
WITH CHECK (
  reporter_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.account_id = auth.uid()
    AND ur.blueprint_id = issues.blueprint_id
  )
);

-- UPDATE: 處理問題
CREATE POLICY "Assigned users can update issues"
ON issues FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM issue_assignments WHERE issue_id = issues.id AND account_id = auth.uid())
  OR
  reporter_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager', 'site_supervisor')
  )
);
```

### 3.6 討論留言 (comments)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看留言 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 發布留言 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 編輯留言 | ✅ | ⚠️ 自己的 | ⚠️ 自己的 | ⚠️ 自己的 | ⚠️ 自己的 | ❌ |
| 刪除留言 | ✅ | ✅ | ⚠️ 自己的 | ⚠️ 自己的 | ⚠️ 自己的 | ❌ |

**RLS Policy 範例**:
```sql
-- INSERT: 發布留言
CREATE POLICY "Members can post comments"
ON comments FOR INSERT
WITH CHECK (
  author_id = auth.uid()
  AND
  (
    (task_id IS NOT NULL AND EXISTS (SELECT 1 FROM tasks WHERE id = comments.task_id))
    OR
    (issue_id IS NOT NULL AND EXISTS (SELECT 1 FROM issues WHERE id = comments.issue_id))
  )
);

-- UPDATE: 編輯留言
CREATE POLICY "Users can edit their own comments"
ON comments FOR UPDATE
USING (
  author_id = auth.uid()
  OR
  EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'system_admin'))
);

-- DELETE: 刪除留言
CREATE POLICY "Users can delete their own comments or admins can delete any"
ON comments FOR DELETE
USING (
  author_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.account_id = auth.uid()
    AND r.name IN ('system_admin', 'project_manager')
  )
);
```

### 3.7 文件管理 (documents)

| 操作 | system_admin | project_manager | site_supervisor | quality_controller | worker | viewer |
|-----|--------------|----------------|----------------|-------------------|--------|--------|
| 查看文件 | ✅ | ✅ | ✅ | ✅ | ✅ 公開的 | ✅ 公開的 |
| 上傳文件 | ✅ | ✅ | ✅ | ✅ | ⚠️ 照片 | ❌ |
| 編輯元資料 | ✅ | ✅ | ⚠️ 自己的 | ⚠️ 自己的 | ❌ | ❌ |
| 刪除文件 | ✅ | ✅ | ⚠️ 自己的 | ⚠️ 自己的 | ❌ | ❌ |

**Storage Bucket RLS**:
```sql
-- Storage Policy for images bucket
CREATE POLICY "Public images are accessible to all members"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images'
  AND
  EXISTS (
    SELECT 1 FROM blueprints b
    WHERE storage.objects.name LIKE b.id || '/%'
    AND (
      b.owner_id = auth.uid()
      OR
      EXISTS (SELECT 1 FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = b.id)
    )
  )
);

-- Upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND
  auth.role() = 'authenticated'
);
```

### 3.8 狀態枚舉約定（與 ERD / 狀態圖對齊）

為確保資料一致性，以下為系統中所有狀態枚舉的標準定義，與 `docs/06-實體關係圖.mermaid.md` 和 `docs/14-狀態圖.mermaid.md` 完全對齊：

#### 核心實體狀態

- **`blueprints.status`**: `planning|active|on_hold|completed|archived`
  - `planning`: 規劃中
  - `active`: 進行中
  - `on_hold`: 暫停（注意使用 `on_hold` 而非 `paused`）
  - `completed`: 已完成
  - `archived`: 已歸檔

- **`tasks.status`**: `pending|assigned|in_progress|staging|in_qa|in_inspection|completed|cancelled`
  - `pending`: 待處理
  - `assigned`: 已指派
  - `in_progress`: 進行中
  - `staging`: 暫存中（48 小時可撤回）
  - `in_qa`: 品管中
  - `in_inspection`: 驗收中
  - `completed`: 已完成
  - `cancelled`: 已取消

- **`quality_checks.status`**: `pending|in_progress|passed|failed|conditional_pass`
  - `pending`: 待檢查
  - `in_progress`: 檢查中
  - `passed`: 通過
  - `failed`: 不通過
  - `conditional_pass`: 條件通過

- **`inspections.status`**: `pending|in_progress|accepted|rejected|conditional_accept`
  - `pending`: 待驗收
  - `in_progress`: 驗收中
  - `accepted`: 已接受（責任轉移）
  - `rejected`: 已拒絕
  - `conditional_accept`: 條件接受

- **`issues.status`**: `open|in_progress|resolved|closed|wont_fix`
  - `open`: 開啟（注意使用 `open` 而非 `new`）
  - `in_progress`: 處理中
  - `resolved`: 已解決
  - `closed`: 已關閉
  - `wont_fix`: 不修復

- **`todos.status`**: `pending|staging|qc|inspection|issue`
  - `pending`: 待執行
  - `staging`: 暫存
  - `qc`: 品管
  - `inspection`: 驗收
  - `issue`: 問題

**參考文檔**：
- [實體關係圖](./06-實體關係圖.mermaid.md) - 資料表結構定義
- [狀態圖](./14-狀態圖.mermaid.md) - 狀態流轉視覺化
- [狀態枚舉值定義](./36-狀態枚舉值定義.md) - 詳細狀態定義與說明

- --

## 4. 安全最佳實踐

### 4.1 JWT Token 管理

1. **Token 過期時間**: 設定為 1 小時
2. **Refresh Token**: 30 天有效期
3. **Token 刷新機制**: 前端自動刷新 Token
4. **Token 撤銷**: Session 登出時立即撤銷

### 4.2 敏感資料保護

1. **加密儲存**:
   - 敏感欄位使用 `pgcrypto` 加密
   - 密碼使用 bcrypt 雜湊
2. **資料遮罩**:
   - API 回應中隱藏敏感資訊
   - 日誌中移除個人資料
3. **HTTPS 強制**:
   - 所有通訊使用 TLS 1.3
   - HSTS 標頭強制 HTTPS

### 4.3 SQL 注入防護

1. **參數化查詢**: 使用 Supabase Client SDK，自動參數化
2. **輸入驗證**: 前端與後端雙重驗證
3. **ORM 使用**: 透過 PostgREST 自動防護

### 4.4 XSS 防護

1. **Content Security Policy (CSP)**: 嚴格的 CSP 標頭
2. **輸出編碼**: Angular 自動轉義
3. **DOMPurify**: 清理用戶輸入的 HTML

### 4.5 CSRF 防護

1. **SameSite Cookie**: 設定為 `Strict`
2. **CSRF Token**: API 請求包含 CSRF Token
3. **Origin 驗證**: 檢查 Referer 和 Origin 標頭

### 4.6 Rate Limiting

1. **API 限流**:
   - 登入: 5 次/分鐘
   - 一般 API: 100 次/分鐘
   - 檔案上傳: 10 次/分鐘
2. **IP 封鎖**: 惡意 IP 自動封鎖 24 小時
3. **User-based Limiting**: 基於用戶的限流

### 4.7 審計日誌

1. **Database Triggers**: 自動記錄所有 CUD 操作
2. **Activity Logs 表**: 記錄操作類型、時間、IP、User Agent
3. **日誌保留**: 保留 1 年，合規審計

- --

## 5. 多租戶隔離策略

### 5.1 帳戶層隔離

每個帳戶 (Account) 可以是:
- **用戶 (User)**: 個人帳戶
- **組織 (Organization)**: 團隊帳戶
- **機器人 (Bot)**: 自動化帳戶

### 5.2 藍圖層隔離

每個藍圖 (Blueprint) 有明確的擁有者 (owner_id)，所有相關資料透過 `blueprint_id` 外鍵關聯，RLS Policy 自動隔離。

### 5.3 團隊協作

- 透過 `user_roles` 表授予成員不同角色
- 角色可以是全域 (`blueprint_id` 為 NULL) 或專案級別
- 支援多團隊多專案協作

- --

## 6. 合規與法規

### 6.1 GDPR 合規

1. **資料最小化**: 只收集必要資料
2. **資料可攜權**: 提供資料匯出功能
3. **刪除權**: 支援帳戶與資料刪除
4. **同意管理**: 明確的隱私政策與同意流程

### 6.2 資料保留政策

1. **活躍資料**: 永久保留
2. **已刪除專案**: 保留 90 天後永久刪除
3. **審計日誌**: 保留 1 年
4. **備份資料**: 保留 30 天

- --

## 7. 緊急事件回應

### 7.1 安全事件類型

1. **資料外洩**: 未授權存取敏感資料
2. **DDoS 攻擊**: 服務不可用
3. **帳戶入侵**: 用戶帳戶被盜用
4. **SQL 注入**: 惡意 SQL 查詢

### 7.2 回應流程

1. **檢測**: 監控系統告警
2. **隔離**: 封鎖惡意 IP/帳戶
3. **調查**: 分析日誌與審計記錄
4. **修復**: 修補漏洞與恢復服務
5. **通知**: 通知受影響用戶
6. **報告**: 記錄事件與改進措施

### 7.3 聯絡方式

- **安全團隊**: security@example.com
- **緊急熱線**: +886-XXX-XXXX
- **事件報告**: 透過系統內建回報功能

## JWT 聲明傳播流程

```text
用戶登入
  ↓
Supabase Auth 生成 JWT
  ↓
JWT 包含：
  - user_id (auth.uid())
  - email
  - raw_user_meta_data (自訂欄位)
  ↓
PostgreSQL RLS 政策讀取 JWT
  ↓
透過 auth.uid() 查詢關聯表：
  - user_roles (取得 blueprint_id, role_id)
  - team_members (取得 team_id, role，透過 team 關聯到 organization)
  ↓
根據 JWT 聲明與關聯表決定資料存取權限
  ↓
執行 SQL 查詢，RLS 自動過濾資料
```

## 角色權限對照表（補充）

| 角色 | 說明 | 權限範圍 | 對應資料表 |
|------|------|----------|------------|
| `anon` | 匿名用戶 | 僅讀取公開資料 | 無（所有表需認證） |
| `authenticated` | 已認證用戶 | 讀寫自己的資料 | `accounts`（自己的帳戶） |
| `org_admin` | 組織管理員 | 管理組織內所有資料 | `organizations`、`projects`、`blueprints` |
| `project_manager` | 專案經理 | 管理專案相關資料 | `blueprints`、`tasks`、`user_roles` |
| `site_supervisor` | 工地主任 | 管理工地相關資料 | `tasks`、`daily_reports`、`quality_checks` |
| `team_member` | 團隊成員 | 讀取專案資料、執行任務 | `blueprints`（讀取）、`tasks`（讀寫自己的） |
| `viewer` | 觀察者 | 僅讀取專案資訊 | `blueprints`（讀取）、`documents`（讀取） |

## RLS 政策對照表（補充）

| 資料表 | SELECT | INSERT | UPDATE | DELETE | RLS 條件 | 說明 |
|--------|--------|--------|--------|--------|----------|------|
| `tasks` | ✅ project_member | ✅ project_member | ✅ assignee/creator | ✅ creator | `blueprint_id IN (SELECT blueprint_id FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = tasks.blueprint_id)` | 任務管理權限 |
| `documents` | ✅ project_member | ✅ project_member | ✅ owner | ✅ owner | `blueprint_id IN (SELECT blueprint_id FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = documents.blueprint_id)` | 文件管理權限 |
| `activity_logs` | ✅ project_member | ✅ project_member | ❌ | ❌ | `blueprint_id IN (SELECT blueprint_id FROM user_roles WHERE account_id = auth.uid() AND blueprint_id = activity_logs.blueprint_id)` | 活動記錄（僅讀寫） |

## 安全政策要點

### 會話管理
- **Access Token**：15–60 分鐘（視敏感度設定）
- **Refresh Token**：7–30 日
- **儲存策略**：偏好 memory/sessionStorage；localStorage 需額外 CSRF 保護

### 資料加密
- **傳輸加密**：HTTPS/TLS 1.3
- **儲存加密**：資料庫與 Supabase Storage 使用 AES-256 伺服端加密
- **敏感資料**：不在前端儲存或傳輸

### 權限審核
- Supabase RLS、密鑰、權限審核完成（包含文件分類欄位與 Aggregation Refresh API）
- 定期檢查 RLS 政策與實際需求是否一致
- 使用 `@SUPABASE get_advisors` 檢查安全漏洞
