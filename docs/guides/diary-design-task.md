---
title: 日誌 (Diary) 功能開發思考鏈
version: 1.0.0
lastUpdated: 2025-01-25
status: approved
owner: Development Team
sourceDocument: diary-design.md
---

# 日誌 (Diary) 功能開發思考鏈

> **📋 文件目的**：此文件為 `diary-design.md` 的逐步執行任務清單，提供開發人員依序實作的思考鏈（Thought Chain）指引。

---

## 🎯 Phase 0: 開發前準備

### Step 0.1: 理解需求與業務目標
- [ ] 閱讀 `diary-design.md` 完整設計文件
- [ ] 閱讀 `angular-enterprise-development-guidelines.md` 企業級規範
- [ ] 確認理解日誌功能的業務目標：
  - 為專案/藍圖提供每日工地紀錄
  - 包含進度、問題、天氣、現場照片與相關待辦連結
- [ ] 確認已理解分層架構流向：`Types → Repositories → Models → Services → Facades → Components`

### Step 0.2: 環境與工具確認
- [ ] 確認 Supabase MCP 可用，用於查詢實際 Schema
- [ ] 確認 Angular CLI 版本 >= 20.x
- [ ] 確認 ng-alain / ng-zorro-antd 版本
- [ ] 執行 `yarn install` 確保依賴完整

### Step 0.3: 使用 Supabase MCP 驗證 Schema
- [ ] 查詢 `diaries` 表結構是否存在
- [ ] 若不存在，執行 Migration 建立表
- [ ] 查詢 `diary_comments` 表結構
- [ ] 查詢 `diary_history` 表結構
- [ ] 確認 RLS Policies 是否已設定

---

## 🔷 Phase 1: Types 層實作

> **📌 職責**：僅定義資料結構，禁止包含任何邏輯

### Step 1.1: 建立目錄結構
```bash
mkdir -p src/app/domain/diary/types
mkdir -p src/app/domain/diary/models
mkdir -p src/app/domain/diary/errors
```

### Step 1.2: 建立 Domain Types (`diary.types.ts`)
- [ ] 建立 `src/app/domain/diary/types/diary.types.ts`
- [ ] 定義 `Diary` interface（所有欄位使用 `readonly`）
- [ ] 定義 `DiaryWeather` type union
- [ ] 定義 `DiaryPhoto` interface
- [ ] 定義 `DiaryAttachment` interface
- [ ] 定義 `DiaryIssue` interface
- [ ] 驗證：無任何邏輯，僅有型別定義

### Step 1.3: 建立 DTO Types (`diary-dto.types.ts`)
- [ ] 建立 `src/app/domain/diary/types/diary-dto.types.ts`
- [ ] 定義 `DiaryDto` interface（snake_case 命名，對應 Supabase）
- [ ] 定義 `CreateDiaryDto` interface
- [ ] 定義 `UpdateDiaryDto` interface
- [ ] 驗證：欄位名稱與 Supabase 表結構一致

### Step 1.4: 建立 View Model Types (`diary-view-model.types.ts`)
- [ ] 建立 `src/app/domain/diary/types/diary-view-model.types.ts`
- [ ] 定義 `DiaryViewModel` interface（UI 顯示專用）
- [ ] 包含格式化的日期、天氣圖示等衍生欄位

### Step 1.5: 建立 Barrel File
- [ ] 建立 `src/app/domain/diary/types/index.ts`
- [ ] 匯出所有公開型別
- [ ] 驗證：`import { Diary } from '@domain/diary/types'` 可正常運作

### Step 1.6: Types 層檢查點 ✅
- [ ] 所有檔案無 TypeScript 錯誤
- [ ] 無任何邏輯程式碼（無 function、無 class method）
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 2: Repository 層實作

> **📌 職責**：純 Supabase CRUD，處理 RLS 錯誤，禁止業務邏輯

### Step 2.1: 建立目錄結構
```bash
mkdir -p src/app/infrastructure/repositories
mkdir -p src/app/infrastructure/errors
```

### Step 2.2: 建立 Repository Error
- [ ] 建立 `src/app/infrastructure/errors/repository.errors.ts`
- [ ] 定義 `DiaryRepositoryError` class
- [ ] 包含 `code` 屬性用於錯誤分類

### Step 2.3: 建立 DiaryRepository (`diary.repository.ts`)
- [ ] 建立 `src/app/infrastructure/repositories/diary.repository.ts`
- [ ] 使用 `inject(SupabaseClient)` 取得 Supabase 實例
- [ ] 實作 `findByBlueprint(blueprintId, date?)` 方法
- [ ] 實作 `findById(id)` 方法
- [ ] 實作 `create(dto)` 方法
- [ ] 實作 `update(id, dto)` 方法
- [ ] 實作 `delete(id)` 方法
- [ ] 實作 `handleError` 私有方法處理錯誤轉換
- [ ] 驗證：無業務邏輯，僅有 CRUD 操作

### Step 2.4: 建立 DiaryStorageRepository (`diary-storage.repository.ts`)
- [ ] 建立 `src/app/infrastructure/repositories/diary-storage.repository.ts`
- [ ] 實作 `uploadPhoto(blueprintId, diaryId, file)` 方法
- [ ] 實作 `deletePhoto(path)` 方法
- [ ] 實作 `getPublicUrl(path)` 私有方法

### Step 2.5: 建立 Barrel File
- [ ] 建立 `src/app/infrastructure/repositories/index.ts`
- [ ] 僅匯出供 Service 層使用的 Repositories

### Step 2.6: Repository 層檢查點 ✅
- [ ] Supabase Client 僅在此層使用
- [ ] 所有方法回傳 `Observable<T>`
- [ ] 錯誤已轉換為 `DiaryRepositoryError`
- [ ] 無業務邏輯
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 3: Models 層實作

> **📌 職責**：資料轉換（DTO → Domain → ViewModel），純映射

### Step 3.1: 建立 DiaryMapper (`diary.mapper.ts`)
- [ ] 建立 `src/app/domain/diary/models/diary.mapper.ts`
- [ ] 實作 `static toDomain(dto: DiaryDto): Diary` 方法
- [ ] 實作 `static toCreateDto(domain, authorId): CreateDiaryDto` 方法
- [ ] 實作私有的 `parsePhotos`, `parseAttachments`, `parseIssues` 方法
- [ ] 驗證：snake_case → camelCase 轉換正確

### Step 3.2: 建立 DiaryViewModelMapper (`diary-view-model.mapper.ts`)
- [ ] 建立 `src/app/domain/diary/models/diary-view-model.mapper.ts`
- [ ] 實作 `static toViewModel(diary: Diary): DiaryViewModel` 方法
- [ ] 格式化日期為易讀字串
- [ ] 轉換天氣為圖示
- [ ] 計算衍生欄位

### Step 3.3: 建立 Domain Errors
- [ ] 建立 `src/app/domain/diary/errors/diary.errors.ts`
- [ ] 定義 `DiaryDomainError` class
- [ ] 定義 `DIARY_ERROR_CODES` 常數

### Step 3.4: 建立 Barrel Files
- [ ] 建立 `src/app/domain/diary/models/index.ts`
- [ ] 建立 `src/app/domain/diary/errors/index.ts`
- [ ] 建立 `src/app/domain/diary/index.ts`（Domain Module 公開 API）

### Step 3.5: 撰寫 Mapper 單元測試
- [ ] 建立 `src/app/domain/diary/models/diary.mapper.spec.ts`
- [ ] 測試 `toDomain` 正確映射所有欄位
- [ ] 測試 `toCreateDto` 正確轉換
- [ ] 測試邊界情況（null 值、空陣列）

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
mkdir -p src/app/core/services/diary
```

### Step 4.2: 建立 DiaryService (`diary.service.ts`)
- [ ] 建立 `src/app/core/services/diary/diary.service.ts`
- [ ] 注入 `DiaryRepository`
- [ ] 實作 `getDiariesByBlueprint(blueprintId, date?)` 方法
  - 呼叫 Repository
  - 使用 Mapper 轉換為 Domain Model
- [ ] 實作 `getDiaryById(id)` 方法
  - 處理 Not Found 情況，拋出 `DiaryDomainError`
- [ ] 實作 `createDiary(diary, authorId)` 方法
  - **業務規則**：驗證 blueprintId 和 date 必填
  - 呼叫 Mapper 轉換為 DTO
  - 呼叫 Repository 建立
- [ ] 實作 `updateDiary(id, updates)` 方法
- [ ] 實作 `deleteDiary(id)` 方法

### Step 4.3: 建立 DiaryExportService (`diary-export.service.ts`)
- [ ] 建立 `src/app/core/services/diary/diary-export.service.ts`
- [ ] 注入 `HttpClient`
- [ ] 實作 `exportToPdf(diaryId)` 方法
- [ ] 實作 `exportRangeToCsv(blueprintId, startDate, endDate)` 方法

### Step 4.4: 建立 Barrel File
- [ ] 建立 `src/app/core/services/diary/index.ts`
- [ ] 僅匯出供 Facade 使用的 Services

### Step 4.5: 撰寫 Service 單元測試
- [ ] 建立 `src/app/core/services/diary/diary.service.spec.ts`
- [ ] Mock Repository
- [ ] 測試業務邏輯（驗證規則）
- [ ] 測試錯誤處理

### Step 4.6: Service 層檢查點 ✅
- [ ] 無 Store 操作（禁止 `.select()`, `.dispatch()`）
- [ ] 無 UI 相關程式碼
- [ ] 業務邏輯集中於此層
- [ ] 單元測試覆蓋率 >= 85%
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 5: Facade 層實作

> **📌 職責**：UI 統一存取介面，封裝 Service/Store，禁止業務邏輯

### Step 5.1: 建立目錄結構
```bash
mkdir -p src/app/features/diary/facades
mkdir -p src/app/features/diary/components
```

### Step 5.2: 建立 DiaryFacade (`diary.facade.ts`)
- [ ] 建立 `src/app/features/diary/facades/diary.facade.ts`
- [ ] 定義 `DiaryState` interface
- [ ] 使用 `signal<DiaryState>()` 建立狀態
- [ ] 建立 Computed Selectors：`diaries`, `selectedDiary`, `loading`, `error`
- [ ] 建立衍生 View Models：`diaryViewModels`
- [ ] 實作 `loadDiaries(blueprintId)` 方法
  - 更新 loading 狀態
  - 呼叫 Service
  - 更新 diaries 狀態
  - 錯誤映射為 UI 訊息
- [ ] 實作 `selectDiary(id)` 方法
- [ ] 實作 `createDiary(diary)` 方法
  - 取得當前使用者 ID（從 AuthFacade）
  - 呼叫 Service
  - 更新 diaries 陣列
- [ ] 實作 `updateDiary(id, updates)` 方法
- [ ] 實作 `deleteDiary(id)` 方法
- [ ] 實作 `clearError()` 方法
- [ ] 實作私有 `mapErrorMessage(error)` 方法

### Step 5.3: 建立 Barrel File
- [ ] 建立 `src/app/features/diary/facades/index.ts`
- [ ] 建立 `src/app/features/diary/index.ts`
- [ ] **僅公開 Facade**，禁止匯出 Service/Repository

### Step 5.4: 撰寫 Facade 單元測試
- [ ] 建立 `src/app/features/diary/facades/diary.facade.spec.ts`
- [ ] Mock Service
- [ ] 測試狀態更新
- [ ] 測試錯誤映射

### Step 5.5: Facade 層檢查點 ✅
- [ ] 為唯一可操作 Store/Signal 的層級
- [ ] 無業務邏輯（僅協調 Service）
- [ ] 公開 API 僅為 Facade
- [ ] 單元測試覆蓋率 >= 80%
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 6: Component 層實作

> **📌 職責**：UI 呈現與事件觸發，僅呼叫 Facade

### Step 6.1: 建立目錄結構
```bash
mkdir -p src/app/routes/diary
```

### Step 6.2: 建立路由配置 (`diary.routes.ts`)
- [ ] 建立 `src/app/routes/diary/diary.routes.ts`
- [ ] 配置 Lazy Load 路由
- [ ] 設定路由資料（title, breadcrumb）

### Step 6.3: 建立 DiaryListComponent (`diary-list.component.ts`)
- [ ] 建立 `src/app/routes/diary/diary-list.component.ts`
- [ ] 使用 `standalone: true`
- [ ] 使用 `ChangeDetectionStrategy.OnPush`
- [ ] 注入 `DiaryFacade`
- [ ] 在 `ngOnInit` 呼叫 `facade.loadDiaries(blueprintId)`
- [ ] 實作 `onCreateDiary()` 事件處理
- [ ] 實作 `onViewDiary(id)` 事件處理
- [ ] 實作 `onEditDiary(id)` 事件處理
- [ ] 實作 `onDeleteDiary(id)` 事件處理
- [ ] 使用 Angular 20+ 語法：`@if`, `@for`

### Step 6.4: 建立 DiaryDetailComponent (`diary-detail.component.ts`)
- [ ] 建立 `src/app/routes/diary/diary-detail.component.ts`
- [ ] 從路由取得 `diaryId`
- [ ] 呼叫 `facade.selectDiary(id)`
- [ ] 顯示日誌詳情
- [ ] 實作編輯功能

### Step 6.5: 建立 DiaryEditorComponent (`diary-editor.component.ts`)
- [ ] 建立 `src/app/routes/diary/diary-editor.component.ts`
- [ ] 使用 `@delon/form` 的 `sf` 元件
- [ ] 定義 Schema Form 配置
- [ ] 整合照片上傳（`nz-upload`）
- [ ] 整合富文本編輯器（`ngx-tinymce`）

### Step 6.6: 建立共用元件
- [ ] 建立 `src/app/features/diary/components/diary-card.component.ts`
- [ ] 建立 `src/app/features/diary/components/diary-date-cell.component.ts`

### Step 6.7: 撰寫 Component 測試
- [ ] 建立 `diary-list.component.spec.ts`
- [ ] Mock Facade
- [ ] 測試事件觸發

### Step 6.8: Component 層檢查點 ✅
- [ ] 僅呼叫 Facade，禁止直接呼叫 Service/Repository
- [ ] 禁止使用 `.select()`, `.dispatch()`, `.update()`
- [ ] 使用 Angular 20+ 新語法
- [ ] 使用 ng-zorro-antd 元件
- [ ] 通過 ESLint 檢查

---

## 🔷 Phase 7: 資料庫與 RLS 設定

### Step 7.1: 執行 Migration
- [ ] 使用 Supabase MCP 執行 `001_create_diaries_table`
- [ ] 使用 Supabase MCP 執行 `002_create_diary_comments_table`
- [ ] 使用 Supabase MCP 執行 `003_create_diary_history_table`
- [ ] 建立索引

### Step 7.2: 設定 RLS Policies
- [ ] 啟用 `diaries` 表的 RLS
- [ ] 建立 SELECT Policy
- [ ] 建立 INSERT Policy
- [ ] 建立 UPDATE Policy
- [ ] 建立 DELETE Policy

### Step 7.3: 設定 Storage Bucket
- [ ] 建立 `diary-attachments` Bucket
- [ ] 設定 Bucket 存取政策
- [ ] 設定檔案大小限制

### Step 7.4: 資料庫檢查點 ✅
- [ ] 所有表結構正確
- [ ] RLS Policies 生效
- [ ] Storage Bucket 可正常使用

---

## 🔷 Phase 8: 整合測試與驗證

### Step 8.1: 整合測試
- [ ] 測試完整 CRUD 流程
- [ ] 測試照片上傳流程
- [ ] 測試權限控制（RLS）
- [ ] 測試錯誤處理

### Step 8.2: E2E 測試
- [ ] 建立 E2E 測試案例
- [ ] 測試日誌建立流程
- [ ] 測試日誌編輯流程
- [ ] 測試照片上傳與預覽

### Step 8.3: 效能測試
- [ ] 測試列表載入效能
- [ ] 測試照片上傳效能
- [ ] 確認無 N+1 查詢問題

### Step 8.4: 整合檢查點 ✅
- [ ] 所有測試通過
- [ ] 效能符合要求
- [ ] 無 Console 錯誤

---

## 🔷 Phase 9: 即時功能實作

### Step 9.1: 建立 DiaryRealtimeService
- [ ] 建立 `src/app/infrastructure/realtime/diary-realtime.service.ts`
- [ ] 實作 `subscribeToDiaryChanges(blueprintId)` 方法
- [ ] 處理 INSERT、UPDATE、DELETE 事件

### Step 9.2: 整合 Realtime 到 Facade
- [ ] 在 `DiaryFacade` 中注入 `DiaryRealtimeService`
- [ ] 實作 `subscribeToChanges()` 方法
- [ ] 更新狀態時考慮即時事件

### Step 9.3: 即時功能檢查點 ✅
- [ ] 新增日誌即時顯示
- [ ] 更新日誌即時同步
- [ ] 刪除日誌即時移除

---

## 🔷 Phase 10: 匯出功能實作

### Step 10.1: 建立 Edge Function（PDF 匯出）
- [ ] 建立 Supabase Edge Function
- [ ] 實作 PDF 生成邏輯
- [ ] 包含照片嵌入

### Step 10.2: 前端整合
- [ ] 在 `DiaryExportService` 中呼叫 Edge Function
- [ ] 在 UI 中加入匯出按鈕
- [ ] 處理下載流程

### Step 10.3: 匯出功能檢查點 ✅
- [ ] PDF 匯出包含所有照片
- [ ] CSV 匯出資料正確
- [ ] 下載功能正常

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
- [ ] 日誌 CRUD 功能正常
- [ ] 照片上傳功能正常
- [ ] 即時更新功能正常
- [ ] PDF 匯出功能正常
- [ ] 權限控制正常

---

## 📚 參考文件

| 文件 | 說明 |
|------|------|
| `diary-design.md` | 日誌功能設計文件 |
| `angular-enterprise-development-guidelines.md` | 企業級開發規範 |
| `todo-design-task.md` | 待辦事項思考鏈（參考） |

---

> **📝 執行說明**：按照 Phase 順序依次完成各 Step，每個 Phase 完成後進行檢查點驗證，確保符合企業級標準後再進入下一階段。
