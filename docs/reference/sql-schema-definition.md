# 完整 SQL 表結構定義 v2.0

## 📑 目錄

- [📊 資料表分類統計](#-資料表分類統計)
- [📋 完整資料表清單與結構](#-完整資料表清單與結構)
  - [🔐 帳戶與身份系統 (4 張)](#-帳戶與身份系統-4-張)
    - [1. accounts (帳戶主表)](#1-accounts-帳戶主表)
    - [2. teams (團隊表)](#2-teams-團隊表)
    - [3. team_members (團隊成員表)](#3-team_members-團隊成員表)
    - [4. organization_schedules (組織排班表)](#4-organization_schedules-組織排班表)
  - [🤝 組織協作系統 (3 張)](#-組織協作系統-3-張)
    - [5. organization_collaborations (組織協作關係表)](#5-organization_collaborations-組織協作關係表)
    - [6. collaboration_invitations (協作邀請表)](#6-collaboration_invitations-協作邀請表)
    - [7. collaboration_members (協作成員表)](#7-collaboration_members-協作成員表)
  - [🔒 權限系統 (5 張)](#-權限系統-5-張)
    - [8. roles (角色定義表)](#8-roles-角色定義表)
    - [9. user_roles (用戶角色關聯表)](#9-user_roles-用戶角色關聯表)
    - [10. permissions (權限定義表)](#10-permissions-權限定義表)
    - [11. role_permissions (角色權限關聯表)](#11-role_permissions-角色權限關聯表)
    - [12. branch_permissions (分支權限表)](#12-branch_permissions-分支權限表)
  - [🎯 藍圖/專案系統 (5 張)](#-藍圖專案系統-5-張)
    - [13. blueprints (藍圖主表 - 主分支)](#13-blueprints-藍圖主表---主分支)
    - [14. blueprint_configs (藍圖設定表)](#14-blueprint_configs-藍圖設定表)
    - [15. blueprint_branches (組織分支表)](#15-blueprint_branches-組織分支表)
    - [16. branch_forks (分支 Fork 記錄表)](#16-branch_forks-分支-fork-記錄表)
    - [17. pull_requests (PR 提交記錄表)](#17-pull_requests-pr-提交記錄表)
  - [📋 任務執行系統 (9 張)](#-任務執行系統-9-張)
    - [18. tasks (任務主表 - 樹狀結構)](#18-tasks-任務主表---樹狀結構)
    - [19. task_assignments (任務指派表)](#19-task_assignments-任務指派表)
    - [20. task_lists (任務列表表)](#20-task_lists-任務列表表)
    - [21. task_staging (暫存區表)](#21-task_staging-暫存區表)
    - [22. daily_reports (施工日誌表)](#22-daily_reports-施工日誌表)
    - [23. report_photos (報表照片表)](#23-report_photos-報表照片表)
    - [24. weather_cache (天氣快取表)](#24-weather_cache-天氣快取表)
    - [25. task_dependencies (任務依賴關係表)](#25-task_dependencies-任務依賴關係表)
    - [26. task_templates (任務模板表)](#26-task_templates-任務模板表)
  - [✅ 品質驗收系統 (4 張)](#-品質驗收系統-4-張)
    - [27. quality_checks (品質管理表)](#27-quality_checks-品質管理表)
    - [28. qc_photos (品管照片表)](#28-qc_photos-品管照片表)
    - [29. inspections (驗收表 - 責任切割)](#29-inspections-驗收表---責任切割)
    - [30. inspection_photos (驗收照片表)](#30-inspection_photos-驗收照片表)
  - [⚠️ 問題追蹤系統 (4 張)](#-問題追蹤系統-4-張)
    - [31. issues (問題主表)](#31-issues-問題主表)
    - [32. issue_assignments (問題指派表)](#32-issue_assignments-問題指派表)
    - [33. issue_photos (問題照片表)](#33-issue_photos-問題照片表)
    - [34. issue_sync_logs (問題同步記錄表)](#34-issue_sync_logs-問題同步記錄表)
  - [💬 協作溝通系統 (6 張)](#-協作溝通系統-6-張)
    - [35. comments (留言表)](#35-comments-留言表)
    - [36. notifications (通知表)](#36-notifications-通知表)
    - [37. notification_rules (通知規則表)](#37-notification_rules-通知規則表)
    - [38. notification_subscriptions (通知訂閱表)](#38-notification_subscriptions-通知訂閱表)
    - [39. personal_todos (個人待辦中心表)](#39-personal_todos-個人待辦中心表)
    - [40. todo_status_tracking (待辦狀態追蹤表)](#40-todo_status_tracking-待辦狀態追蹤表)
  - [📊 資料分析系統 (6 張)](#-資料分析系統-6-張)
    - [41. documents (文件元資料表)](#41-documents-文件元資料表)
    - [42. document_versions (文件版本控制表)](#42-document_versions-文件版本控制表)
    - [43. document_thumbnails (圖片縮圖表)](#43-document_thumbnails-圖片縮圖表)
    - [44. progress_tracking (進度追蹤表)](#44-progress_tracking-進度追蹤表)
    - [45. activity_logs (活動記錄表)](#45-activity_logs-活動記錄表)
    - [46. analytics_cache (數據分析快取表)](#46-analytics_cache-數據分析快取表)
  - [🤖 機器人系統 (3 張)](#-機器人系統-3-張)
    - [47. bots (機器人定義表)](#47-bots-機器人定義表)
    - [48. bot_tasks (機器人任務表)](#48-bot_tasks-機器人任務表)
    - [49. bot_execution_logs (機器人執行日誌表)](#49-bot_execution_logs-機器人執行日誌表)
  - [⚙️ 系統管理 (2 張)](#-系統管理-2-張)
    - [50. settings (系統設定表)](#50-settings-系統設定表)
    - [51. feature_flags (功能開關表)](#51-feature_flags-功能開關表)
- [🔗 關鍵關聯關係圖](#-關鍵關聯關係圖)
  - [藍圖 → 分支 → PR 流程](#藍圖--分支--pr-流程)
  - [任務執行流程](#任務執行流程)
  - [問題同步機制](#問題同步機制)
- [📝 表格數量確認](#-表格數量確認)
- [🎯 核心設計原則總結](#-核心設計原則總結)
  - [1. Git-like 分支模型](#1-git-like-分支模型)
  - [2. 權限分離架構](#2-權限分離架構)
  - [3. 數據同步機制](#3-數據同步機制)
  - [4. 暫存區設計](#4-暫存區設計)
  - [5. 待辦中心分類](#5-待辦中心分類)
- [🔧 索引優化建議](#-索引優化建議)
  - [高頻查詢表的額外索引](#高頻查詢表的額外索引)
- [🚀 分區表建議（未來優化）](#-分區表建議未來優化)
  - [適合分區的大型表](#適合分區的大型表)
- [📊 資料庫大小預估](#-資料庫大小預估)
  - [小型專案（10 個藍圖）](#小型專案10-個藍圖)
  - [中型專案（100 個藍圖）](#中型專案100-個藍圖)
  - [大型專案（1,000 個藍圖）](#大型專案1000-個藍圖)
- [⚡ 效能優化檢查清單](#-效能優化檢查清單)
- [🔐 安全性檢查清單](#-安全性檢查清單)
- [📚 相關文件連結](#-相關文件連結)
  - [Supabase 參考](#supabase-參考)
  - [PostgreSQL 參考](#postgresql-參考)
- [🎨 ERD 視覺化建議](#-erd-視覺化建議)
- [✅ 資料表結構驗證](#-資料表結構驗證)
  - [命名規範檢查](#命名規範檢查)
  - [資料完整性檢查](#資料完整性檢查)
- [🎯 下一步建議](#-下一步建議)

---


> 📋 **目的**：提供 51 張資料表的完整 SQL 定義，作為資料庫遷移和開發的權威參考

根據最新架構設計，系統共需要 **51 張資料表**（不包括 Supabase Auth 內建的 `auth.users` 表）。

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📊 資料表分類統計

| 分類 | 數量 | 說明 |
|------|------|------|
| 🔐 帳戶與身份系統 | 4 張 | 統一身份抽象、團隊、排班 |
| 🤝 組織協作系統 | 3 張 | 跨組織協作、邀請管理 |
| 🔒 權限系統 | 5 張 | 角色權限、分支權限控制 |
| 🎯 藍圖/專案系統 | 5 張 | Git-like 分支模型 |
| 📋 任務執行系統 | 9 張 | 樹狀任務、暫存區、日誌 |
| ✅ 品質驗收系統 | 4 張 | 品管、驗收、責任切割 |
| ⚠️ 問題追蹤系統 | 4 張 | 問題管理、跨分支同步 |
| 💬 協作溝通系統 | 6 張 | 留言、通知、待辦中心 |
| 📊 資料分析系統 | 6 張 | 文件管理、進度追蹤、分析快取 |
| 🤖 機器人系統 | 3 張 | Bot 定義、任務、執行日誌 |
| ⚙️ 系統管理 | 2 張 | 系統設定、功能開關 |
| **總計** | **51 張** | |

- --

## 📋 完整資料表清單與結構

### 🔐 帳戶與身份系統 (4 張)

#### 1. accounts (帳戶主表)
統一身份抽象，支援 User/Bot/Organization 三種類型。

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('User', 'Bot', 'Organization')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(auth_user_id),
  UNIQUE(email)
);

CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_auth_user_id ON accounts(auth_user_id);
```

#### 2. teams (團隊表)
組織內的團隊管理。

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_org_type CHECK (
    EXISTS (SELECT 1 FROM accounts WHERE id = organization_id AND type = 'Organization')
  )
);

CREATE INDEX idx_teams_org ON teams(organization_id);
CREATE INDEX idx_teams_created_by ON teams(created_by);
```

#### 3. team_members (團隊成員表)
團隊成員關聯表。

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(team_id, account_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_account ON team_members(account_id);
```

#### 4. organization_schedules (組織排班表)
組織內部排班管理，可跨藍圖調派成員。

```sql
CREATE TABLE organization_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id),
  team_id UUID REFERENCES teams(id),
  schedule_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  weather_info JSONB,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_assign_target CHECK (
    (account_id IS NOT NULL AND team_id IS NULL) OR
    (account_id IS NULL AND team_id IS NOT NULL)
  )
);

CREATE INDEX idx_org_schedules_date ON organization_schedules(schedule_date);
CREATE INDEX idx_org_schedules_org ON organization_schedules(organization_id);
CREATE INDEX idx_org_schedules_blueprint ON organization_schedules(blueprint_id);
CREATE INDEX idx_org_schedules_branch ON organization_schedules(branch_id);
```

- --

### 🤝 組織協作系統 (3 張)

#### 5. organization_collaborations (組織協作關係表)
管理跨組織協作關係（1:1 承攬關係）。

```sql
CREATE TABLE organization_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  owner_org_id UUID NOT NULL REFERENCES accounts(id),
  collaborator_org_id UUID NOT NULL REFERENCES accounts(id),
  collaboration_type VARCHAR(50) DEFAULT 'contractor' CHECK (
    collaboration_type IN ('contractor', 'subcontractor', 'consultant', 'partner')
  ),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'ended')),
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(blueprint_id, collaborator_org_id),
  CONSTRAINT chk_different_orgs CHECK (owner_org_id != collaborator_org_id)
);

CREATE INDEX idx_org_collab_blueprint ON organization_collaborations(blueprint_id);
CREATE INDEX idx_org_collab_owner ON organization_collaborations(owner_org_id);
CREATE INDEX idx_org_collab_collaborator ON organization_collaborations(collaborator_org_id);
```

#### 6. collaboration_invitations (協作邀請表)
組織協作邀請管理。

```sql
CREATE TABLE collaboration_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  from_org_id UUID NOT NULL REFERENCES accounts(id),
  to_org_id UUID NOT NULL REFERENCES accounts(id),
  invitation_message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_different_orgs_inv CHECK (from_org_id != to_org_id)
);

CREATE INDEX idx_collab_inv_status ON collaboration_invitations(status);
CREATE INDEX idx_collab_inv_to_org ON collaboration_invitations(to_org_id);
CREATE INDEX idx_collab_inv_expires ON collaboration_invitations(expires_at);
```

#### 7. collaboration_members (協作成員表)
協作關係中的成員管理。

```sql
CREATE TABLE collaboration_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id UUID NOT NULL REFERENCES organization_collaborations(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(collaboration_id, account_id)
);

CREATE INDEX idx_collab_members_collab ON collaboration_members(collaboration_id);
CREATE INDEX idx_collab_members_account ON collaboration_members(account_id);
```

- --

### 🔒 權限系統 (5 張)

#### 8. roles (角色定義表)
系統角色定義。

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 預設系統角色
INSERT INTO roles (name, description, is_system_role) VALUES
('blueprint_owner', '藍圖擁有者（全權控制）', TRUE),
('blueprint_admin', '藍圖管理員', TRUE),
('project_manager', '專案經理', TRUE),
('contractor', '承攬商（僅操作承攬欄位）', TRUE),
('quality_inspector', '品管人員', TRUE),
('viewer', '查看者（唯讀）', TRUE);
```

#### 9. user_roles (用戶角色關聯表)
用戶在特定藍圖/分支的角色關聯。

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES accounts(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(account_id, role_id, blueprint_id, branch_id)
);

CREATE INDEX idx_user_roles_account ON user_roles(account_id);
CREATE INDEX idx_user_roles_blueprint ON user_roles(blueprint_id);
CREATE INDEX idx_user_roles_branch ON user_roles(branch_id);
```

#### 10. permissions (權限定義表)
系統權限定義。

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  is_system_permission BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 預設權限
INSERT INTO permissions (name, resource, action, description) VALUES
-- 藍圖權限
('blueprint.create', 'blueprint', 'create', '建立藍圖'),
('blueprint.read', 'blueprint', 'read', '查看藍圖'),
('blueprint.update', 'blueprint', 'update', '更新藍圖結構'),
('blueprint.delete', 'blueprint', 'delete', '刪除藍圖'),
('blueprint.fork', 'blueprint', 'fork', 'Fork 藍圖給協作組織'),
-- 任務權限
('task.create', 'task', 'create', '建立任務（僅擁有者）'),
('task.read', 'task', 'read', '查看任務'),
('task.update', 'task', 'update', '更新任務結構（僅擁有者）'),
('task.assign', 'task', 'assign', '指派任務'),
('task.submit', 'task', 'submit', '提交任務完成'),
('task.fill_contractor_fields', 'task', 'fill_contractor_fields', '填寫承攬欄位'),
-- PR 權限
('pr.create', 'pull_request', 'create', '建立 PR（提交執行數據）'),
('pr.review', 'pull_request', 'review', '審查 PR（擁有者）'),
('pr.merge', 'pull_request', 'merge', '合併 PR（更新承攬欄位）');
```

#### 11. role_permissions (角色權限關聯表)
角色與權限的多對多關聯。

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_perms_role ON role_permissions(role_id);
CREATE INDEX idx_role_perms_permission ON role_permissions(permission_id);
```

#### 12. branch_permissions (分支權限表)
分支層級的權限控制。

```sql
CREATE TABLE branch_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  permission_level VARCHAR(20) NOT NULL CHECK (
    permission_level IN ('owner', 'admin', 'write', 'read')
  ),
  granted_by UUID NOT NULL REFERENCES accounts(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(branch_id, account_id)
);

CREATE INDEX idx_branch_perms_branch ON branch_permissions(branch_id);
CREATE INDEX idx_branch_perms_account ON branch_permissions(account_id);
```

- --

### 🎯 藍圖/專案系統 (5 張)

#### 13. blueprints (藍圖主表 - 主分支)
專案藍圖主分支，由擁有者組織控制任務結構。

```sql
CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES accounts(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  project_code VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'planning' CHECK (
    status IN ('planning', 'active', 'on_hold', 'completed', 'archived')
  ),
  start_date DATE,
  end_date DATE,
  location TEXT,
  budget DECIMAL(15, 2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_owner_is_org CHECK (
    EXISTS (SELECT 1 FROM accounts WHERE id = owner_id AND type = 'Organization')
  )
);

CREATE INDEX idx_blueprints_owner ON blueprints(owner_id);
CREATE INDEX idx_blueprints_status ON blueprints(status);
CREATE INDEX idx_blueprints_code ON blueprints(project_code);
```

#### 14. blueprint_configs (藍圖設定表)
藍圖基本資訊和範圍設定。

```sql
CREATE TABLE blueprint_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB NOT NULL,
  updated_by UUID REFERENCES accounts(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(blueprint_id, config_key)
);

CREATE INDEX idx_blueprint_configs_blueprint ON blueprint_configs(blueprint_id);
```

#### 15. blueprint_branches (組織分支表)
協作組織的 Fork 分支，只能操作承攬欄位。

```sql
CREATE TABLE blueprint_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES accounts(id),
  branch_name VARCHAR(255) NOT NULL,
  branch_type VARCHAR(20) DEFAULT 'contractor' CHECK (
    branch_type IN ('contractor', 'subcontractor', 'consultant')
  ),
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'merged', 'closed')
  ),
  forked_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  notes TEXT,

  UNIQUE(blueprint_id, organization_id),
  CONSTRAINT chk_org_type_branch CHECK (
    EXISTS (SELECT 1 FROM accounts WHERE id = organization_id AND type = 'Organization')
  )
);

CREATE INDEX idx_branches_blueprint ON blueprint_branches(blueprint_id);
CREATE INDEX idx_branches_org ON blueprint_branches(organization_id);
CREATE INDEX idx_branches_status ON blueprint_branches(status);
```

#### 16. branch_forks (分支 Fork 記錄表)
記錄任務 Fork 的歷史。

```sql
CREATE TABLE branch_forks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  forked_from_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  forked_by UUID NOT NULL REFERENCES accounts(id),
  fork_reason TEXT,
  forked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_branch_forks_blueprint ON branch_forks(blueprint_id);
CREATE INDEX idx_branch_forks_branch ON branch_forks(branch_id);
CREATE INDEX idx_branch_forks_task ON branch_forks(forked_from_task_id);
```

#### 17. pull_requests (PR 提交記錄表)
協作組織提交執行數據，擁有者審核後合併。

```sql
CREATE TABLE pull_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (
    status IN ('open', 'reviewing', 'approved', 'rejected', 'merged', 'closed')
  ),
  submitted_by UUID NOT NULL REFERENCES accounts(id),
  reviewed_by UUID REFERENCES accounts(id),
  merged_by UUID REFERENCES accounts(id),
  changes_summary JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  merged_at TIMESTAMPTZ,

  CONSTRAINT chk_pr_status_dates CHECK (
    (status IN ('open', 'reviewing') AND reviewed_at IS NULL AND merged_at IS NULL) OR
    (status = 'approved' AND reviewed_at IS NOT NULL AND merged_at IS NULL) OR
    (status = 'merged' AND reviewed_at IS NOT NULL AND merged_at IS NOT NULL)
  )
);

CREATE INDEX idx_prs_blueprint ON pull_requests(blueprint_id);
CREATE INDEX idx_prs_branch ON pull_requests(branch_id);
CREATE INDEX idx_prs_status ON pull_requests(status);
CREATE INDEX idx_prs_submitted_by ON pull_requests(submitted_by);
```

- --

### 📋 任務執行系統 (9 張)

#### 18. tasks (任務主表 - 樹狀結構)
無層級限制的樹狀任務結構。

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50) DEFAULT 'task' CHECK (
    task_type IN ('milestone', 'phase', 'task', 'subtask')
  ),
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'assigned', 'in_progress', 'staging', 'in_qa', 'in_inspection', 'completed', 'cancelled')
  ),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (
    priority IN ('low', 'medium', 'high', 'urgent')
  ),
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  estimated_hours DECIMAL(8, 2),
  actual_hours DECIMAL(8, 2),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  contractor_fields JSONB DEFAULT '{}',
  tree_path LTREE,
  tree_level INTEGER DEFAULT 0,
  sequence_order INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_task_dates CHECK (
    planned_start_date IS NULL OR planned_end_date IS NULL OR
    planned_start_date <= planned_end_date
  )
);

CREATE INDEX idx_tasks_blueprint ON tasks(blueprint_id);
CREATE INDEX idx_tasks_branch ON tasks(branch_id);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tree_path ON tasks USING GIST(tree_path);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
```

#### 19. task_assignments (任務指派表)
支援個人/團隊/組織/承攬四種指派類型。

```sql
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assignee_type VARCHAR(20) NOT NULL CHECK (
    assignee_type IN ('individual', 'team', 'organization', 'contractor')
  ),
  assignee_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES accounts(id),
  assignment_note TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,

  UNIQUE(task_id, assignee_id)
);

CREATE INDEX idx_task_assign_task ON task_assignments(task_id);
CREATE INDEX idx_task_assign_assignee ON task_assignments(assignee_id);
CREATE INDEX idx_task_assign_type ON task_assignments(assignee_type);
```

#### 20. task_lists (任務列表表)
按指派對象分類的任務列表。

```sql
CREATE TABLE task_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  list_type VARCHAR(20) DEFAULT 'assigned' CHECK (
    list_type IN ('assigned', 'watching', 'archived')
  ),
  added_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(task_id, account_id, list_type)
);

CREATE INDEX idx_task_lists_account ON task_lists(account_id);
CREATE INDEX idx_task_lists_type ON task_lists(list_type);
```

#### 21. task_staging (暫存區表)
48 小時可撤回機制。

```sql
CREATE TABLE task_staging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES accounts(id),
  staging_data JSONB NOT NULL,
  photos JSONB DEFAULT '[]',
  notes TEXT,
  can_withdraw BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,

  CONSTRAINT chk_staging_status CHECK (
    (confirmed_at IS NULL AND withdrawn_at IS NULL) OR
    (confirmed_at IS NOT NULL AND withdrawn_at IS NULL) OR
    (confirmed_at IS NULL AND withdrawn_at IS NOT NULL)
  )
);

CREATE INDEX idx_staging_task ON task_staging(task_id);
CREATE INDEX idx_staging_submitter ON task_staging(submitted_by);
CREATE INDEX idx_staging_expires ON task_staging(expires_at) WHERE confirmed_at IS NULL;
```

#### 22. daily_reports (施工日誌表)
每日施工記錄，自動同步到主分支。

```sql
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE SET NULL,
  report_date DATE NOT NULL,
  work_description TEXT NOT NULL,
  worker_count INTEGER,
  equipment_used TEXT,
  materials_used TEXT,
  weather_info JSONB,
  progress_notes TEXT,
  issues_encountered TEXT,
  reported_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(task_id, report_date, branch_id)
);

CREATE INDEX idx_daily_reports_task ON daily_reports(task_id);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);
CREATE INDEX idx_daily_reports_blueprint ON daily_reports(blueprint_id);
CREATE INDEX idx_daily_reports_branch ON daily_reports(branch_id);
```

#### 23. report_photos (報表照片表)
施工日誌的照片附件。

```sql
CREATE TABLE report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  photo_type VARCHAR(50) DEFAULT 'progress' CHECK (
    photo_type IN ('progress', 'before', 'after', 'issue', 'equipment', 'material')
  ),
  caption TEXT,
  sequence_order INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES accounts(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_photos_report ON report_photos(report_id);
CREATE INDEX idx_report_photos_type ON report_photos(photo_type);
```

#### 24. weather_cache (天氣快取表)
中央氣象局 API 天氣資料快取。

```sql
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location VARCHAR(255) NOT NULL,
  forecast_date DATE NOT NULL,
  weather_data JSONB NOT NULL,
  api_source VARCHAR(100) DEFAULT 'cwb_api',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  UNIQUE(location, forecast_date)
);

CREATE INDEX idx_weather_cache_location ON weather_cache(location);
CREATE INDEX idx_weather_cache_date ON weather_cache(forecast_date);
CREATE INDEX idx_weather_cache_expires ON weather_cache(expires_at);
```

#### 25. task_dependencies (任務依賴關係表)
任務間的前置關係。

```sql
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'finish_to_start' CHECK (
    dependency_type IN ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')
  ),
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(task_id, depends_on_task_id),
  CONSTRAINT chk_no_self_dependency CHECK (task_id != depends_on_task_id)
);

CREATE INDEX idx_task_deps_task ON task_dependencies(task_id);
CREATE INDEX idx_task_deps_depends ON task_dependencies(depends_on_task_id);
```

#### 26. task_templates (任務模板表)
可重複使用的任務模板。

```sql
CREATE TABLE task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES accounts(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_templates_org ON task_templates(organization_id);
CREATE INDEX idx_task_templates_public ON task_templates(is_public) WHERE is_public = TRUE;
```

- --

### ✅ 品質驗收系統 (4 張)

#### 27. quality_checks (品質管理表)
品管檢查記錄。

```sql
CREATE TABLE quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  staging_id UUID REFERENCES task_staging(id) ON DELETE SET NULL,
  inspector_id UUID NOT NULL REFERENCES accounts(id),
  check_type VARCHAR(50) DEFAULT 'routine' CHECK (
    check_type IN ('routine', 'milestone', 'final', 'spot_check')
  ),
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'passed', 'failed', 'conditional_pass')
  ),
  check_items JSONB NOT NULL,
  findings TEXT,
  recommendations TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT chk_qc_completion CHECK (
    (status IN ('pending', 'in_progress') AND completed_at IS NULL) OR
    (status IN ('passed', 'failed', 'conditional_pass') AND completed_at IS NOT NULL)
  )
);

CREATE INDEX idx_quality_checks_task ON quality_checks(task_id);
CREATE INDEX idx_quality_checks_inspector ON quality_checks(inspector_id);
CREATE INDEX idx_quality_checks_status ON quality_checks(status);
```

#### 28. qc_photos (品管照片表)
品管檢查的照片附件。

```sql
CREATE TABLE qc_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qc_id UUID NOT NULL REFERENCES quality_checks(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  photo_type VARCHAR(50) DEFAULT 'inspection' CHECK (
    photo_type IN ('inspection', 'defect', 'measurement', 'compliance')
  ),
  caption TEXT,
  sequence_order INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES accounts(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qc_photos_qc ON qc_photos(qc_id);
CREATE INDEX idx_qc_photos_type ON qc_photos(photo_type);
```

#### 29. inspections (驗收表 - 責任切割)
最終驗收記錄，明確責任切割點。

```sql
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  qc_id UUID REFERENCES quality_checks(id) ON DELETE SET NULL,
  inspector_id UUID NOT NULL REFERENCES accounts(id),
  inspection_type VARCHAR(50) DEFAULT 'final' CHECK (
    inspection_type IN ('preliminary', 'final', 'warranty', 'handover')
  ),
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'accepted', 'rejected', 'conditional_accept')
  ),
  inspection_items JSONB NOT NULL,
  defects_found JSONB DEFAULT '[]',
  acceptance_criteria TEXT,
  findings TEXT,
  corrective_actions TEXT,
  responsibility_transferred BOOLEAN DEFAULT FALSE,
  transfer_date DATE,
  inspected_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT chk_inspection_completion CHECK (
    (status IN ('pending', 'in_progress') AND completed_at IS NULL) OR
    (status IN ('accepted', 'rejected', 'conditional_accept') AND completed_at IS NOT NULL)
  ),
  CONSTRAINT chk_responsibility_transfer CHECK (
    (responsibility_transferred = FALSE AND transfer_date IS NULL) OR
    (responsibility_transferred = TRUE AND transfer_date IS NOT NULL AND status = 'accepted')
  )
);

CREATE INDEX idx_inspections_task ON inspections(task_id);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_transfer ON inspections(responsibility_transferred);
```

#### 30. inspection_photos (驗收照片表)
驗收記錄的照片附件。

```sql
CREATE TABLE inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  photo_type VARCHAR(50) DEFAULT 'acceptance' CHECK (
    photo_type IN ('acceptance', 'defect', 'before_correction', 'after_correction', 'handover')
  ),
  caption TEXT,
  sequence_order INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES accounts(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inspection_photos_inspection ON inspection_photos(inspection_id);
CREATE INDEX idx_inspection_photos_type ON inspection_photos(photo_type);
```

- --

### ⚠️ 問題追蹤系統 (4 張)

#### 31. issues (問題主表)
施工異常問題追蹤。

```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  issue_type VARCHAR(50) DEFAULT 'general' CHECK (
    issue_type IN ('general', 'quality', 'safety', 'delay', 'resource', 'technical')
  ),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (
    severity IN ('low', 'medium', 'high', 'critical')
  ),
  status VARCHAR(20) DEFAULT 'open' CHECK (
    status IN ('open', 'in_progress', 'resolved', 'closed', 'wont_fix')
  ),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (
    priority IN ('low', 'medium', 'high', 'urgent')
  ),
  reported_by UUID NOT NULL REFERENCES accounts(id),
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  resolution_note TEXT,
  synced_to_main BOOLEAN DEFAULT TRUE,

  CONSTRAINT chk_issue_resolution CHECK (
    (status IN ('open', 'in_progress') AND resolved_at IS NULL) OR
    (status IN ('resolved', 'closed', 'wont_fix') AND resolved_at IS NOT NULL)
  )
);

CREATE INDEX idx_issues_blueprint ON issues(blueprint_id);
CREATE INDEX idx_issues_branch ON issues(branch_id);
CREATE INDEX idx_issues_task ON issues(task_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_synced ON issues(synced_to_main);
```

#### 32. issue_assignments (問題指派表)
問題處理人員指派。

```sql
CREATE TABLE issue_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  assignee_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES accounts(id),
  assignment_note TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(issue_id, assignee_id)
);

CREATE INDEX idx_issue_assign_issue ON issue_assignments(issue_id);
CREATE INDEX idx_issue_assign_assignee ON issue_assignments(assignee_id);
```

#### 33. issue_photos (問題照片表)
問題相關的照片附件。

```sql
CREATE TABLE issue_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  photo_type VARCHAR(50) DEFAULT 'problem' CHECK (
    photo_type IN ('problem', 'evidence', 'before', 'after', 'context')
  ),
  caption TEXT,
  sequence_order INTEGER DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES accounts(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_issue_photos_issue ON issue_photos(issue_id);
CREATE INDEX idx_issue_photos_type ON issue_photos(photo_type);
```

#### 34. issue_sync_logs (問題同步記錄表)
跨分支問題同步記錄（即時同步至主分支）。

```sql
CREATE TABLE issue_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  source_branch_id UUID REFERENCES blueprint_branches(id) ON DELETE SET NULL,
  target_blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  sync_type VARCHAR(20) DEFAULT 'create' CHECK (
    sync_type IN ('create', 'update', 'resolve', 'close')
  ),
  sync_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  synced_by UUID REFERENCES accounts(id)
);

CREATE INDEX idx_issue_sync_issue ON issue_sync_logs(issue_id);
CREATE INDEX idx_issue_sync_source ON issue_sync_logs(source_branch_id);
CREATE INDEX idx_issue_sync_target ON issue_sync_logs(target_blueprint_id);
CREATE INDEX idx_issue_sync_date ON issue_sync_logs(synced_at);
```

- --

### 💬 協作溝通系統 (6 張)

#### 35. comments (留言表)
任務、問題的討論留言。

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commentable_type VARCHAR(50) NOT NULL CHECK (
    commentable_type IN ('task', 'issue', 'pull_request', 'inspection', 'quality_check')
  ),
  commentable_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES accounts(id),
  content TEXT NOT NULL,
  mentions JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_comment_edit CHECK (
    (is_edited = FALSE AND edited_at IS NULL) OR
    (is_edited = TRUE AND edited_at IS NOT NULL)
  )
);

CREATE INDEX idx_comments_commentable ON comments(commentable_type, commentable_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

#### 36. notifications (通知表)
系統通知記錄。

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES accounts(id),
  notification_type VARCHAR(50) NOT NULL CHECK (
    notification_type IN (
      'task_assigned', 'task_submitted', 'task_approved', 'task_rejected',
      'issue_created', 'issue_assigned', 'issue_resolved',
      'pr_created', 'pr_reviewed', 'pr_merged',
      'comment_mention', 'qa_required', 'inspection_required',
      'deadline_reminder', 'staging_expiring'
    )
  ),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  related_type VARCHAR(50),
  related_id UUID,
  action_url TEXT,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (
    priority IN ('low', 'normal', 'high', 'urgent')
  ),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_notification_read CHECK (
    (is_read = FALSE AND read_at IS NULL) OR
    (is_read = TRUE AND read_at IS NOT NULL)
  )
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

#### 37. notification_rules (通知規則表)
用戶自訂通知規則。

```sql
CREATE TABLE notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (
    channel IN ('in_app', 'email', 'push', 'sms')
  ),
  is_enabled BOOLEAN DEFAULT TRUE,
  frequency VARCHAR(20) DEFAULT 'immediate' CHECK (
    frequency IN ('immediate', 'hourly', 'daily', 'weekly')
  ),
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(account_id, notification_type, channel)
);

CREATE INDEX idx_notif_rules_account ON notification_rules(account_id);
CREATE INDEX idx_notif_rules_type ON notification_rules(notification_type);
```

#### 38. notification_subscriptions (通知訂閱表)
訂閱特定資源的通知。

```sql
CREATE TABLE notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  subscribable_type VARCHAR(50) NOT NULL CHECK (
    subscribable_type IN ('blueprint', 'task', 'issue', 'branch')
  ),
  subscribable_id UUID NOT NULL,
  subscription_level VARCHAR(20) DEFAULT 'all' CHECK (
    subscription_level IN ('all', 'mentions_only', 'none')
  ),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(account_id, subscribable_type, subscribable_id)
);

CREATE INDEX idx_notif_subs_account ON notification_subscriptions(account_id);
CREATE INDEX idx_notif_subs_subscribable ON notification_subscriptions(subscribable_type, subscribable_id);
```

#### 39. personal_todos (個人待辦中心表)
用戶的個人待辦事項聚合。

```sql
CREATE TABLE personal_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  todo_type VARCHAR(50) NOT NULL CHECK (
    todo_type IN ('task', 'issue', 'review_pr', 'qa_check', 'inspection', 'custom')
  ),
  related_type VARCHAR(50),
  related_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (
    priority IN ('low', 'medium', 'high', 'urgent')
  ),
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'staging', 'in_qa', 'in_inspection', 'completed', 'cancelled')
  ),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_personal_todos_account ON personal_todos(account_id);
CREATE INDEX idx_personal_todos_status ON personal_todos(status);
CREATE INDEX idx_personal_todos_type ON personal_todos(todo_type);
CREATE INDEX idx_personal_todos_due ON personal_todos(due_date) WHERE status NOT IN ('completed', 'cancelled');
```

#### 40. todo_status_tracking (待辦狀態追蹤表)
追蹤待辦事項的狀態變化歷史。

```sql
CREATE TABLE todo_status_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id UUID NOT NULL REFERENCES personal_todos(id) ON DELETE CASCADE,
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES accounts(id),
  change_note TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_todo_tracking_todo ON todo_status_tracking(todo_id);
CREATE INDEX idx_todo_tracking_date ON todo_status_tracking(changed_at);
```

- --

### 📊 資料分析系統 (6 張)

#### 41. documents (文件元資料表)
統一文件管理（圖片、PDF 等）。

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id UUID NOT NULL REFERENCES accounts(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  storage_bucket VARCHAR(100) DEFAULT 'documents',
  checksum VARCHAR(64),
  is_public BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  upload_source VARCHAR(50) CHECK (
    upload_source IN ('web', 'mobile', 'api', 'bot')
  ),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  soft_deleted_at TIMESTAMPTZ,
  permanent_delete_at TIMESTAMPTZ,

  CONSTRAINT chk_soft_delete CHECK (
    (soft_deleted_at IS NULL AND permanent_delete_at IS NULL) OR
    (soft_deleted_at IS NOT NULL AND permanent_delete_at IS NOT NULL AND
     permanent_delete_at >= soft_deleted_at + INTERVAL '30 days')
  )
);

CREATE INDEX idx_documents_uploader ON documents(uploader_id);
CREATE INDEX idx_documents_type ON documents(file_type);
CREATE INDEX idx_documents_deleted ON documents(soft_deleted_at);
CREATE INDEX idx_documents_permanent_delete ON documents(permanent_delete_at) WHERE permanent_delete_at IS NOT NULL;
```

#### 42. document_versions (文件版本控制表)
文件修改版本歷史。

```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  checksum VARCHAR(64),
  change_description TEXT,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(document_id, version_number)
);

CREATE INDEX idx_doc_versions_document ON document_versions(document_id);
CREATE INDEX idx_doc_versions_created ON document_versions(created_at);
```

#### 43. document_thumbnails (圖片縮圖表)
圖片文件的縮圖快取。

```sql
CREATE TABLE document_thumbnails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  thumbnail_size VARCHAR(20) NOT NULL CHECK (
    thumbnail_size IN ('small', 'medium', 'large')
  ),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(document_id, thumbnail_size)
);

CREATE INDEX idx_thumbnails_document ON document_thumbnails(document_id);
```

#### 44. progress_tracking (進度追蹤表)
視覺化儀表板數據。

```sql
CREATE TABLE progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  tracking_date DATE NOT NULL,
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  in_progress_tasks INTEGER DEFAULT 0,
  pending_tasks INTEGER DEFAULT 0,
  overdue_tasks INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5, 2) DEFAULT 0.00,
  schedule_variance_days INTEGER DEFAULT 0,
  budget_spent DECIMAL(15, 2) DEFAULT 0.00,
  budget_variance DECIMAL(15, 2) DEFAULT 0.00,
  quality_score DECIMAL(5, 2),
  safety_incidents INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(blueprint_id, branch_id, tracking_date)
);

CREATE INDEX idx_progress_blueprint ON progress_tracking(blueprint_id);
CREATE INDEX idx_progress_branch ON progress_tracking(branch_id);
CREATE INDEX idx_progress_date ON progress_tracking(tracking_date);
```

#### 45. activity_logs (活動記錄表)
集中記錄所有操作（所有分支同步到主分支）。

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES accounts(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL CHECK (
    resource_type IN ('blueprint', 'branch', 'task', 'issue', 'pr', 'comment', 'document', 'inspection', 'qa')
  ),
  resource_id UUID,
  action_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_activity_blueprint_or_branch CHECK (
    (branch_id IS NULL) OR
    (branch_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM blueprint_branches WHERE id = branch_id AND blueprint_id = activity_logs.blueprint_id
    ))
  )
);

CREATE INDEX idx_activity_logs_blueprint ON activity_logs(blueprint_id);
CREATE INDEX idx_activity_logs_branch ON activity_logs(branch_id);
CREATE INDEX idx_activity_logs_actor ON activity_logs(actor_id);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
```

#### 46. analytics_cache (數據分析快取表)
預計算的分析報表快取。

```sql
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key VARCHAR(255) NOT NULL UNIQUE,
  cache_type VARCHAR(50) NOT NULL CHECK (
    cache_type IN ('main_branch', 'single_branch', 'cross_branch', 'organization', 'global')
  ),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES blueprint_branches(id) ON DELETE CASCADE,
  aggregation_level VARCHAR(20) DEFAULT 'daily' CHECK (
    aggregation_level IN ('hourly', 'daily', 'weekly', 'monthly')
  ),
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT chk_cache_scope CHECK (
    (cache_type = 'main_branch' AND blueprint_id IS NOT NULL AND branch_id IS NULL) OR
    (cache_type = 'single_branch' AND branch_id IS NOT NULL) OR
    (cache_type = 'cross_branch' AND blueprint_id IS NOT NULL) OR
    (cache_type IN ('organization', 'global'))
  )
);

CREATE INDEX idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX idx_analytics_cache_blueprint ON analytics_cache(blueprint_id);
CREATE INDEX idx_analytics_cache_branch ON analytics_cache(branch_id);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);
```

- --

### 🤖 機器人系統 (3 張)

#### 47. bots (機器人定義表)
系統機器人配置（定期報表、通知、備份）。

```sql
CREATE TABLE bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  bot_type VARCHAR(50) NOT NULL CHECK (
    bot_type IN ('report_generator', 'notifier', 'backup', 'data_sync', 'custom')
  ),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_bot_account CHECK (
    EXISTS (SELECT 1 FROM accounts WHERE id = account_id AND type = 'Bot')
  )
);

CREATE INDEX idx_bots_account ON bots(account_id);
CREATE INDEX idx_bots_type ON bots(bot_type);
CREATE INDEX idx_bots_enabled ON bots(is_enabled);
```

#### 48. bot_tasks (機器人任務表)
機器人執行任務佇列。

```sql
CREATE TABLE bot_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL,
  task_config JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'completed', 'failed', 'cancelled')
  ),
  priority INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bot_tasks_bot ON bot_tasks(bot_id);
CREATE INDEX idx_bot_tasks_status ON bot_tasks(status);
CREATE INDEX idx_bot_tasks_scheduled ON bot_tasks(scheduled_at) WHERE status = 'pending';
```

#### 49. bot_execution_logs (機器人執行日誌表)
機器人執行歷史記錄。

```sql
CREATE TABLE bot_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
  bot_task_id UUID REFERENCES bot_tasks(id) ON DELETE SET NULL,
  execution_status VARCHAR(20) NOT NULL CHECK (
    execution_status IN ('success', 'partial_success', 'failed')
  ),
  execution_details JSONB,
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  execution_duration_ms INTEGER,
  error_logs JSONB DEFAULT '[]',
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bot_logs_bot ON bot_execution_logs(bot_id);
CREATE INDEX idx_bot_logs_task ON bot_execution_logs(bot_task_id);
CREATE INDEX idx_bot_logs_executed ON bot_execution_logs(executed_at);
```

- --

### ⚙️ 系統管理 (2 張)

#### 50. settings (系統設定表)
全局系統設定。

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'system' CHECK (
    setting_type IN ('system', 'organization', 'blueprint', 'user')
  ),
  scope_id UUID,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES accounts(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(setting_key);
CREATE INDEX idx_settings_type ON settings(setting_type);
CREATE INDEX idx_settings_scope ON settings(scope_id);
```

#### 51. feature_flags (功能開關表)
功能開關控制（灰度發布、A/B 測試）。

```sql
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key VARCHAR(100) NOT NULL UNIQUE,
  flag_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  target_accounts JSONB DEFAULT '[]',
  target_organizations JSONB DEFAULT '[]',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT chk_feature_dates CHECK (
    start_date IS NULL OR end_date IS NULL OR start_date <= end_date
  )
);

CREATE INDEX idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX idx_feature_flags_enabled ON feature_flags(is_enabled);
```

- --

## 🔗 關鍵關聯關係圖

### 藍圖 → 分支 → PR 流程
```text
    ↓ 1:N
blueprint_branches (組織分支)
    ↓ 1:N
pull_requests (提交執行數據)
    ↓ 審核通過
blueprints (更新承攬欄位)
```

### 任務執行流程
tasks (任務樹)
```text
task_assignments (指派)
    ↓
task_lists (待辦列表)
    ↓
task_staging (48h 暫存)
    ↓
daily_reports (施工日誌) + quality_checks (品管)
    ↓
inspections (驗收/責任切割)
    ↓
progress_tracking (進度儀表板)
```

### 問題同步機制
issues (分支問題)
    ↓ 即時同步
```text
    ↓
blueprints (主分支統一掌控)
```

- --

## 📝 表格數量確認

| 序號 | 表名 | 分類 |
|------|------|------|
| 1 | accounts | 帳戶系統 |
| 2 | teams | 帳戶系統 |
| 3 | team_members | 帳戶系統 |
| 4 | organization_schedules | 帳戶系統 |
| 5 | organization_collaborations | 協作系統 |
| 6 | collaboration_invitations | 協作系統 |
| 7 | collaboration_members | 協作系統 |
| 8 | roles | 權限系統 |
| 9 | user_roles | 權限系統 |
| 10 | permissions | 權限系統 |
| 11 | role_permissions | 權限系統 |
| 12 | branch_permissions | 權限系統 |
| 13 | blueprints | 藍圖系統 |
| 14 | blueprint_configs | 藍圖系統 |
| 15 | blueprint_branches | 藍圖系統 |
| 16 | branch_forks | 藍圖系統 |
| 17 | pull_requests | 藍圖系統 |
| 18 | tasks | 任務系統 |
| 19 | task_assignments | 任務系統 |
| 20 | task_lists | 任務系統 |
| 21 | task_staging | 任務系統 |
| 22 | daily_reports | 任務系統 |
| 23 | report_photos | 任務系統 |
| 24 | weather_cache | 任務系統 |
| 25 | task_dependencies | 任務系統 |
| 26 | task_templates | 任務系統 |
| 27 | quality_checks | 品質系統 |
| 28 | qc_photos | 品質系統 |
| 29 | inspections | 品質系統 |
| 30 | inspection_photos | 品質系統 |
| 31 | issues | 問題系統 |
| 32 | issue_assignments | 問題系統 |
| 33 | issue_photos | 問題系統 |
| 34 | issue_sync_logs | 問題系統 |
| 35 | comments | 溝通系統 |
| 36 | notifications | 溝通系統 |
| 37 | notification_rules | 溝通系統 |
| 38 | notification_subscriptions | 溝通系統 |
| 39 | personal_todos | 溝通系統 |
| 40 | todo_status_tracking | 溝通系統 |
| 41 | documents | 資料系統 |
| 42 | document_versions | 資料系統 |
| 43 | document_thumbnails | 資料系統 |
| 44 | progress_tracking | 資料系統 |
| 45 | activity_logs | 資料系統 |
| 46 | analytics_cache | 資料系統 |
| 47 | bots | 機器人系統 |
| 48 | bot_tasks | 機器人系統 |
| 49 | bot_execution_logs | 機器人系統 |
| 50 | settings | 系統管理 |
| 51 | feature_flags | 系統管理 |

**總計：51 張資料表**

- --

## 🎯 核心設計原則總結

### 1. Git-like 分支模型
- **主分支 (blueprints)**：擁有者全權控制任務結構
- **組織分支 (blueprint_branches)**：協作組織只能填寫承攬欄位
- **Pull Request**：提交執行數據 → 擁有者審核 → 合併更新

### 2. 權限分離架構
擁有者權限：
✅ 建立/修改任務結構
✅ Fork 任務給協作組織
```text
✅ 查看所有分支數據

協作組織權限：
❌ 不能修改任務結構
✅ 只能填寫承攬欄位
✅ 提交執行數據 (PR)
✅ 查看自己分支數據
```

### 3. 數據同步機制
- **施工日誌**：自動同步到主分支
- **品管記錄**：自動同步到主分支
- **問題追蹤**：即時同步到主分支（所有分支問題統一可見）
- **活動記錄**：集中記錄在主分支（擁有者全局掌控）

### 4. 暫存區設計
- **48 小時緩衝期**：允許撤回提交
- **分階段確認**：提交 → 暫存 → 品管 → 驗收
- **責任切割點**：驗收通過後明確責任轉移

### 5. 待辦中心分類
個人待辦中心 (personal_todos)
├── 🟦 待執行 (task_lists)
├── 🟨 暫存中 (task_staging)
├── 🟧 品管中 (quality_checks)
```sql
└── ⚠️ 問題追蹤 (issues)
```

- --

## 🔧 索引優化建議

### 高頻查詢表的額外索引

```sql
-- 任務樹狀查詢優化
CREATE INDEX idx_tasks_parent_status ON tasks(parent_task_id, status);
CREATE INDEX idx_tasks_blueprint_status ON tasks(blueprint_id, status);

-- 待辦中心查詢優化
CREATE INDEX idx_personal_todos_account_status ON personal_todos(account_id, status);
CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_id, is_read, created_at DESC);

-- 進度追蹤查詢優化
CREATE INDEX idx_progress_blueprint_date ON progress_tracking(blueprint_id, tracking_date DESC);

-- 活動記錄查詢優化
CREATE INDEX idx_activity_logs_blueprint_created ON activity_logs(blueprint_id, created_at DESC);

-- PR 狀態查詢優化
CREATE INDEX idx_prs_branch_status ON pull_requests(branch_id, status);
```

- --

## 🚀 分區表建議（未來優化）

### 適合分區的大型表

```sql
-- 1. activity_logs (按月分區)
CREATE TABLE activity_logs (
  -- ... 欄位定義
) PARTITION BY RANGE (created_at);

CREATE TABLE activity_logs_2025_01 PARTITION OF activity_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 2. notifications (按月分區)
CREATE TABLE notifications (
  -- ... 欄位定義
) PARTITION BY RANGE (created_at);

-- 3. bot_execution_logs (按月分區)
CREATE TABLE bot_execution_logs (
  -- ... 欄位定義
) PARTITION BY RANGE (executed_at);
```

- --

## 📊 資料庫大小預估

### 小型專案（10 個藍圖）
- 任務數：~5,000
- 用戶數：~100
- 預估大小：~5 GB

### 中型專案（100 個藍圖）
- 任務數：~50,000
- 用戶數：~1,000
- 預估大小：~50 GB

### 大型專案（1,000 個藍圖）
- 任務數：~500,000
- 用戶數：~10,000
- 預估大小：~500 GB

- --

## ⚡ 效能優化檢查清單

- [x] 所有外鍵都有索引
- [x] 高頻查詢欄位有複合索引
- [x] JSONB 欄位使用 GIN 索引（按需建立）
- [x] 時間序列查詢有日期索引
- [x] 軟刪除欄位有部分索引
- [x] 唯一約束防止重複資料
- [x] CHECK 約束保證資料完整性
- [ ] 定期 VACUUM 和 ANALYZE（運行時設定）
- [ ] 連線池配置（應用層設定）
- [ ] 查詢快取策略（應用層設定）

- --

## 🔐 安全性檢查清單

- [x] 所有敏感操作記錄到 activity_logs
- [x] 軟刪除機制（30 天保留期）
- [x] 權限系統完整覆蓋
- [x] 分支權限隔離
- [x] 密碼相關欄位使用 Supabase Auth
- [ ] Row Level Security (RLS) 策略（Supabase 層實作）
- [ ] API 層權限驗證（應用層實作）
- [ ] 敏感資料加密（應用層實作）

- --

## 📚 相關文件連結

### Supabase 參考
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

### PostgreSQL 參考
- [ltree 擴充](https://www.postgresql.org/docs/current/ltree.html)
- [JSONB 類型](https://www.postgresql.org/docs/current/datatype-json.html)
- [分區表](https://www.postgresql.org/docs/current/ddl-partitioning.html)

- --

## 🎨 ERD 視覺化建議

建議使用以下工具生成 ERD：
- **dbdiagram.io**：線上 ERD 工具
- **DBeaver**：支援反向工程
- **pgAdmin**：PostgreSQL 官方工具
- **Supabase Studio**：內建 Schema Visualizer

- --

## ✅ 資料表結構驗證

### 命名規範檢查
- ✅ 表名使用複數形式（users, tasks）
- ✅ 欄位名使用 snake_case
- ✅ 時間戳記統一使用 TIMESTAMPTZ
- ✅ 外鍵欄位統一命名為 `{table}_id`
- ✅ 布林欄位使用 `is_` 或 `has_` 前綴

### 資料完整性檢查
- ✅ 所有主鍵使用 UUID
- ✅ 所有外鍵設定 ON DELETE 行為
- ✅ 關鍵欄位有 NOT NULL 約束
- ✅ 枚舉欄位使用 CHECK 約束
- ✅ 日期欄位有邏輯驗證約束
- ✅ 軟刪除欄位有完整性約束

- --

## 🎯 下一步建議

1. **建立 Supabase 專案**
   - 執行 SQL 建立所有表格
   - 設定 RLS 策略
   - 配置 Storage Buckets

2. **初始化資料**
   - 插入預設角色和權限
   - 建立系統機器人帳戶
   - 設定預設通知規則

3. **API 開發**
   - 實作權限驗證中介層
   - 建立 RESTful/GraphQL API
   - 實作 Webhook 通知

4. **前端整合**
   - 藍圖管理介面
   - 任務執行流程介面
   - 待辦中心儀表板
   - 進度追蹤視覺化

5. **測試與優化**
   - 效能測試
   - 壓力測試
   - 查詢優化
   - 索引調整

- --

**文件版本**: v2.0
**最後更新**: 2025-11-15
**維護者**: 系統架構團隊
