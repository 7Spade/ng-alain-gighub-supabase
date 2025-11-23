# Task Infrastructure Types

任務管理基礎設施型別定義模組 | Task Management Infrastructure Types Module

## 📋 概述 | Overview

此模組定義任務（Task）管理相關的基礎設施層型別（Infrastructure Types），包括資料庫模型、Repository 介面、Supabase 相關型別等。

This module defines infrastructure layer types for task management, including database models, repository interfaces, Supabase-related types, etc.

## 🎯 職責 | Responsibilities

- 定義資料庫層的任務資料模型型別
- 定義 Repository 介面的型別
- 定義 Supabase 查詢和操作的型別
- 提供型別安全的資料庫操作介面
- 定義任務狀態、優先級等枚舉型別

## 📦 主要型別定義 | Main Type Definitions

### `TaskStatus`
任務狀態枚舉（8 個狀態）。

```typescript
type TaskStatus = 
  | 'pending'       // 待處理 - 任務已建立但未開始
  | 'assigned'      // 已指派 - 任務已指派給負責人
  | 'in_progress'   // 進行中 - 任務正在執行
  | 'staging'       // 暫存中 - 任務已提交，進入 48 小時暫存區（可撤回）
  | 'in_qa'         // 品管中 - 任務進入品質檢查流程
  | 'in_inspection' // 驗收中 - 任務進入驗收流程
  | 'completed'     // 已完成 - 任務已完成
  | 'cancelled';    // 已取消 - 任務已取消
```

### `TaskPriority`
任務優先級枚舉。

```typescript
type TaskPriority = 
  | 'low'     // 低優先級
  | 'medium'  // 中等優先級
  | 'high'    // 高優先級
  | 'urgent'; // 緊急優先級
```

### `AssigneeType`
指派對象類型（多型）。

```typescript
type AssigneeType = 
  | 'user'         // 用戶
  | 'team'         // 團隊
  | 'organization' // 組織
  | 'bot';         // 機器人
```

### `TaskDatabaseModel`
任務資料庫模型，對應 `tasks` 資料表。

**主要屬性：**
- `id: string` - 任務 ID (UUID)
- `workspace_id: string` - 工作區 ID (FK workspaces)
- `parent_id: string | null` - 父任務 ID（樹狀結構）
- `position: number` - 同層級排序位置
- `path: string` - 實體化路徑（如 '1.2.3'）
- `depth: number` - 樹深度（0 為根任務）
- `title: string` - 任務標題（1-200 字元）
- `description: string | null` - 任務描述
- `status: TaskStatus` - 任務狀態
- `priority: TaskPriority` - 任務優先級
- `assignee_ids: string[]` - 指派對象 ID 陣列
- `assignee_types: AssigneeType[]` - 指派對象類型陣列
- `created_at: string` - 創建時間 (ISO 8601)
- `updated_at: string` - 更新時間 (ISO 8601)
- `started_at: string | null` - 開始時間
- `completed_at: string | null` - 完成時間
- `due_date: string | null` - 截止日期
- `tags: string[]` - 標籤陣列
- `contractor_fields: Record<string, unknown> | null` - 承攬欄位（JSONB）
- `dependency_count: number` - 依賴此任務的任務數量
- `blocked_count: number` - 此任務依賴的任務數量
- `comment_count: number` - 評論數量
- `child_count: number` - 子任務數量

### `TaskDependencyDatabaseModel`
任務依賴關係資料庫模型，對應 `task_dependencies` 資料表。

**主要屬性：**
- `id: string` - 依賴關係 ID
- `task_id: string` - 被阻塞的任務 ID
- `depends_on_task_id: string` - 必須先完成的任務 ID
- `created_at: string` - 創建時間
- `created_by: string` - 創建者 ID

### `TaskAssignmentDatabaseModel`
任務指派資料庫模型，對應 `task_assignments` 資料表。

**主要屬性：**
- `id: string` - 指派記錄 ID
- `task_id: string` - 任務 ID
- `assignee_id: string` - 指派對象 ID
- `assignee_type: AssigneeType` - 指派對象類型
- `assigned_at: string` - 指派時間
- `assigned_by: string` - 指派者 ID

### `TaskStagingDatabaseModel`
任務暫存資料庫模型，對應 `task_staging` 資料表（48 小時可撤回機制）。

**主要屬性：**
- `id: string` - 暫存記錄 ID
- `task_id: string` - 任務 ID
- `submitted_by: string` - 提交者 ID
- `submitted_at: string` - 提交時間
- `expires_at: string` - 過期時間（提交時間 + 48 小時）
- `previous_status: TaskStatus` - 之前的狀態（用於撤回）
- `previous_data: Record<string, unknown> | null` - 之前的資料快照（JSONB）
- `withdrawn: boolean` - 是否已撤回

### `TaskHistoryDatabaseModel`
任務歷史記錄資料庫模型，對應 `task_history` 資料表（審計追蹤）。

**主要屬性：**
- `id: string` - 歷史記錄 ID
- `task_id: string` - 任務 ID
- `changed_by: string` - 變更者 ID
- `changed_at: string` - 變更時間
- `action: string` - 操作類型（created, updated, moved, deleted, status_changed）
- `changed_fields: Record<string, { old: unknown; new: unknown }> | null` - 變更欄位（JSONB）
- `metadata: Record<string, unknown> | null` - 元資料（JSONB）

### `TaskTemplateDatabaseModel`
任務模板資料庫模型，對應 `task_templates` 資料表。

**主要屬性：**
- `id: string` - 模板 ID
- `name: string` - 模板名稱
- `description: string | null` - 模板描述
- `task_structure: Record<string, unknown> | null` - 任務結構（JSONB）
- `variables: Record<string, unknown>[] | null` - 變數定義（JSONB）
- `category: string | null` - 分類
- `tags: string[]` - 標籤陣列
- `usage_count: number` - 使用次數
- `owner_id: string` - 擁有者 ID
- `owner_type: string` - 擁有者類型
- `visibility: string` - 可見性（private, organization, public）
- `created_at: string` - 創建時間
- `updated_at: string` - 更新時間

## 🔗 依賴關係 | Dependencies

- **Supabase Client**: `@supabase/supabase-js` 型別定義
- **Database Schema**: Supabase 資料庫 schema 定義
- **Account Types**: `@core/infra/types/account` - 帳號相關型別
- **Blueprint Types**: `@core/infra/types/blueprint` - 藍圖相關型別

## 📝 使用範例 | Usage Example

```typescript
import { 
  TaskStatus, 
  TaskPriority,
  TaskDatabaseModel,
  AssigneeType
} from '@core/infra/types/blueprint/task';

// 使用枚舉
const status: TaskStatus = TaskStatus.IN_PROGRESS;
const priority: TaskPriority = TaskPriority.HIGH;

// 使用資料庫模型
const task: TaskDatabaseModel = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  workspace_id: 'workspace-123',
  parent_id: null,
  position: 0,
  path: '1',
  depth: 0,
  title: '任務標題',
  description: '任務描述',
  status: 'in_progress',
  priority: 'high',
  assignee_ids: ['user-123'],
  assignee_types: ['user'],
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  started_at: '2025-01-01T00:00:00Z',
  completed_at: null,
  due_date: null,
  tags: ['urgent', 'frontend'],
  contractor_fields: null,
  dependency_count: 0,
  blocked_count: 0,
  comment_count: 0,
  child_count: 0
};
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Core Infrastructure Types 層**，屬於基礎設施層，負責：
- 定義資料庫層的型別
- 提供型別安全的資料庫操作
- 與 Supabase 資料庫 schema 對應
- 為 Repository 層提供型別定義

## 🌳 樹狀結構 | Tree Structure

任務採用無限深度的樹狀結構：

- **parent_id**: 父任務 ID（null 表示根任務）
- **path**: 實體化路徑（如 '1.2.3'），用於高效查詢
- **depth**: 樹深度（0 為根任務）
- **position**: 同層級排序位置（支援拖放排序）

## 🔄 狀態轉換 | Status Transitions

任務狀態轉換規則：

```
pending → assigned → in_progress → staging (48h 可撤回)
  ↓         ↓            ↓            ↓
cancelled ← cancelled ← cancelled ← in_qa → in_inspection → completed
```

## 📚 相關文檔 | Related Documentation

- [任務 Repository 文檔](../../repositories/blueprint/task/README.md)
- [任務模型文檔](../../../../shared/models/blueprint/task/README.md)
- [任務服務文檔](../../../../shared/services/blueprint/task/README.md)
- [藍圖任務模組設計](../../../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [狀態枚舉定義](../../../../../../docs/reference/state-enum-definitions.md)
- [SQL Schema 定義](../../../../../../docs/reference/sql-schema-definition.md)
- [資料模型對照表](../../../../../../docs/reference/data-model-mapping.md)

## 🔄 更新日誌 | Changelog

**v1.0.0** (2025-01-XX)
- 初始版本
- 實現 Task、TaskDependency、TaskAssignment 等核心型別定義
- 定義 8 個任務狀態和 4 個優先級

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

