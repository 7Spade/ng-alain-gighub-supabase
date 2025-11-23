# Blueprint & Task Module Implementation Summary

## 目的
建立藍圖 (Blueprint) 與任務 (Task) 模塊的最基本架構，為日後無縫接上上下文切換器 (Context Switcher) 做準備。

## 實作完成項目

### 1. 檔案結構
```
src/app/routes/blueprint/
├── types/
│   ├── blueprint.types.ts    # 藍圖型別定義
│   ├── task.types.ts          # 任務型別定義
│   └── index.ts               # 型別匯出
├── blueprint-list/
│   ├── blueprint-list.component.ts
│   └── blueprint-list.component.html
├── blueprint-detail/
│   ├── blueprint-detail.component.ts
│   └── blueprint-detail.component.html
├── task/
│   ├── task-list/
│   │   ├── task-list.component.ts
│   │   └── task-list.component.html
│   ├── task-detail/
│   │   ├── task-detail.component.ts
│   │   └── task-detail.component.html
│   ├── routes.ts
│   └── README.md
├── routes.ts
└── README.md
```

### 2. 型別定義

#### Blueprint 型別
- `Blueprint`: 藍圖基礎介面 (id, name, description, status, created_at, updated_at)
- `BlueprintStatus`: 狀態型別 ('draft' | 'active' | 'archived')
- `CreateBlueprintDto`: 建立藍圖參數
- `UpdateBlueprintDto`: 更新藍圖參數

#### Task 型別
- `Task`: 任務基礎介面 (id, blueprint_id, title, description, status, priority, assigned_to, created_at, updated_at)
- `TaskStatus`: 狀態型別 ('todo' | 'in_progress' | 'done' | 'blocked')
- `TaskPriority`: 優先級型別 ('low' | 'medium' | 'high' | 'critical')
- `CreateTaskDto`: 建立任務參數
- `UpdateTaskDto`: 更新任務參數

### 3. 路由配置

#### 主路由 (routes.ts)
```typescript
{ path: 'blueprint', loadChildren: () => import('./blueprint/routes') }
```

#### Blueprint 路由
- `/blueprint` → BlueprintListComponent (藍圖列表)
- `/blueprint/:id` → BlueprintDetailComponent (藍圖詳情)
- `/blueprint/:id/tasks` → 延遲載入 Task 路由

#### Task 路由
- `/blueprint/:id/tasks` → TaskListComponent (任務列表)
- `/blueprint/:id/tasks/:taskId` → TaskDetailComponent (任務詳情)

### 4. 元件功能

#### BlueprintListComponent
- **功能**: 顯示所有藍圖的列表
- **使用元件**: 
  - `@delon/abc/st` (Simple Table)
  - `@delon/abc/page-header` (PageHeader)
- **欄位**: ID, 名稱, 描述, 狀態 (徽章), 建立時間
- **操作**: 檢視, 檢視任務, 建立新藍圖

#### BlueprintDetailComponent
- **功能**: 顯示/編輯單一藍圖詳情
- **模式**: 支援新建 (new) 和編輯模式
- **預留**: 表單整合點、Supabase CRUD
- **導航**: 返回列表, 檢視任務, 儲存

#### TaskListComponent
- **功能**: 顯示特定藍圖的所有任務
- **使用元件**: 
  - `@delon/abc/st` (Simple Table)
  - `@delon/abc/page-header` (PageHeader)
- **欄位**: ID, 標題, 描述, 狀態 (徽章), 優先級 (徽章), 負責人, 建立時間
- **狀態徽章**: 
  - todo → 待辦 (default)
  - in_progress → 進行中 (processing)
  - done → 完成 (success)
  - blocked → 阻塞 (error)
- **優先級徽章**:
  - low → 低 (default)
  - medium → 中 (processing)
  - high → 高 (warning)
  - critical → 緊急 (error)

#### TaskDetailComponent
- **功能**: 顯示/編輯單一任務詳情
- **模式**: 支援新建 (new) 和編輯模式
- **預留**: 表單整合點、Supabase CRUD
- **導航**: 返回列表, 儲存

### 5. 技術特點

#### 使用的技術棧
- ✅ Angular 20.3.x Standalone Components
- ✅ ng-alain 20.1.0 企業級框架
- ✅ @delon/abc 業務元件庫
- ✅ ng-zorro-antd UI 元件庫
- ✅ TypeScript 5.8.x 嚴格型別檢查
- ✅ 延遲載入路由 (Lazy Loading)

#### 開發最佳實踐
- ✅ 使用 `inject()` 函數進行依賴注入
- ✅ `ChangeDetectionStrategy.OnPush` 最佳化變更檢測
- ✅ 模組化路由設計 (主路由 + 子路由)
- ✅ TypeScript 介面嚴格型別定義
- ✅ 元件使用 SHARED_IMPORTS 統一導入

### 6. 預留整合點

#### 資料層整合
```typescript
// 預留：在各元件的 ngOnInit 或相關方法中
private loadBlueprints(): void {
  // TODO: 整合 Supabase 服務
  // this.supabaseService.getBlueprints().subscribe(...)
}
```

#### 表單整合
```html
<!-- 預留：在 detail 元件的 HTML 中 -->
<nz-alert
  nzType="info"
  nzMessage="待實作"
  nzDescription="此處將整合表單，並連接 Supabase 資料庫"
  nzShowIcon
></nz-alert>
```

#### 上下文切換器
- 路由結構已支援 blueprint 和 task 的層級關係
- 可在導航時追蹤當前的 blueprint 和 task 上下文
- 預留在未來實作時整合 WorkspaceContextService

### 7. 驗證結果

#### 建置驗證
```bash
npm run build
```
- ✅ 建置成功
- ✅ 無 TypeScript 編譯錯誤
- ✅ 產生正確的 chunk 檔案
- ⚠️ Bundle size 警告 (專案整體問題，非新增模組造成)

#### 程式碼品質
```bash
npm run lint
```
- ✅ 新增的 Blueprint 和 Task 模組檔案無 ESLint 錯誤
- ℹ️ 專案中存在其他既有檔案的 lint 錯誤 (不影響新模組)

#### 開發伺服器
```bash
npm start
```
- ✅ 成功編譯並啟動
- ✅ 所有路由正確載入
- ✅ 無執行時錯誤

### 8. 下一步建議

#### 立即可做
1. **Supabase Schema 設計**
   - 建立 `blueprints` 表格
   - 建立 `tasks` 表格
   - 定義外鍵關係 (tasks.blueprint_id → blueprints.id)
   - 設定 RLS (Row Level Security) 政策

2. **服務層實作**
   ```typescript
   // src/app/routes/blueprint/services/blueprint.service.ts
   @Injectable({ providedIn: 'root' })
   export class BlueprintService {
     getBlueprints(): Observable<Blueprint[]> { }
     getBlueprintById(id: string): Observable<Blueprint> { }
     createBlueprint(dto: CreateBlueprintDto): Observable<Blueprint> { }
     updateBlueprint(id: string, dto: UpdateBlueprintDto): Observable<Blueprint> { }
     deleteBlueprint(id: string): Observable<void> { }
   }
   ```

3. **表單實作**
   - 使用 `@delon/form` Schema Form
   - 整合 Reactive Forms 驗證
   - 實作儲存和取消邏輯

#### 進階功能
4. **上下文切換器整合**
   - 追蹤當前 blueprint 和 task
   - 實作快速切換功能
   - 整合 WorkspaceContextService
   - 實作麵包屑導航

5. **即時更新**
   - 使用 Supabase Realtime 訂閱
   - 實作資料同步機制

6. **權限管理**
   - 使用 @delon/acl 進行權限控制
   - 根據角色顯示/隱藏操作按鈕
   - 路由層級權限守衛

7. **測試**
   - 單元測試 (Jasmine + Karma)
   - E2E 測試 (Playwright)

### 9. 注意事項

#### 已知問題
- 專案整體存在一些 ESLint 錯誤（非本次變更造成）
- Bundle size 超過預算（專案整體問題）

#### 相容性
- ✅ 與現有 ng-alain 專案結構相容
- ✅ 遵循專案的 Standalone Components 模式
- ✅ 使用專案統一的 SHARED_IMPORTS

#### 擴展性
- 模組化設計便於未來擴展
- 型別定義完整，便於資料驗證
- 路由結構清晰，易於新增子功能

## 總結

此次實作成功建立了 Blueprint 和 Task 模塊的基礎架構，完全符合需求「先建立藍圖與任務模塊的最基本架構出來，方便日後無縫接上上下文切換器」。

**核心成果**:
- ✅ 完整的型別定義系統
- ✅ 模組化的路由結構
- ✅ 基於 @delon 的 UI 元件
- ✅ 預留充足的整合點
- ✅ 建置和執行無誤

**為上下文切換器準備的基礎**:
- 路由層級清晰 (blueprint → task)
- 狀態資訊完整 (status, priority)
- 導航結構完善 (列表 ↔ 詳情 ↔ 任務)

專案已準備好進入下一階段的資料層整合和上下文切換器功能實作。
