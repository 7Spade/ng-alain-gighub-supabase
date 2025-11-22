# 🏢 企業標準合規檢查文檔

> **目的**：提供完整的企業標準合規檢查清單，確保所有代碼、架構和流程符合企業級要求

**版本**：v1.0.0  
**最後更新**：2025-01-15  
**適用對象**：所有開發者、技術主管、架構師

---

## 📋 使用說明

### 何時使用？

- ✅ 新功能開發完成後
- ✅ 重大重構完成後
- ✅ PR 提交前
- ✅ 生產環境部署前
- ✅ 架構審查時
- ✅ 代碼審查時

### 如何使用？

1. **逐項檢查**：按照清單逐項檢查，確保所有項目都符合要求
2. **記錄結果**：記錄檢查結果（✅ 通過 / ⚠️ 警告 / ❌ 不合格）
3. **修復問題**：對於不合格或警告項目，立即修復
4. **重新檢查**：修復後重新檢查，確保問題已解決
5. **文檔記錄**：將檢查結果記錄在 PR 描述或架構文檔中

---

## 🔴 Level 0：強制執行程序（必須 100% 通過）

### 記憶庫查閱
- [ ] 已查閱專案記憶庫（`.github/copilot/memory.jsonl`）
- [ ] 已查詢與任務相關的實體
- [ ] 已理解相關的架構原則和模式
- [ ] 已遵循記憶庫中的開發標準
- [ ] 已查詢 "Five Layer Development Order" 實體

### 系統架構理解
- [ ] 已閱讀系統架構思維導圖（`docs/architecture/01-system-architecture-mindmap.mermaid.md`）
- [ ] 已理解當前任務在系統架構中的位置
- [ ] 已確認相關模組和依賴關係
- [ ] 已識別需要遵循的架構原則

### 啟動檢查清單
- [ ] 已完成 Agent 啟動檢查清單（`.github/agents/agent-startup-checklist.md`）
- [ ] 已確認任務範圍與目標
- [ ] 已規劃執行順序（遵循五層架構）
- [ ] 已閱讀相關文檔

### 開發順序指南（新功能開發必須）
- [ ] 已閱讀開發順序指南（`.github/agents/development-sequence-guide.md`）
- [ ] 已確認需要開發哪些層級
- [ ] 已理解每個層級的依賴關係
- [ ] 已理解每個層級的完成標準
- [ ] 已確認開發順序：Types → Repositories → Models → Services → Facades → Components → Tests

---

## 🟠 Level 1：核心開發原則（必須 100% 通過）

### 四大核心開發原則

#### 1. 常見做法（Best Practices）
- [ ] 遵循 Angular 20 官方最佳實踐
- [ ] 遵循 NG-ZORRO 組件使用規範
- [ ] 遵循 Supabase 使用最佳實踐
- [ ] 遵循 TypeScript 最佳實踐
- [ ] 參考官方文檔和示例代碼

#### 2. 企業標準（Enterprise Standards）
- [ ] **代碼結構清晰**：模組化、分層清晰、檔案組織合理
- [ ] **職責分離明確**：SRP 原則、每個類別只有一個改變的理由
- [ ] **錯誤處理完善**：所有 async 操作都有 try-catch、用戶友好的錯誤提示
- [ ] **狀態管理規範**：使用 Signals、避免全局狀態污染
- [ ] **測試覆蓋充分**：Service ≥80%、Facade ≥80%、關鍵邏輯 100%

#### 3. 符合邏輯（Logical Consistency）
- [ ] **數據流清晰**：資料流向明確、狀態更新可追蹤
- [ ] **命名語義化**：變數、函數、類別命名清晰易懂
- [ ] **條件判斷合理**：邏輯判斷清晰、沒有冗餘或矛盾
- [ ] **組件初始化順序正確**：依賴關係明確、初始化順序合理

#### 4. 符合常理（Common Sense）
- [ ] **功能真正可用**：不只是編譯通過，實際可用
- [ ] **用戶體驗優先**：考慮用戶使用情境、提供友善的互動
- [ ] **避免過度設計**：KISS 原則、YAGNI 原則
- [ ] **及時驗證**：開發過程中持續驗證功能正確性

---

## 🟡 Level 2：架構原則（必須 ≥90% 通過）

### 企業架構十大原則（SRP 核心）

#### 1. 單一職責原則（SRP）
- [ ] Component 只處理 UI 展示與用戶交互
- [ ] Service 只處理業務邏輯
- [ ] Repository 只處理資料存取
- [ ] Facade 只處理狀態與 UI 溝通
- [ ] Pipe 只處理數據轉換
- [ ] Directive 只處理 DOM 行為

#### 2. 封裝與界限（Clear Boundaries）
- [ ] 明確隔離不同層級（Routes → Shared → Core）
- [ ] 依賴方向正確（不可反向依賴）
- [ ] Facades → Services → Repositories → SupabaseService
- [ ] 沒有跨層直接調用

#### 3. 可組合性（Composability）
- [ ] 小而專注的 Component
- [ ] 小而單一的 Service
- [ ] 小而純粹的 Utility
- [ ] 可組合的 Signals

#### 4. 明確的依賴方向（Dependency Direction）
- [ ] 依賴方向從上到下
- [ ] 沒有循環依賴（使用 madge 檢查）
- [ ] Component → Facade → Service → Repository → SupabaseService
- [ ] Models ← Types

#### 5. 低耦合、高內聚（Low Coupling & High Cohesion）
- [ ] Feature 模組內部高內聚
- [ ] Feature 模組之間低耦合
- [ ] 通過 Facade 暴露接口
- [ ] 通過 Models 傳遞數據

#### 6. 可測試性（Testability）
- [ ] 小而乾淨的函數（易於測試）
- [ ] 低耦合（易於 mock）
- [ ] SRP（每個測試只驗證一件事）
- [ ] 分層架構（UI 與邏輯分離）

#### 7. 可維護性（Maintainability）
- [ ] 嚴格型別（TypeScript strict mode）
- [ ] 嚴格 lint（ESLint 規則）
- [ ] 嚴格架構規範（分層架構）
- [ ] 可閱讀的檔案結構
- [ ] 低複雜度的代碼

#### 8. 可替換性（Replaceability）
- [ ] Repository 模式（封裝資料存取）
- [ ] Service 模式（封裝業務邏輯）
- [ ] Facade 模式（統一對外接口）
- [ ] 依賴注入（inject() 函數）

#### 9. 漸進式演進（Incremental Evolution）
- [ ] NgModule → Standalone（漸進遷移）
- [ ] RxJS → Signals（逐步引入）
- [ ] 架構可部分重構

#### 10. 一致性（Consistency）
- [ ] 一致的程式碼風格（Prettier）
- [ ] 一致的 API 格式（RESTful）
- [ ] 一致的命名（語義化）
- [ ] 一致的 Component 架構
- [ ] 一致的錯誤處理
- [ ] 一致的 UX 行為

---

## 🟡 Level 2.5：開發順序合規（新功能開發必須 100% 通過）

> **詳細指南**：[development-sequence-guide.md](./development-sequence-guide.md) ⭐⭐⭐⭐⭐

### 開發前準備

#### 需求分析
- [ ] 明確功能需求（PRD、用戶故事）
- [ ] 確認業務流程和規則
- [ ] 識別相關的現有模組和依賴
- [ ] 評估複雜度和優先級
- [ ] 參考項目中已有的類似實現

#### 資料庫設計
- [ ] 設計資料表結構（對照 51 張表架構）
- [ ] 確認是否需要新增資料表
- [ ] 設計 RLS 策略（參考安全文檔）
- [ ] 準備資料庫遷移腳本
- [ ] 使用 Supabase MCP 工具驗證設計

#### 架構規劃
- [ ] 確認功能屬於哪個業務模組（11 個模組之一）
- [ ] 規劃需要哪些層級（Types、Repositories、Models、Services、Facades）
- [ ] 確認與現有模組的整合點
- [ ] 設計 API 介面（如需要）

### 五層架構開發順序（嚴格遵守）

#### 第 1 步：Types 層（P0 - 必須最先完成）
- [ ] 生成/更新 `database.types.ts`（如需要新表）
- [ ] 創建業務模組類型文件（如需要）
- [ ] 類型定義完整，與資料庫結構一致
- [ ] 類型已正確導出
- [ ] 通過 TypeScript 編譯檢查（`yarn type-check`）
- [ ] 無 `any` 類型（除非必要）

#### 第 2 步：Repositories 層（P0 - 依賴 Types）
- [ ] Repository 繼承自 `BaseRepository`
- [ ] `tableName` 已正確設置（snake_case）
- [ ] 類型參數正確（Entity, Insert, Update）
- [ ] 特定查詢方法已實現（如需要）
- [ ] Repository 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] 職責分離明確（只負責數據訪問）

#### 第 3 步：Models 層（P0 - 可與 Repositories 並行）
- [ ] Models 文件已創建
- [ ] 從 Types 層正確提取類型
- [ ] 業務相關枚舉和類型已定義
- [ ] Models 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] 模型定義完整，枚舉值明確

#### 第 4 步：Services 層（P0 - 依賴 Repositories + Models）
- [ ] Service 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 使用 Signals 管理狀態（`signal()`, `computed()`）
- [ ] 暴露 `ReadonlySignal` 給組件
- [ ] 業務邏輯方法已實現
- [ ] 錯誤處理已實現（try-catch，錯誤狀態管理）
- [ ] Loading 狀態管理已實現
- [ ] Service 已正確導出
- [ ] 測試覆蓋率 ≥80%

#### 第 5 步：Facades 層（P0 - 依賴 Services）
- [ ] Facade 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 協調多個 Services（如需要）
- [ ] 暴露統一的 Signal 狀態接口
- [ ] 整合錯誤處理（ErrorStateService）
- [ ] 業務方法已實現
- [ ] Facade 已正確導出
- [ ] 測試覆蓋率 ≥80%

#### 第 6 步：Routes/Components 層（P0 - 依賴 Facades）
- [ ] 組件使用 Standalone Component
- [ ] 使用 `SHARED_IMPORTS` 導入模組
- [ ] 使用 `inject()` 注入 Facade
- [ ] 從 Facade 獲取狀態（ReadonlySignal）
- [ ] 路由已配置（懶加載）
- [ ] UI/UX 符合設計規範
- [ ] 響應式設計已實現
- [ ] 可訪問性要求已滿足（WCAG 2.1 AA）

#### 第 7 步：測試與文檔（P0 - 必須完成）
- [ ] Service 測試已編寫（≥80% 覆蓋率）
- [ ] Facade 測試已編寫（≥80% 覆蓋率）
- [ ] 所有測試通過（`yarn test`）
- [ ] 文檔已更新（README、API 文檔、架構文檔）

---

## 🟢 Level 3：技術標準（必須 ≥85% 通過）

### Angular 開發標準

#### Standalone Components（必須）
- [ ] 所有 Component 使用 Standalone 模式
- [ ] 使用 `SHARED_IMPORTS` 導入共用模組
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 禁止新增 NgModule

#### Signals API（必須）
- [ ] 禁止使用 `@Input()`/`@Output()`/`@ViewChild()`
- [ ] 使用 `input()`/`output()`/`viewChild()` Signals API
- [ ] 狀態管理使用 `signal()`/`computed()`/`effect()`

#### 現代化語法（必須）
- [ ] 使用 `@if`/`@for`/`@switch`/`@defer`
- [ ] 禁止使用 `*ngIf`/`*ngFor`/`*ngSwitch`

#### OnPush 策略（必須）
- [ ] 所有 Component 必須使用 `OnPush` 策略
- [ ] 使用 Signals 或不可變資料觸發檢測
- [ ] 需要時使用 `ChangeDetectorRef.markForCheck()`

#### UI 元件優先級（必須）
- [ ] **優先 NG-ZORRO**：所有 UI 需求優先從 NG-ZORRO 選擇
- [ ] **次選 @delon/abc**：NG-ZORRO 無法滿足時使用
- [ ] **最後才自訂**：僅當前兩者都無法滿足
- [ ] **禁用原生 HTML**：不使用 `<input>`/`<select>`/`<button>`

### TypeScript 標準

#### Strict Mode（必須）
- [ ] 啟用所有 strict 選項
- [ ] `yarn type-check` 必須無錯誤
- [ ] 禁止使用 `any`（除非有充分理由並文件化）
- [ ] 使用 `unknown` 替代 `any`

#### 型別定義（必須）
- [ ] 所有函數參數和返回值都有明確型別
- [ ] 使用 Interface 定義資料結構
- [ ] 使用 Type Alias 定義聯合類型或複雜型別
- [ ] 使用 Enum 定義常量集合

### 五層架構開發順序（必須）

- [ ] **第 1 步：Types 層**（P0 - 必須最先）
  - [ ] 生成/更新 database.types.ts
  - [ ] 創建業務類型文件（如需要）
  - [ ] 通過 TypeScript 編譯檢查

- [ ] **第 2 步：Repositories 層**（P0 - 依賴 Types）
  - [ ] 繼承 BaseRepository
  - [ ] tableName 正確設置（snake_case）
  - [ ] 類型參數正確（Entity, Insert, Update）

- [ ] **第 3 步：Models 層**（P0 - 可與 Repositories 並行）
  - [ ] 從 Types 層正確提取類型
  - [ ] 業務相關枚舉和類型已定義

- [ ] **第 4 步：Services 層**（P0 - 依賴 Repositories + Models）
  - [ ] 使用 `@Injectable({ providedIn: 'root' })`
  - [ ] 使用 Signals 管理狀態
  - [ ] 暴露 ReadonlySignal 給組件
  - [ ] 錯誤處理已實現

- [ ] **第 5 步：Facades 層**（P0 - 依賴 Services）
  - [ ] 協調多個 Services
  - [ ] 提供統一接口給 Components
  - [ ] 使用 Signals 管理 UI 狀態
  - [ ] 錯誤處理完善（用戶友好的錯誤訊息）

- [ ] **第 6 步：Routes/Components 層**（P0 - 依賴 Facades）
  - [ ] 使用 Standalone Component
  - [ ] 從 Facade 獲取狀態
  - [ ] 調用 Facade 方法處理用戶交互
  - [ ] 響應式設計已實現

- [ ] **第 7 步：測試與文檔**（P0 - 必須完成）
  - [ ] Service 層單元測試（覆蓋率 ≥80%）
  - [ ] Facade 層單元測試（覆蓋率 ≥80%）
  - [ ] 更新相關文檔

---

## 🔵 Level 4：安全與效能（必須 ≥80% 通過）

### 安全標準

#### 身份認證與授權
- [ ] 所有資料表設定 Supabase RLS Policy
- [ ] 前端僅透過 `@delon/auth TokenService` 存取 token
- [ ] 禁止在程式碼中硬編碼 API key 或憑證
- [ ] 使用 Supabase Auth 進行身份驗證

#### 資料保護
- [ ] 敏感資料加密儲存
- [ ] 使用 HTTPS 傳輸
- [ ] 防止 XSS 攻擊（使用 DomSanitizer）
- [ ] 防止 CSRF 攻擊
- [ ] 防止 SQL Injection（使用參數化查詢）

#### 權限控制
- [ ] RLS 策略完整覆蓋
- [ ] 前端 ACL 權限檢查
- [ ] 分支權限規則正確（Owner/Collaborator/Viewer）

### 效能標準

#### Core Web Vitals
- [ ] LCP < 2.5s（最大內容繪製）
- [ ] INP < 200ms（互動至下一次繪製）
- [ ] CLS < 0.1（累計版面配置轉移）

#### Bundle 優化
- [ ] 任何 chunk > 150KB 必須切分或延後載入
- [ ] 使用 Lazy Loading
- [ ] 使用 `@defer` 延後載入非關鍵元件

#### 資料抓取
- [ ] 避免 `select('*')`
- [ ] 列表使用分頁或虛擬滾動
- [ ] 共用快取透過 signals/computed 管理

#### 變更檢測
- [ ] 預設 `OnPush`
- [ ] 列表使用 `track item.id`
- [ ] 模板不得呼叫昂貴函數

---

## 🔍 Level 5：代碼品質（必須 ≥80% 通過）

### Lint 與格式化
- [ ] `yarn lint` 通過
- [ ] `yarn lint:style` 通過
- [ ] `yarn format` 通過
- [ ] 無 ESLint 警告
- [ ] 無 Stylelint 警告

### 測試覆蓋率
- [ ] 單元測試覆蓋率 ≥ 80%
- [ ] Service 測試覆蓋率 ≥ 90%
- [ ] 關鍵業務邏輯 = 100%
- [ ] 所有測試通過
- [ ] 無測試警告

### 代碼複雜度
- [ ] 函數長度 < 50 行
- [ ] 函數參數 < 5 個
- [ ] 嵌套深度 < 4 層
- [ ] 循環複雜度 < 10

### 命名規範
- [ ] camelCase：函數、變數
- [ ] PascalCase：類別、介面、型別
- [ ] kebab-case：檔案名稱、CSS 類別
- [ ] UPPER_SNAKE_CASE：常量

---

## 📊 合規評分

### 評分標準

| 級別 | 要求 | 權重 | 說明 |
|------|------|------|------|
| Level 0 | 100% | 20% | 強制執行程序（必須全部通過） |
| Level 1 | 100% | 25% | 核心開發原則（必須全部通過） |
| Level 2 | ≥90% | 20% | 架構原則（允許少數例外） |
| Level 3 | ≥85% | 20% | 技術標準（允許部分例外） |
| Level 4 | ≥80% | 10% | 安全與效能（允許部分例外） |
| Level 5 | ≥80% | 5% | 代碼品質（允許部分例外） |

### 總分計算

```
總分 = Level0 × 20% + Level1 × 25% + Level2 × 20% + Level3 × 20% + Level4 × 10% + Level5 × 5%
```

### 合格標準

- ✅ **優秀**：總分 ≥ 95%（Level 0-1 必須 100%，其他 ≥90%）
- ✅ **良好**：總分 ≥ 90%（Level 0-1 必須 100%，其他 ≥85%）
- ✅ **合格**：總分 ≥ 85%（Level 0-1 必須 100%，其他 ≥80%）
- ⚠️ **需改進**：總分 < 85%（需要重新檢查和改進）
- ❌ **不合格**：Level 0-1 任一項未 100%（必須立即修復）

---

## 📝 檢查記錄範本

### 基本資訊
```yaml
檢查日期: YYYY-MM-DD
檢查者: [姓名]
專案/模組: [專案名稱]
PR 編號: #[PR 編號]
```

### 檢查結果
```yaml
Level 0（強制執行程序）: [  ]% ([ ]/[ ]項通過)
Level 1（核心開發原則）: [  ]% ([ ]/[ ]項通過)
Level 2（架構原則）: [  ]% ([ ]/[ ]項通過)
Level 3（技術標準）: [  ]% ([ ]/[ ]項通過)
Level 4（安全與效能）: [  ]% ([ ]/[ ]項通過)
Level 5（代碼品質）: [  ]% ([ ]/[ ]項通過)

總分: [  ]%
評級: [優秀/良好/合格/需改進/不合格]
```

### 不合格項目
```yaml
不合格項目:
1. [描述]
   - 影響: [高/中/低]
   - 修復計劃: [描述]
   - 預計完成: YYYY-MM-DD

2. [描述]
   - 影響: [高/中/低]
   - 修復計劃: [描述]
   - 預計完成: YYYY-MM-DD
```

### 備註
```
[其他需要說明的事項]
```

---

## 🔗 相關資源

### 核心文檔
- [agent-startup-checklist.md](./agent-startup-checklist.md) - Agent 啟動檢查清單
- [memory-usage-guide.md](./memory-usage-guide.md) - 記憶庫使用指南
- [.github/copilot/memory.jsonl](../copilot/memory.jsonl) - 專案記憶庫

### 架構與規範
- [docs/architecture/01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構思維導圖
- [docs/20-完整架構流程圖.mermaid.md](../../docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型
- [docs/21-架構審查報告.md](../../docs/21-架構審查報告.md) - 架構審查報告（100/100 分）

### 開發規範
- [docs/00-Component規範.md](../../docs/00-Component規範.md) - Angular 組件規範
- [docs/00-代碼質量規範.md](../../docs/00-代碼質量規範.md) - 代碼質量規範
- [docs/00-安全規範.md](../../docs/00-安全規範.md) - 安全規範
- [docs/42-開發最佳實踐指南.md](../../docs/42-開發最佳實踐指南.md) - 開發最佳實踐

---

**最後更新**：2025-01-15  
**版本**：v1.0.0  
**維護者**：開發團隊
