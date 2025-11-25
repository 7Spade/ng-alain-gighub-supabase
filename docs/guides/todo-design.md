---
title: 待辦事項 (Todo) 功能設計
version: 2.0.0
lastUpdated: 2025-01-25
status: approved
owner: Development Team
---

# 待辦事項 (Todo) 功能設計

## 1. 文件概要

> **📋 文件目的**：此文件定義專案中 `todo`（待辦事項）功能的設計與實作指引，遵循 Angular 企業級開發規範。

### 1.1 目的與範圍

| 項目 | 說明 |
|------|------|
| **目的** | 提供一個輕量、即時、可追蹤的待辦系統，用於記錄指派給使用者的任務或藍圖內檢查項 |
| **範圍** | UI/UX 規格、資料模型、API 合約、即時/通知行為、授權與可測試標準 |
| **對應規範** | `angular-enterprise-development-guidelines.md` |

### 1.2 文件變更歷史

| 版本 | 日期 | 作者 | 變更說明 |
|------|------|------|----------|
| 2.0.0 | 2025-01-25 | Copilot Agent | 重構：符合企業級開發規範 |
| 1.0.0 | - | - | 初始版本 |

---

## 2. 分層架構設計

> **⚠️ 重要**：必須遵守分層依賴順序，禁止跨層或反方向依賴

### 2.1 分層流向

```
Types → Repositories → Models → Services → Facades → Routes/Components
```

### 2.2 各層職責定義

#### 2.2.1 Types 層 (`src/app/domain/todo/types/`)

**📌 職責**：僅定義資料結構，禁止包含任何邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo.types.ts` | Domain Types 定義 | 核心業務型別 |
| `todo-dto.types.ts` | DTO Types 定義 | Supabase 回傳結構 |
| `todo-view-model.types.ts` | View Model Types | UI 顯示專用型別 |
| `index.ts` | Barrel file | 統一匯出公開 API |

```typescript
// todo.types.ts
/**
 * @description 待辦事項 Domain Type
 * @layer Types
 * @module Domain/Todo
 */
export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly assigneeId: string | null;
  readonly creatorId: string;
  readonly blueprintId: string | null;
  readonly taskId: string | null;
  readonly status: TodoStatus;
  readonly priority: TodoPriority;
  readonly dueAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type TodoStatus = 'open' | 'in_progress' | 'done' | 'cancelled';
export type TodoPriority = 'low' | 'normal' | 'high';

export interface TodoComment {
  readonly id: string;
  readonly todoId: string;
  readonly authorId: string;
  readonly content: string;
  readonly createdAt: Date;
}

export interface TodoAttachment {
  readonly id: string;
  readonly todoId: string;
  readonly url: string;
  readonly filename: string;
  readonly size: number;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly uploadedAt: Date;
}
```

```typescript
// todo-dto.types.ts
/**
 * @description Supabase DTO Types
 * @layer Types
 * @source Supabase Database
 */
export interface TodoDto {
  id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  creator_id: string;
  blueprint_id: string | null;
  task_id: string | null;
  status: string;
  priority: string;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  assignee_id?: string;
  creator_id: string;
  blueprint_id?: string;
  task_id?: string;
  status?: string;
  priority?: string;
  due_at?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  assignee_id?: string;
  status?: string;
  priority?: string;
  due_at?: string;
}
```

#### 2.2.2 Repositories 層 (`src/app/infrastructure/repositories/`)

**📌 職責**：純後端存取操作，處理 RLS 驗證錯誤，禁止包含業務邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo.repository.ts` | Supabase CRUD 操作 | 唯一可使用 Supabase Client 的層級 |
| `todo-comment.repository.ts` | 待辦評論 CRUD | 獨立 Repository |
| `todo-attachment.repository.ts` | 附件儲存操作 | Supabase Storage |
| `index.ts` | Barrel file | 僅供 Service 層使用 |

```typescript
// todo.repository.ts
/**
 * @description 待辦事項 Repository - 純 Supabase CRUD
 * @layer Repository
 * @dependency Supabase Client
 * @prohibit 禁止包含業務邏輯
 */
import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from '@domain/todo/types';
import { TodoRepositoryError } from '@infrastructure/errors';

@Injectable({ providedIn: 'root' })
export class TodoRepository {
  private readonly supabase = inject(SupabaseClient);
  private readonly TABLE_NAME = 'todos';

  /**
   * 查詢使用者的待辦列表
   */
  findByAssignee(assigneeId: string, status?: string): Observable<TodoDto[]> {
    let query = this.supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('assignee_id', assigneeId)
      .order('due_at', { ascending: true, nullsFirst: false });

    if (status) {
      query = query.eq('status', status);
    }

    return from(query).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto[];
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 查詢藍圖的待辦列表
   */
  findByBlueprint(blueprintId: string): Observable<TodoDto[]> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('blueprint_id', blueprintId)
        .order('priority', { ascending: false })
        .order('due_at', { ascending: true, nullsFirst: false })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto[];
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 查詢單一待辦
   */
  findById(id: string): Observable<TodoDto | null> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          if (response.error.code === 'PGRST116') {
            return null;
          }
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 建立待辦
   */
  create(dto: CreateTodoDto): Observable<TodoDto> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .insert(dto)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 更新待辦
   */
  update(id: string, dto: UpdateTodoDto): Observable<TodoDto> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 刪除待辦
   */
  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 批次更新狀態
   */
  batchUpdateStatus(ids: string[], status: string): Observable<TodoDto[]> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', ids)
        .select()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new TodoRepositoryError(response.error.message, response.error.code);
        }
        return response.data as TodoDto[];
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: unknown): Observable<never> => {
    if (error instanceof TodoRepositoryError) {
      throw error;
    }
    throw new TodoRepositoryError('Unknown repository error', 'UNKNOWN');
  };
}
```

#### 2.2.3 Models 層 (`src/app/domain/todo/models/`)

**📌 職責**：負責資料轉換（DTO → Domain Model → View Model），純資料映射

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo.mapper.ts` | DTO ↔ Domain 轉換 | 雙向映射 |
| `todo-view-model.mapper.ts` | Domain → ViewModel 轉換 | UI 專用 |
| `index.ts` | Barrel file | 統一匯出 |

```typescript
// todo.mapper.ts
/**
 * @description 待辦事項資料映射器
 * @layer Models
 * @pattern Mapper Pattern
 */
import { Todo, TodoStatus, TodoPriority } from '@domain/todo/types';
import { TodoDto, CreateTodoDto } from '@domain/todo/types';

export class TodoMapper {
  /**
   * DTO → Domain Model
   */
  static toDomain(dto: TodoDto): Todo {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      assigneeId: dto.assignee_id,
      creatorId: dto.creator_id,
      blueprintId: dto.blueprint_id,
      taskId: dto.task_id,
      status: dto.status as TodoStatus,
      priority: dto.priority as TodoPriority,
      dueAt: dto.due_at ? new Date(dto.due_at) : null,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  /**
   * Domain Model → DTO (for create)
   */
  static toCreateDto(domain: Partial<Todo>, creatorId: string): CreateTodoDto {
    return {
      title: domain.title!,
      description: domain.description ?? undefined,
      assignee_id: domain.assigneeId ?? undefined,
      creator_id: creatorId,
      blueprint_id: domain.blueprintId ?? undefined,
      task_id: domain.taskId ?? undefined,
      status: domain.status ?? 'open',
      priority: domain.priority ?? 'normal',
      due_at: domain.dueAt?.toISOString() ?? undefined,
    };
  }
}
```

#### 2.2.4 Services 層 (`src/app/core/services/todo/`)

**📌 職責**：實作業務邏輯與流程控制（use cases），禁止接觸 UI 層

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo.service.ts` | 待辦業務邏輯 | 核心 Use Cases |
| `todo-notification.service.ts` | 通知邏輯 | 到期提醒、指派通知 |
| `index.ts` | Barrel file | 僅供 Facade 使用 |

```typescript
// todo.service.ts
/**
 * @description 待辦事項業務服務
 * @layer Service
 * @dependency Repository, Mapper
 * @prohibit 禁止直接操作 Store 或接觸 UI
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoRepository } from '@infrastructure/repositories';
import { TodoMapper } from '@domain/todo/models';
import { Todo, TodoStatus } from '@domain/todo/types';
import { TodoDomainError } from '@domain/todo/errors';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly repository = inject(TodoRepository);

  /**
   * 取得使用者的待辦列表
   */
  getTodosByAssignee(assigneeId: string, status?: TodoStatus): Observable<Todo[]> {
    return this.repository.findByAssignee(assigneeId, status).pipe(
      map(dtos => dtos.map(TodoMapper.toDomain))
    );
  }

  /**
   * 取得藍圖的待辦列表
   */
  getTodosByBlueprint(blueprintId: string): Observable<Todo[]> {
    return this.repository.findByBlueprint(blueprintId).pipe(
      map(dtos => dtos.map(TodoMapper.toDomain))
    );
  }

  /**
   * 取得單一待辦
   */
  getTodoById(id: string): Observable<Todo> {
    return this.repository.findById(id).pipe(
      map(dto => {
        if (!dto) {
          throw new TodoDomainError('Todo not found', 'TODO_NOT_FOUND');
        }
        return TodoMapper.toDomain(dto);
      })
    );
  }

  /**
   * 建立待辦
   * @businessRule 標題為必填
   */
  createTodo(todo: Partial<Todo>, creatorId: string): Observable<Todo> {
    if (!todo.title?.trim()) {
      throw new TodoDomainError('Title is required', 'INVALID_INPUT');
    }

    const dto = TodoMapper.toCreateDto(todo, creatorId);
    return this.repository.create(dto).pipe(
      map(TodoMapper.toDomain)
    );
  }

  /**
   * 更新待辦
   */
  updateTodo(id: string, updates: Partial<Todo>): Observable<Todo> {
    const dto = {
      title: updates.title,
      description: updates.description,
      assignee_id: updates.assigneeId,
      status: updates.status,
      priority: updates.priority,
      due_at: updates.dueAt?.toISOString(),
    };
    return this.repository.update(id, dto).pipe(
      map(TodoMapper.toDomain)
    );
  }

  /**
   * 變更狀態
   */
  changeStatus(id: string, status: TodoStatus): Observable<Todo> {
    return this.repository.update(id, { status }).pipe(
      map(TodoMapper.toDomain)
    );
  }

  /**
   * 批次變更狀態
   */
  batchChangeStatus(ids: string[], status: TodoStatus): Observable<Todo[]> {
    return this.repository.batchUpdateStatus(ids, status).pipe(
      map(dtos => dtos.map(TodoMapper.toDomain))
    );
  }

  /**
   * 刪除待辦
   */
  deleteTodo(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
```

#### 2.2.5 Facades 層 (`src/app/features/todo/facades/`)

**📌 職責**：提供 UI 專用的統一 API，封裝 service/store，禁止包含商業邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo.facade.ts` | UI 統一存取介面 | 唯一可操作 Store 的層級 |
| `index.ts` | Barrel file | Feature Module 唯一公開 API |

```typescript
// todo.facade.ts
/**
 * @description 待辦事項 Facade - UI 唯一存取介面
 * @layer Facade
 * @dependency Service, Store
 * @prohibit 禁止包含業務邏輯
 */
import { Injectable, inject, computed, signal } from '@angular/core';
import { TodoService } from '@core/services/todo';
import { AuthFacade } from '@core/facades';
import { Todo, TodoStatus } from '@domain/todo/types';
import { TodoViewModel } from '@domain/todo/types/todo-view-model.types';
import { TodoViewModelMapper } from '@domain/todo/models';

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
  filter: { status?: TodoStatus };
}

@Injectable()
export class TodoFacade {
  private readonly todoService = inject(TodoService);
  private readonly authFacade = inject(AuthFacade);

  // State (Signal-based)
  private readonly state = signal<TodoState>({
    todos: [],
    selectedTodo: null,
    loading: false,
    error: null,
    filter: {},
  });

  // Selectors
  readonly todos = computed(() => this.state().todos);
  readonly selectedTodo = computed(() => this.state().selectedTodo);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filter = computed(() => this.state().filter);

  // Derived View Models
  readonly todoViewModels = computed<TodoViewModel[]>(() =>
    this.todos().map(TodoViewModelMapper.toViewModel)
  );

  // Computed stats
  readonly stats = computed(() => {
    const todos = this.todos();
    return {
      total: todos.length,
      open: todos.filter(t => t.status === 'open').length,
      inProgress: todos.filter(t => t.status === 'in_progress').length,
      done: todos.filter(t => t.status === 'done').length,
      overdue: todos.filter(t => t.dueAt && t.dueAt < new Date() && t.status !== 'done').length,
    };
  });

  /**
   * 載入我的待辦
   */
  loadMyTodos(status?: TodoStatus): void {
    const userId = this.authFacade.currentUserId();
    if (!userId) return;

    this.updateState({ loading: true, error: null, filter: { status } });

    this.todoService.getTodosByAssignee(userId, status).subscribe({
      next: todos => this.updateState({ todos, loading: false }),
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 載入藍圖待辦
   */
  loadBlueprintTodos(blueprintId: string): void {
    this.updateState({ loading: true, error: null });

    this.todoService.getTodosByBlueprint(blueprintId).subscribe({
      next: todos => this.updateState({ todos, loading: false }),
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 選擇待辦
   */
  selectTodo(id: string): void {
    this.updateState({ loading: true, error: null });

    this.todoService.getTodoById(id).subscribe({
      next: todo => this.updateState({ selectedTodo: todo, loading: false }),
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 建立待辦
   */
  createTodo(todo: Partial<Todo>): void {
    const creatorId = this.authFacade.currentUserId();
    if (!creatorId) {
      this.updateState({ error: '請先登入' });
      return;
    }

    this.updateState({ loading: true, error: null });

    this.todoService.createTodo(todo, creatorId).subscribe({
      next: newTodo => {
        this.updateState({
          todos: [newTodo, ...this.todos()],
          loading: false,
        });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 更新待辦
   */
  updateTodo(id: string, updates: Partial<Todo>): void {
    this.updateState({ loading: true, error: null });

    this.todoService.updateTodo(id, updates).subscribe({
      next: updated => {
        const todos = this.todos().map(t => t.id === id ? updated : t);
        this.updateState({ todos, selectedTodo: updated, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 標記完成
   */
  markAsDone(id: string): void {
    this.changeStatus(id, 'done');
  }

  /**
   * 變更狀態
   */
  changeStatus(id: string, status: TodoStatus): void {
    this.updateState({ loading: true, error: null });

    this.todoService.changeStatus(id, status).subscribe({
      next: updated => {
        const todos = this.todos().map(t => t.id === id ? updated : t);
        this.updateState({ todos, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 批次標記完成
   */
  batchMarkAsDone(ids: string[]): void {
    this.updateState({ loading: true, error: null });

    this.todoService.batchChangeStatus(ids, 'done').subscribe({
      next: updatedTodos => {
        const updatedIds = new Set(updatedTodos.map(t => t.id));
        const todos = this.todos().map(t => 
          updatedIds.has(t.id) ? updatedTodos.find(u => u.id === t.id)! : t
        );
        this.updateState({ todos, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 刪除待辦
   */
  deleteTodo(id: string): void {
    this.updateState({ loading: true, error: null });

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        const todos = this.todos().filter(t => t.id !== id);
        this.updateState({ todos, selectedTodo: null, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 清除錯誤
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partial: Partial<TodoState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }

  /**
   * 錯誤映射：Domain Error → UI Error Message
   */
  private mapErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      const errorMap: Record<string, string> = {
        TODO_NOT_FOUND: '找不到該待辦事項',
        INVALID_INPUT: '輸入資料不完整',
        PERMISSION_DENIED: '您沒有權限執行此操作',
        NETWORK_ERROR: '網路連線錯誤，請稍後再試',
      };
      return errorMap[(error as any).code] || '操作失敗，請稍後再試';
    }
    return '發生未知錯誤';
  }
}
```

#### 2.2.6 Routes/Components 層 (`src/app/routes/todo/`)

**📌 職責**：僅負責 UI 呈現與事件觸發，禁止直接操作 store、service、repository

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `todo-list.component.ts` | 待辦列表頁面 | 列表/看板檢視 |
| `todo-detail.component.ts` | 待辦詳情頁面 | 查看/編輯 |
| `todo-quick-add.component.ts` | 快速新增元件 | 藍圖內快速建立 |
| `todo.routes.ts` | 路由配置 | Lazy Load |
| `index.ts` | Barrel file | 路由匯出 |

```typescript
// todo-list.component.ts
/**
 * @description 待辦列表元件
 * @layer Component
 * @dependency Facade only
 * @prohibit 禁止直接呼叫 Service/Repository/Store
 */
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { PageHeaderModule } from '@delon/abc/page-header';
import { TodoFacade } from '../facades';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    NzListModule,
    NzTagModule,
    NzCheckboxModule,
    NzSpinModule,
    NzEmptyModule,
    NzButtonModule,
    NzBadgeModule,
    PageHeaderModule,
  ],
  template: `
    <page-header [title]="'我的待辦'" [breadcrumb]="breadcrumb">
      <ng-template #extra>
        <nz-badge [nzCount]="facade.stats().overdue" nzOverflowCount="99">
          <span>逾期</span>
        </nz-badge>
      </ng-template>
      <ng-template #action>
        <button nz-button nzType="primary" (click)="onCreateTodo()">
          <span nz-icon nzType="plus"></span>
          新增待辦
        </button>
      </ng-template>
    </page-header>

    <nz-spin [nzSpinning]="facade.loading()">
      @if (facade.todoViewModels().length > 0) {
        <nz-list [nzDataSource]="facade.todoViewModels()" [nzRenderItem]="item">
          <ng-template #item let-todo>
            <nz-list-item>
              <nz-list-item-meta
                [nzTitle]="titleTpl"
                [nzDescription]="todo.description"
              >
                <ng-template #titleTpl>
                  <label
                    nz-checkbox
                    [nzChecked]="todo.status === 'done'"
                    (nzCheckedChange)="onToggleStatus(todo.id, $event)"
                  >
                    {{ todo.title }}
                  </label>
                </ng-template>
              </nz-list-item-meta>
              <ul nz-list-item-actions>
                <nz-list-item-action>
                  <nz-tag [nzColor]="getPriorityColor(todo.priority)">
                    {{ todo.priorityLabel }}
                  </nz-tag>
                </nz-list-item-action>
                <nz-list-item-action>
                  <a (click)="onEditTodo(todo.id)">編輯</a>
                </nz-list-item-action>
                <nz-list-item-action>
                  <a nz-popconfirm nzPopconfirmTitle="確定刪除？" (nzOnConfirm)="onDeleteTodo(todo.id)">刪除</a>
                </nz-list-item-action>
              </ul>
            </nz-list-item>
          </ng-template>
        </nz-list>
      } @else {
        <nz-empty [nzNotFoundContent]="'尚無待辦事項'" />
      }
    </nz-spin>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  readonly facade = inject(TodoFacade);

  ngOnInit(): void {
    this.facade.loadMyTodos();
  }

  onCreateTodo(): void {
    // 導航至新增頁或開啟 Modal
  }

  onToggleStatus(id: string, checked: boolean): void {
    this.facade.changeStatus(id, checked ? 'done' : 'open');
  }

  onEditTodo(id: string): void {
    // 導航至編輯頁
  }

  onDeleteTodo(id: string): void {
    this.facade.deleteTodo(id);
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      high: 'red',
      normal: 'blue',
      low: 'default',
    };
    return colors[priority] || 'default';
  }
}
```

---

## 3. 模組邊界管理

> **⚠️ 禁止規則**：嚴格遵守模組邊界，違反將導致架構腐敗

### 3.1 模組結構

```
src/app/
├── domain/                    # Domain Module
│   └── todo/
│       ├── types/            # 型別定義
│       ├── models/           # Mapper
│       ├── errors/           # Domain Errors
│       └── index.ts          # Public API
│
├── infrastructure/            # Infrastructure Module
│   └── repositories/
│       ├── todo.repository.ts
│       └── index.ts
│
├── core/                      # Core Module
│   └── services/
│       └── todo/
│           ├── todo.service.ts
│           └── index.ts
│
├── features/                  # Feature Modules
│   └── todo/
│       ├── facades/
│       ├── components/
│       └── index.ts          # 僅公開 Facade
│
└── routes/                    # Routes/Components
    └── todo/
        ├── todo-list.component.ts
        ├── todo-detail.component.ts
        └── todo.routes.ts
```

### 3.2 邊界禁止規則

| 規則 | 說明 | 違反後果 |
|------|------|----------|
| Component → Repository | ❌ 禁止 | 架構腐敗 |
| Component → Service | ❌ 禁止 | 繞過 Facade |
| Feature → Feature | ❌ 禁止 | 模組耦合 |
| Domain → Infrastructure | ❌ 禁止 | 依賴反轉 |
| Shared → Feature | ❌ 禁止 | 循環依賴 |

### 3.3 Barrel Files (`index.ts`)

```typescript
// domain/todo/index.ts - 僅公開型別
export * from './types';
export * from './models';
export * from './errors';

// features/todo/index.ts - 僅公開 Facade
export { TodoFacade } from './facades';
// ❌ 禁止: export { TodoService } from './services';
// ❌ 禁止: export { TodoRepository } from './repositories';
```

---

## 4. 狀態管理標準

### 4.1 狀態流向

```
Component → Facade → Service → Store
    ↓           ↓
  UI 事件    Observable/Signal
```

### 4.2 各層職責

| 層級 | 允許操作 | 禁止操作 |
|------|----------|----------|
| **Component** | 綁定 UI、呼叫 Facade 方法 | `.select()`, `.dispatch()`, `.update()` |
| **Facade** | 操作 Store、暴露 Observable/Signal | 包含業務邏輯 |
| **Service** | 執行業務邏輯、呼叫 Repository | 直接控制 Store |
| **Repository** | Supabase CRUD | 涉及狀態管理 |

---

## 5. 資料模型設計

### 5.1 資料庫結構

> **📌 注意**：必須透過 Supabase MCP 驗證實際 Schema

#### Table: `todos`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK, DEFAULT gen_random_uuid() |
| `title` | text | 標題 | NOT NULL |
| `description` | text | 描述 | NULLABLE |
| `assignee_id` | uuid | 指派對象 | NULLABLE, FK |
| `creator_id` | uuid | 建立者 | NOT NULL, FK |
| `blueprint_id` | uuid | 關聯藍圖 | NULLABLE, FK |
| `task_id` | uuid | 關聯任務 | NULLABLE, FK |
| `status` | text | 狀態 | NOT NULL, DEFAULT 'open' |
| `priority` | text | 優先度 | NOT NULL, DEFAULT 'normal' |
| `due_at` | timestamptz | 到期時間 | NULLABLE |
| `created_at` | timestamptz | 建立時間 | DEFAULT now() |
| `updated_at` | timestamptz | 更新時間 | DEFAULT now() |

#### Table: `todo_comments`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK |
| `todo_id` | uuid | 關聯待辦 | NOT NULL, FK |
| `author_id` | uuid | 評論者 | NOT NULL, FK |
| `content` | text | 評論內容 | NOT NULL |
| `created_at` | timestamptz | 建立時間 | DEFAULT now() |

#### Table: `todo_attachments`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK |
| `todo_id` | uuid | 關聯待辦 | NOT NULL, FK |
| `url` | text | 檔案 URL | NOT NULL |
| `filename` | text | 檔案名稱 | NOT NULL |
| `size` | int | 檔案大小 | NOT NULL |
| `mime_type` | text | MIME 類型 | NOT NULL |
| `storage_path` | text | Storage 路徑 | NOT NULL |
| `uploaded_at` | timestamptz | 上傳時間 | DEFAULT now() |

### 5.2 SQL Migration

```sql
-- Migration: 001_create_todos_table
CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assignee_id uuid REFERENCES auth.users(id),
  creator_id uuid NOT NULL REFERENCES auth.users(id),
  blueprint_id uuid REFERENCES blueprints(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  due_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_todos_assignee_id ON todos(assignee_id);
CREATE INDEX idx_todos_creator_id ON todos(creator_id);
CREATE INDEX idx_todos_blueprint_id ON todos(blueprint_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_due_at ON todos(due_at) WHERE due_at IS NOT NULL;

-- Migration: 002_create_todo_comments_table
CREATE TABLE todo_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id uuid NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_todo_comments_todo_id ON todo_comments(todo_id);

-- Migration: 003_create_todo_attachments_table
CREATE TABLE todo_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id uuid NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text NOT NULL,
  size int NOT NULL,
  mime_type text NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_todo_attachments_todo_id ON todo_attachments(todo_id);
```

---

## 6. 認證與授權

### 6.1 認證流向

```
Supabase Auth → @delon/auth → DA_SERVICE_TOKEN → @delon/acl
```

### 6.2 權限規則

| 操作 | 權限要求 | RLS Policy |
|------|----------|------------|
| 讀取待辦 | 指派者、建立者、藍圖成員 | 見下方 Policy |
| 建立待辦 | 已登入使用者 | `auth.uid() = creator_id` |
| 編輯待辦 | 指派者、建立者 | `auth.uid() IN (assignee_id, creator_id)` |
| 刪除待辦 | 建立者 | `auth.uid() = creator_id` |

### 6.3 RLS Policies

```sql
-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Read policy
CREATE POLICY "Users can view their assigned or created todos"
  ON todos FOR SELECT
  USING (
    auth.uid() = assignee_id OR
    auth.uid() = creator_id OR
    (blueprint_id IS NOT NULL AND auth.uid() IN (
      SELECT user_id FROM blueprint_members
      WHERE blueprint_id = todos.blueprint_id
    ))
  );

-- Insert policy
CREATE POLICY "Authenticated users can create todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Update policy
CREATE POLICY "Assignees and creators can update todos"
  ON todos FOR UPDATE
  USING (auth.uid() IN (assignee_id, creator_id));

-- Delete policy
CREATE POLICY "Only creators can delete todos"
  ON todos FOR DELETE
  USING (auth.uid() = creator_id);
```

---

## 7. UI/UX 設計規範

### 7.1 元件使用優先順序

1. **@delon/abc** 業務元件優先
2. **ng-zorro-antd** 基礎元件次之
3. 自定義元件最後考慮

### 7.2 推薦元件清單

| 功能 | 推薦元件 | 來源 |
|------|----------|------|
| 列表檢視 | `st` (Simple Table) | @delon/abc |
| 卡片檢視 | `nz-card` | ng-zorro-antd |
| 狀態標籤 | `nz-tag` | ng-zorro-antd |
| 勾選框 | `nz-checkbox` | ng-zorro-antd |
| 頁面標題 | `page-header` | @delon/abc |
| 表單 | `sf` (Schema Form) | @delon/form |
| 優先度徽章 | `nz-badge` | ng-zorro-antd |
| 下拉選單 | `nz-select` | ng-zorro-antd |

### 7.3 頁面佈局

```typescript
// 列表檢視頁面結構
<page-header title="我的待辦">
  <ng-template #extra>
    <nz-badge [nzCount]="stats.overdue">逾期</nz-badge>
  </ng-template>
  <ng-template #action>
    <button nz-button nzType="primary">新增待辦</button>
  </ng-template>
</page-header>

<nz-card>
  <nz-tabset>
    <nz-tab nzTitle="全部">...</nz-tab>
    <nz-tab nzTitle="進行中">...</nz-tab>
    <nz-tab nzTitle="已完成">...</nz-tab>
  </nz-tabset>
</nz-card>
```

### 7.4 Angular 20+ 模板語法

> **⚠️ 強制要求**：必須使用新控制流語法

| 舊語法 | 新語法 | 狀態 |
|--------|--------|------|
| `*ngIf` | `@if` / `@else` | ✅ 必須使用 |
| `*ngFor` | `@for` | ✅ 必須使用 |
| `*ngSwitch` | `@switch` / `@case` | ✅ 必須使用 |
| - | `@defer` | ✅ 建議使用 |

---

## 8. 錯誤處理標準

### 8.1 錯誤流向

```
Supabase Error → Domain Error → UI Error
```

### 8.2 錯誤類型定義

```typescript
// domain/todo/errors/todo.errors.ts
export class TodoDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'TodoDomainError';
  }
}

// Error codes
export const TODO_ERROR_CODES = {
  TODO_NOT_FOUND: 'TODO_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ASSIGNMENT_FAILED: 'ASSIGNMENT_FAILED',
} as const;
```

### 8.3 錯誤映射表

| 層級 | 錯誤來源 | 處理方式 |
|------|----------|----------|
| Repository | Supabase Error | 轉換為 TodoRepositoryError |
| Service | Domain Logic | 拋出 TodoDomainError |
| Facade | Domain Error | 映射為 UI 友善訊息 |
| Component | Facade | 顯示訊息（NzMessage） |

---

## 9. 即時與通知功能

### 9.1 Supabase Realtime 訂閱

```typescript
// infrastructure/realtime/todo-realtime.service.ts
@Injectable({ providedIn: 'root' })
export class TodoRealtimeService {
  private readonly supabase = inject(SupabaseClient);

  subscribeToUserTodos(userId: string): Observable<RealtimeEvent<Todo>> {
    return new Observable(subscriber => {
      const channel = this.supabase
        .channel(`todo_changes_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'todos',
            filter: `assignee_id=eq.${userId}`,
          },
          payload => {
            subscriber.next({
              event: payload.eventType,
              data: TodoMapper.toDomain(payload.new as TodoDto),
              old: payload.old ? TodoMapper.toDomain(payload.old as TodoDto) : undefined,
            });
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    });
  }
}
```

### 9.2 通知策略

| 事件 | 通知方式 | 觸發條件 |
|------|----------|----------|
| 新指派 | 站內 + Email | 待辦被指派給使用者 |
| 到期提醒 | 站內 + Email | 到期前 1 天、當天、逾期 |
| 狀態變更 | 站內 | 指派者狀態變更 |
| 評論 | 站內 | 有人在待辦下留言 |

---

## 10. 測試標準

### 10.1 測試分層

| 層級 | 測試類型 | 覆蓋率要求 |
|------|----------|------------|
| Types | N/A | - |
| Mapper | Unit | 90% |
| Repository | Unit + Integration | 80% |
| Service | Unit | 85% |
| Facade | Unit | 80% |
| Component | Unit + E2E | 70% |

### 10.2 測試範例

```typescript
// domain/todo/models/todo.mapper.spec.ts
describe('TodoMapper', () => {
  describe('toDomain', () => {
    it('should map TodoDto to Todo correctly', () => {
      const dto: TodoDto = {
        id: '123',
        title: 'Test Todo',
        description: 'Test description',
        assignee_id: 'user-001',
        creator_id: 'user-002',
        blueprint_id: null,
        task_id: null,
        status: 'open',
        priority: 'high',
        due_at: '2025-01-30T10:00:00Z',
        created_at: '2025-01-25T10:00:00Z',
        updated_at: '2025-01-25T10:00:00Z',
      };

      const result = TodoMapper.toDomain(dto);

      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Todo');
      expect(result.status).toBe('open');
      expect(result.priority).toBe('high');
      expect(result.dueAt).toEqual(new Date('2025-01-30T10:00:00Z'));
    });
  });
});
```

### 10.3 驗收條件

| 功能 | 驗收標準 |
|------|----------|
| 指派通知 | 指派後 5 秒內前端可見新待辦 |
| 狀態變更 | 狀態變更正確紀錄歷史 |
| 批次操作 | 批次更新 10 筆以內 2 秒完成 |
| 即時更新 | 其他使用者變更 5 秒內可見 |

---

## 11. 企業級檢查清單

### 11.1 架構檢查

- [ ] 是否遵守 Types → Repositories → Models → Services → Facades → Components 順序？
- [ ] 是否無跨層依賴（如 Component → Repository）？
- [ ] Component 是否僅呼叫 Facade？
- [ ] 是否使用 barrel file（index.ts）定義公開 API？

### 11.2 模組邊界檢查

- [ ] Feature Module 是否未 import 其他 Feature Module？
- [ ] Domain 是否未依賴 Infrastructure？
- [ ] Supabase Client 是否僅出現在 Repository 層？
- [ ] Feature 是否僅公開 Facade？

### 11.3 狀態管理檢查

- [ ] 是否遵循 Component → Facade → Service → Store 流向？
- [ ] Component 是否未使用 `.select()` / `.dispatch()` / `.update()`？
- [ ] Facade 是否為唯一操作 Store 的層級？

### 11.4 程式碼品質檢查

- [ ] 是否通過 ESLint？
- [ ] 是否符合 Prettier 格式？
- [ ] 是否使用 Angular 20+ 新語法（@if, @for）？
- [ ] 是否避免使用 `any` 型別？

---

## 12. 待討論事項

| 項目 | 說明 | 負責人 | 狀態 |
|------|------|--------|------|
| 匿名任務 | 是否允許匿名任務或跨組織指派？ | 產品團隊 | 🟡 待討論 |
| 通知頻率 | 到期通知的頻率與重試策略 | 技術團隊 | 🟡 待討論 |
| 看板檢視 | 是否需要看板（Kanban）檢視？ | 產品團隊 | 🟡 待討論 |
| 子任務 | 是否支援子任務？ | 產品團隊 | 🟡 待討論 |

---

## 13. 參考文件

| 文件 | 說明 |
|------|------|
| `angular-enterprise-development-guidelines.md` | 企業級開發規範 |
| `docs/guides/diary-design.md` | 日誌設計（關聯功能） |
| `docs/guides/frontend-state-management-guide.md` | 狀態管理指南 |
| `docs/guides/error-handling-guide.md` | 錯誤處理指南 |

---

> **📝 文件維護說明**：此文件遵循企業級開發規範，任何變更需經過 Code Review 並更新版本號。
