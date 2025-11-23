# Task Services

任務管理相關服務模組 | Task Management Services Module

## 📋 概述 | Overview

此模組提供任務（Task）管理相關的業務邏輯服務，包括任務的 CRUD 操作、樹狀結構管理、狀態轉換、依賴管理等功能。

This module provides business logic services for task management, including task CRUD operations, tree structure management, status transitions, dependency management, and other functions.

## 🎯 職責 | Responsibilities

- 提供任務相關業務邏輯的封裝
- 管理任務狀態（使用 Angular Signals）
- 協調 Repository 層進行資料操作
- 處理任務狀態轉換和驗證
- 管理任務樹狀結構的操作
- 管理任務依賴關係
- 管理任務指派
- 管理任務暫存（48 小時可撤回機制）
- 管理任務歷史記錄（審計追蹤）

## 📦 主要服務 | Main Services

### `TaskService`
任務核心管理服務，提供任務的 CRUD 操作。

**主要方法：**
- `findById(id: string)` - 根據 ID 查詢任務
- `findByWorkspace(workspaceId: string)` - 查詢工作區的所有任務
- `findByAssignee(assigneeId: string, assigneeType: AssigneeType)` - 查詢指派給對象的任務
- `findByStatus(status: TaskStatus, workspaceId?: string)` - 根據狀態查詢任務
- `create(request: CreateTaskRequest)` - 創建任務
- `update(id: string, request: UpdateTaskRequest)` - 更新任務
- `delete(id: string)` - 刪除任務
- `changeStatus(id: string, newStatus: TaskStatus)` - 變更任務狀態（含驗證）

**狀態管理：**
- `tasks: Signal<TaskBusinessModel[]>` - 任務列表
- `loading: Signal<boolean>` - 載入狀態
- `error: Signal<string | null>` - 錯誤訊息

### `TaskTreeService`
任務樹狀結構服務，管理任務的樹狀操作。

**主要方法：**
- `getTaskTree(workspaceId: string, rootTaskId?: string)` - 獲取任務樹
- `moveTask(request: MoveTaskRequest)` - 移動任務（拖放排序）
- `getTaskPath(taskId: string)` - 獲取任務路徑
- `getTaskDescendants(taskId: string)` - 獲取任務的所有後代
- `getTaskAncestors(taskId: string)` - 獲取任務的所有祖先
- `canMoveTask(taskId: string, newParentId: string | null)` - 檢查是否可以移動任務

**狀態管理：**
- `taskTree: Signal<TaskNode[]>` - 任務樹
- `expandedKeys: Signal<string[]>` - 展開的節點鍵值

### `TaskDependencyService`
任務依賴關係服務，管理任務依賴。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有依賴
- `findBlockingTasks(taskId: string)` - 查詢阻塞此任務的任務
- `findBlockedTasks(taskId: string)` - 查詢被此任務阻塞的任務
- `create(request: CreateTaskDependencyRequest)` - 創建依賴關係
- `delete(id: string)` - 刪除依賴關係
- `checkCycle(taskId: string, dependsOnTaskId: string)` - 檢查循環依賴

### `TaskAssignmentService`
任務指派服務，管理任務指派。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有指派
- `findByAssignee(assigneeId: string, assigneeType: AssigneeType)` - 查詢指派給對象的所有任務
- `assign(taskId: string, assigneeId: string, assigneeType: AssigneeType)` - 指派任務
- `unassign(taskId: string, assigneeId: string, assigneeType: AssigneeType)` - 取消指派
- `bulkAssign(taskIds: string[], assigneeId: string, assigneeType: AssigneeType)` - 批量指派

### `TaskStagingService`
任務暫存服務，管理 48 小時可撤回機制。

**主要方法：**
- `submitToStaging(taskId: string)` - 提交任務到暫存區
- `withdrawFromStaging(taskId: string)` - 從暫存區撤回任務
- `isWithdrawable(taskId: string)` - 檢查是否可撤回（48 小時內）
- `getStagingTasks(workspaceId: string)` - 獲取暫存中的任務

### `TaskHistoryService`
任務歷史記錄服務，管理審計追蹤。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有歷史記錄
- `getTaskTimeline(taskId: string)` - 獲取任務時間線
- `createHistoryEntry(taskId: string, action: TaskHistoryAction, changedFields: Record<string, { old: unknown; new: unknown }>)` - 創建歷史記錄

### `TaskTemplateService`
任務模板服務，管理任務模板。

**主要方法：**
- `findById(id: string)` - 根據 ID 查詢模板
- `findByOwner(ownerId: string, ownerType: string)` - 查詢擁有者的模板
- `findPublic()` - 查詢公開模板
- `create(request: CreateTaskTemplateRequest)` - 創建模板
- `update(id: string, request: UpdateTaskTemplateRequest)` - 更新模板
- `delete(id: string)` - 刪除模板
- `instantiate(templateId: string, variables: Record<string, string>, workspaceId: string)` - 實例化模板

## 🔗 依賴關係 | Dependencies

- **Repository 層**: `@core/infra/repositories/blueprint/task`
- **Models 層**: `@shared/models/blueprint/task`
- **Types 層**: `@core/infra/types/blueprint/task`
- **Account Services**: `@shared/services/account`
- **Supabase Service**: `@core/infra/supabase`

## 📝 使用範例 | Usage Example

```typescript
import { inject } from '@angular/core';
import { TaskService, TaskTreeService } from '@shared/services/blueprint/task';
import { TaskStatus, TaskPriority } from '@shared/models/blueprint/task';

// 在組件或服務中注入
const taskService = inject(TaskService);
const taskTreeService = inject(TaskTreeService);

// 創建任務
const task = await taskService.create({
  workspaceId: 'workspace-123',
  title: '新任務',
  description: '任務描述',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM
});

// 變更任務狀態
await taskService.changeStatus(task.id, TaskStatus.IN_PROGRESS);

// 移動任務（拖放排序）
await taskTreeService.moveTask({
  taskId: task.id,
  newParentId: 'parent-task-id',
  newPosition: 2
});

// 獲取任務樹
const tree = await taskTreeService.getTaskTree('workspace-123');

// 監聽狀態變化
taskService.tasks(); // Signal<TaskBusinessModel[]>
taskService.loading(); // Signal<boolean>
taskService.error(); // Signal<string | null>
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Shared Services 層**，屬於業務邏輯層，負責：
- 封裝業務邏輯
- 管理應用狀態（使用 Signals）
- 協調 Repository 層進行資料操作
- 提供可重用的業務服務

## 🔄 狀態轉換驗證 | Status Transition Validation

服務層實現任務狀態轉換的驗證：

```typescript
// 狀態轉換規則
const transitions: Record<TaskStatus, TaskStatus[]> = {
  pending: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'pending', 'cancelled'],
  in_progress: ['staging', 'assigned', 'cancelled'],
  staging: ['in_qa', 'in_progress'], // 48h 內可撤回
  in_qa: ['in_inspection', 'in_progress', 'cancelled'],
  in_inspection: ['completed', 'in_qa', 'cancelled'],
  completed: [], // 終端狀態
  cancelled: []  // 終端狀態
};
```

## 🌳 樹狀結構操作 | Tree Operations

服務層實現任務樹狀結構的操作：

- **移動任務**: 自動更新路徑和位置
- **路徑計算**: 重新計算實體化路徑
- **位置計算**: 重新計算同層級位置
- **循環檢測**: 防止任務移動造成循環

## ⏰ 48 小時暫存機制 | 48-Hour Staging Mechanism

任務提交後進入 `staging` 狀態，48 小時內可以撤回：

- `submitToStaging()` - 提交任務到暫存區
- `withdrawFromStaging()` - 從暫存區撤回任務（恢復之前狀態）
- `isWithdrawable()` - 檢查是否可撤回（48 小時內）

## 📚 相關文檔 | Related Documentation

- [任務模型文檔](../../models/blueprint/task/README.md)
- [任務 Repository 文檔](../../../core/infra/repositories/blueprint/task/README.md)
- [任務類型定義](../../../core/infra/types/blueprint/task/README.md)
- [藍圖任務模組設計](../../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [狀態枚舉定義](../../../../../docs/reference/state-enum-definitions.md)

## 🔄 更新日誌 | Changelog

**v1.0.0** (2025-01-XX)
- 初始版本
- 實現 TaskService、TaskTreeService 等核心服務
- 實現任務狀態轉換驗證
- 實現任務樹狀結構操作
- 實現 48 小時暫存機制

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

