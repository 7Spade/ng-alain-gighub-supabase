# 資料模型對照表

## 📑 目錄

- [📋 目錄](#-目錄)
- [對照說明](#對照說明)
- [命名規範](#命名規範)
  - [資料庫命名規範](#資料庫命名規範)
  - [TypeScript 命名規範](#typescript-命名規範)
- [類型對照](#類型對照)
  - [PostgreSQL ↔ TypeScript 類型對照表](#postgresql--typescript-類型對照表)
  - [可選欄位對照](#可選欄位對照)
- [核心模型對照](#核心模型對照)
  - [1. 帳戶與身份系統](#1-帳戶與身份系統)
    - [accounts 表 ↔ Account 介面](#accounts-表--account-介面)
    - [teams 表 ↔ Team 介面](#teams-表--team-介面)
    - [team_members 表 ↔ TeamMember 介面](#team_members-表--teammember-介面)
  - [2. 組織協作系統](#2-組織協作系統)
    - [organization_collaborations 表 ↔ OrganizationCollaboration 介面](#organization_collaborations-表--organizationcollaboration-介面)
  - [3. 藍圖/專案系統](#3-藍圖專案系統)
    - [blueprints 表 ↔ Blueprint 介面](#blueprints-表--blueprint-介面)
  - [4. 任務系統](#4-任務系統)
    - [tasks 表 ↔ Task 介面](#tasks-表--task-介面)
  - [5. 其他系統模型](#5-其他系統模型)
    - [users 表 ↔ User 介面](#users-表--user-介面)
- [Repository 層映射規則](#repository-層映射規則)
  - [命名轉換規則](#命名轉換規則)
    - [1. 欄位名轉換](#1-欄位名轉換)
    - [2. 類型轉換](#2-類型轉換)
    - [3. 可選欄位處理](#3-可選欄位處理)
  - [Repository 實作範例](#repository-實作範例)
- [範例](#範例)
  - [完整對照範例：Blueprint](#完整對照範例blueprint)
- [注意事項](#注意事項)
  - [1. 命名一致性](#1-命名一致性)
  - [2. 類型安全](#2-類型安全)
  - [3. 陣列和 JSONB](#3-陣列和-jsonb)
  - [4. 擴展模型](#4-擴展模型)
- [相關文檔](#相關文檔)
- [📝 更新說明](#-更新說明)
  - [主要更新內容](#主要更新內容)
  - [待補充的模型對照](#待補充的模型對照)

---


> 📋 **目的**：提供資料庫表結構與 TypeScript 模型的完整對照，確保開發時命名和類型一致

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [對照說明](#對照說明)
- [命名規範](#命名規範)
- [類型對照](#類型對照)
- [核心模型對照](#核心模型對照)
- [Repository 層映射規則](#repository-層映射規則)
- [範例](#範例)

- --

## 對照說明

本文檔提供：
- 資料庫表名 ↔ TypeScript 介面/類型對照
- 資料庫欄位名（snake_case）↔ TypeScript 屬性名（camelCase）對照
- PostgreSQL 類型 ↔ TypeScript 類型對照
- Repository 層映射規則

**參考文檔**：
- 資料庫結構：`docs/12-實體關係圖.mermaid.md`
- 資料表清單：`docs/30-資料表清單總覽.md`
- TypeScript 模型：`src/app/shared/models/`

- --

## 命名規範

### 資料庫命名規範

- **表名**：小寫 + 底線（snake_case），複數形式
  - 範例：`accounts`, `blueprints`, `task_assignments`
- **欄位名**：小寫 + 底線（snake_case）
  - 範例：`user_id`, `created_at`, `is_private`
- **主鍵**：統一使用 `id`（UUID 類型）
- **外鍵**：`{table}_id` 格式
  - 範例：`blueprint_id`, `account_id`
- **時間戳記**：`created_at`, `updated_at`

### TypeScript 命名規範

- **介面名**：PascalCase，單數形式
  - 範例：`Account`, `Blueprint`, `TaskAssignment`
- **屬性名**：camelCase
  - 範例：`userId`, `createdAt`, `isPrivate`
- **類型別名**：PascalCase，通常以 `Type` 或具體名稱結尾
  - 範例：`BlueprintStatus`, `TeamMemberRole`

- --

## 類型對照

### PostgreSQL ↔ TypeScript 類型對照表

| PostgreSQL 類型 | TypeScript 類型 | 說明 | 範例 |
|----------------|----------------|------|------|
| `uuid` | `string` | UUID 字串 | `"550e8400-e29b-41d4-a716-446655440000"` |
| `text` | `string` | 文字字串 | `"Hello World"` |
| `varchar(n)` | `string` | 有限長度字串 | `"example"` |
| `integer` | `number` | 整數 | `42` |
| `bigint` | `number` | 大整數 | `1234567890` |
| `numeric(p,s)` | `number` | 精確數值 | `123.45` |
| `boolean` | `boolean` | 布林值 | `true`, `false` |
| `date` | `string` | ISO 8601 日期字串 | `"2025-01-15"` |
| `timestamp` | `string` | ISO 8601 時間戳記 | `"2025-01-15T08:30:00Z"` |
| `timestamp with time zone` | `string` | ISO 8601 時間戳記（含時區） | `"2025-01-15T08:30:00+08:00"` |
| `jsonb` | `Record<string, unknown> \| null` | JSON 物件 | `{ "key": "value" }` |
| `jsonb` | `T[] \| null` | JSON 陣列 | `["item1", "item2"]` |
| `enum` | `'value1' \| 'value2'` | 字串字面值聯合類型 | `'active' \| 'inactive'` |
| `array` | `T[]` | 陣列類型 | `string[]`, `number[]` |

### 可選欄位對照

| PostgreSQL | TypeScript | 說明 |
|-----------|-----------|------|
| `NOT NULL` | 必填屬性 | `name: string` |
| `NULL` 或無約束 | 可選屬性 | `description?: string \| null` |
| `DEFAULT` | 預設值 | 在 TypeScript 中可選，或使用預設值 |

- --

## 核心模型對照

### 1. 帳戶與身份系統

#### accounts 表 ↔ Account 介面

**資料庫表**：`accounts`（統一身份抽象，支援 User/Bot/Organization）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 帳戶 ID（主鍵） |
| `auth_user_id` | `authUserId` | `uuid` → `string \| null` | Auth User ID（可選） |
| `type` | `type` | `enum` → `'User' \| 'Bot' \| 'Organization'` | 帳戶類型 |
| `name` | `name` | `varchar(255)` → `string` | 帳戶名稱 |
| `email` | `email` | `varchar(255)` → `string \| null` | 電子郵件（可選） |
| `avatar_url` | `avatarUrl` | `text` → `string \| null` | 頭像 URL |
| `status` | `status` | `enum` → `'active' \| 'inactive' \| 'suspended'` | 帳戶狀態 |
| `metadata` | `metadata` | `jsonb` → `Record<string, unknown> \| null` | 擴展資料 |
| `created_at` | `createdAt` | `timestamptz` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamptz` → `string` | 更新時間 |

**TypeScript 模型位置**：`src/app/shared/models/account.model.ts`（需建立）

**對應介面**：`Account`

**注意**：根據 30-0-完整SQL表結構定義.md，`accounts` 表是統一身份抽象，支援三種類型。需要建立對應的 TypeScript 模型。

- --

#### teams 表 ↔ Team 介面

**資料庫表**：`teams`（組織內的團隊管理）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 團隊 ID（主鍵） |
| `organization_id` | `organizationId` | `uuid` → `string` | 所屬組織 ID |
| `name` | `name` | `varchar(255)` → `string` | 團隊名稱 |
| `description` | `description` | `text` → `string \| null` | 團隊描述 |
| `avatar_url` | `avatarUrl` | `text` → `string \| null` | 頭像 URL |
| `created_by` | `createdBy` | `uuid` → `string` | 建立者 ID |
| `created_at` | `createdAt` | `timestamptz` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamptz` → `string` | 更新時間 |

**TypeScript 模型位置**：`src/app/shared/models/team.model.ts`

**對應介面**：`Team`

**注意**：根據 30-0-完整SQL表結構定義.md，`teams` 表不包含 `slug`、`privacy`、`parent_team_id` 欄位。

- --

#### team_members 表 ↔ TeamMember 介面

**資料庫表**：`team_members`（團隊成員關聯表）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 成員 ID（主鍵） |
| `team_id` | `teamId` | `uuid` → `string` | 團隊 ID |
| `account_id` | `accountId` | `uuid` → `string` | 帳戶 ID（對應 accounts 表） |
| `role` | `role` | `enum` → `'leader' \| 'member'` | 角色 |
| `joined_at` | `joinedAt` | `timestamptz` → `string` | 加入時間 |

**TypeScript 模型位置**：`src/app/shared/models/team.model.ts`

**對應介面**：`TeamMember`

**注意**：根據 30-0-完整SQL表結構定義.md，`team_members` 表使用 `account_id` 而非 `user_id`，且不包含 `status` 欄位。

- --

### 2. 組織協作系統

**注意**：根據 30-0-完整SQL表結構定義.md，組織資訊存儲在 `accounts` 表中（`type = 'Organization'`），不再有獨立的 `organizations` 表。組織協作相關的表包括：

#### organization_collaborations 表 ↔ OrganizationCollaboration 介面

**資料庫表**：`organization_collaborations`（管理跨組織協作關係，1:1 承攬關係）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 協作關係 ID（主鍵） |
| `blueprint_id` | `blueprintId` | `uuid` → `string` | 藍圖 ID |
| `owner_org_id` | `ownerOrgId` | `uuid` → `string` | 擁有者組織 ID |
| `collaborator_org_id` | `collaboratorOrgId` | `uuid` → `string` | 協作組織 ID |
| `collaboration_type` | `collaborationType` | `enum` → `'contractor' \| 'subcontractor' \| 'consultant' \| 'partner'` | 協作類型 |
| `status` | `status` | `enum` → `'pending' \| 'active' \| 'suspended' \| 'ended'` | 協作狀態 |
| `contract_start_date` | `contractStartDate` | `date` → `string \| null` | 合約開始日期 |
| `contract_end_date` | `contractEndDate` | `date` → `string \| null` | 合約結束日期 |
| `notes` | `notes` | `text` → `string \| null` | 備註 |
| `created_at` | `createdAt` | `timestamptz` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamptz` → `string` | 更新時間 |

**TypeScript 模型位置**：`src/app/shared/models/organization.model.ts`（需建立）

**對應介面**：`OrganizationCollaboration`

- --

### 3. 藍圖/專案系統

#### blueprints 表 ↔ Blueprint 介面

**資料庫表**：`blueprints`（藍圖主表 - 主分支，由擁有者組織控制任務結構）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 藍圖 ID（主鍵） |
| `owner_id` | `ownerId` | `uuid` → `string` | 擁有者 ID（必須是 Organization 類型） |
| `name` | `name` | `varchar(255)` → `string` | 藍圖名稱 |
| `description` | `description` | `text` → `string \| null` | 藍圖描述 |
| `project_code` | `projectCode` | `varchar(50)` → `string \| null` | 專案代碼（唯一） |
| `status` | `status` | `enum` → `'planning' \| 'active' \| 'on_hold' \| 'completed' \| 'archived'` | 藍圖狀態 |
| `start_date` | `startDate` | `date` → `string \| null` | 開始日期 |
| `end_date` | `endDate` | `date` → `string \| null` | 結束日期 |
| `location` | `location` | `text` → `string \| null` | 工地位置 |
| `budget` | `budget` | `decimal(15, 2)` → `number \| null` | 預算 |
| `metadata` | `metadata` | `jsonb` → `Record<string, unknown> \| null` | 擴展資料 |
| `created_at` | `createdAt` | `timestamptz` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamptz` → `string` | 更新時間 |

**TypeScript 模型位置**：`src/app/shared/models/blueprint.model.ts`

**對應介面**：`Blueprint`

**注意**：根據 30-0-完整SQL表結構定義.md，`blueprints` 表不包含 `organization_id`、`team_id`、`slug`、`avatar_url`、`project_manager_id`、`current_stage`、`progress_percentage`、`is_private`、`tags` 等欄位。這些資訊可能存儲在 `blueprint_configs` 表或其他相關表中。

- --

### 4. 任務系統

#### tasks 表 ↔ Task 介面

**資料庫表**：`tasks`

**注意**：任務模型較為複雜，包含多個維度（Identity, Time, Location, Resource, Progress, Cost, Quality, Risk, Safety, Document, Communication, Change）。

**TypeScript 模型位置**：`src/app/routes/blueprint/tabs/tasks/shared/models/`

**主要介面**：
- `Task` - 完整任務模型（組合所有維度）
- `TaskIdentityComplete` - 任務本體模型

**核心欄位對照**（以 TaskIdentity 為例）：

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 任務 ID（主鍵） |
| `blueprint_id` | `blueprintId` | `uuid` → `string` | 藍圖 ID |
| `parent_id` | `parentId` | `uuid` → `string \| null` | 父任務 ID |
| `name` | `name` | `text` → `string` | 任務名稱 |
| `description` | `description` | `text` → `string \| null` | 任務描述 |
| `status` | `status` | `enum` → `'pending' \| 'assigned' \| 'in_progress' \| 'completed' \| 'cancelled'` | 任務狀態 |
| `priority` | `priority` | `enum` → `'low' \| 'medium' \| 'high' \| 'urgent'` | 優先級 |
| `created_at` | `createdAt` | `timestamp` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamp` → `string` | 更新時間 |

- --

### 5. 其他系統模型

#### users 表 ↔ User 介面

**資料庫表**：`auth.users`（Supabase Auth 內建）+ `public.users`（擴展）

| 資料庫欄位 | TypeScript 屬性 | 類型 | 說明 |
|-----------|----------------|------|------|
| `id` | `id` | `uuid` → `string` | 用戶 ID（主鍵） |
| `email` | `email` | `text` → `string` | 電子郵件 |
| `display_name` | `displayName` | `text` → `string \| null` | 顯示名稱 |
| `avatar_url` | `avatarUrl` | `text` → `string \| null` | 頭像 URL |
| `bio` | `bio` | `text` → `string \| null` | 個人簡介 |
| `timezone` | `timezone` | `text` → `string \| null` | 時區 |
| `locale` | `locale` | `text` → `string \| null` | 語言設定 |
| `created_at` | `createdAt` | `timestamp` → `string` | 建立時間 |
| `updated_at` | `updatedAt` | `timestamp` → `string` | 更新時間 |

**TypeScript 模型位置**：`src/app/shared/models/user.model.ts`

**對應介面**：`User`

- --

## Repository 層映射規則

### 命名轉換規則

Repository 層負責在資料庫（snake_case）和 TypeScript（camelCase）之間進行轉換。

#### 1. 欄位名轉換

```typescript
// 資料庫 → TypeScript
const dbRecord = {
  user_id: '123',
  created_at: '2025-01-15T08:30:00Z',
  is_private: true
};

// 轉換為
const tsModel = {
  userId: '123',
  createdAt: '2025-01-15T08:30:00Z',
  isPrivate: true
};
```

#### 2. 類型轉換

```typescript
// UUID 轉換（通常不需要，因為都是 string）
const id: string = dbRecord.id;

// 日期轉換（確保 ISO 8601 格式）
const createdAt: string = new Date(dbRecord.created_at).toISOString();

// 陣列轉換
const tags: string[] = dbRecord.tags || [];

// JSONB 轉換
const metadata: Record<string, unknown> = dbRecord.metadata || {};
```

#### 3. 可選欄位處理

```typescript
// 資料庫 NULL → TypeScript null 或 undefined
const description: string | null = dbRecord.description ?? null;

// 或使用可選屬性
const description?: string | null = dbRecord.description;
```

### Repository 實作範例

```typescript
// Repository 層負責轉換
export class BlueprintRepository {
  // 資料庫記錄 → TypeScript 模型
  private mapDbToModel(dbRecord: BlueprintDbRecord): Blueprint {
    return {
      id: dbRecord.id,
      organizationId: dbRecord.organization_id,
      teamId: dbRecord.team_id,
      ownerId: dbRecord.owner_id,
      name: dbRecord.name,
      slug: dbRecord.slug,
      description: dbRecord.description ?? null,
      avatarUrl: dbRecord.avatar_url ?? null,
      siteLocation: dbRecord.site_location ?? null,
      projectManagerId: dbRecord.project_manager_id ?? null,
      currentStage: dbRecord.current_stage ?? null,
      progressPercentage: dbRecord.progress_percentage,
      isPrivate: dbRecord.is_private,
      status: dbRecord.status,
      startDate: dbRecord.start_date ?? null,
      endDate: dbRecord.end_date ?? null,
      tags: dbRecord.tags ?? [],
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }

  // TypeScript 模型 → 資料庫記錄
  private mapModelToDb(model: Blueprint): BlueprintDbRecord {
    return {
      id: model.id,
      organization_id: model.organizationId ?? null,
      team_id: model.teamId ?? null,
      owner_id: model.ownerId,
      name: model.name,
      slug: model.slug,
      description: model.description ?? null,
      avatar_url: model.avatarUrl ?? null,
      site_location: model.siteLocation ?? null,
      project_manager_id: model.projectManagerId ?? null,
      current_stage: model.currentStage ?? null,
      progress_percentage: model.progressPercentage,
      is_private: model.isPrivate,
      status: model.status,
      start_date: model.startDate ?? null,
      end_date: model.endDate ?? null,
      tags: model.tags ?? [],
      created_at: model.createdAt,
      updated_at: model.updatedAt
    };
  }
}
```

- --

## 範例

### 完整對照範例：Blueprint

**資料庫查詢結果**（PostgREST 回應）：
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "organization_id": "660e8400-e29b-41d4-a716-446655440001",
  "team_id": null,
  "owner_id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "台北101大樓新建工程",
  "slug": "taipei-101-construction",
  "description": "台北101大樓新建工程專案",
  "avatar_url": "https://storage.supabase.co/...",
  "site_location": "台北市信義區",
  "project_manager_id": "880e8400-e29b-41d4-a716-446655440003",
  "current_stage": "基礎施工",
  "progress_percentage": 45.5,
  "is_private": false,
  "status": "active",
  "start_date": "2025-01-01",
  "end_date": "2026-12-31",
  "tags": ["建築", "大型工程"],
  "created_at": "2025-01-15T08:30:00Z",
  "updated_at": "2025-01-15T16:45:00Z"
}
```

**TypeScript 模型**：
```typescript
const blueprint: Blueprint = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  organizationId: "660e8400-e29b-41d4-a716-446655440001",
  teamId: null,
  ownerId: "770e8400-e29b-41d4-a716-446655440002",
  name: "台北101大樓新建工程",
  slug: "taipei-101-construction",
  description: "台北101大樓新建工程專案",
  avatarUrl: "https://storage.supabase.co/...",
  siteLocation: "台北市信義區",
  projectManagerId: "880e8400-e29b-41d4-a716-446655440003",
  currentStage: "基礎施工",
  progressPercentage: 45.5,
  isPrivate: false,
  status: "active",
  startDate: "2025-01-01",
  endDate: "2026-12-31",
  tags: ["建築", "大型工程"],
  createdAt: "2025-01-15T08:30:00Z",
  updatedAt: "2025-01-15T16:45:00Z"
};
```

- --

## 注意事項

### 1. 命名一致性

- ✅ **正確**：資料庫使用 `snake_case`，TypeScript 使用 `camelCase`
- ❌ **錯誤**：在 TypeScript 中使用 `snake_case` 或資料庫中使用 `camelCase`

### 2. 類型安全

- 所有 UUID 欄位在 TypeScript 中都是 `string` 類型
- 日期時間欄位統一使用 ISO 8601 格式字串
- 可選欄位必須明確標註 `| null` 或使用 `?`

### 3. 陣列和 JSONB

- 陣列欄位（如 `tags`）在 TypeScript 中對應 `T[]`
- JSONB 欄位對應 `Record<string, unknown> | null` 或具體類型

### 4. 擴展模型

- 使用 `extends` 建立擴展模型（如 `BlueprintWithOwner`）
- 關聯資料通過擴展模型包含（如 `BlueprintMemberWithUser`）

- --

## 相關文檔

- [文檔索引](./README.md) - 文檔導航
- [實體關係圖](./12-實體關係圖.mermaid.md)
- [資料表清單總覽](./30-資料表清單總覽.md)
- [狀態枚舉值定義](./43-狀態枚舉值定義.md) - 狀態定義單一真實來源
- [API接口詳細文檔](./33-API-接口詳細文檔.md)
- [開發作業指引](./specs/00-development-guidelines.md)

- --

- --

## 📝 更新說明

本文檔已根據 `30-0-完整SQL表結構定義.md` 的完整 SQL 表結構定義進行更新，確保與 51 張資料表的實際結構完全一致。

### 主要更新內容

1. **accounts 表**：更新為統一身份抽象結構，支援 User/Bot/Organization 三種類型
2. **teams 表**：移除不存在的欄位（slug、privacy、parent_team_id）
3. **team_members 表**：使用 `account_id` 而非 `user_id`，移除 `status` 欄位
4. **organizations 表**：改為使用 `accounts` 表（type = 'Organization'），新增 `organization_collaborations` 表對照
5. **blueprints 表**：對齊 30-0-完整SQL表結構定義.md 的實際欄位定義

### 待補充的模型對照

根據 30-0-完整SQL表結構定義.md，以下表的模型對照需要補充：
- `blueprint_configs` - 藍圖設定表
- `blueprint_branches` - 組織分支表（Git-like 分支模型）
- `branch_forks` - 分支 Fork 記錄表
- `pull_requests` - PR 提交記錄表
- `task_staging` - 暫存區表（48 小時可撤回機制）
- `daily_reports` - 施工日誌表
- `quality_checks` - 品質管理表
- `inspections` - 驗收表（責任切割）
- `issues` - 問題主表
- `issue_sync_logs` - 問題同步記錄表
- `personal_todos` - 個人待辦中心表（五種狀態分類）
- `documents` - 文件元資料表
- `activity_logs` - 活動記錄表
- 以及其他 51 張表中的所有表

**完整對照請參考**：`30-0-完整SQL表結構定義.md` 中的完整 SQL 表結構定義。

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**對齊版本**：30-0-完整SQL表結構定義.md v2.0（51 張資料表）

