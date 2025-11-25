---
title: 待辦事項 (Todo) 功能開發思考鏈
version: 1.0.0
lastUpdated: 2025-01-25
status: approved
owner: Development Team
sourceDocument: todo-design.md
---

# 待辦事項 (Todo) 功能開發思考鏈

> **📋 文件目的**：此文件為 `todo-design.md` 的逐步執行任務清單，提供開發人員依序實作的思考鏈（Thought Chain）指引。

---

## 🎯 Phase 0: 開發前準備

### Step 0.1: 理解需求與業務目標
- [ ] 閱讀 `todo-design.md` 完整設計文件
- [ ] 閱讀 `angular-enterprise-development-guidelines.md` 企業級規範
- [ ] 確認理解待辦事項功能的業務目標：
  - 提供輕量、即時、可追蹤的待辦系統
  - 用於記錄指派給使用者的任務或藍圖內檢查項
- [ ] 確認已理解分層架構流向：`Types → Repositories → Models → Services → Facades → Components`

### Step 0.2: 環境與工具確認
- [ ] 確認 Supabase MCP 可用，用於查詢實際 Schema
- [ ] 確認 Angular CLI 版本 >= 20.x
- [ ] 確認 ng-alain / ng-zorro-antd 版本
- [ ] 執行 `yarn install` 確保依賴完整

### Step 0.3: 使用 Supabase MCP 驗證 Schema
- [ ] 查詢 `todos` 表結構是否存在
- [ ] 若不存在，執行 Migration 建立表
- [ ] 查詢 `todo_comments` 表結構
- [ ] 查詢 `todo_attachments` 表結構
- [ ] 確認 RLS Policies 是否已設定

---

## 🔷 Phase 1: Types 層實作

> **📌 職責**：僅定義資料結構，禁止包含任何邏輯

### Step 1.1: 建立目錄結構
```bash
mkdir -p src/app/domain/todo/types
mkdir -p src/app/domain/todo/models
mkdir -p src/app/domain/todo/errors
```

### Step 1.2: 建立 Domain Types (`todo.types.ts`)
- [ ] 建立 `src/app/domain/todo/types/todo.types.ts`
- [ ] 定義 `Todo` interface（所有欄位使用 `readonly`）
- [ ] 定義 `TodoStatus` type union：`'open' | 'in_progress' | 'done' | 'cancelled'`
- [ ] 定義 `TodoPriority` type union：`'low' | 'normal' | 'high'`
- [ ] 定義 `TodoComment` interface
- [ ] 定義 `TodoAttachment` interface
- [ ] 驗證：無任何邏輯，僅有型別定義

### Step 1.3: 建立 DTO Types (`todo-dto.types.ts`)
- [ ] 建立 `src/app/domain/todo/types/todo-dto.types.ts`
- [ ] 定義 `TodoDto` interface（snake_case 命名，對應 Supabase）
- [ ] 定義 `CreateTodoDto` interface
- [ ] 定義 `UpdateTodoDto` interface
- [ ] 驗證：欄位名稱與 Supabase 表結構一致

### Step 1.4: 建立 View Model Types (`todo-view-model.types.ts`)
- [ ] 建立 `src/app/domain/todo/types/todo-view-model.types.ts`
- [ ] 定義 `TodoViewModel` interface（UI 顯示專用）
- [ ] 包含格式化的到期日、優先度標籤、狀態圖示等衍生欄位

### Step 1.5: 建立 Barrel File
- [ ] 建立 `src/app/domain/todo/types/index.ts`
- [ ] 匯出所有公開型別
- [ ] 驗證：`import { Todo } from '@domain/todo/types'` 可正常運作

### Step 1.6: Types 層檢查點 ✅
- [ ] 所有檔案無 TypeScript 錯誤
- [ ] 無任何邏輯程式碼（無 function、無 class method）
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 2: Repository 層實作

> **📌 職責**：純 Supabase CRUD，處理 RLS 錯誤，禁止業務邏輯

### Step 2.1: 建立目錄結構（若尚未存在）
```bash
mkdir -p src/app/infrastructure/repositories
mkdir -p src/app/infrastructure/errors
```

### Step 2.2: 建立 Repository Error
- [ ] 建立或更新 `src/app/infrastructure/errors/repository.errors.ts`
- [ ] 定義 `TodoRepositoryError` class
- [ ] 包含 `code` 屬性用於錯誤分類

### Step 2.3: 建立 TodoRepository (`todo.repository.ts`)
- [ ] 建立 `src/app/infrastructure/repositories/todo.repository.ts`
- [ ] 使用 `inject(SupabaseClient)` 取得 Supabase 實例
- [ ] 實作 `findByAssignee(assigneeId, status?)` 方法
  - 按 `due_at` 升序排列（null 值放最後）
- [ ] 實作 `findByBlueprint(blueprintId)` 方法
  - 按 `priority` 降序、`due_at` 升序排列
- [ ] 實作 `findById(id)` 方法
- [ ] 實作 `create(dto)` 方法
- [ ] 實作 `update(id, dto)` 方法
- [ ] 實作 `delete(id)` 方法
- [ ] 實作 `batchUpdateStatus(ids, status)` 方法（批次操作）
- [ ] 實作 `handleError` 私有方法處理錯誤轉換
- [ ] 驗證：無業務邏輯，僅有 CRUD 操作

### Step 2.4: 建立 TodoCommentRepository (`todo-comment.repository.ts`)
- [ ] 建立 `src/app/infrastructure/repositories/todo-comment.repository.ts`
- [ ] 實作 `findByTodoId(todoId)` 方法
- [ ] 實作 `create(dto)` 方法
- [ ] 實作 `delete(id)` 方法

### Step 2.5: 建立 TodoAttachmentRepository (`todo-attachment.repository.ts`)
- [ ] 建立 `src/app/infrastructure/repositories/todo-attachment.repository.ts`
- [ ] 實作 `findByTodoId(todoId)` 方法
- [ ] 實作 `upload(todoId, file)` 方法
- [ ] 實作 `delete(id)` 方法

### Step 2.6: 建立 Barrel File
- [ ] 更新 `src/app/infrastructure/repositories/index.ts`
- [ ] 匯出 Todo 相關 Repositories

### Step 2.7: Repository 層檢查點 ✅
- [ ] Supabase Client 僅在此層使用
- [ ] 所有方法回傳 `Observable<T>`
- [ ] 錯誤已轉換為 `TodoRepositoryError`
- [ ] 無業務邏輯
- [ ] 支援批次操作
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 3: Models 層實作

> **📌 職責**：資料轉換（DTO → Domain → ViewModel），純映射

### Step 3.1: 建立 TodoMapper (`todo.mapper.ts`)
- [ ] 建立 `src/app/domain/todo/models/todo.mapper.ts`
- [ ] 實作 `static toDomain(dto: TodoDto): Todo` 方法
  - 轉換 `due_at` 字串為 `Date | null`
  - 轉換 `status` 字串為 `TodoStatus`
  - 轉換 `priority` 字串為 `TodoPriority`
- [ ] 實作 `static toCreateDto(domain, creatorId): CreateTodoDto` 方法
- [ ] 驗證：snake_case → camelCase 轉換正確

### Step 3.2: 建立 TodoViewModelMapper (`todo-view-model.mapper.ts`)
- [ ] 建立 `src/app/domain/todo/models/todo-view-model.mapper.ts`
- [ ] 實作 `static toViewModel(todo: Todo): TodoViewModel` 方法
- [ ] 格式化到期日為易讀字串（例如「3 天後到期」）
- [ ] 轉換優先度為標籤（例如「高優先」）
- [ ] 計算是否逾期
- [ ] 轉換狀態為圖示/顏色

### Step 3.3: 建立 Domain Errors
- [ ] 建立 `src/app/domain/todo/errors/todo.errors.ts`
- [ ] 定義 `TodoDomainError` class
- [ ] 定義 `TODO_ERROR_CODES` 常數：
  - `TODO_NOT_FOUND`
  - `INVALID_INPUT`
  - `PERMISSION_DENIED`
  - `ASSIGNMENT_FAILED`

### Step 3.4: 建立 Barrel Files
- [ ] 建立 `src/app/domain/todo/models/index.ts`
- [ ] 建立 `src/app/domain/todo/errors/index.ts`
- [ ] 建立 `src/app/domain/todo/index.ts`（Domain Module 公開 API）

### Step 3.5: 撰寫 Mapper 單元測試
- [ ] 建立 `src/app/domain/todo/models/todo.mapper.spec.ts`
- [ ] 測試 `toDomain` 正確映射所有欄位
- [ ] 測試 `due_at` null 值處理
- [ ] 測試 `toCreateDto` 正確轉換
- [ ] 測試邊界情況

### Step 3.6: Models 層檢查點 ✅
- [ ] Mapper 為純函數（無副作用）
- [ ] 單元測試覆蓋率 >= 90%
- [ ] 通過 ESLint 檢查
- [ ] 執行 `npm test` 通過

---

## 🔷 Phase 4: Service 層實作

> **📌 職責**：業務邏輯與流程控制，禁止接觸 UI

### Step 4.1: 建立目錄結構
```bash
mkdir -p src/app/core/services/todo
```

### Step 4.2: 建立 TodoService (`todo.service.ts`)
- [ ] 建立 `src/app/core/services/todo/todo.service.ts`
- [ ] 注入 `TodoRepository`
- [ ] 實作 `getTodosByAssignee(assigneeId, status?)` 方法
  - 呼叫 Repository
  - 使用 Mapper 轉換為 Domain Model
- [ ] 實作 `getTodosByBlueprint(blueprintId)` 方法
- [ ] 實作 `getTodoById(id)` 方法
  - 處理 Not Found 情況，拋出 `TodoDomainError`
- [ ] 實作 `createTodo(todo, creatorId)` 方法
  - **業務規則**：驗證 title 必填且非空白
  - 呼叫 Mapper 轉換為 DTO
  - 呼叫 Repository 建立
- [ ] 實作 `updateTodo(id, updates)` 方法
- [ ] 實作 `changeStatus(id, status)` 方法
- [ ] 實作 `batchChangeStatus(ids, status)` 方法
- [ ] 實作 `deleteTodo(id)` 方法

### Step 4.3: 建立 TodoNotificationService (`todo-notification.service.ts`)
- [ ] 建立 `src/app/core/services/todo/todo-notification.service.ts`
- [ ] 實作到期提醒邏輯
- [ ] 實作指派通知邏輯

### Step 4.4: 建立 Barrel File
- [ ] 建立 `src/app/core/services/todo/index.ts`
- [ ] 僅匯出供 Facade 使用的 Services

### Step 4.5: 撰寫 Service 單元測試
- [ ] 建立 `src/app/core/services/todo/todo.service.spec.ts`
- [ ] Mock Repository
- [ ] 測試業務邏輯（title 驗證）
- [ ] 測試批次操作
- [ ] 測試錯誤處理

### Step 4.6: Service 層檢查點 ✅
- [ ] 無 Store 操作（禁止 `.select()`, `.dispatch()`）
- [ ] 無 UI 相關程式碼
- [ ] 業務邏輯集中於此層
- [ ] 支援批次操作
- [ ] 單元測試覆蓋率 >= 85%
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 5: Facade 層實作

> **📌 職責**：UI 統一存取介面，封裝 Service/Store，禁止業務邏輯

### Step 5.1: 建立目錄結構
```bash
mkdir -p src/app/features/todo/facades
mkdir -p src/app/features/todo/components
```

### Step 5.2: 建立 TodoFacade (`todo.facade.ts`)
- [ ] 建立 `src/app/features/todo/facades/todo.facade.ts`
- [ ] 定義 `TodoState` interface（含 `filter` 欄位）
- [ ] 使用 `signal<TodoState>()` 建立狀態
- [ ] 建立 Computed Selectors：`todos`, `selectedTodo`, `loading`, `error`, `filter`
- [ ] 建立衍生 View Models：`todoViewModels`
- [ ] 建立 Computed Stats：`stats`（total, open, inProgress, done, overdue）
- [ ] 實作 `loadMyTodos(status?)` 方法
  - 取得當前使用者 ID
  - 更新 loading 狀態
  - 呼叫 Service
  - 更新 todos 狀態
- [ ] 實作 `loadBlueprintTodos(blueprintId)` 方法
- [ ] 實作 `selectTodo(id)` 方法
- [ ] 實作 `createTodo(todo)` 方法
- [ ] 實作 `updateTodo(id, updates)` 方法
- [ ] 實作 `markAsDone(id)` 方法（快捷方法）
- [ ] 實作 `changeStatus(id, status)` 方法
- [ ] 實作 `batchMarkAsDone(ids)` 方法
- [ ] 實作 `deleteTodo(id)` 方法
- [ ] 實作 `clearError()` 方法
- [ ] 實作私有 `mapErrorMessage(error)` 方法

### Step 5.3: 建立 Barrel File
- [ ] 建立 `src/app/features/todo/facades/index.ts`
- [ ] 建立 `src/app/features/todo/index.ts`
- [ ] **僅公開 Facade**，禁止匯出 Service/Repository

### Step 5.4: 撰寫 Facade 單元測試
- [ ] 建立 `src/app/features/todo/facades/todo.facade.spec.ts`
- [ ] Mock Service
- [ ] 測試狀態更新
- [ ] 測試 stats 計算
- [ ] 測試批次操作
- [ ] 測試錯誤映射

### Step 5.5: Facade 層檢查點 ✅
- [ ] 為唯一可操作 Store/Signal 的層級
- [ ] 無業務邏輯（僅協調 Service）
- [ ] 公開 API 僅為 Facade
- [ ] 支援統計計算
- [ ] 單元測試覆蓋率 >= 80%
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 6: Component 層實作

> **📌 職責**：UI 呈現與事件觸發，僅呼叫 Facade

### Step 6.1: 建立目錄結構
```bash
mkdir -p src/app/routes/todo
```

### Step 6.2: 建立路由配置 (`todo.routes.ts`)
- [ ] 建立 `src/app/routes/todo/todo.routes.ts`
- [ ] 配置 Lazy Load 路由
- [ ] 設定路由資料（title, breadcrumb）

### Step 6.3: 建立 TodoListComponent (`todo-list.component.ts`)
- [ ] 建立 `src/app/routes/todo/todo-list.component.ts`
- [ ] 使用 `standalone: true`
- [ ] 使用 `ChangeDetectionStrategy.OnPush`
- [ ] 注入 `TodoFacade`
- [ ] 在 `ngOnInit` 呼叫 `facade.loadMyTodos()`
- [ ] 顯示 stats（總數、逾期數）
- [ ] 實作 `onCreateTodo()` 事件處理
- [ ] 實作 `onToggleStatus(id, checked)` 事件處理
- [ ] 實作 `onEditTodo(id)` 事件處理
- [ ] 實作 `onDeleteTodo(id)` 事件處理
- [ ] 實作 `getPriorityColor(priority)` 輔助方法
- [ ] 使用 Angular 20+ 語法：`@if`, `@for`

### Step 6.4: 建立 TodoDetailComponent (`todo-detail.component.ts`)
- [ ] 建立 `src/app/routes/todo/todo-detail.component.ts`
- [ ] 從路由取得 `todoId`
- [ ] 呼叫 `facade.selectTodo(id)`
- [ ] 顯示待辦詳情
- [ ] 顯示評論區
- [ ] 顯示附件列表
- [ ] 實作狀態變更功能

### Step 6.5: 建立 TodoQuickAddComponent (`todo-quick-add.component.ts`)
- [ ] 建立 `src/app/routes/todo/todo-quick-add.component.ts`
- [ ] 提供快速新增輸入框
- [ ] 可在藍圖頁面內嵌使用
- [ ] 預填關聯藍圖 ID

### Step 6.6: 建立 TodoFormComponent (`todo-form.component.ts`)
- [ ] 建立 `src/app/routes/todo/todo-form.component.ts`
- [ ] 使用 `@delon/form` 的 `sf` 元件
- [ ] 定義 Schema Form 配置
- [ ] 包含標題、描述、指派者、優先度、到期日欄位

### Step 6.7: 建立共用元件
- [ ] 建立 `src/app/features/todo/components/todo-card.component.ts`
- [ ] 建立 `src/app/features/todo/components/todo-status-tag.component.ts`
- [ ] 建立 `src/app/features/todo/components/todo-priority-badge.component.ts`

### Step 6.8: 撰寫 Component 測試
- [ ] 建立 `todo-list.component.spec.ts`
- [ ] Mock Facade
- [ ] 測試事件觸發
- [ ] 測試 stats 顯示

### Step 6.9: Component 層檢查點 ✅
- [ ] 僅呼叫 Facade，禁止直接呼叫 Service/Repository
- [ ] 禁止使用 `.select()`, `.dispatch()`, `.update()`
- [ ] 使用 Angular 20+ 新語法
- [ ] 使用 ng-zorro-antd 元件
- [ ] 支援批次操作 UI
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 7: 資料庫與 RLS 設定

### Step 7.1: 執行 Migration
- [ ] 使用 Supabase MCP 執行 `001_create_todos_table`
- [ ] 使用 Supabase MCP 執行 `002_create_todo_comments_table`
- [ ] 使用 Supabase MCP 執行 `003_create_todo_attachments_table`
- [ ] 建立索引（assignee_id, creator_id, blueprint_id, status, due_at）

### Step 7.2: 設定 RLS Policies
- [ ] 啟用 `todos` 表的 RLS
- [ ] 建立 SELECT Policy（assignee, creator, blueprint members 可讀）
- [ ] 建立 INSERT Policy（已登入使用者可建立）
- [ ] 建立 UPDATE Policy（assignee, creator 可更新）
- [ ] 建立 DELETE Policy（creator 可刪除）

### Step 7.3: 設定 Storage Bucket（若需要附件功能）
- [ ] 建立 `todo-attachments` Bucket
- [ ] 設定 Bucket 存取政策
- [ ] 設定檔案大小限制

### Step 7.4: 資料庫檢查點 ✅
- [ ] 所有表結構正確
- [ ] 索引已建立
- [ ] RLS Policies 生效
- [ ] Storage Bucket 可正常使用（若適用）

---

## 🔷 Phase 8: 整合測試與驗證

### Step 8.1: 整合測試
- [ ] 測試完整 CRUD 流程
- [ ] 測試狀態變更流程
- [ ] 測試批次操作流程
- [ ] 測試權限控制（RLS）
- [ ] 測試錯誤處理

### Step 8.2: E2E 測試
- [ ] 建立 E2E 測試案例
- [ ] 測試待辦建立流程
- [ ] 測試勾選完成流程
- [ ] 測試批次標記完成
- [ ] 測試刪除流程

### Step 8.3: 效能測試
- [ ] 測試列表載入效能
- [ ] 測試批次操作效能
- [ ] 確認無 N+1 查詢問題

### Step 8.4: 整合檢查點 ✅
- [ ] 所有測試通過
- [ ] 效能符合要求（批次 10 筆 < 2 秒）
- [ ] 無 Console 錯誤

---

## 🔷 Phase 9: 即時功能實作

### Step 9.1: 建立 TodoRealtimeService
- [ ] 建立 `src/app/infrastructure/realtime/todo-realtime.service.ts`
- [ ] 實作 `subscribeToUserTodos(userId)` 方法
- [ ] 處理 INSERT、UPDATE、DELETE 事件

### Step 9.2: 整合 Realtime 到 Facade
- [ ] 在 `TodoFacade` 中注入 `TodoRealtimeService`
- [ ] 實作 `subscribeToChanges()` 方法
- [ ] 更新狀態時考慮即時事件

### Step 9.3: 即時功能檢查點 ✅
- [ ] 新指派待辦即時顯示
- [ ] 狀態變更即時同步
- [ ] 刪除待辦即時移除
- [ ] 5 秒內可見變更

---

## 🔷 Phase 10: 通知功能實作

### Step 10.1: 站內通知
- [ ] 建立通知服務
- [ ] 實作新指派通知
- [ ] 實作狀態變更通知
- [ ] 實作評論通知

### Step 10.2: 到期提醒
- [ ] 實作到期前 1 天提醒
- [ ] 實作當天提醒
- [ ] 實作逾期提醒

### Step 10.3: Email 通知（可選）
- [ ] 建立 Edge Function 發送 Email
- [ ] 整合通知服務

### Step 10.4: 通知功能檢查點 ✅
- [ ] 新指派 5 秒內收到通知
- [ ] 到期提醒正確觸發
- [ ] 通知可正確清除

---

## ✅ 最終檢查清單

### 架構檢查
- [ ] 遵守 `Types → Repositories → Models → Services → Facades → Components` 順序
- [ ] 無跨層依賴
- [ ] 使用 barrel file（index.ts）定義公開 API

### 模組邊界檢查
- [ ] Feature Module 未 import 其他 Feature Module
- [ ] Domain 未依賴 Infrastructure
- [ ] Supabase Client 僅出現在 Repository 層
- [ ] Feature 僅公開 Facade

### 狀態管理檢查
- [ ] 遵循 `Component → Facade → Service → Store` 流向
- [ ] Component 未使用 `.select()` / `.dispatch()` / `.update()`
- [ ] Facade 為唯一操作 Store 的層級

### 程式碼品質檢查
- [ ] 通過 ESLint
- [ ] 符合 Prettier 格式
- [ ] 使用 Angular 20+ 新語法
- [ ] 避免使用 `any` 型別
- [ ] 單元測試覆蓋率符合要求

### 功能驗收
- [ ] 待辦 CRUD 功能正常
- [ ] 狀態變更功能正常
- [ ] 批次操作功能正常
- [ ] 即時更新功能正常
- [ ] 通知功能正常
- [ ] 權限控制正常

---

## 📚 參考文件

| 文件 | 說明 |
|------|------|
| `todo-design.md` | 待辦事項功能設計文件 |
| `angular-enterprise-development-guidelines.md` | 企業級開發規範 |
| `diary-design-task.md` | 日誌思考鏈（參考） |

---

> **📝 執行說明**：按照 Phase 順序依次完成各 Step，每個 Phase 完成後進行檢查點驗證，確保符合企業級標準後再進入下一階段。
