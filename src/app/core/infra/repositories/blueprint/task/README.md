# Task Repositories

任務管理倉儲層模組 | Task Repository Layer Module

## 📋 概述 | Overview

此模組提供任務（Task）管理相關的資料存取層（Repository Layer），封裝對 Supabase 資料庫的操作，提供型別安全的資料存取介面。

This module provides the data access layer (Repository Layer) for task management, encapsulating operations on Supabase database and providing type-safe data access interfaces.

## 🎯 職責 | Responsibilities

- 封裝任務資料庫 CRUD 操作
- 提供型別安全的查詢介面
- 處理資料庫模型與業務模型的轉換
- 實現 RLS（Row Level Security）策略的查詢
- 管理任務樹狀結構的操作（移動、排序等）
- 管理任務依賴關係
- 管理任務指派
- 管理任務暫存（48 小時可撤回機制）
- 管理任務歷史記錄（審計追蹤）
- 管理資料庫連線和錯誤處理

## 📦 主要 Repository | Main Repositories

### `TaskRepository`
任務基礎 Repository，提供任務的 CRUD 操作。

**主要方法：**
- `findById(id: string)` - 根據 ID 查詢任務
- `findByWorkspace(workspaceId: string)` - 查詢工作區的所有任務
- `findByParent(parentId: string | null)` - 查詢父任務的所有子任務
- `findByAssignee(assigneeId: string, assigneeType: AssigneeType)` - 查詢指派給對象的任務
- `findByStatus(status: TaskStatus, workspaceId?: string)` - 根據狀態查詢任務
- `create(data)` - 創建任務
- `update(id, data)` - 更新任務
- `delete(id)` - 刪除任務（硬刪除）
- `softDelete(id)` - 軟刪除任務

### `TaskTreeRepository`
任務樹狀結構 Repository，管理任務的樹狀操作。

**主要方法：**
- `moveTask(taskId: string, newParentId: string | null, newPosition: number)` - 移動任務（拖放排序）
- `getTaskPath(taskId: string)` - 獲取任務路徑
- `getTaskTree(workspaceId: string, rootTaskId?: string)` - 獲取任務樹
- `getTaskDescendants(taskId: string)` - 獲取任務的所有後代
- `getTaskAncestors(taskId: string)` - 獲取任務的所有祖先
- `recalculatePath(taskId: string)` - 重新計算任務路徑
- `recalculatePositions(parentId: string | null)` - 重新計算同層級位置

### `TaskDependencyRepository`
任務依賴關係 Repository，管理任務依賴。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有依賴
- `findBlockingTasks(taskId: string)` - 查詢阻塞此任務的任務
- `findBlockedTasks(taskId: string)` - 查詢被此任務阻塞的任務
- `create(data)` - 創建依賴關係
- `delete(id)` - 刪除依賴關係
- `checkCycle(taskId: string, dependsOnTaskId: string)` - 檢查循環依賴

### `TaskAssignmentRepository`
任務指派 Repository，管理任務指派。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有指派
- `findByAssignee(assigneeId: string, assigneeType: AssigneeType)` - 查詢指派給對象的所有任務
- `create(data)` - 創建指派
- `update(id, data)` - 更新指派
- `delete(id)` - 刪除指派
- `bulkAssign(taskIds: string[], assigneeId: string, assigneeType: AssigneeType)` - 批量指派

### `TaskStagingRepository`
任務暫存 Repository，管理 48 小時可撤回機制。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的暫存記錄
- `create(data)` - 創建暫存記錄
- `withdraw(taskId: string)` - 撤回暫存（恢復之前狀態）
- `expireStaging()` - 過期暫存記錄（定時任務）
- `isWithdrawable(taskId: string)` - 檢查是否可撤回（48 小時內）

### `TaskHistoryRepository`
任務歷史記錄 Repository，管理審計追蹤。

**主要方法：**
- `findByTask(taskId: string)` - 查詢任務的所有歷史記錄
- `create(data)` - 創建歷史記錄
- `getTaskTimeline(taskId: string)` - 獲取任務時間線

### `TaskTemplateRepository`
任務模板 Repository，管理任務模板。

**主要方法：**
- `findById(id: string)` - 根據 ID 查詢模板
- `findByOwner(ownerId: string, ownerType: string)` - 查詢擁有者的模板
- `findPublic()` - 查詢公開模板
- `create(data)` - 創建模板
- `update(id, data)` - 更新模板
- `delete(id)` - 刪除模板
- `instantiate(templateId: string, variables: Record<string, string>)` - 實例化模板

## 🔗 依賴關係 | Dependencies

- **Types 層**: `@core/infra/types/blueprint/task` - 資料庫模型型別
- **Supabase Service**: `@core/infra/supabase` - Supabase 客戶端
- **Database**: Supabase PostgreSQL 資料庫

## 📝 使用範例 | Usage Example

```typescript
import { inject } from '@angular/core';
import { TaskRepository, TaskTreeRepository } from '@core/infra/repositories/blueprint/task';
import { firstValueFrom } from 'rxjs';

// 在服務中注入
const taskRepo = inject(TaskRepository);
const taskTreeRepo = inject(TaskTreeRepository);

// 查詢任務
const task$ = taskRepo.findById('task-id');
const task = await firstValueFrom(task$);

// 創建任務
const newTask$ = taskRepo.create({
  workspace_id: 'workspace-123',
  parent_id: null,
  position: 0,
  path: '1',
  depth: 0,
  title: '新任務',
  description: '任務描述',
  status: 'pending',
  priority: 'medium'
});
const newTask = await firstValueFrom(newTask$);

// 移動任務（拖放排序）
await firstValueFrom(
  taskTreeRepo.moveTask('task-id', 'new-parent-id', 2)
);

// 查詢任務樹
const tree$ = taskTreeRepo.getTaskTree('workspace-123');
const tree = await firstValueFrom(tree$);
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Core Infrastructure Repository 層**，屬於資料存取層，負責：
- 封裝資料庫操作
- 提供型別安全的查詢介面
- 處理資料庫模型與業務模型的轉換
- 實現任務樹狀結構的操作
- 實現資料庫查詢優化

## 🌳 樹狀結構操作 | Tree Operations

Repository 層實現任務樹狀結構的操作：

- **移動任務**: `moveTask()` - 支援拖放排序，自動更新路徑和位置
- **路徑計算**: `recalculatePath()` - 重新計算實體化路徑
- **位置計算**: `recalculatePositions()` - 重新計算同層級位置
- **樹查詢**: `getTaskTree()` - 獲取完整的任務樹結構

## 🔐 RLS 策略 | RLS Policies

Repository 層的查詢會自動遵循 Supabase RLS（Row Level Security）策略：

- 用戶只能查詢自己有權限的工作區的任務
- 任務指派者可以查看和更新任務
- 工作區成員可以查看任務
- 軟刪除的任務不會被查詢到（除非明確指定）

## 🔄 資料轉換 | Data Transformation

Repository 層負責將資料庫模型轉換為業務模型：

```
Database Model (Infra Types)
  ↓ Repository 轉換
Business Model (Shared Models)
  ↓ Service 使用
Component/Service Usage
```

## ⏰ 48 小時暫存機制 | 48-Hour Staging Mechanism

任務提交後進入 `staging` 狀態，48 小時內可以撤回：

- `TaskStagingRepository.create()` - 創建暫存記錄
- `TaskStagingRepository.withdraw()` - 撤回暫存（恢復之前狀態）
- `TaskStagingRepository.expireStaging()` - 過期暫存記錄（定時任務）

## 📚 相關文檔 | Related Documentation

- [任務服務文檔](../../../../shared/services/blueprint/task/README.md)
- [任務模型文檔](../../../../shared/models/blueprint/task/README.md)
- [任務類型定義](../types/blueprint/task/README.md)
- [藍圖任務模組設計](../../../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [Supabase RLS 策略](../../../../../../docs/supabase/security/rls.md)
- [資料庫架構設計](../../../../../../docs/supabase/architecture/database.md)

## 🔄 更新日誌 | Changelog

**v1.0.0** (2025-01-XX)
- 初始版本
- 實現 Task、TaskTree、TaskDependency 等核心 Repository
- 實現任務樹狀結構操作
- 實現 48 小時暫存機制

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

