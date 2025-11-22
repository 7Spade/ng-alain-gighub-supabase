# MCP 工具工作流程指南

> **目的**：提供 Sequential Thinking 和 Software Planning Tool 的標準使用流程，確保所有 GitHub Copilot Agents 正確且常態化使用這些工具

**版本**：v1.0.0  
**最後更新**：2025-11-21  
**適用對象**：所有 GitHub Copilot Agents

---

## 🎯 為什麼必須使用這些工具？

### Sequential Thinking Tool
- ✅ **結構化思考**：將複雜問題拆解為清晰的思考步驟
- ✅ **決策記錄**：記錄思考過程和決策理由，便於後續審查
- ✅ **風險識別**：系統化識別潛在問題和挑戰
- ✅ **可行性驗證**：在開始開發前驗證解決方案的可行性
- ✅ **知識積累**：將思考過程記錄下來，成為專案知識庫的一部分

### Software Planning Tool
- ✅ **計畫管理**：創建可追蹤、可更新的執行計畫
- ✅ **任務分解**：將大任務分解為具體的、可執行的子任務
- ✅ **進度追蹤**：隨時掌握任務完成狀態
- ✅ **複雜度評估**：對每個子任務進行複雜度評分，便於時間估算
- ✅ **團隊協作**：提供清晰的任務列表，便於交接和協作

---

## 📋 標準工作流程

### 階段 1：任務分析（使用 Sequential Thinking）

#### 步驟 1：理解問題本質
```typescript
// Thought 1/N: 理解問題
sequentialthinking({
  thought: `
    問題描述：${任務描述}
    核心目標：${要達成什麼}
    背景資訊：${相關背景}
    約束條件：${技術/時間/資源限制}
  `,
  thoughtNumber: 1,
  totalThoughts: 7,  // 初始估計，可調整
  nextThoughtNeeded: true
})
```

#### 步驟 2：查閱記憶庫和架構
```typescript
// Thought 2/N: 查閱專案知識
sequentialthinking({
  thought: `
    記憶庫查詢結果：
    - 查詢實體：${相關實體名稱}
    - 關鍵發現：${從記憶庫學到什麼}
    - 相關規範：${需要遵循的規範}
    
    架構分析：
    - 涉及模組：${系統架構中的哪些模組}
    - 依賴關係：${與其他模組的關係}
    - 架構原則：${需要遵循的架構原則}
  `,
  thoughtNumber: 2,
  totalThoughts: 7,
  nextThoughtNeeded: true
})
```

#### 步驟 3：分析架構影響
```typescript
// Thought 3/N: 架構層級分析
sequentialthinking({
  thought: `
    五層架構影響分析：
    1. Types 層：${是否需要新增/修改類型}
    2. Repositories 層：${是否需要新增/修改 Repository}
    3. Models 層：${是否需要新增/修改 Model}
    4. Services 層：${是否需要新增/修改 Service}
    5. Facades 層：${是否需要新增/修改 Facade}
    6. Components 層：${是否需要新增/修改 Component}
    
    依賴關係：${各層之間的依賴}
    開發順序：${按照五層架構的開發順序}
  `,
  thoughtNumber: 3,
  totalThoughts: 7,
  nextThoughtNeeded: true
})
```

#### 步驟 4：識別技術挑戰
```typescript
// Thought 4/N: 技術挑戰識別
sequentialthinking({
  thought: `
    技術挑戰：
    1. ${挑戰1}：${具體描述和潛在影響}
    2. ${挑戰2}：${具體描述和潛在影響}
    
    解決方案：
    1. ${挑戰1的解決方案}
    2. ${挑戰2的解決方案}
    
    需要的技術調研：${是否需要查閱官方文檔或範例}
  `,
  thoughtNumber: 4,
  totalThoughts: 7,
  nextThoughtNeeded: true
})
```

#### 步驟 5：風險評估
```typescript
// Thought 5/N: 風險評估
sequentialthinking({
  thought: `
    潛在風險：
    1. 技術風險：${技術實現的不確定性}
    2. 架構風險：${對現有架構的影響}
    3. 安全風險：${安全相關的問題}
    4. 效能風險：${可能的效能問題}
    5. 測試風險：${測試難度和覆蓋率}
    
    風險應對：
    - 高風險項目：${如何降低風險}
    - 替代方案：${是否有備用方案}
    - 驗證方法：${如何驗證風險已被解決}
  `,
  thoughtNumber: 5,
  totalThoughts: 7,
  nextThoughtNeeded: true
})
```

#### 步驟 6：驗證可行性
```typescript
// Thought 6/N: 可行性驗證
sequentialthinking({
  thought: `
    可行性檢查：
    ✅ 符合五層架構開發順序
    ✅ 符合 SRP 原則
    ✅ 符合四大核心開發原則
    ✅ 有完整的錯誤處理
    ✅ 測試覆蓋率可達標
    ✅ 不違反禁止事項
    
    技術可行性：${技術上是否可實現}
    時間可行性：${時間估算是否合理}
    資源可行性：${所需資源是否可用}
  `,
  thoughtNumber: 6,
  totalThoughts: 7,
  nextThoughtNeeded: true
})
```

#### 步驟 7：總結決策
```typescript
// Thought 7/7: 決策總結
sequentialthinking({
  thought: `
    最終決策：
    - 實現方案：${選擇的實現方案}
    - 關鍵決策：${為什麼選擇這個方案}
    - 預期結果：${完成後應該達到什麼狀態}
    
    下一步：開始使用 Software Planning Tool 創建執行計畫
  `,
  thoughtNumber: 7,
  totalThoughts: 7,
  nextThoughtNeeded: false  // 思考完成
})
```

---

### 階段 2：計畫制定（使用 Software Planning Tool）

#### 步驟 1：開始規劃會話
```typescript
start_planning({
  goal: "基於 Sequential Thinking 的分析結果，描述任務目標"
})
```

#### 步驟 2：創建任務列表

**按照五層架構順序創建 todos**：

```typescript
// 第 1 步：Types 層
add_todo({
  title: "第1步：Types 層 - 類型定義",
  description: `
    任務內容：
    - 生成/更新 database.types.ts（如需要）
    - 創建業務類型文件（如需要）
    - 定義介面和枚舉
    
    參考文檔：
    - docs/22-完整SQL表結構定義.md
    - 記憶庫實體：Database Schema
    
    完成標準：
    - ✅ TypeScript 編譯通過
    - ✅ 類型定義完整
    - ✅ 已正確導出
  `,
  complexity: 2,  // 0-10 評分
  codeExample: `
    // 範例代碼
    export interface ${TypeName} {
      id: string;
      // ...
    }
  `
})

// 第 2 步：Repositories 層
add_todo({
  title: "第2步：Repositories 層 - 資料存取",
  description: `
    任務內容：
    - 創建 Repository（繼承 BaseRepository）
    - 實現特定查詢方法（如需要）
    - 配置 tableName 和類型參數
    
    參考文檔：
    - 記憶庫實體：Repository Pattern
    - 現有 Repository 範例
    
    完成標準：
    - ✅ 繼承自 BaseRepository
    - ✅ 基本 CRUD 可用
    - ✅ TypeScript 編譯通過
  `,
  complexity: 4,
  codeExample: `
    @Injectable({ providedIn: 'root' })
    export class ${Name}Repository extends BaseRepository<
      ${Entity},
      ${Insert},
      ${Update}
    > {
      protected override tableName = '${table_name}';
    }
  `
})

// 第 3 步：Models 層（可與 Repositories 並行）
add_todo({
  title: "第3步：Models 層 - 業務模型",
  description: `
    任務內容：
    - 定義業務模型介面
    - 定義業務相關枚舉
    - 創建輔助類型
    
    參考文檔：
    - 記憶庫實體：Domain Model Pattern
    
    完成標準：
    - ✅ 模型定義完整
    - ✅ 枚舉值明確
    - ✅ TypeScript 編譯通過
  `,
  complexity: 3,
  codeExample: `
    export interface ${ModelName} {
      // 業務模型定義
    }
    
    export enum ${EnumName} {
      // 枚舉值
    }
  `
})

// 第 4 步：Services 層
add_todo({
  title: "第4步：Services 層 - 業務邏輯",
  description: `
    任務內容：
    - 創建 Service 實現業務邏輯
    - 使用 Signals 管理狀態
    - 實現錯誤處理
    - 整合相關 Repositories
    
    參考文檔：
    - 記憶庫實體：Service Pattern, Signals API
    - docs/42-開發最佳實踐指南.md
    
    完成標準：
    - ✅ 使用 @Injectable({ providedIn: 'root' })
    - ✅ 使用 inject() 依賴注入
    - ✅ 使用 Signals 管理狀態
    - ✅ 完整的錯誤處理
    - ✅ 單元測試覆蓋率 ≥80%
  `,
  complexity: 7,
  codeExample: `
    @Injectable({ providedIn: 'root' })
    export class ${Name}Service {
      private repository = inject(${Name}Repository);
      
      private _items = signal<${Type}[]>([]);
      readonly items = this._items.asReadonly();
      
      private _loading = signal(false);
      readonly loading = this._loading.asReadonly();
      
      async loadItems() {
        this._loading.set(true);
        try {
          const data = await this.repository.findAll();
          this._items.set(data);
        } catch (error) {
          // 錯誤處理
        } finally {
          this._loading.set(false);
        }
      }
    }
  `
})

// 第 5 步：Facades 層
add_todo({
  title: "第5步：Facades 層 - UI 狀態管理",
  description: `
    任務內容：
    - 創建 Facade 協調 Services
    - 提供統一的 UI 介面
    - 處理 UI 友善的錯誤訊息
    - 管理 UI 狀態
    
    參考文檔：
    - 記憶庫實體：Facade Pattern
    - docs/42-開發最佳實踐指南.md
    
    完成標準：
    - ✅ 協調多個 Services
    - ✅ 提供 ReadonlySignal 給組件
    - ✅ 錯誤訊息用戶友善
    - ✅ 完整的 loading 狀態
    - ✅ 單元測試覆蓋率 ≥80%
  `,
  complexity: 6,
  codeExample: `
    @Injectable({ providedIn: 'root' })
    export class ${Name}Facade {
      private service = inject(${Name}Service);
      
      readonly items = this.service.items;
      readonly loading = this.service.loading;
      
      async load() {
        try {
          await this.service.loadItems();
        } catch (error) {
          // 轉換為用戶友善的錯誤訊息
          throw new Error('載入失敗，請稍後再試');
        }
      }
    }
  `
})

// 第 6 步：Routes/Components 層
add_todo({
  title: "第6步：Components 層 - UI 實現",
  description: `
    任務內容：
    - 創建 Standalone Component
    - 使用 NG-ZORRO 元件
    - 使用 OnPush 策略
    - 使用新版控制流語法（@if, @for）
    - 整合 Facade
    
    參考文檔：
    - 記憶庫實體：UI Component Priority, OnPush Strategy
    - docs/37-SHARED_IMPORTS-使用指南.md
    - domain/angular-agent.md
    
    完成標準：
    - ✅ Standalone Component
    - ✅ 使用 SHARED_IMPORTS
    - ✅ OnPush 策略
    - ✅ 使用 @if, @for 語法
    - ✅ 只從 Facade 獲取狀態
    - ✅ 響應式設計
    - ✅ 無障礙功能（ARIA）
  `,
  complexity: 8,
  codeExample: `
    @Component({
      selector: 'app-${name}',
      standalone: true,
      imports: [SHARED_IMPORTS],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: \`
        @if (loading()) {
          <nz-spin />
        } @else {
          @for (item of items(); track item.id) {
            <div>{{ item.name }}</div>
          }
        }
      \`
    })
    export class ${Name}Component {
      private facade = inject(${Name}Facade);
      
      items = this.facade.items;
      loading = this.facade.loading;
      
      ngOnInit() {
        this.facade.load();
      }
    }
  `
})

// 第 7 步：測試與文檔
add_todo({
  title: "第7步：測試與文檔",
  description: `
    任務內容：
    - 編寫 Service 單元測試（覆蓋率 ≥80%）
    - 編寫 Facade 單元測試（覆蓋率 ≥80%）
    - 編寫 Component 測試（建議）
    - 編寫 E2E 測試（關鍵流程）
    - 更新相關文檔
    
    參考文檔：
    - domain/testing-agent.md
    - 記憶庫實體：Testing Strategy
    
    完成標準：
    - ✅ Service 測試覆蓋率 ≥80%
    - ✅ Facade 測試覆蓋率 ≥80%
    - ✅ 所有測試通過
    - ✅ 文檔已更新
  `,
  complexity: 7,
  codeExample: `
    describe('${Name}Service', () => {
      it('should load items', async () => {
        // 測試代碼
      });
      
      it('should handle errors', async () => {
        // 錯誤處理測試
      });
    });
  `
})
```

#### 步驟 3：保存完整計畫
```typescript
save_plan({
  plan: `
# ${任務名稱} 實作計畫

## 目標
${基於 Sequential Thinking 的任務目標}

## 總時間估算
- Types 層：${X}h
- Repositories 層：${X}h
- Models 層：${X}h
- Services 層：${X}h
- Facades 層：${X}h
- Components 層：${X}h
- 測試與文檔：${X}h
- **總計：${總計}h**

## 風險評估
${從 Sequential Thinking 中提取的風險}
1. ${風險1}：${應對策略}
2. ${風險2}：${應對策略}

## 技術決策
${從 Sequential Thinking 中提取的關鍵決策}
- 決策1：${理由}
- 決策2：${理由}

## 驗證標準
- ✅ TypeScript 編譯通過（yarn type-check）
- ✅ ESLint 檢查通過（yarn lint）
- ✅ Stylelint 檢查通過（yarn lint:style）
- ✅ 單元測試通過（yarn test）
- ✅ 測試覆蓋率 ≥80%（Service、Facade）
- ✅ 生產構建成功（yarn build）
- ✅ 無控制台錯誤
- ✅ 符合企業標準

## 參考資源
- 記憶庫實體：${相關實體列表}
- 文檔：${相關文檔列表}
- 範例代碼：${現有類似實現}
  `
})
```

---

### 階段 3：執行與追蹤

#### 執行過程中持續更新狀態
```typescript
// 完成一個 todo 時
update_todo_status({
  todoId: "todo-id-from-get-todos",
  isComplete: true
})

// 隨時查看所有任務狀態
get_todos()
```

#### 遇到新問題時
如果在執行過程中遇到新的複雜問題或需要做重大決策：

1. **暫停當前任務**
2. **再次使用 Sequential Thinking** 分析新問題
3. **更新 Software Planning** 中的相關 todos
4. **繼續執行**

```typescript
// 範例：發現需要額外的 Service
add_todo({
  title: "額外任務：創建 ${AdditionalService}",
  description: "在執行過程中發現需要...",
  complexity: 5
})
```

---

## 📊 工具使用檢查清單

### Sequential Thinking 檢查清單
- [ ] 是否清楚描述了問題本質？
- [ ] 是否查閱了記憶庫和架構文檔？
- [ ] 是否分析了對五層架構的影響？
- [ ] 是否識別了技術挑戰和解決方案？
- [ ] 是否進行了風險評估？
- [ ] 是否驗證了可行性？
- [ ] 是否記錄了關鍵決策和理由？
- [ ] 思考過程是否邏輯清晰、有條理？

### Software Planning 檢查清單
- [ ] 是否創建了規劃會話（start_planning）？
- [ ] 是否按五層架構順序創建了 todos？
- [ ] 每個 todo 是否包含：
  - [ ] 清晰的標題和描述？
  - [ ] 合理的複雜度評分（0-10）？
  - [ ] 具體的代碼範例？
  - [ ] 參考文檔？
  - [ ] 完成標準？
- [ ] 是否保存了完整計畫（save_plan）？
- [ ] 計畫是否包含：
  - [ ] 明確的目標？
  - [ ] 時間估算？
  - [ ] 風險評估？
  - [ ] 驗證標準？
- [ ] 是否在執行過程中更新 todo 狀態？

---

## 🎯 最佳實踐

### Do's ✅

1. **每次任務都使用工具**
   - 不要因為任務看起來簡單就跳過
   - 養成習慣，讓工具使用成為標準流程

2. **認真思考，不要流於形式**
   - Sequential Thinking 要真正分析問題
   - Software Planning 要創建可執行的計畫

3. **記錄完整**
   - 保存工具輸出用於文檔
   - 記錄關鍵決策和理由

4. **持續更新**
   - 執行過程中更新 todo 狀態
   - 遇到問題再次使用工具

5. **與記憶庫結合**
   - 在 Sequential Thinking 中引用記憶庫實體
   - 在 Software Planning 中參考記憶庫知識

### Don'ts ❌

1. **不要跳過工具使用**
   - 即使是小任務也要走流程
   - 不要想當然地開始開發

2. **不要敷衍了事**
   - 不要寫幾句話就結束 Sequential Thinking
   - 不要創建空洞的計畫

3. **不要忘記更新**
   - 不要創建計畫後就忘記
   - 不要完成任務後不標記狀態

4. **不要孤立使用**
   - 不要忽略記憶庫知識
   - 不要忽略架構文檔

---

## 📝 範例：完整工作流程

**任務**：實作用戶個人資料編輯功能

### 1. Sequential Thinking 輸出範例

```
Thought 1/7: 理解問題
問題：實作用戶個人資料編輯功能
目標：允許用戶更新個人資料（姓名、頭像、簡介等）
涉及：身份認證層、用戶管理模組

Thought 2/7: 查閱知識
記憶庫查詢：
- "User Profile Management"
- "Supabase Storage for Avatars"
- "Form Validation Patterns"
關鍵發現：
- 頭像上傳需使用 Supabase Storage
- 需要 RLS 策略確保用戶只能編輯自己的資料
- 表單驗證需遵循 NG-ZORRO 規範

Thought 3/7: 架構分析
涉及層級：
1. Types 層：UserProfile 類型已存在
2. Repositories 層：UserRepository 已存在，需新增 updateProfile 方法
3. Services 層：需新建 ProfileService
4. Facades 層：需新建 ProfileFacade
5. Components 層：需新建 ProfileEditComponent

Thought 4/7: 技術挑戰
1. 頭像上傳：需整合 Supabase Storage API
2. 表單驗證：需使用 NG-ZORRO Form + Reactive Forms
3. 樂觀更新：編輯時本地更新，保存失敗時回滾

Thought 5/7: 風險評估
1. 安全風險：RLS 策略必須正確，防止用戶修改他人資料
2. 效能風險：頭像上傳可能較慢，需顯示進度
3. UX 風險：保存失敗時需友善提示

Thought 6/7: 可行性驗證
✅ 符合五層架構
✅ 有現有範例可參考（AvatarUploadComponent）
✅ NG-ZORRO 提供所需的表單元件
✅ Supabase Storage API 完整

Thought 7/7: 決策總結
實現方案：使用 ProfileService + ProfileFacade + ProfileEditComponent
頭像上傳：整合 Supabase Storage，顯示上傳進度
表單驗證：使用 NG-ZORRO nz-form + ReactiveFormsModule
```

### 2. Software Planning 輸出範例

```yaml
goal: "實作用戶個人資料編輯功能"

todos:
  - Types 層（已存在，跳過）
  
  - Repositories 層：
    title: "第1步：UserRepository - 新增 updateProfile"
    complexity: 3
    
  - Services 層：
    title: "第2步：ProfileService - 個人資料管理"
    complexity: 7
    
  - Facades 層：
    title: "第3步：ProfileFacade - UI 狀態管理"
    complexity: 6
    
  - Components 層：
    title: "第4步：ProfileEditComponent - 編輯表單"
    complexity: 8
    
  - 測試與文檔：
    title: "第5步：測試與文檔"
    complexity: 6

總時間估算：30 小時

風險應對：
1. RLS 策略：先在 Supabase Dashboard 驗證
2. 頭像上傳：使用 nz-upload 顯示進度
3. 錯誤處理：使用 NzMessageService 顯示友善訊息
```

---

## 🔗 相關資源

- [agent-startup-checklist.md](./agent-startup-checklist.md) - 完整啟動檢查清單
- [ng-alain-github-agent.md](./ng-alain-github-agent.md) - 主 Agent 配置
- [development-sequence-guide.md](./development-sequence-guide.md) - 五層架構開發指南
- [memory.jsonl](../copilot/memory.jsonl) - 專案記憶庫

---

**最後更新**：2025-11-21  
**版本**：v1.0.0  
**維護者**：開發團隊
