# Task Models

任務管理相關資料模型模組 | Task Management Data Models Module

## 📋 概述 | Overview

此模組定義任務（Task）管理相關的業務資料模型（Business Models），包括任務、任務依賴、任務指派等實體的型別定義和介面。

This module defines business data models for task management, including type definitions and interfaces for tasks, task dependencies, task assignments, and other entities.

## 🎯 職責 | Responsibilities

- 定義任務相關業務模型的型別
- 提供資料傳輸物件（DTO）的介面定義
- 定義請求/回應的資料結構
- 提供模型驗證和轉換工具
- 定義任務樹狀結構的業務模型

## 📦 主要模型 | Main Models

### `TaskBusinessModel`
任務業務模型，定義任務的業務層資料結構。

**主要屬性：**
- `id: string` - 任務 ID
- `workspaceId: string` - 工作區 ID
- `parentId: string | null` - 父任務 ID
- `position: number` - 同層級排序位置
- `path: string` - 實體化路徑
- `depth: number` - 樹深度
- `title: string` - 任務標題
- `description: string | null` - 任務描述
- `status: TaskStatus` - 任務狀態
- `priority: TaskPriority` - 任務優先級
- `assignees: TaskAssignee[]` - 指派對象陣列
- `createdAt: Date` - 創建時間
- `updatedAt: Date` - 更新時間
- `startedAt: Date | null` - 開始時間
- `completedAt: Date | null` - 完成時間
- `dueDate: Date | null` - 截止日期
- `tags: string[]` - 標籤陣列
- `contractorFields: Record<string, unknown> | null` - 承攬欄位
- `dependencyCount: number` - 依賴此任務的任務數量
- `blockedCount: number` - 此任務依賴的任務數量
- `commentCount: number` - 評論數量
- `childCount: number` - 子任務數量

### `TaskAssignee`
任務指派對象模型。

**主要屬性：**
- `id: string` - 指派對象 ID
- `type: AssigneeType` - 指派對象類型（user, team, organization, bot）
- `name: string` - 指派對象名稱
- `avatar: string | null` - 指派對象頭像

### `TaskNode`
任務樹節點模型，用於樹狀結構展示。

**主要屬性：**
- `key: string` - 任務 ID
- `title: string` - 任務標題
- `isLeaf: boolean` - 是否為葉節點
- `expanded: boolean` - 是否展開
- `children: TaskNode[]` - 子節點陣列
- `task: TaskBusinessModel` - 任務資料
- `level: number` - 顯示深度
- `icon: string` - 圖示（根據狀態）
- `disabled: boolean` - 是否禁用

### `TaskDependencyBusinessModel`
任務依賴關係業務模型。

**主要屬性：**
- `id: string` - 依賴關係 ID
- `taskId: string` - 被阻塞的任務 ID
- `dependsOnTaskId: string` - 必須先完成的任務 ID
- `dependsOnTask: TaskBusinessModel | null` - 依賴的任務（關聯資料）
- `createdAt: Date` - 創建時間
- `createdBy: string` - 創建者 ID

### `TaskStagingBusinessModel`
任務暫存業務模型（48 小時可撤回機制）。

**主要屬性：**
- `id: string` - 暫存記錄 ID
- `taskId: string` - 任務 ID
- `submittedBy: string` - 提交者 ID
- `submittedAt: Date` - 提交時間
- `expiresAt: Date` - 過期時間（提交時間 + 48 小時）
- `previousStatus: TaskStatus` - 之前的狀態
- `previousData: Partial<TaskBusinessModel> | null` - 之前的資料快照
- `withdrawn: boolean` - 是否已撤回
- `isWithdrawable: boolean` - 是否可撤回（計算屬性）

### `TaskHistoryBusinessModel`
任務歷史記錄業務模型（審計追蹤）。

**主要屬性：**
- `id: string` - 歷史記錄 ID
- `taskId: string` - 任務 ID
- `changedBy: string` - 變更者 ID
- `changedAt: Date` - 變更時間
- `action: TaskHistoryAction` - 操作類型
- `changedFields: Record<string, { old: unknown; new: unknown }> | null` - 變更欄位
- `metadata: Record<string, unknown> | null` - 元資料

### `TaskTemplateBusinessModel`
任務模板業務模型。

**主要屬性：**
- `id: string` - 模板 ID
- `name: string` - 模板名稱
- `description: string | null` - 模板描述
- `taskStructure: TaskTemplateNode[]` - 任務結構
- `variables: TaskTemplateVariable[]` - 變數定義
- `category: string | null` - 分類
- `tags: string[]` - 標籤陣列
- `usageCount: number` - 使用次數
- `ownerId: string` - 擁有者 ID
- `ownerType: string` - 擁有者類型
- `visibility: TaskTemplateVisibility` - 可見性
- `createdAt: Date` - 創建時間
- `updatedAt: Date` - 更新時間

## 📝 請求/回應模型 | Request/Response Models

### `CreateTaskRequest`
創建任務請求模型。

```typescript
interface CreateTaskRequest {
  workspaceId: string;
  parentId?: string | null;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignees?: Array<{ id: string; type: AssigneeType }>;
  dueDate?: Date | null;
  tags?: string[];
  contractorFields?: Record<string, unknown> | null;
}
```

### `UpdateTaskRequest`
更新任務請求模型。

```typescript
interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignees?: Array<{ id: string; type: AssigneeType }>;
  dueDate?: Date | null;
  tags?: string[];
  contractorFields?: Record<string, unknown> | null;
}
```

### `MoveTaskRequest`
移動任務請求模型（拖放排序）。

```typescript
interface MoveTaskRequest {
  taskId: string;
  newParentId: string | null;
  newPosition: number;
}
```

### `CreateTaskDependencyRequest`
創建任務依賴請求模型。

```typescript
interface CreateTaskDependencyRequest {
  taskId: string;
  dependsOnTaskId: string;
}
```

## 🔗 依賴關係 | Dependencies

- **Types 層**: `@core/infra/types/blueprint/task` - 基礎型別定義
- **Account Models**: `@shared/models/account` - 帳號相關模型
- **Enums**: `TaskStatus`, `TaskPriority`, `AssigneeType` 等

## 📝 使用範例 | Usage Example

```typescript
import { 
  TaskBusinessModel, 
  CreateTaskRequest,
  TaskStatus,
  TaskPriority
} from '@shared/models/blueprint/task';

// 創建任務請求
const request: CreateTaskRequest = {
  workspaceId: 'workspace-123',
  parentId: null,
  title: '新任務',
  description: '任務描述',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  assignees: [
    { id: 'user-123', type: 'user' }
  ],
  tags: ['urgent', 'frontend']
};

// 使用業務模型
const task: TaskBusinessModel = {
  id: 'task-123',
  workspaceId: 'workspace-123',
  parentId: null,
  position: 0,
  path: '1',
  depth: 0,
  title: '新任務',
  description: '任務描述',
  status: TaskStatus.IN_PROGRESS,
  priority: TaskPriority.HIGH,
  assignees: [
    {
      id: 'user-123',
      type: 'user',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.png'
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: null,
  dueDate: null,
  tags: ['urgent', 'frontend'],
  contractorFields: null,
  dependencyCount: 0,
  blockedCount: 0,
  commentCount: 0,
  childCount: 0
};
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Shared Models 層**，屬於業務模型層，負責：
- 定義業務層的資料結構
- 提供型別安全的資料模型
- 與 Repository 層的資料模型分離（業務模型 vs 資料庫模型）

## 🌳 樹狀結構模型 | Tree Structure Models

業務模型支援無限深度的樹狀結構：

- `TaskNode` - 用於樹狀結構展示
- `path` - 實體化路徑（如 '1.2.3'）
- `depth` - 樹深度
- `position` - 同層級排序位置

## 🔄 模型轉換 | Model Transformation

業務模型與資料庫模型之間的轉換通常在 Repository 層或 Service 層進行：

```
Database Model (Infra Types) 
  → Business Model (Shared Models)
  → Component/Service Usage
```

## 📚 相關文檔 | Related Documentation

- [任務服務文檔](../../services/blueprint/task/README.md)
- [任務 Repository 文檔](../../../core/infra/repositories/blueprint/task/README.md)
- [任務類型定義](../../../core/infra/types/blueprint/task/README.md)
- [藍圖任務模組設計](../../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [資料模型對照表](../../../../../docs/reference/data-model-mapping.md)

## 🔄 更新日誌 | Changelog

**v1.0.0** (2025-01-XX)
- 初始版本
- 實現 Task、TaskNode、TaskDependency 等核心業務模型
- 支援無限深度的樹狀結構

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

