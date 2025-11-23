# 前端狀態管理指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [狀態管理策略](#狀態管理策略)
  - [狀態分類](#狀態分類)
  - [選擇合適的狀態管理方案](#選擇合適的狀態管理方案)
- [Signals 基礎](#signals-基礎)
  - [Signal 創建與更新](#signal-創建與更新)
  - [Signal Inputs/Outputs (Angular 20)](#signal-inputsoutputs-angular-20)
  - [Signal Queries](#signal-queries)
- [狀態管理模式](#狀態管理模式)
  - [1. Service-based State (推薦)](#1-service-based-state-推薦)
  - [2. Store Pattern (複雜狀態)](#2-store-pattern-複雜狀態)
  - [3. Repository Pattern (資料獲取)](#3-repository-pattern-資料獲取)
  - [4. Feature State (功能狀態)](#4-feature-state-功能狀態)
- [最佳實踐](#最佳實踐)
  - [1. Signal 命名規範](#1-signal-命名規範)
  - [2. 避免直接暴露可寫 Signal](#2-避免直接暴露可寫-signal)
  - [3. Computed Signal 優化](#3-computed-signal-優化)
  - [4. Effect 使用原則](#4-effect-使用原則)
  - [5. 不可變性更新](#5-不可變性更新)
  - [6. 非同步資料載入模式](#6-非同步資料載入模式)
  - [7. 測試 Signals](#7-測試-signals)
- [效能優化](#效能優化)
  - [1. OnPush 變更檢測](#1-onpush-變更檢測)
  - [2. Signal 記憶化](#2-signal-記憶化)
  - [3. 批次更新](#3-批次更新)
- [相關文檔](#相關文檔)

---


> **目的**：定義 Angular 20 應用的狀態管理最佳實踐，使用 Signals 進行響應式狀態管理

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊
**技術棧**：Angular 20.3.x + Signals

- --

## 📋 目錄

1. [狀態管理策略](#狀態管理策略)
2. [Signals 基礎](#signals-基礎)
3. [狀態管理模式](#狀態管理模式)
4. [最佳實踐](#最佳實踐)

- --

## 狀態管理策略

### 狀態分類

```typescript
// 1. 元件本地狀態 (Component State)
@Component({...})
export class UserProfileComponent {
  isEditing = signal(false);
  formData = signal<UserData>({...});
}

// 2. 共享狀態 (Shared State) - 使用 Service
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private userState = signal<User | null>(null);
  readonly user = this.userState.asReadonly();

  setUser(user: User) {
    this.userState.set(user);
  }
}

// 3. 全域狀態 (Global State) - 使用 Store Pattern
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private state = signal<AppState>({
    theme: 'light',
    language: 'zh-TW',
    notifications: []
  });

  readonly theme = computed(() => this.state().theme);
  readonly language = computed(() => this.state().language);
}
```

### 選擇合適的狀態管理方案

| 場景 | 方案 | 範例 |
|------|------|------|
| **單一元件** | Local Signal | 表單編輯狀態、Modal 開關 |
| **父子元件** | Input/Output Signals | 資料傳遞、事件通知 |
| **跨元件共享** | Service + Signals | 認證狀態、使用者資訊 |
| **複雜全域狀態** | Store Pattern | 應用設定、快取管理 |

- --

## Signals 基礎

### Signal 創建與更新

```typescript
import { signal, computed, effect } from '@angular/core';

// 創建 Signal
const count = signal(0);
const user = signal<User | null>(null);

// 讀取值
console.log(count());  // 0

// 更新值
count.set(1);           // 直接設定
count.update(n => n + 1);  // 基於當前值更新

// Computed Signal (派生狀態)
const doubled = computed(() => count() * 2);
console.log(doubled());  // 4

// Effect (副作用)
effect(() => {
  console.log(`Count changed to ${count()}`);
});
```

### Signal Inputs/Outputs (Angular 20)

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <button (click)="handleEdit()">Edit</button>
    </div>
  `
})
export class UserCardComponent {
  // Input Signal
  user = input.required<User>();

  // Output Signal
  editClicked = output<User>();

  handleEdit() {
    this.editClicked.emit(this.user());
  }
}
```

### Signal Queries

```typescript
@Component({...})
export class ParentComponent {
  // Query single child
  childComponent = viewChild<ChildComponent>('child');

  // Query multiple children
  children = viewChildren<ChildComponent>(ChildComponent);

  // Content queries
  contentChild = contentChild<DirectiveType>('ref');
  contentChildren = contentChildren<DirectiveType>(DirectiveType);

  ngAfterViewInit() {
    // Signals are automatically available
    console.log(this.childComponent());
    console.log(this.children());
  }
}
```

- --

## 狀態管理模式

### 1. Service-based State (推薦)

```typescript
// auth-state.service.ts
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // Private writable signal
  private userState = signal<User | null>(null);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  // Public readonly signals
  readonly user = this.userState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userName = computed(() => this.user()?.name ?? '');

  // Actions
  setUser(user: User) {
    this.userState.set(user);
    this.errorState.set(null);
  }

  setLoading(loading: boolean) {
    this.loadingState.set(loading);
  }

  setError(error: string) {
    this.errorState.set(error);
    this.loadingState.set(false);
  }

  clearUser() {
    this.userState.set(null);
  }
}

// 使用
@Component({...})
export class HeaderComponent {
  authState = inject(AuthStateService);

  // 直接使用 signals
  user = this.authState.user;
  isAuthenticated = this.authState.isAuthenticated;
}
```

### 2. Store Pattern (複雜狀態)

```typescript
// app.store.ts
interface AppState {
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  // State
  private state = signal<AppState>({
    theme: 'light',
    language: 'zh-TW',
    sidebarCollapsed: false,
    notifications: []
  });

  // Selectors
  readonly theme = computed(() => this.state().theme);
  readonly language = computed(() => this.state().language);
  readonly sidebarCollapsed = computed(() => this.state().sidebarCollapsed);
  readonly notifications = computed(() => this.state().notifications);
  readonly unreadCount = computed(() =>
    this.state().notifications.filter(n => !n.read).length
  );

  // Actions
  setTheme(theme: 'light' | 'dark') {
    this.state.update(state => ({ ...state, theme }));
  }

  toggleSidebar() {
    this.state.update(state => ({
      ...state,
      sidebarCollapsed: !state.sidebarCollapsed
    }));
  }

  addNotification(notification: Notification) {
    this.state.update(state => ({
      ...state,
      notifications: [...state.notifications, notification]
    }));
  }

  markAsRead(id: string) {
    this.state.update(state => ({
      ...state,
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }
}
```

### 3. Repository Pattern (資料獲取)

```typescript
// blueprint.repository.ts
@Injectable({ providedIn: 'root' })
export class BlueprintRepository {
  private supabase = inject(SupabaseService);

  // Cache with signal
  private cache = signal<Map<string, Blueprint>>(new Map());

  async getById(id: string): Promise<Blueprint | null> {
    // Check cache first
    const cached = this.cache().get(id);
    if (cached) return cached;

    // Fetch from API
    const { data, error } = await this.supabase
      .from('blueprints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Update cache
    if (data) {
      this.cache.update(cache => {
        const newCache = new Map(cache);
        newCache.set(id, data);
        return newCache;
      });
    }

    return data;
  }

  invalidateCache(id?: string) {
    if (id) {
      this.cache.update(cache => {
        const newCache = new Map(cache);
        newCache.delete(id);
        return newCache;
      });
    } else {
      this.cache.set(new Map());
    }
  }
}
```

### 4. Feature State (功能狀態)

```typescript
// tasks/task-list.state.ts
@Injectable()
export class TaskListState {
  // State
  private tasksState = signal<Task[]>([]);
  private filterState = signal<TaskFilter>({ status: 'all' });
  private sortState = signal<TaskSort>({ field: 'created_at', order: 'desc' });

  // Selectors
  readonly tasks = this.tasksState.asReadonly();
  readonly filter = this.filterState.asReadonly();
  readonly sort = this.sortState.asReadonly();

  // Filtered and sorted tasks
  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filter();
    const sort = this.sort();

    // Filter
    let filtered = tasks;
    if (filter.status !== 'all') {
      filtered = filtered.filter(t => t.status === filter.status);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      return sort.order === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    return filtered;
  });

  // Actions
  setTasks(tasks: Task[]) {
    this.tasksState.set(tasks);
  }

  setFilter(filter: TaskFilter) {
    this.filterState.set(filter);
  }

  setSort(sort: TaskSort) {
    this.sortState.set(sort);
  }
}

// 在元件中提供
@Component({
  selector: 'app-task-list',
  standalone: true,
  providers: [TaskListState],  // 元件級別提供
  template: `...`
})
export class TaskListComponent {
  state = inject(TaskListState);

  tasks = this.state.filteredTasks;
}
```

- --

## 最佳實踐

### 1. Signal 命名規範

```typescript
// ✅ 好的命名
const isLoading = signal(false);
const userCount = signal(0);
const selectedItem = signal<Item | null>(null);

// ❌ 不好的命名
const loading = signal(false);  // 不清楚是狀態還是動作
const x = signal(0);
const data = signal<any>(null);
```

### 2. 避免直接暴露可寫 Signal

```typescript
// ❌ 不好：直接暴露可寫 signal
@Injectable({ providedIn: 'root' })
export class BadService {
  user = signal<User | null>(null);  // 可以被外部修改
}

// ✅ 好：暴露只讀 signal + 提供修改方法
@Injectable({ providedIn: 'root' })
export class GoodService {
  private userState = signal<User | null>(null);
  readonly user = this.userState.asReadonly();

  setUser(user: User) {
    this.userState.set(user);
  }
}
```

### 3. Computed Signal 優化

```typescript
// ✅ 好：使用 computed 自動追蹤依賴
const fullName = computed(() => {
  const first = firstName();
  const last = lastName();
  return `${first} ${last}`;
});

// ❌ 不好：手動追蹤
let fullName = '';
effect(() => {
  fullName = `${firstName()} ${lastName()}`;
});
```

### 4. Effect 使用原則

```typescript
// ✅ 好：用於副作用（日誌、本地儲存、API 調用）
effect(() => {
  const theme = themeSignal();
  localStorage.setItem('theme', theme);
});

// ❌ 不好：用於派生狀態（應該用 computed）
effect(() => {
  derivedValue = sourceValue() * 2;  // 應該用 computed
});
```

### 5. 不可變性更新

```typescript
// ✅ 好：不可變更新
const items = signal<Item[]>([]);

// 添加項目
items.update(current => [...current, newItem]);

// 更新項目
items.update(current =>
  current.map(item =>
    item.id === id ? { ...item, name: newName } : item
  )
);

// 刪除項目
items.update(current => current.filter(item => item.id !== id));

// ❌ 不好：直接修改
items().push(newItem);  // 不會觸發更新
items()[0].name = 'New';  // 不會觸發更新
```

### 6. 非同步資料載入模式

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private dataState = signal<Data[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  readonly data = this.dataState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  async loadData() {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await api.fetchData();
      this.dataState.set(data);
    } catch (error) {
      this.errorState.set(error.message);
    } finally {
      this.loadingState.set(false);
    }
  }
}

// 使用
@Component({...})
export class DataComponent {
  service = inject(DataService);

  data = this.service.data;
  loading = this.service.loading;
  error = this.service.error;

  async ngOnInit() {
    await this.service.loadData();
  }
}
```

### 7. 測試 Signals

```typescript
describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  it('should set user', () => {
    const user = { id: '1', name: 'Test' };
    service.setUser(user);

    expect(service.user()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should compute userName', () => {
    service.setUser({ id: '1', name: 'John' });
    expect(service.userName()).toBe('John');

    service.clearUser();
    expect(service.userName()).toBe('');
  });
});
```

- --

## 效能優化

### 1. OnPush 變更檢測

```typescript
@Component({
  selector: 'app-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }
  `
})
export class ListComponent {
  items = input.required<Item[]>();
}
```

### 2. Signal 記憶化

```typescript
// 避免不必要的重新計算
const expensiveComputation = computed(() => {
  return heavyOperation(data());
});
```

### 3. 批次更新

```typescript
// ✅ 好：一次更新
state.update(current => ({
  ...current,
  field1: value1,
  field2: value2,
  field3: value3
}));

// ❌ 不好：多次更新
state.update(c => ({ ...c, field1: value1 }));
state.update(c => ({ ...c, field2: value2 }));
state.update(c => ({ ...c, field3: value3 }));
```

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [開發最佳實踐指南](./guides/development-best-practices.md)
- [測試指南](./38-測試指南.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
