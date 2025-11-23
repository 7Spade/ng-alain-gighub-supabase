# Blueprint Infrastructure Types

藍圖管理基礎設施型別定義模組 | Blueprint Infrastructure Types Module

## 📋 概述 | Overview

此模組定義藍圖（Blueprint）管理相關的基礎設施層型別（Infrastructure Types），包括資料庫模型、Repository 介面、Supabase 相關型別等。

This module defines infrastructure layer types for blueprint management, including database models, repository interfaces, Supabase-related types, etc.

## 🎯 職責 | Responsibilities

- 定義資料庫層的資料模型型別
- 定義 Repository 介面的型別
- 定義 Supabase 查詢和操作的型別
- 提供型別安全的資料庫操作介面

## 📦 主要型別定義 | Main Type Definitions

### 待實現型別 | Types to be Implemented

此模組目前處於規劃階段，預計包含以下型別：

### `BlueprintStatus`
藍圖狀態枚舉。

```typescript
enum BlueprintStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}
```

### `BranchStatus`
分支狀態枚舉。

```typescript
enum BranchStatus {
  ACTIVE = 'active',
  MERGED = 'merged',
  CLOSED = 'closed'
}
```

### `TaskStatus`
任務狀態枚舉。

```typescript
enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  STAGING = 'staging',
  IN_QA = 'in_qa',
  IN_INSPECTION = 'in_inspection',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### `BlueprintDatabaseModel`
藍圖資料庫模型，對應 `blueprints` 資料表。

**預計屬性：**
- `id: string` - 藍圖 ID (UUID)
- `name: string` - 藍圖名稱
- `owner_id: string` - 擁有者帳號 ID (FK accounts)
- `description: string | null` - 藍圖描述
- `status: BlueprintStatus` - 藍圖狀態
- `config: Json` - 藍圖配置 (JSON)
- `created_at: string` - 創建時間 (ISO 8601)
- `updated_at: string` - 更新時間 (ISO 8601)
- `deleted_at: string | null` - 刪除時間 (軟刪除)

### `BlueprintBranchDatabaseModel`
藍圖分支資料庫模型，對應 `blueprint_branches` 資料表。

**預計屬性：**
- `id: string` - 分支 ID (UUID)
- `blueprint_id: string` - 所屬藍圖 ID (FK blueprints)
- `name: string` - 分支名稱
- `parent_branch_id: string | null` - 父分支 ID
- `owner_id: string` - 分支擁有者 ID (FK accounts)
- `status: BranchStatus` - 分支狀態
- `created_at: string` - 創建時間
- `updated_at: string` - 更新時間

### `BlueprintTaskDatabaseModel`
藍圖任務資料庫模型，對應 `blueprint_tasks` 資料表。

### `PullRequestDatabaseModel`
Pull Request 資料庫模型，對應 `pull_requests` 資料表。

## 🔗 依賴關係 | Dependencies

- **Supabase Client**: `@supabase/supabase-js` 型別定義
- **Database Schema**: Supabase 資料庫 schema 定義
- **Account Types**: `@core/infra/types/account` - 帳號相關型別

## 📝 使用範例 | Usage Example

```typescript
import { 
  BlueprintStatus, 
  BranchStatus,
  BlueprintDatabaseModel 
} from '@core/infra/types/blueprint';

// 使用枚舉
const blueprintStatus: BlueprintStatus = BlueprintStatus.ACTIVE;
const branchStatus: BranchStatus = BranchStatus.ACTIVE;

// 使用資料庫模型
const blueprint: BlueprintDatabaseModel = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: '專案藍圖',
  owner_id: 'org-123',
  description: '這是一個專案管理藍圖',
  status: BlueprintStatus.ACTIVE,
  config: {
    workingDays: [1, 2, 3, 4, 5],
    notificationRules: []
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  deleted_at: null
};
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Core Infrastructure Types 層**，屬於基礎設施層，負責：
- 定義資料庫層的型別
- 提供型別安全的資料庫操作
- 與 Supabase 資料庫 schema 對應
- 為 Repository 層提供型別定義

## 🔀 Git-like 型別關係 | Git-like Type Relationships

藍圖系統採用類似 Git 的型別關係：

```
Blueprint (Repository)
  ├── Main Branch (主分支)
  ├── Organization Branch (組織分支)
  │   └── Tasks (任務)
  └── Pull Requests (PR)
```

## 📚 相關文檔 | Related Documentation

- [藍圖 Repository 文檔](../repositories/blueprint/README.md)
- [藍圖模型文檔](../../../shared/models/blueprint/README.md)
- [藍圖容器規劃文檔](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md)
- [藍圖任務模組設計](../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [SQL Schema 定義](../../../../docs/reference/sql-schema-definition.md)
- [資料模型對照表](../../../../docs/reference/data-model-mapping.md)
- [Supabase 架構文檔](../../../../docs/supabase/architecture/database.md)

## 🚧 開發狀態 | Development Status

**狀態**: 規劃中 | Planning

此模組目前處於設計和規劃階段，相關型別將根據 [Blueprint Container Planning](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md) 文檔逐步實現。

## 🔄 更新日誌 | Changelog

**v0.1.0** (2025-01-XX)
- 初始規劃版本
- 建立模組結構和文檔

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

