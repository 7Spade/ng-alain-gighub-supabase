# 🚀 Agent 啟動檢查清單

> **目的**：確保每個 GitHub Copilot Agent 在執行任務前都遵循企業標準流程，並充分利用專案知識庫

**版本**：v2.0.0 - 增加 MCP 工具強制使用機制  
**最後更新**：2025-11-21  
**適用對象**：所有 GitHub Copilot Agents

---

## ⚠️ 強制執行項目（每次任務開始前）

### 🔴 第 0 步：連接 Redis 外掛大腦（絕對必須）⭐⭐⭐⭐⭐

**工具**：Redis MCP Server  
**詳細指南**：[redis-external-brain-guide.md](./redis-external-brain-guide.md) ⭐⭐⭐⭐⭐

**⚠️ Redis 是 Agent 的外掛大腦，負責長期記憶、知識累積與持續成長**

#### A. 載入長期記憶（Recall from External Brain）
```bash
# 1. 載入使用者偏好
redis-cli MGET user:preferences:code_style user:preferences:ui user:preferences:workflow

# 2. 載入專案知識
redis-cli MGET project:knowledge:architecture project:knowledge:api_conventions project:knowledge:naming

# 3. 載入歷史決策（類似任務）
redis-cli KEYS history:decisions:*

# 4. 載入模式與慣例
redis-cli MGET patterns:repository patterns:service patterns:component

# 5. 載入常見錯誤與修正
redis-cli GET errors:common

# 6. 載入統計數據
redis-cli MGET stats:tasks stats:tool_usage stats:code_quality
```

**必須確認**：
- [ ] 是否已連接 Redis？
- [ ] 是否載入了使用者偏好？
- [ ] 是否載入了專案知識？
- [ ] 是否載入了相關的歷史決策？
- [ ] 是否載入了模式和慣例？

#### B. 記錄當前任務（Observation）
```bash
# 記錄新任務到 Redis
redis-cli SET history:tasks:$(date +%Y%m%dT%H%M%S) '{
  "description": "任務描述",
  "context": "任務上下文",
  "timestamp": "$(date -Iseconds)"
}'

# 更新統計
redis-cli INCR stats:tasks:total
```

**完整 Redis 使用流程**：
1. **載入記憶** → 從 Redis 讀取所有相關知識
2. **任務推論** → 結合 Redis 記憶 + 當前上下文
3. **更新知識** → 將新發現寫回 Redis
4. **持續成長** → 每次任務都讓 Agent 更聰明

---

### 🧠 第 1 步：查閱專案記憶庫（必須）

**位置**：[.github/copilot/memory.jsonl](../copilot/memory.jsonl)

```
✓ 打開記憶庫文件
✓ 搜尋與當前任務相關的實體（entities）
✓ 檢查相關關係（relations）
✓ 記錄關鍵發現
```

**記憶庫包含**（v4.0 - 149 實體 + 170 關係）：
- 📐 架構設計原則（Git-like Branch Model、51 張資料表、五層架構）
- 🛡️ 安全與權限規範（RLS 策略、認證流程、分支權限規則）
- 📝 開發標準（SOLID、DRY、KISS、四大核心開發原則）
- 🚀 效能優化（OnPush 策略、Lazy Loading、Bundle 優化）
- 🧪 測試策略（單元測試、E2E 測試、覆蓋率要求）
- 📚 文檔結構（232 個文檔的組織架構和閱讀路徑）

**如何使用**：
```bash
# 快速搜尋相關實體
grep -i "關鍵字" .github/copilot/memory.jsonl

# 或使用 jq 查詢
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("關鍵字"))'
```

**常見查詢範例**：
- 開發新功能 → 搜尋 "Five Layer Development Order", "Repository Pattern", "Security Best Practices"
- 代碼審查 → 搜尋 "Code Review Standards", "Four Core Development Principles", "Testing Strategy"
- 架構設計 → 搜尋 "Git-like Branch Model", "Five Layer Architecture", "Dependency Direction"
- UI 開發 → 搜尋 "UI Component Priority", "OnPush Strategy", "NG-ZORRO"

---

### 🗺️ 第 2 步：檢查系統架構思維導圖（必須）

**位置**：[docs/architecture/01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md)

```
✓ 打開系統架構思維導圖
✓ 理解系統整體架構
✓ 確認當前任務在架構中的位置
✓ 識別相關模組和依賴關係
```

**架構思維導圖包含**：
- 🔐 身份認證層（Supabase Auth、帳戶系統、組織管理）
- 🔒 權限控制層（RLS Policies、角色系統、權限矩陣）
- 🎯 專案藍圖層（Git-like 分支模型、主分支、組織分支、PR 機制）
- 📋 任務執行模組（任務管理、暫存區、品質驗收、進度儀表板）
- ⚠️ 異常處理模組（問題追蹤、跨分支同步）
- 💬 協作溝通模組（討論區、通知中心、待辦中心）
- 📊 資料分析模組（文件管理、活動記錄、數據分析）
- ⚙️ 系統管理模組（系統設定、功能開關、機器人系統）
- ⚡ Supabase 核心服務（Database、Storage、Realtime、Edge Functions、RLS）

**關鍵問題**：
1. 我的任務涉及哪些模組？
2. 需要與哪些其他模組互動？
3. 有哪些依賴關係？
4. 需要遵循哪些架構原則？

---

### 📚 第 3 步：閱讀相關文檔（視任務而定）

**核心文檔**（⭐⭐⭐⭐⭐ 必讀）：
```
✓ docs/20-完整架構流程圖.mermaid.md - Git-like 分支模型
✓ docs/21-架構審查報告.md - 生產就緒版架構（100/100 分）
✓ docs/22-完整SQL表結構定義.md - 51 張表結構
✓ docs/37-SHARED_IMPORTS-使用指南.md - 共用模組規範
✓ docs/42-開發最佳實踐指南.md - 代碼示例與最佳實踐
```

**根據任務類型選擇**：
- **前端開發** → docs/00-Component規範.md, docs/38-ng-zorro-antd-組件清單與CLI指令.md
- **後端開發** → docs/00-API規範.md, docs/50-RLS策略開發指南.md
- **測試開發** → docs/00-測試規範.md, docs/測試策略.md
- **安全相關** → docs/00-安全規範.md, docs/51-Edge-Function開發指南.md

**文檔索引**：[docs/README.md](../../docs/README.md)

---

### 🎯 第 4 步：使用 Sequential Thinking 分析任務（必須）⭐⭐⭐⭐⭐

**工具**：`sequential-thinking` MCP Tool

**使用時機**：**每次任務開始前必須使用（在載入 Redis 記憶後）**

**⚠️ 重要：Sequential Thinking 必須結合 Redis 外掛大腦的記憶進行推論**

```
✓ 啟動 Sequential Thinking Tool
✓ 結合 Redis 載入的使用者偏好進行分析
✓ 參考 Redis 中的專案知識和歷史決策
✓ 拆解任務步驟與依賴關係
✓ 識別潛在風險與挑戰（參考 Redis 常見錯誤）
✓ 驗證解決方案可行性（基於 Redis 統計數據）
✓ 記錄思考過程與決策理由
```

**Sequential Thinking 使用範例（結合 Redis 外掛大腦）**：
```typescript
// Thought 1/7: 載入 Redis 外掛大腦記憶
// 從 Redis 載入：
// - user:preferences:code_style (使用者代碼風格偏好)
// - project:knowledge:auth (專案認證方式)
// - history:decisions:* (類似登入功能的歷史決策)
// - patterns:service (Service 層模式)
// - errors:common (常見的認證錯誤)

// Thought 2/7: 理解問題本質（基於 Redis 知識）
// 任務：實作用戶登入功能
// 核心問題：需要整合 Supabase Auth + @delon/auth TokenService
// 涉及模組：身份認證層、權限控制層
// Redis 顯示：過去類似任務使用相同架構，成功率 95%

// Thought 3/7: 檢查記憶庫和 Redis
// memory.jsonl 查詢關鍵實體：
// - "Supabase Auth Integration" 
// - "Delon Auth Token Management"
// Redis 顯示：
// - project:knowledge:auth = "Supabase Auth + @delon/auth"
// - patterns:auth_flow = "signIn → TokenService → routing"

// Thought 4/7: 分析架構影響（基於 Redis 模式）
// 需要修改的層級（遵循 Redis patterns:*）：
// 1. Types 層：定義 AuthUser 類型
// 2. Services 層：AuthService 整合 Supabase
// 3. Facades 層：AuthFacade 提供 UI 介面
// 4. Components 層：LoginComponent
// Redis 統計：類似任務平均時間 4.5 小時

// Thought 5/7: 識別風險（參考 Redis errors:common）
// - Supabase session 刷新機制
// - Token 過期處理
// - RLS 策略是否正確配置
// - 路由守衛設定
// Redis 顯示：errors:common:forgot_rls_check 發生過 3 次

// Thought 6/7: 參考歷史決策（Redis history:decisions:*）
// 找到 3 個類似任務的歷史決策：
// - history:decisions:20251110_auth: 使用 Supabase + @delon/auth (成功)
// - history:decisions:20251115_session: 實作 session 刷新 (成功)
// - history:decisions:20251118_rls: RLS 策略配置 (失敗→修正→成功)
// 學習到的經驗：必須先測試 RLS 策略

// Thought 7/7: 驗證可行性（基於 Redis 統計）
// ✅ 符合五層架構開發順序
// ✅ 符合 SRP 原則（基於 Redis patterns:*）
// ✅ 有完整的錯誤處理（避免 Redis errors:common）
// ✅ 測試覆蓋率可達標（基於 Redis stats:code_quality）
// ✅ 歷史數據顯示：類似任務成功率 95%，預期時間 4.5h
```

**必須回答的問題（結合 Redis）**：
1. ❓ 任務的核心問題是什麼？
2. ❓ Redis 中有哪些相關的使用者偏好？
3. ❓ Redis 中有哪些相關的專案知識？
4. ❓ 需要查閱記憶庫中的哪些實體？
5. ❓ Redis 中有哪些類似任務的歷史決策？
6. ❓ 涉及系統架構的哪些模組？
7. ❓ 需要遵循哪些開發原則（Redis patterns:*）？
8. ❓ 有哪些潛在風險（Redis errors:common）？
9. ❓ 如何驗證解決方案（Redis stats:*）？
4. ❓ 需要遵循哪些開發原則？
5. ❓ 有哪些潛在風險？
6. ❓ 如何驗證解決方案？

---

### 📋 第 5 步：使用 Software Planning Tool 制定計畫（必須）⭐⭐⭐⭐⭐

**工具**：`software-planning-tool` MCP Tool

**使用時機**：**完成 Sequential Thinking 後立即使用**

```
✓ 啟動 Software Planning Tool
✓ 創建新的規劃會話（start_planning）
✓ 將 Sequential Thinking 的輸出轉化為具體計畫
✓ 分解任務為可執行的子任務（add_todo）
✓ 設定每個子任務的複雜度（0-10）
✓ 添加代碼範例和參考文檔
✓ 保存完整計畫（save_plan）
```

**Software Planning Tool 使用範例**：
```yaml
# start_planning
goal: "實作用戶登入功能，整合 Supabase Auth 和 @delon/auth"

# add_todo 範例
todos:
  - title: "第1步：Types 層 - 定義認證類型"
    description: |
      創建 auth.types.ts 定義：
      - AuthUser 介面
      - LoginCredentials 介面
      - AuthSession 介面
      參考：docs/22-完整SQL表結構定義.md
    complexity: 2
    codeExample: |
      export interface AuthUser {
        id: string;
        email: string;
        // ...
      }
  
  - title: "第2步：Services 層 - AuthService"
    description: |
      創建 auth.service.ts：
      - signIn() 整合 Supabase
      - signOut() 清除 session
      - refreshToken() 自動刷新
      - syncWithDelonAuth() 同步 TokenService
    complexity: 7
    codeExample: |
      @Injectable({ providedIn: 'root' })
      export class AuthService {
        private supabase = inject(SupabaseService);
        // ...
      }
  
  - title: "第3步：Facades 層 - AuthFacade"
    description: |
      創建 auth.facade.ts：
      - 使用 Signals 管理狀態
      - 提供 UI 友善的錯誤訊息
      - 處理 loading 狀態
    complexity: 5
  
  - title: "第4步：Components 層 - LoginComponent"
    description: |
      創建登入組件：
      - 使用 NG-ZORRO 表單元件
      - OnPush 策略
      - Signals API
      - 表單驗證
    complexity: 6
  
  - title: "第5步：測試與文檔"
    description: |
      - AuthService 單元測試（覆蓋率 ≥80%）
      - AuthFacade 單元測試（覆蓋率 ≥80%）
      - E2E 測試（登入流程）
      - 更新認證流程文檔
    complexity: 8

# save_plan
plan: |
  ## 用戶登入功能實作計畫
  
  ### 總時間估算：28 小時
  - Types 層：2h
  - Services 層：8h
  - Facades 層：6h
  - Components 層：6h
  - 測試與文檔：6h
  
  ### 風險評估
  1. Supabase session 刷新機制需額外測試
  2. RLS 策略需要仔細檢查
  3. 多標籤頁 session 同步問題
  
  ### 驗證標準
  - ✅ 所有測試通過
  - ✅ 測試覆蓋率 ≥80%
  - ✅ ESLint 無錯誤
  - ✅ TypeScript 編譯通過
  - ✅ 生產構建成功
```

**規劃必須包含**：
- ✅ 明確的任務目標
- ✅ 按五層架構順序的子任務
- ✅ 每個子任務的複雜度評分（0-10）
- ✅ 具體的代碼範例或參考
- ✅ 時間估算
- ✅ 風險評估
- ✅ 驗證標準

---

### 🎯 第 6 步：確認任務範圍與目標

**基於 Sequential Thinking 和 Software Planning 的輸出**：

```
✓ 任務目標已明確（來自 Sequential Thinking）
✓ 執行計畫已制定（來自 Software Planning）
✓ 風險已識別並有應對策略
✓ 成功標準已定義
✓ 時間估算已完成
```

**檢查清單**：
- [ ] 是否已完成 Sequential Thinking 分析？
- [ ] 是否已使用 Software Planning Tool 創建計畫？
- [ ] 計畫是否包含所有必要的子任務？
- [ ] 每個子任務是否有明確的驗證標準？
- [ ] 是否識別了所有潛在風險？

---

### 🏗️ 第 7 步：執行開發（遵循五層架構）

**⭐ 重要：新功能開發必須遵循五層架構開發順序**

**詳細指南**：[development-sequence-guide.md](./development-sequence-guide.md) ⭐⭐⭐⭐⭐

**標準開發順序**：
```
第 1 步：Types 層（P0 - 必須最先）
  ↓
第 2 步：Repositories 層（P0 - 依賴 Types）
  ↓
第 3 步：Models 層（P0 - 可與 Repositories 並行）
  ↓
第 4 步：Services 層（P0 - 依賴 Repositories + Models）
  ↓
第 5 步：Facades 層（P0 - 依賴 Services）
  ↓
第 6 步：Routes/ㄋ 層（P0 - 依賴 Facades）
  ↓
第 7 步：測試與文檔（P0 - 必須完成）
```

**檢查清單**：
```
✓ 已使用 Sequential Thinking Tool 分析任務
✓ 已使用 Software Planning Tool 創建計畫
✓ 已閱讀開發順序指南（development-sequence-guide.md）
✓ 確認需要哪些層級（參考 Software Planning 輸出）
✓ 確認依賴關係（參考 Sequential Thinking 輸出）
✓ 確認開發順序（按照 Software Planning 中的 todos）
✓ 理解每個層級的完成標準
✓ 預估每個步驟的時間（已在 Software Planning 中完成）
```

**從記憶庫查詢開發順序**：
```bash
# 查詢五層架構開發順序
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Five Layer Development Order"))'

# 查詢各層開發實踐
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Layer Development"))'
```

---

## 📋 執行中檢查

### 🔄 工具使用確認（每個階段必須）

**階段 1：開始前**
- [ ] 是否使用 Sequential Thinking Tool 分析任務？
- [ ] 是否使用 Software Planning Tool 創建計畫？
- [ ] Sequential Thinking 輸出是否包含：問題分析、架構影響、風險識別、可行性驗證？
- [ ] Software Planning 輸出是否包含：目標、子任務、複雜度、時間估算、風險評估？

**階段 2：執行中**
- [ ] 是否按照 Software Planning 的 todos 順序執行？
- [ ] 遇到新問題時，是否再次使用 Sequential Thinking 分析？
- [ ] 計畫變更時，是否更新 Software Planning Tool（update_todo_status）？

**階段 3：完成前**
- [ ] 是否記錄了關鍵決策和思考過程？
- [ ] 是否使用 Software Planning Tool 標記完成的任務（update_todo_status）？
- [ ] 是否檢視所有 todos 都已完成（get_todos）？

---

### 開發原則檢查

**四大核心開發原則**（從記憶庫中查閱）：
- [ ] **常見做法**：遵循業界標準，參考官方文檔和最佳實踐
- [ ] **企業標準**：代碼結構清晰、職責分離明確、錯誤處理完善、狀態管理規範
- [ ] **符合邏輯**：數據流清晰、命名語義化、條件判斷合理、組件初始化順序正確
- [ ] **符合常理**：功能真正可用、用戶體驗優先、避免過度設計、及時驗證

### 企業架構十大原則（SRP 核心）

- [ ] 1. **單一職責原則（SRP）**：每個模組只有一個改變的理由
- [ ] 2. **封裝與界限**：明確隔離不同層級，避免跨層依賴
- [ ] 3. **可組合性**：功能可自由組合，拆解後仍能運作
- [ ] 4. **明確的依賴方向**：依賴方向從上到下，避免循環依賴
- [ ] 5. **低耦合、高內聚**：相關功能放在一起，不同領域弱依賴
- [ ] 6. **可測試性**：架構必須為測試設計
- [ ] 7. **可維護性**：今天能維護，三年後也能維護
- [ ] 8. **可替換性**：能夠替換任何基礎設施層
- [ ] 9. **漸進式演進**：架構可部分重構，無需一次性重建
- [ ] 10. **一致性**：一致性比「聰明」更重要

### UI 元件優先級（必須遵守）

- [ ] 1. **優先 NG-ZORRO 元件**：所有 UI 需求優先從 NG-ZORRO 選擇
- [ ] 2. **次選 @delon/abc**：NG-ZORRO 無法滿足時使用業務元件
- [ ] 3. **最後才自訂**：僅當前兩者都無法滿足才自訂
- [ ] 4. **禁用原生 HTML**：不使用 `<input>`/`<select>`/`<button>`

### OnPush 策略（強制）

- [ ] 所有元件必須使用 `OnPush` 策略
- [ ] 使用 Signals 或不可變資料觸發檢測
- [ ] 需要時使用 `ChangeDetectorRef.markForCheck()`

---

## ✅ 完成前檢查

### 代碼質量

- [ ] TypeScript 編譯通過（`yarn type-check`）
- [ ] ESLint 檢查通過（`yarn lint`）
- [ ] Stylelint 檢查通過（`yarn lint:style`）
- [ ] Prettier 格式化完成
- [ ] 無循環依賴

### 構建與測試

- [ ] 項目構建成功（`yarn build`）
- [ ] 單元測試通過（Service ≥80%、Facade ≥80%）
- [ ] E2E 測試通過（關鍵流程）
- [ ] 無控制台錯誤或警告

### 企業標準驗證

- [ ] **常見做法檢查**：符合 Angular/TypeScript 最佳實踐
- [ ] **企業標準檢查**：代碼結構、職責分離、錯誤處理、狀態管理
- [ ] **邏輯一致性檢查**：數據流、命名、條件判斷、狀態更新
- [ ] **符合常理檢查**：功能可用、用戶體驗、避免過度設計

### 文檔與記錄

- [ ] 更新相關文檔（README、API 文檔）
- [ ] 記錄關鍵決策（如需要，更新 memory.jsonl）
- [ ] Commit 訊息符合規範（`<type>(<scope>): <subject>`）
- [ ] PR 描述清晰完整

### 🧠 Redis 外掛大腦成長（必須）⭐⭐⭐⭐⭐

**⚠️ 任務完成後必須將新知識寫回 Redis，讓 Agent 持續成長**

```bash
# 1. 保存決策與推論結果
redis-cli SET history:decisions:$(date +%Y%m%dT%H%M%S) '{
  "task": "任務描述",
  "decision": "最終決策",
  "reasoning": "推論過程",
  "alternatives_considered": ["方案A", "方案B"],
  "outcome": "successful",
  "lessons_learned": "學到的經驗"
}'

# 2. 更新專案知識（如有新發現）
redis-cli SET project:knowledge:new_domain '{
  "pattern": "新發現的模式",
  "convention": "新的慣例"
}'

# 3. 記錄新的命名規範（如有）
redis-cli HSET project:knowledge:naming new_pattern "新命名模式"

# 4. 更新統計數據
redis-cli INCR stats:tasks:total_completed
redis-cli HINCRBY stats:tasks:by_type feature 1

# 5. 記錄使用者反饋（如有）
redis-cli SET feedback:$(date +%Y%m%dT%H%M%S) '{
  "decision": "決策",
  "feedback": "反饋內容",
  "effective": true
}'

# 6. 更新工具使用統計
redis-cli HINCRBY stats:tool_usage:sequential_thinking used 1
redis-cli HINCRBY stats:tool_usage:software_planning used 1
```

**必須確認**：
- [ ] 是否將新決策寫入 Redis？
- [ ] 是否更新了專案知識？
- [ ] 是否記錄了新的模式和慣例？
- [ ] 是否更新了統計數據？
- [ ] 是否記錄了使用者反饋？

**成長效果**：
- ✅ 下次類似任務，Agent 會記得這次的決策
- ✅ 專案知識持續累積，Agent 越來越熟悉專案
- ✅ 統計數據幫助 Agent 做出更準確的時間估算
- ✅ 使用者偏好讓 Agent 越來越符合你的習慣

### 🔧 工具使用完成度驗證

- [ ] **Sequential Thinking Tool**：是否在任務開始前使用？
- [ ] **Software Planning Tool**：是否創建了完整的執行計畫？
- [ ] **工具輸出質量**：思考過程是否清晰？計畫是否可執行？
- [ ] **工具記錄留存**：是否保存了工具使用的輸出（用於未來參考）？
- [ ] **持續更新**：執行過程中是否持續使用工具追蹤進度？

---

## 🚫 禁止事項（必須避免）

從記憶庫中的 "Forbidden Practices" 實體：

❌ **禁止使用原生 HTML 元件**
❌ **禁止跳過 OnPush 策略**
❌ **禁止繞過 @delon/auth 認證**
❌ **禁止在程式碼中寫入機密資訊**
❌ **禁止使用 any 類型**
❌ **禁止使用舊版 Angular 語法**（`*ngIf`, `*ngFor` → 使用 `@if`, `@for`）
❌ **禁止未經審核修改 Schema**
❌ **禁止副作用外洩**
❌ **禁止過度耦合**
❌ **禁止 Agent 自動修改 infrastructure 配置**
❌ **禁止 Agent 自動修改 migrations 腳本**
❌ **禁止 Agent 自動修改 production 配置**
❌ **禁止跳過 Sequential Thinking Tool 和 Software Planning Tool 使用** ⭐⭐⭐⭐⭐

---

## 📊 任務完成自評

### 完成度評分

| 項目 | 分數 (0-10) | 備註 |
|------|------------|------|
| 記憶庫查閱 | __ / 10 | 是否充分利用記憶庫知識？ |
| 架構理解 | __ / 10 | 是否理解系統架構與模組關係？ |
| **工具使用** | __ / 10 | **是否正確使用 Sequential Thinking 和 Software Planning Tool？** ⭐ |
| 標準遵循 | __ / 10 | 是否遵循企業標準與最佳實踐？ |
| 代碼質量 | __ / 10 | 是否通過所有檢查？ |
| 測試覆蓋 | __ / 10 | 是否達到測試覆蓋率要求？ |
| 文檔完整 | __ / 10 | 是否更新相關文檔？ |
| **總分** | __ / 70 | 目標：≥ 63 分（90%） |

### 改進建議

```
記錄需要改進的地方：

1. 
2. 
3. 
```

---

## 🔧 MCP 工具快速參考

### Sequential Thinking Tool
**工具名稱**：`sequential-thinking`
**何時使用**：任務開始前、遇到複雜問題、需要決策時

**基本流程**：
```typescript
sequentialthinking({
  thought: "理解問題：這個任務的核心目標是什麼？",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
})

// 繼續思考...直到 nextThoughtNeeded: false
```

### Software Planning Tool
**工具名稱**：`software-planning-tool`
**何時使用**：完成 Sequential Thinking 後，需要制定執行計畫時

**基本流程**：
```typescript
// 1. 開始規劃
start_planning({ goal: "任務描述" })

// 2. 添加子任務
add_todo({
  title: "第1步：Types 層",
  description: "詳細說明",
  complexity: 3,
  codeExample: "範例代碼"
})

// 3. 更新狀態（執行過程中）
update_todo_status({
  todoId: "task-id",
  isComplete: true
})

// 4. 檢視所有任務
get_todos()

// 5. 保存計畫
save_plan({ plan: "完整計畫文本" })
```

### 工具使用最佳實踐

✅ **做這些**：
- 在任務開始前**必須**使用 Sequential Thinking 分析
- 使用 Software Planning 創建**可追蹤**的計畫
- 執行過程中持續更新 todo 狀態
- 保存工具輸出用於文檔和復盤
- 遇到新問題再次使用 Sequential Thinking

❌ **避免這些**：
- 跳過工具使用直接開始開發
- 創建計畫後不更新狀態
- 工具使用流於形式，不認真思考
- 不記錄工具輸出和決策過程

---

## 🔗 相關資源

### 核心配置文件
- [ng-alain-github-agent.md](./ng-alain-github-agent.md) - 主 Agent 配置
- [QUICK-START.md](./QUICK-START.md) - 快速開始指南
- [README.md](./README.md) - Agents 目錄總覽

### 記憶庫與架構
- [memory.jsonl](../copilot/memory.jsonl) - 專案記憶庫（149 實體 + 170 關係）
- [MEMORY_SUMMARY.md](../copilot/MEMORY_SUMMARY.md) - 記憶庫摘要
- [01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構思維導圖

### 領域專家
- [domain/angular-agent.md](./domain/angular-agent.md) - Angular 開發規範
- [domain/typescript-agent.md](./domain/typescript-agent.md) - TypeScript 規範
- [domain/code-quality-agent.md](./domain/code-quality-agent.md) - 代碼質量規範
- [domain/testing-agent.md](./domain/testing-agent.md) - 測試規範
- [domain/security-agent.md](./domain/security-agent.md) - 安全規範

---

**最後更新**：2025-11-21  
**版本**：v2.0.0 - 增加 MCP 工具強制使用機制  
**維護者**：開發團隊
