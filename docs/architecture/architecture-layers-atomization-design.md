# 架構層級原子化設計規範

> 📋 **目的**：定義 Types、Models、Repositories、Services、Facades 五個架構層級的原子化策略與設計規範

**文件版本**：v1.0  
**最後更新**：2025-01-20  
**狀態**：Active  
**負責人**：架構團隊

---

## 📑 目錄

- [1. 概述](#1-概述)
- [2. 架構層級總覽](#2-架構層級總覽)
- [3. Types 層級（高原子化）](#3-types-層級高原子化)
- [4. Models 層級（中度原子化）](#4-models-層級中度原子化)
- [5. Repositories 層級（高原子化）](#5-repositories-層級高原子化)
- [6. Services 層級（中度原子化）](#6-services-層級中度原子化)
- [7. Facades 層級（低原子化/聚合層）](#7-facades-層級低原子化聚合層)
- [8. 實際案例](#8-實際案例)
- [9. 最佳實踐](#9-最佳實踐)
- [10. 常見問題](#10-常見問題)

---

## 1. 概述

### 1.1 什麼是原子化？

**原子化**（Atomization）是將系統拆分為更小、更獨立、更可重用的單元的過程。在軟體架構中，適當的原子化可以：

✅ **提高可維護性**：單一職責，易於理解和修改  
✅ **提高可測試性**：獨立單元易於編寫單元測試  
✅ **提高可重用性**：小單元可在多處重用  
✅ **降低耦合度**：減少模組間的依賴關係  

### 1.2 為什麼需要分層原子化策略？

不同架構層級有不同的職責和使用場景，因此需要不同程度的原子化：

| 層級 | 原子化程度 | 原因 |
|------|-----------|------|
| **Types** | 高 | 跨層共享，需要高度重用 |
| **Models** | 中 | 封裝 domain 邏輯，按 entity 組織 |
| **Repositories** | 高 | 資料來源獨立，易於替換和測試 |
| **Services** | 中 | 業務邏輯內聚，避免 God Object |
| **Facades** | 低 | 聚合多個 service，簡化對外接口 |

### 1.3 核心原則

🎯 **單一職責原則（SRP）**：每個模組只負責一件事  
🎯 **開閉原則（OCP）**：對擴展開放，對修改封閉  
🎯 **依賴反轉原則（DIP）**：依賴抽象而非具體實現  
🎯 **最小知識原則（LoD）**：模組只與直接依賴的模組通信  

---

## 2. 架構層級總覽

### 2.1 五層架構概覽

```text
│                    Component Layer                       │
│                   (Presentation)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                    Facades Layer                         │
│          (統一對外接口、協調多個 Service)                  │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│          (業務邏輯、狀態管理、協調 Repository)              │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 Repositories Layer                       │
│              (資料存取、CRUD、查詢)                       │
└──────────────────────┬──────────────────────────────────┘
                       │ use
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Types + Models                         │
│              (型別定義、資料結構)                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 目錄結構

src/app/
```typescript
│   ├── infra/
│   │   ├── types/                  # ⭐ Types 層（高原子化）
│   │   │   ├── bot/
│   │   │   │   ├── bot.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── task/
│   │   │   │   ├── task.types.ts
│   │   │   │   └── index.ts
│   │   │   └── ...
│   │   └── repositories/           # ⭐ Repositories 層（高原子化）
│   │       ├── task.repository.ts
│   │       ├── issue.repository.ts
│   │       └── ...
│   └── facades/                    # ⭐ Facades 層（低原子化）
│       ├── task.facade.ts
│       ├── issue.facade.ts
│       └── ...
│
├── shared/                         # 共享層
│   ├── models/                     # ⭐ Models 層（中度原子化）
│   │   ├── task.models.ts
│   │   ├── issue.models.ts
│   │   └── ...
│   └── services/                   # ⭐ Services 層（中度原子化）
│       ├── task/
│       │   ├── task.service.ts
│       │   ├── task-state-machine.ts
│       │   └── index.ts
│       ├── issue/
│       │   └── issue.service.ts
│       └── ...
│
└── routes/                         # 路由層（組件）
    └── ...
```

---

## 3. Types 層級（高原子化）

### 3.1 定位與作用

**作用**：
- 定義 TypeScript 型別、介面、枚舉
- 提供靜態類型檢查
- 作為跨層共享的契約

**位置**：`src/app/core/infra/types/`

**為什麼在 core 層？**
- Repository 層需要使用這些型別
- 符合分層架構：core 不依賴 shared

### 3.2 原子化策略：高原子化

**✅ 推薦做法**：
- 每個 domain/entity 單獨拆出來
- 按功能域組織（bot/、task/、issue/等）
- 每個文件專注於一個 entity 的型別定義

**❌ 不推薦做法**：
- 不要過度拆分到每個欄位級別
- 不要在 types 中混入業務邏輯
- 不要跨 domain 混合型別

### 3.3 文件結構

```typescript
// ✅ 好的範例：src/app/core/infra/types/bot/bot.types.ts
/**
 * 機器人相關型別定義（基礎設施層）
 *
 * 這些型別被 Repository 層使用，因此放在 core 層
 * 符合分層架構：core 不依賴 shared
 */

/**
 * 機器人狀態枚舉
 * 對應資料庫 bots.status 欄位
 */
export enum BotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * 機器人任務狀態枚舉
 */
export enum BotTaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * 機器人任務優先級枚舉
 */
export enum BotTaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * 機器人執行類型枚舉
 */
export enum BotExecutionType {
  SCHEDULED = 'scheduled',
  MANUAL = 'manual',
  TRIGGERED = 'triggered'
}
```

### 3.4 Index 文件組織

```typescript
// ✅ src/app/core/infra/types/bot/index.ts
export * from './bot.types';
```

```typescript
// ✅ src/app/core/infra/types/index.ts
export * from './bot';
export * from './task';
export * from './issue';
export * from './common';
// ... 其他 domain
```

### 3.5 優點

✅ **高度重用**：可在 Repository、Service、Component 中重用  
✅ **型別安全**：編譯時檢查，減少運行時錯誤  
✅ **易於維護**：改型別不會影響其他無關層  
✅ **文檔化**：型別即文檔，提高可讀性  

### 3.6 實際案例

```typescript
// src/app/core/infra/types/task/task.types.ts
export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  STAGING = 'staging',
  IN_QA = 'in_qa',
  IN_INSPECTION = 'in_inspection',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskType {
  GENERAL = 'general',
  BLUEPRINT = 'blueprint',
  QUALITY = 'quality',
  ISSUE = 'issue'
}
```

---

## 4. Models 層級（中度原子化）

### 4.1 定位與作用

**作用**：
- 代表實體對象（entity）
- 封裝 domain 資料與簡單邏輯
- 提供資料轉換方法（toDTO、validate 等）

**位置**：`src/app/shared/models/`

**為什麼在 shared 層？**
- Models 是應用層的資料結構
- 可以在多個模組間共享
- 不包含資料存取邏輯

### 4.2 原子化策略：中度原子化

**✅ 推薦做法**：
- 每個 domain entity 一個 model 文件
- 相關的 entity 可以放在同一個文件中
- 提供簡單的輔助方法

**❌ 不推薦做法**：
- 不要把 service 層邏輯放進 model
- 不要在 model 中進行資料庫操作
- 不要過度拆分相關的 entity

### 4.3 文件結構

```typescript
// ✅ 好的範例：src/app/shared/models/task.models.ts
import { Database, TaskType, TaskStatus, TaskPriority } from '@core';

/**
 * 重新匯出任務相關枚舉（從 core 層匯入）
 * 保持向後相容，允許從 @shared/models/task 匯入
 */
export { TaskType, TaskStatus, TaskPriority };

/**
 * Task 實體類型（camelCase）
 * 注意：BaseRepository 會自動進行 snake_case → camelCase 轉換
 */
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

/**
 * TaskAssignment 實體類型（camelCase）
 */
export type TaskAssignment = Database['public']['Tables']['task_assignments']['Row'];
export type TaskAssignmentInsert = Database['public']['Tables']['task_assignments']['Insert'];
export type TaskAssignmentUpdate = Database['public']['Tables']['task_assignments']['Update'];

/**
 * TaskList 實體類型（camelCase）
 */
export type TaskList = Database['public']['Tables']['task_lists']['Row'];
export type TaskListInsert = Database['public']['Tables']['task_lists']['Insert'];
export type TaskListUpdate = Database['public']['Tables']['task_lists']['Update'];

/**
 * 任務樹節點類型（用於前端樹狀結構展示）
 */
export interface TaskTreeNode {
  readonly task: Task;
  readonly children: TaskTreeNode[];
  readonly level: number;
  readonly expanded?: boolean;
}

/**
 * 任務詳情類型（包含關聯資料）
 */
export interface TaskDetail {
  readonly task: Task;
  readonly assignments?: TaskAssignment[];
  readonly lists?: TaskList[];
  readonly children?: Task[];
  readonly parent?: Task;
}
```

### 4.4 Models 與 Types 的區別

| 特性 | Types | Models |
|------|-------|--------|
| **位置** | `core/infra/types/` | `shared/models/` |
| **用途** | 基礎型別定義、枚舉 | 實體對象、業務資料結構 |
| **依賴** | 不依賴其他層 | 可依賴 Types |
| **邏輯** | 無邏輯 | 可包含簡單轉換邏輯 |
| **範例** | `TaskStatus` enum | `Task` type, `TaskDetail` interface |

### 4.5 優點

✅ **單一職責**：每個 model 對應一個 entity  
✅ **封裝邏輯**：可附加方法（toDTO、validate）  
✅ **型別安全**：從資料庫 Schema 自動生成  
✅ **易於重用**：在 Service、Component 中共享  

---

## 5. Repositories 層級（高原子化）

### 5.1 定位與作用

**作用**：
- 負責資料存取（DB、API、Supabase 等）
- 封裝 CRUD 操作
- 提供查詢方法

**位置**：`src/app/core/infra/repositories/`

**為什麼在 core 層？**
- 基礎設施層，提供資料存取能力
- 不依賴業務邏輯
- 可以被 Service 層調用

### 5.2 原子化策略：高原子化

**✅ 推薦做法**：
- 每個 entity/資源一個 repository
- 繼承 `BaseRepository` 獲得通用 CRUD 方法
- 提供專屬的查詢方法

**❌ 不推薦做法**：
- 不要在 repository 中放業務邏輯
- 不要跨 entity 混合操作
- 不要直接操作多個表（使用 Service 協調）

### 5.3 文件結構

```typescript
// ✅ 好的範例：src/app/core/infra/repositories/task.repository.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';
import { TaskPriority, TaskStatus, TaskType } from '../types/task';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type Task = TaskRow;
export type { TaskInsert, TaskUpdate };

/**
 * Task Repository
 *
 * 提供任務相關的資料存取方法
 *
 * @example
 * ```typescript
 * const taskRepo = inject(TaskRepository);
 * taskRepo.findByBlueprintId('blueprint-id').subscribe(tasks => {
 *   console.log('Blueprint tasks:', tasks);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks';

  /**
   * 根據藍圖 ID 查詢任務
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 會自動轉換為 blueprint_id
      }
    });
  }

  /**
   * 根據分支 ID 查詢任務
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId
      }
    });
  }

  /**
   * 根據父任務 ID 查詢子任務
   */
  findChildren(parentTaskId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        parentTaskId
      },
      orderBy: 'sequence_order',
      orderDirection: 'asc'
    });
  }

  /**
   * 查詢根任務（沒有父任務的任務）
   */
  findRootTasks(blueprintId: string, options?: QueryOptions): Observable<Task[]> {
    return this.query({
      filter: `blueprint_id=eq.${blueprintId}&parent_task_id=is.null`,
      order: 'sequence_order.asc'
    });
  }
}
```

### 5.4 BaseRepository 抽象

所有 Repository 都繼承自 `BaseRepository`，提供通用 CRUD 方法：

```typescript
// src/app/core/infra/repositories/base.repository.ts
export abstract class BaseRepository<T, TInsert, TUpdate> {
  protected abstract tableName: string;

  // 通用方法
  findAll(options?: QueryOptions): Observable<T[]>;
  findById(id: string): Observable<T | null>;
  create(data: TInsert): Observable<T>;
  update(id: string, data: TUpdate): Observable<T>;
  delete(id: string): Observable<void>;
  query(options: QueryOptions): Observable<T[]>;
  // ...
}
```

### 5.5 優點

✅ **資料來源獨立**：切換資料來源時，只需替換 repository  
✅ **易於測試**：可以 mock repository 進行單元測試  
✅ **統一介面**：BaseRepository 提供一致的 API  
✅ **專注資料存取**：不包含業務邏輯，職責單一  

### 5.6 進階技巧

#### 5.6.1 抽象介面（方便測試）

```typescript
// ✅ 定義介面
export interface ITaskRepository {
  findByBlueprintId(blueprintId: string): Observable<Task[]>;
  findByBranchId(branchId: string): Observable<Task[]>;
  // ...
}

// 實現介面
@Injectable()
export class TaskRepository extends BaseRepository implements ITaskRepository {
  // ...
}

// 測試時使用 mock
class MockTaskRepository implements ITaskRepository {
  findByBlueprintId(blueprintId: string): Observable<Task[]> {
    return of([/* mock data */]);
  }
  // ...
}
```

#### 5.6.2 複雜查詢 Helper

```typescript
// ✅ 對複雜查詢可建 Helper
export class TaskQueryHelper {
  static buildTreePathFilter(treePath: string): string {
    return `tree_path=like.${treePath}%`;
  }

  static buildStatusFilter(statuses: TaskStatus[]): string {
    return `status=in.(${statuses.join(',')})`;
  }
}

// 在 Repository 中使用
findByTreePath(treePath: string): Observable<Task[]> {
  return this.query({
    filter: TaskQueryHelper.buildTreePathFilter(treePath)
  });
}
```

---

## 6. Services 層級（中度原子化）

### 6.1 定位與作用

**作用**：
- 封裝業務邏輯
- 管理狀態（使用 Signals）
- 協調多個 repository

**位置**：`src/app/shared/services/`

**為什麼在 shared 層？**
- 業務邏輯層，可在多個模組間共享
- 可以調用多個 repository
- 提供 domain 特定的業務方法

### 6.2 原子化策略：中度原子化

**✅ 推薦做法**：
- 依功能域拆 service（TaskService、IssueService）
- 一個 service 處理一組相關邏輯
- 使用 Signals 管理狀態

**❌ 不推薦做法**：
- 避免服務變成巨型 God Object
- 不要跨 domain 混合業務邏輯
- 不要在 service 中直接操作資料庫（使用 Repository）

### 6.3 文件結構

```typescript
// ✅ 好的範例：src/app/shared/services/task/task.service.ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { TaskRepository, TaskInsert, TaskUpdate } from '@core';
import { Task, TaskStatus, TaskPriority, TaskTreeNode } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task Service
 *
 * 提供任務相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const taskService = inject(TaskService);
 *
 * // 訂閱任務列表
 * effect(() => {
 *   console.log('Tasks:', taskService.tasks());
 * });
 *
 * // 載入任務列表
 * await taskService.loadTasksByBlueprint('blueprint-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskRepository = inject(TaskRepository);

  // 使用 Signals 管理狀態
  private tasksState = signal<Task[]>([]);
  private selectedTaskState = signal<Task | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTask = this.selectedTaskState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly pendingTasks = computed(() => 
    this.tasks().filter(t => t.status === TaskStatus.PENDING)
  );

  readonly inProgressTasks = computed(() => 
    this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS)
  );

  readonly completedTasks = computed(() => 
    this.tasks().filter(t => t.status === TaskStatus.COMPLETED)
  );

  readonly highPriorityTasks = computed(() =>
    this.tasks().filter(t => 
      t.priority === TaskPriority.HIGH || t.priority === TaskPriority.URGENT
    )
  );

  /**
   * 載入所有任務（按藍圖）
   */
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(
        this.taskRepository.findByBlueprintId(blueprintId)
      );
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : '載入任務列表失敗'
      );
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新任務
   */
  async createTask(data: TaskInsert): Promise<Task> {
    this.loadingState.set(true);

    try {
      const newTask = await firstValueFrom(
        this.taskRepository.create(data)
      );
      
      // 更新本地狀態
      this.tasksState.update(tasks => [...tasks, newTask]);
      
      return newTask;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任務狀態
   */
  async updateTaskStatus(
    taskId: string, 
    status: TaskStatus
  ): Promise<Task> {
    const updated = await firstValueFrom(
      this.taskRepository.update(taskId, { status })
    );

    // 更新本地狀態
    this.tasksState.update(tasks =>
      tasks.map(t => t.id === taskId ? updated : t)
    );

    return updated;
  }

  /**
   * 刪除任務
   */
  async deleteTask(taskId: string): Promise<void> {
    await firstValueFrom(this.taskRepository.delete(taskId));

    // 更新本地狀態
    this.tasksState.update(tasks =>
      tasks.filter(t => t.id !== taskId)
    );
  }

  /**
   * 重置狀態
   */
  reset(): void {
    this.tasksState.set([]);
    this.selectedTaskState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}
```

### 6.4 狀態管理模式

**✅ 使用 Signals（Angular 20）**：

```typescript
// Private writable signals
private dataState = signal<T[]>([]);

// Public readonly signals
readonly data = this.dataState.asReadonly();

// Computed signals
readonly filteredData = computed(() => 
  this.data().filter(/* ... */)
);
```

### 6.5 優點

✅ **業務邏輯內聚**：單一服務處理一組邏輯  
✅ **狀態管理**：使用 Signals 提供響應式狀態  
✅ **可測試**：可以 mock repository 進行測試  
✅ **易於維護**：職責清晰，不耦合跨 domain  

### 6.6 何時省略 Service？

如果業務邏輯過於簡單（只是 CRUD），可以省略 service，直接在 facade 層調用 repository：

```typescript
// ❌ 不需要的 Service（邏輯太簡單）
@Injectable()
export class SimpleEntityService {
  private repo = inject(SimpleEntityRepository);

  getAll() { return this.repo.findAll(); }
  getById(id: string) { return this.repo.findById(id); }
  create(data: any) { return this.repo.create(data); }
  // ...
}

// ✅ 直接在 Facade 中調用 Repository
@Injectable()
export class SimpleEntityFacade {
  private repo = inject(SimpleEntityRepository);

  async loadAll() {
    return firstValueFrom(this.repo.findAll());
  }
}
```

---

## 7. Facades 層級（低原子化/聚合層）

### 7.1 定位與作用

**作用**：
- 對外統一提供 API
- 簡化 controller/component 調用
- 協調多個 service
- 支持 transaction、批量操作
- 統一錯誤處理和日誌記錄

**位置**：`src/app/core/facades/`

**為什麼在 core 層？**
- 對外接口層，提供統一的 API
- 可以跨模組協調
- 不包含具體業務邏輯（由 Service 提供）

### 7.2 原子化策略：低原子化/聚合層

**✅ 推薦做法**：
- 通常按照 use-case 聚合 service 方法
- 一個 facade 可以協調多個 service
- 提供便捷的高層級 API

**❌ 不推薦做法**：
- facade 不要放業務邏輯（由 Service 處理）
- 不要直接調用 repository（通過 Service）
- 不要過度拆分 facade

### 7.3 文件結構

```typescript
// ✅ 好的範例：src/app/core/facades/task.facade.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskInsert, TaskUpdate, type Task } from '@core';
import {
  TaskService,
  TaskAssignmentService,
  TaskListService,
  TaskStatus,
  TaskPriority,
  type TaskDetail,
  type TaskTreeNode
} from '@shared';
import { BlueprintActivityService } from '@shared';
import { ErrorStateService } from '../services/error-state.service';

/**
 * Task Facade
 *
 * 企業級任務管理門面
 * 協調 TaskService、TaskAssignmentService、TaskListService
 * 提供統一的任務操作介面
 *
 * 設計原則：
 * - Signal-based 狀態管理（Angular 20）
 * - Facade 模式：Component → Facade → Service → Repository → Supabase
 * - 非侵入式錯誤處理（ErrorStateService）
 * - 自動審計日誌（BlueprintActivityService）
 *
 * 核心功能：
 * - 任務 CRUD 操作
 * - 任務層級管理（parent-child relationships）
 * - 任務指派管理
 * - 任務列表管理
 * - 任務狀態和優先級管理
 * - 任務樹建構和導航
 * - 過濾視圖和統計
 *
 * @example
 * ```typescript
 * const facade = inject(TaskFacade);
 *
 * // 載入任務
 * await facade.loadTasksByBlueprint('blueprint-id');
 *
 * // 訂閱狀態
 * effect(() => {
 *   console.log('Tasks:', facade.tasks());
 *   console.log('Pending:', facade.pendingTasks());
 * });
 *
 * // 創建任務
 * const newTask = await facade.createTask({
 *   title: 'New Task',
 *   blueprint_id: 'bp-123',
 *   created_by: userId
 * });
 *
 * // 指派任務
 * await facade.assignTask('task-id', 'user-id', 'user');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskFacade {
  // 注入依賴
  private readonly taskService = inject(TaskService);
  private readonly taskAssignmentService = inject(TaskAssignmentService);
  private readonly taskListService = inject(TaskListService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);

  // Facade 特定狀態
  private readonly currentTaskIdState = signal<string | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);

  // 暴露 Service 狀態（代理）
  readonly tasks = this.taskService.tasks;
  readonly selectedTask = this.taskService.selectedTask;
  readonly loading = this.taskService.loading;
  readonly error = this.taskService.error;

  // 暴露 Computed signals
  readonly pendingTasks = this.taskService.pendingTasks;
  readonly inProgressTasks = this.taskService.inProgressTasks;
  readonly completedTasks = this.taskService.completedTasks;
  readonly highPriorityTasks = this.taskService.highPriorityTasks;

  // Facade 特定 Computed signals
  readonly currentTask = computed(() => {
    const currentId = this.currentTaskIdState();
    if (!currentId) return null;
    return this.tasks().find(t => t.id === currentId) || null;
  });

  /**
   * 載入任務（按藍圖）
   */
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      this.handleError('loadTasksByBlueprint', error);
      throw error;
    }
  }

  /**
   * 創建任務（含審計日誌）
   */
  async createTask(data: TaskInsert): Promise<Task> {
    this.operationInProgressState.set(true);

    try {
      const newTask = await this.taskService.createTask(data);

      // 記錄活動
      await this.activityService.logActivity({
        blueprint_id: data.blueprint_id,
        action_type: 'task_created',
        action_details: { taskId: newTask.id, title: data.title }
      });

      return newTask;
    } catch (error) {
      this.handleError('createTask', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * 更新任務（含審計日誌）
   */
  async updateTask(
    taskId: string, 
    data: TaskUpdate
  ): Promise<Task> {
    this.operationInProgressState.set(true);

    try {
      const updated = await this.taskService.updateTask(taskId, data);

      // 記錄活動
      await this.activityService.logActivity({
        blueprint_id: updated.blueprintId,
        action_type: 'task_updated',
        action_details: { taskId, updates: data }
      });

      return updated;
    } catch (error) {
      this.handleError('updateTask', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * 指派任務（協調多個 Service）
   */
  async assignTask(
    taskId: string,
    assigneeId: string,
    assigneeType: 'user' | 'team'
  ): Promise<void> {
    this.operationInProgressState.set(true);

    try {
      // 1. 創建指派記錄
      await this.taskAssignmentService.assignTask(
        taskId,
        assigneeId,
        assigneeType
      );

      // 2. 更新任務狀態
      await this.taskService.updateTaskStatus(
        taskId,
        TaskStatus.ASSIGNED
      );

      // 3. 記錄活動
      const task = this.tasks().find(t => t.id === taskId);
      if (task) {
        await this.activityService.logActivity({
          blueprint_id: task.blueprintId,
          action_type: 'task_assigned',
          action_details: { taskId, assigneeId, assigneeType }
        });
      }
    } catch (error) {
      this.handleError('assignTask', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * 批量操作：批量更新任務狀態
   */
  async batchUpdateStatus(
    taskIds: string[],
    status: TaskStatus
  ): Promise<void> {
    this.operationInProgressState.set(true);

    try {
      await Promise.all(
        taskIds.map(id => this.taskService.updateTaskStatus(id, status))
      );

      // 記錄批量活動
      const firstTask = this.tasks().find(t => t.id === taskIds[0]);
      if (firstTask) {
        await this.activityService.logActivity({
          blueprint_id: firstTask.blueprintId,
          action_type: 'tasks_batch_updated',
          action_details: { taskIds, status, count: taskIds.length }
        });
      }
    } catch (error) {
      this.handleError('batchUpdateStatus', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * 統一錯誤處理
   */
  private handleError(operation: string, error: unknown): void {
    this.errorStateService.addError({
      category: 'BusinessLogic',
      severity: 'error',
      message: error instanceof Error ? error.message : `Operation ${operation} failed`,
      details: error,
      context: 'TaskFacade'
    });
  }

  /**
   * 重置所有狀態
   */
  reset(): void {
    this.taskService.reset();
    this.taskAssignmentService.reset();
    this.taskListService.reset();
    this.currentTaskIdState.set(null);
    this.operationInProgressState.set(false);
  }
}
```

### 7.4 Facade 的職責

✅ **應該做的事**：
- 協調多個 service
- 提供便捷的高層級 API
- 統一錯誤處理
- 記錄審計日誌
- 支持批量操作和 transaction

❌ **不應該做的事**：
- 不要放業務邏輯（由 Service 處理）
- 不要直接操作資料庫（通過 Repository）
- 不要重複實現 Service 已有的邏輯

### 7.5 優點

✅ **簡化調用**：Component 只需調用 Facade，不必知道 Service/Repository 細節  
✅ **統一介面**：提供一致的 API  
✅ **協調多個 Service**：支持複雜的業務流程  
✅ **錯誤處理**：統一的錯誤處理和日誌記錄  

---

## 8. 實際案例

### 8.1 完整流程範例：創建並指派任務

```typescript
// Component 層
@Component({
  selector: 'app-task-create',
  template: `
    <button (click)="createAndAssignTask()">創建並指派</button>
  `
})
export class TaskCreateComponent {
  private taskFacade = inject(TaskFacade);

  async createAndAssignTask(): Promise<void> {
    // Component 只需調用 Facade
    const task = await this.taskFacade.createTask({
      title: '新任務',
      blueprint_id: this.blueprintId,
      created_by: this.userId
    });

    await this.taskFacade.assignTask(
      task.id,
      this.assigneeId,
      'user'
    );
  }
}

// ↓ Facade 層（協調多個 Service）
@Injectable()
export class TaskFacade {
  private taskService = inject(TaskService);
  private taskAssignmentService = inject(TaskAssignmentService);
  private activityService = inject(BlueprintActivityService);

  async createTask(data: TaskInsert): Promise<Task> {
    // 調用 Service
    const task = await this.taskService.createTask(data);
    
    // 記錄活動
    await this.activityService.logActivity(/* ... */);
    
    return task;
  }

  async assignTask(taskId: string, assigneeId: string, type: string): Promise<void> {
    // 協調多個 Service
    await this.taskAssignmentService.assignTask(taskId, assigneeId, type);
    await this.taskService.updateTaskStatus(taskId, TaskStatus.ASSIGNED);
    await this.activityService.logActivity(/* ... */);
  }
}

// ↓ Service 層（業務邏輯）
@Injectable()
export class TaskService {
  private taskRepo = inject(TaskRepository);
  private tasksState = signal<Task[]>([]);

  async createTask(data: TaskInsert): Promise<Task> {
    // 調用 Repository
    const task = await firstValueFrom(this.taskRepo.create(data));
    
    // 更新本地狀態
    this.tasksState.update(tasks => [...tasks, task]);
    
    return task;
  }
}

// ↓ Repository 層（資料存取）
@Injectable()
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks';

  create(data: TaskInsert): Observable<Task> {
    // 調用 Supabase
    return from(
      this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single()
    ).pipe(/* ... */);
  }
}

// ↓ Types/Models 層（型別定義）
// task.types.ts
export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  // ...
}

// task.models.ts
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
```

### 8.2 資料流向

Component
    ↓ inject TaskFacade
```text
    ↓ inject TaskService, TaskAssignmentService, ActivityService
TaskService (業務邏輯)
    ↓ inject TaskRepository
TaskRepository (資料存取)
    ↓ use Task types/models
Supabase (資料庫)
```

---

## 9. 最佳實踐

### 9.1 原子化決策樹

需要定義型別/枚舉？
    ├─ 是 → Types 層（高原子化，每個 entity 一個文件）
    └─ 否 ↓
```typescript
需要封裝資料結構？
    ├─ 是 → Models 層（中度原子化，相關 entity 可放一起）
    └─ 否 ↓

需要資料存取？
    ├─ 是 → Repository 層（高原子化，每個資源一個 repo）
    └─ 否 ↓

需要業務邏輯？
    ├─ 是 → Service 層（中度原子化，每個 domain 一個 service）
    └─ 否 ↓

需要協調多個 Service？
    ├─ 是 → Facade 層（低原子化，聚合 use-cases）
    └─ 否 → 直接在 Component 中使用
```

### 9.2 Do's ✅

**Types 層**：
- ✅ 每個 entity 單獨拆出來
- ✅ 使用 enum 定義枚舉
- ✅ 提供完整的 JSDoc 註釋
- ✅ 從 Database Schema 自動生成

**Models 層**：
- ✅ 每個 domain entity 一個文件
- ✅ 重新匯出 Types 層的枚舉（保持向後相容）
- ✅ 提供輔助介面（TreeNode、Detail 等）
- ✅ 使用 readonly 保證不可變性

**Repositories 層**：
- ✅ 每個資源一個 repository
- ✅ 繼承 BaseRepository
- ✅ 提供專屬查詢方法
- ✅ 使用 Observable 返回資料
- ✅ 自動轉換 snake_case ↔ camelCase

**Services 層**：
- ✅ 每個 domain 一個 service
- ✅ 使用 Signals 管理狀態
- ✅ 暴露 ReadonlySignal
- ✅ 提供 Computed signals
- ✅ 協調多個 repository

**Facades 層**：
- ✅ 按 use-case 聚合
- ✅ 協調多個 service
- ✅ 統一錯誤處理
- ✅ 記錄審計日誌
- ✅ 支持批量操作

### 9.3 Don'ts ❌

**Types 層**：
- ❌ 不要過度拆分到欄位級別
- ❌ 不要在 types 中混入業務邏輯
- ❌ 不要跨 domain 混合型別

**Models 層**：
- ❌ 不要把 service 層邏輯放進 model
- ❌ 不要在 model 中進行資料庫操作
- ❌ 不要過度拆分相關的 entity

**Repositories 層**：
- ❌ 不要在 repository 中放業務邏輯
- ❌ 不要跨 entity 混合操作
- ❌ 不要直接操作多個表（使用 Service 協調）

**Services 層**：
- ❌ 避免服務變成巨型 God Object
- ❌ 不要跨 domain 混合業務邏輯
- ❌ 不要在 service 中直接操作資料庫

**Facades 層**：
- ❌ 不要放業務邏輯（由 Service 處理）
- ❌ 不要直接調用 repository（通過 Service）
- ❌ 不要重複實現 Service 已有的邏輯

---

## 10. 常見問題

### Q1: Types 和 Models 有什麼區別？

**A**: 
- **Types**（`core/infra/types/`）：基礎型別定義、枚舉，不依賴其他層，無邏輯
- **Models**（`shared/models/`）：實體對象、業務資料結構，可依賴 Types，可包含簡單轉換邏輯

### Q2: 什麼時候需要創建 Service，什麼時候可以省略？

**A**: 
- **需要 Service**：有業務邏輯、狀態管理、協調多個 repository
- **可以省略**：只是簡單 CRUD，直接在 Facade 中調用 Repository

### Q3: Facade 和 Service 的區別是什麼？

**A**:
- **Service**：封裝業務邏輯，管理狀態，調用 Repository
- **Facade**：協調多個 Service，提供統一介面，不包含業務邏輯

### Q4: 為什麼 Repository 要高度原子化？

**A**: 
- 資料來源獨立，易於切換（例如從 Supabase 切換到 REST API）
- 易於測試（可以 mock 單個 repository）
- 職責單一，易於維護

### Q5: 如何判斷原子化是否過度？

**A**:
- **過度拆分的症狀**：
  - 文件數量過多，難以導航
  - 每個文件只有幾行代碼
  - 需要頻繁在多個文件間跳轉
  
- **適度原子化的標準**：
  - 每個文件有明確的職責
  - 修改時不會影響無關的代碼
  - 測試時可以獨立測試

### Q6: 如何在 Component 中使用？

**A**: 
```typescript
// ✅ 優先使用 Facade
@Component({/* ... */})
export class MyComponent {
  private taskFacade = inject(TaskFacade);

  async loadData() {
    await this.taskFacade.loadTasksByBlueprint(this.blueprintId);
  }
}

// ⚠️ 如果沒有 Facade，可以直接使用 Service
@Component({/* ... */})
export class SimpleComponent {
  private taskService = inject(TaskService);

  async loadData() {
    await this.taskService.loadTasksByBlueprint(this.blueprintId);
  }
}

// ❌ 不要直接使用 Repository（應該通過 Service 或 Facade）
@Component({/* ... */})
export class BadComponent {
  private taskRepo = inject(TaskRepository); // ❌ 不推薦

  loadData() {
    this.taskRepo.findAll().subscribe(/* ... */);
  }
}
```

---

## 11. 總結

### 11.1 原子化策略總結表

| 層級 | 原子化程度 | 拆分單位 | 原因 |
|------|-----------|---------|------|
| **Types** | **高** | 每個 entity | 型別重用，改動影響面小 |
| **Models** | **中** | 每個 entity，相關可合併 | 封裝簡單邏輯 |
| **Repositories** | **高** | 每個資源 | 方便切換資料來源/測試 |
| **Services** | **中** | 每個 domain | 避免變成 God Object |
| **Facades** | **低** | 聚合 use-cases | 簡化對外接口 |

### 11.2 核心原則

🎯 **資料與型別層 → 高度原子化**（方便重用、測試）  
🎯 **業務與協調層 → 中度原子化**（每個 domain/功能單一責任）  
🎯 **對外接口層 → 聚合即可**（避免過度拆分）  

### 11.3 設計目標

✅ **高可維護性**：單一職責，易於理解和修改  
✅ **高可測試性**：獨立單元，易於編寫測試  
✅ **高可重用性**：小單元，可在多處重用  
✅ **低耦合度**：減少模組間依賴  
✅ **高內聚性**：相關邏輯集中在一起  

---

## 12. 相關文檔

### 12.1 架構設計

- [完整架構流程圖](./20-complete-architecture-flowchart.mermaid.md) - Git-like 分支模型
- [架構審查報告](./21-architecture-review-report.md) - 生產就緒版

### 12.2 開發指南

- [開發最佳實踐指南](../guides/development-best-practices.md) - 代碼示例
- [前端狀態管理指南](../guides/frontend-state-management-guide.md) - Signals 使用

### 12.3 資料庫設計

- [完整SQL表結構定義](../reference/sql-schema-definition.md) - 51 張表結構

---

**文件維護**：
- **創建日期**：2025-01-20
- **最後更新**：2025-01-20
- **維護者**：架構團隊
- **審查週期**：每季度審查一次

**變更歷史**：
- v1.0 (2025-01-20)：初始版本，定義五層原子化策略
