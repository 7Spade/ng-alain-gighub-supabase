# 開發最佳實踐指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [Standalone Component 模板](#standalone-component-模板)
  - [基礎模板](#基礎模板)
  - [使用 Signal Inputs/Outputs（Angular 20）](#使用-signal-inputsoutputsangular-20)
- [Service 設計模式](#service-設計模式)
  - [Signal-based Service 模板](#signal-based-service-模板)
- [Signal 狀態管理](#signal-狀態管理)
  - [基本用法](#基本用法)
  - [狀態更新模式](#狀態更新模式)
- [現代控制流程](#現代控制流程)
  - [@if / @else / @else if](#if--else--else-if)
  - [@for 循環](#for-循環)
  - [@switch 選擇](#switch-選擇)
- [路由配置](#路由配置)
  - [懶加載路由](#懶加載路由)
  - [路由守衛](#路由守衛)
  - [路由導航](#路由導航)
- [依賴注入模式](#依賴注入模式)
  - [使用 inject()（推薦）](#使用-inject推薦)
  - [舊式 Constructor Injection（不推薦）](#舊式-constructor-injection不推薦)
- [錯誤處理模式](#錯誤處理模式)
  - [Service 層錯誤處理](#service-層錯誤處理)
  - [Component 層錯誤處理](#component-層錯誤處理)
- [常見反模式](#常見反模式)
  - [❌ 反模式1：零碎引入模組](#-反模式1零碎引入模組)
  - [❌ 反模式2：在模板中直接調用方法](#-反模式2在模板中直接調用方法)
  - [❌ 反模式3：使用 any 類型](#-反模式3使用-any-類型)
  - [❌ 反模式4：忘記調用 Signal](#-反模式4忘記調用-signal)
  - [❌ 反模式5：權宜式修改](#-反模式5權宜式修改)
- [快速參考](#快速參考)
  - [組件開發檢查清單](#組件開發檢查清單)
  - [Service 開發檢查清單](#service-開發檢查清單)
  - [路由配置檢查清單](#路由配置檢查清單)
- [📚 相關文檔](#-相關文檔)

---


> 📋 **目的**：提供實用的代碼示例、開發模式和最佳實踐，加速開發效率

**最後更新**：2025-11-15
**維護者**：開發團隊
**來源**：基於 `src-參考` 文件夾提取的價值信息

- --

## 📋 目錄

- [Standalone Component 模板](#standalone-component-模板)
- [Service 設計模式](#service-設計模式)
- [Signal 狀態管理](#signal-狀態管理)
- [現代控制流程](#現代控制流程)
- [路由配置](#路由配置)
- [依賴注入模式](#依賴注入模式)
- [錯誤處理模式](#錯誤處理模式)
- [常見反模式](#常見反模式)

- --

## Standalone Component 模板

### 基礎模板

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { TaskService, Task } from '@shared';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [SHARED_IMPORTS], // ✅ 優先使用 SHARED_IMPORTS
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ 預設使用 OnPush
  template: `
    <page-header [title]="'任務列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任務
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="任務列表" style="margin-top: 16px;">
      @if (loading()) {
        <nz-spin></nz-spin>
      } @else if (error()) {
        <nz-alert [nzMessage]="error()" nzType="error"></nz-alert>
      } @else {
        @for (task of tasks(); track task.id) {
          <div>{{ task.title }}</div>
        } @empty {
          <nz-empty nzNotFoundContent="暫無任務"></nz-empty>
        }
      }
    </nz-card>
  `
})
export class TaskListComponent {
  // ✅ 使用 inject() 替代 constructor injection
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ✅ 使用 signal() 創建狀態
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly tasks = this.taskService.tasks; // ✅ 使用 Service 的 ReadonlySignal

  // ✅ 使用 computed() 創建派生狀態
  readonly hasTasks = computed(() => this.tasks().length > 0);

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.taskService.loadTasksByBlueprint('blueprint-id');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : '加載失敗');
    } finally {
      this.loading.set(false);
    }
  }

  createTask(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
}
```

### 使用 Signal Inputs/Outputs（Angular 20）

```typescript
import { Component, input, output, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  standalone: true,
  selector: 'app-task-item',
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>{{ task().title }}</h3>
      <button nz-button (click)="onEdit.emit()">編輯</button>
      <button nz-button nzType="danger" (click)="onDelete.emit()">刪除</button>
    </nz-card>
  `
})
export class TaskItemComponent {
  // ✅ 使用 input() 替代 @Input()
  readonly task = input.required<Task>();
  readonly editable = input<boolean>(true);

  // ✅ 使用 output() 替代 @Output()
  readonly onEdit = output<void>();
  readonly onDelete = output<void>();
}
```

- --

## Service 設計模式

### Signal-based Service 模板

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskRepository, TaskInsert, TaskUpdate } from '@core';
import { Task, TaskStatus } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task Service
 *
 * 提供任務相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // ✅ 使用 inject() 注入依賴
  private readonly taskRepository = inject(TaskRepository);

  // ✅ 使用 signal() 管理狀態（私有）
  private readonly tasksState = signal<Task[]>([]);
  private readonly selectedTaskState = signal<Task | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // ✅ 暴露 ReadonlySignal 給組件
  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTask = this.selectedTaskState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // ✅ 使用 computed() 創建派生狀態
  readonly pendingTasks = computed(() =>
    this.tasks().filter(t => t.status === TaskStatus.PENDING)
  );

  readonly inProgressTasks = computed(() =>
    this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS)
  );

  /**
   * 加載任務列表
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
        error instanceof Error ? error.message : '加載任務列表失敗'
      );
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建任務
   */
  async createTask(data: TaskInsert): Promise<Task> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.taskRepository.create(data));
      // ✅ 更新本地狀態
      this.tasksState.update(tasks => [...tasks, task]);
      return task;
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : '創建任務失敗'
      );
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任務
   */
  async updateTask(id: string, data: TaskUpdate): Promise<Task> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.taskRepository.update(id, data));
      // ✅ 更新本地狀態
      this.tasksState.update(tasks =>
        tasks.map(t => (t.id === id ? task : t))
      );
      if (this.selectedTaskState()?.id === id) {
        this.selectedTaskState.set(task);
      }
      return task;
    } catch (error) {
      this.errorState.set(
        error instanceof Error ? error.message : '更新任務失敗'
      );
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 選擇任務
   */
  selectTask(task: Task | null): void {
    this.selectedTaskState.set(task);
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
```

- --

## Signal 狀態管理

### 基本用法

```typescript
// ✅ 創建狀態
readonly loading = signal(false);
readonly data = signal<Data[]>([]);
readonly selectedId = signal<string | null>(null);

// ✅ 更新狀態
this.loading.set(true);
this.data.set([...this.data(), newItem]);
this.selectedId.update(id => id === 'old' ? 'new' : id);

// ✅ 創建派生狀態
readonly hasData = computed(() => this.data().length > 0);
readonly selectedItem = computed(() =>
  this.data().find(item => item.id === this.selectedId())
);

// ✅ 在模板中使用（必須使用括號）
template: `
  @if (loading()) {
    <nz-spin></nz-spin>
  }
  @for (item of data(); track item.id) {
    <div>{{ item.name }}</div>
  }
  <div>總數：{{ data().length }}</div>
`
```

### 狀態更新模式

```typescript
// ✅ 模式1：直接設置
this.loading.set(true);

// ✅ 模式2：基於當前值更新
this.data.update(current => [...current, newItem]);

// ✅ 模式3：條件更新
this.selectedId.update(id => id === targetId ? null : id);

// ✅ 模式4：批量更新（使用 effect）
effect(() => {
  if (this.selectedId()) {
    this.loadDetails(this.selectedId()!);
  }
});
```

- --

## 現代控制流程

### @if / @else / @else if

```typescript
template: `
  @if (loading()) {
    <nz-spin></nz-spin>
  } @else if (error()) {
    <nz-alert [nzMessage]="error()" nzType="error"></nz-alert>
  } @else {
    <div>內容</div>
  }
`
```

### @for 循環

```typescript
template: `
  @for (task of tasks(); track task.id) {
    <div>{{ task.title }}</div>
  } @empty {
    <nz-empty nzNotFoundContent="暫無數據"></nz-empty>
  }
`

// ✅ 使用 track 函數優化性能
@for (task of tasks(); track task.id) {
  <div>{{ task.title }}</div>
}

// ✅ 訪問索引
@for (task of tasks(); track task.id; let i = $index) {
  <div>{{ i + 1 }}. {{ task.title }}</div>
}
```

### @switch 選擇

```typescript
template: `
  @switch (status()) {
    @case ('pending') {
      <nz-tag nzColor="default">待處理</nz-tag>
    }
    @case ('in_progress') {
      <nz-tag nzColor="processing">進行中</nz-tag>
    }
    @case ('completed') {
      <nz-tag nzColor="success">已完成</nz-tag>
    }
    @default {
      <nz-tag>未知</nz-tag>
    }
  }
`
```

- --

## 路由配置

### 懶加載路由

```typescript
// routes.ts
import { Routes } from '@angular/router';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./list/task-list.component')
        .then(m => m.TaskListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./form/task-form.component')
        .then(m => m.TaskFormComponent),
    data: { title: '創建任務' } // ✅ 設置 ReuseTab 標題
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/task-detail.component')
        .then(m => m.TaskDetailComponent)
  }
];
```

### 路由守衛

```typescript
{
  path: 'tasks',
  canActivate: [authSimpleCanActivate],
  canActivateChild: [authSimpleCanActivateChild],
  loadChildren: () => import('./tasks/routes').then(m => m.TASK_ROUTES)
}
```

### 路由導航

```typescript
// ✅ 使用 Router 導航
this.router.navigate(['/tasks', taskId]);

// ✅ 相對路徑導航
this.router.navigate(['edit'], { relativeTo: this.route });

// ✅ 帶查詢參數
this.router.navigate(['/tasks'], {
  queryParams: { status: 'pending' }
});
```

- --

## 依賴注入模式

### 使用 inject()（推薦）

```typescript
export class TaskListComponent {
  // ✅ 使用 inject() 替代 constructor injection
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
}
```

### 舊式 Constructor Injection（不推薦）

```typescript
// ❌ 不推薦：使用 constructor injection
export class TaskListComponent {
  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}
}
```

- --

## 錯誤處理模式

### Service 層錯誤處理

```typescript
async loadTasks(): Promise<void> {
  this.loadingState.set(true);
  this.errorState.set(null);

  try {
    const tasks = await firstValueFrom(this.taskRepository.findAll());
    this.tasksState.set(tasks);
  } catch (error) {
    // ✅ 統一錯誤處理
    this.errorState.set(
      error instanceof Error ? error.message : '加載失敗'
    );
    throw error; // 重新拋出，讓調用者處理
  } finally {
    this.loadingState.set(false);
  }
}
```

### Component 層錯誤處理

```typescript
async loadTasks(): Promise<void> {
  try {
    await this.taskService.loadTasksByBlueprint('blueprint-id');
  } catch (error) {
    // ✅ 顯示用戶友好的錯誤消息
    this.message.error('加載任務列表失敗，請稍後重試');
    console.error('Error loading tasks:', error);
  }
}
```

- --

## 常見反模式

### ❌ 反模式1：零碎引入模組

```typescript
// ❌ 錯誤：零碎引入
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  imports: [CommonModule, FormsModule, NzButtonModule, NzInputModule, NzCardModule]
})
```

```typescript
// ✅ 正確：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared';

@Component({
  imports: [SHARED_IMPORTS] // 一次導入所有常用模組
})
```

### ❌ 反模式2：在模板中直接調用方法

```typescript
// ❌ 錯誤：在模板中調用方法
template: `
  @for (item of getFilteredItems(); track item.id) {
    <div>{{ item.name }}</div>
  }
`
```

```typescript
// ✅ 正確：使用 computed() Signal
readonly filteredItems = computed(() =>
  this.items().filter(item => item.status === 'active')
);

template: `
  @for (item of filteredItems(); track item.id) {
    <div>{{ item.name }}</div>
  }
`
```

### ❌ 反模式3：使用 any 類型

```typescript
// ❌ 錯誤：使用 any
value: any;
data: any[];

// ✅ 正確：使用明確類型
value: string | null;
data: Task[];
```

### ❌ 反模式4：忘記調用 Signal

```typescript
// ❌ 錯誤：忘記使用括號
template: `
  @if (loading) {  <!-- 錯誤：應該是 loading() -->
    <nz-spin></nz-spin>
  }
`

// ✅ 正確：使用括號調用 Signal
template: `
  @if (loading()) {
    <nz-spin></nz-spin>
  }
`
```

### ❌ 反模式5：權宜式修改

```typescript
// ❌ 錯誤：權宜式修改
export class BadComponent {
  value: any; // ❌ 使用 any
  // TODO: refactor later // ❌ 延後處理技術債務
}

// ✅ 正確：結構化解法
export class GoodComponent {
  readonly value = signal<string>(''); // ✅ 使用 Signal 與明確類型
}
```

- --

## 快速參考

### 組件開發檢查清單

- [ ] 使用 `SHARED_IMPORTS` 而非零碎引入
- [ ] 使用 `inject()` 替代 constructor injection
- [ ] 使用 `signal()` 管理狀態
- [ ] 使用 `computed()` 創建派生狀態
- [ ] 使用現代控制流程（`@if`、`@for`、`@switch`）
- [ ] 設置 `ChangeDetectionStrategy.OnPush`
- [ ] 在模板中調用 Signal 時使用括號 `signal()`
- [ ] 提供 `route.data.title` 或使用 `TitleService.setTitle()`
- [ ] 避免使用 `any` 類型
- [ ] 避免權宜式修改

### Service 開發檢查清單

- [ ] 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 `inject()` 注入依賴
- [ ] 使用 `signal()` 管理狀態（私有）
- [ ] 暴露 `ReadonlySignal` 給組件
- [ ] 使用 `computed()` 創建派生狀態
- [ ] 提供完整的錯誤處理
- [ ] 使用 `firstValueFrom()` 或 `toSignal()` 處理 Observable

### 路由配置檢查清單

- [ ] 使用懶加載（`loadComponent` 或 `loadChildren`）
- [ ] 提供 `route.data.title` 設置 ReuseTab 標題
- [ ] 使用路由守衛保護敏感路由
- [ ] 遵循 RESTful 命名規範

- --

## 📚 相關文檔

- [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md) ⭐ 必讀
- [開發作業指引](./specs/00-development-guidelines.md) - 完整開發規範
- [Angular 20 最佳實踐](../.cursor/rules/angular.mdc) - Angular 現代語法
- [代碼質量規範](../.cursor/rules/code-quality.mdc) - 代碼質量要求

- --

**最後更新**：2025-01-15
**維護者**：開發團隊

