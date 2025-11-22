# GitHub Copilot Memory Configuration

此目錄包含 GitHub Copilot Memory MCP（Model Context Protocol）的配置文件。

## 🚀 快速開始：如何讓 Agents 自動查看 memory.jsonl

### 自動加載機制

**所有 Agent 配置文件都已經包含對 memory.jsonl 的引用**，確保每次執行任務時都會提醒查閱記憶庫：

1. **根目錄配置文件**
   - `AGENTS.md` - 所有 AI 助手的入口文檔（包含記憶庫章節）
   - `.copilot-instructions.md` - VSCode Copilot 主要指引（開頭包含記憶庫提示）

2. **GitHub Agents 配置**
   - `.github/agents/ng-alain-github-agent.md` - 主要 Agent 配置（開頭包含記憶庫章節）
   - `.github/agents/copilot-instructions.md` - Copilot Agent 簡要指引（開頭包含記憶庫提示）

3. **領域專家 Agents**
   - 所有領域 Agent（`domain/*.md`）都會繼承主配置中的記憶庫引用

### Agent 使用記憶庫的標準流程

```text
   ↓
2. 閱讀 Agent 配置文件（自動提示查閱 memory.jsonl）
   ↓
3. 查詢記憶庫相關實體
   - 架構設計原則
   - 開發標準和規範
   - 已知模式和最佳實踐
   ↓
4. 基於記憶庫知識執行任務
   ↓
5. 任務完成後建議更新記憶庫（如有新發現）
```

### 記憶庫查詢範例

**範例 1：開發新功能**
任務：實作用戶管理功能
```diff
Agent 應查閱的記憶實體：
- Five Layer Development Order（開發順序）
- Repository Pattern（數據訪問模式）
- Security Best Practices（安全規範）
- UI Component Priority（UI 元件優先級）
```

**範例 2：代碼審查**
任務：審查 PR 中的代碼變更

```diff
- Code Review Standards（審查標準）
- Four Core Development Principles（核心開發原則）
- Testing Strategy（測試策略）
- Linting Standards（代碼檢查標準）
```

**範例 3：架構設計**
任務：設計新模組架構

Agent 應查閱的記憶實體：
```mermaid
- Five Layer Architecture（五層架構）
- Dependency Direction Principle（依賴方向原則）
- Low Coupling High Cohesion（低耦合高內聚）
```

---

## 🛠️ AI 工具整合（v4.2 新增）

本專案整合了兩個強大的 AI 工具，提升開發效率和質量：

### Sequential Thinking Tool

**用途**：複雜問題的深度分析和結構化思考

**適用場景**：
- ✅ 架構設計決策
- ✅ 複雜問題分析
- ✅ 技術選型評估
- ✅ Bug 根因分析

**特色功能**：
- 思考鏈記錄（完整的思考過程）
- 修正機制（isRevision）
- 分支探索（branchFromThought）
- 動態調整步驟數

### Software Planning Tool

**用途**：任務規劃、分解和進度追蹤

**適用場景**：
- ✅ 新功能開發
- ✅ 大型任務分解
- ✅ 多步驟重構
- ✅ 團隊協作任務

**核心命令**：
- `start_planning(goal)` - 啟動規劃會話
- `add_todo(...)` - 添加任務
- `update_todo_status(...)` - 更新狀態
- `save_plan(plan)` - 保存計畫

### 🔗 工具整合使用

**標準工作流程**：
1. 使用 Sequential Thinking 分析需求和設計架構
2. 查詢 memory.jsonl 了解相關規範
3. 使用 Software Planning Tool 創建任務計畫
4. 執行任務（遵循五層開發順序）
5. 遇到問題時使用 Sequential Thinking 分析
6. 完成後更新記憶庫

**詳細指南**：
- [TOOL-GUIDE.md](./TOOL-GUIDE.md) - 完整的工具使用指南
- [DEVELOPMENT-WORKFLOWS.md](./DEVELOPMENT-WORKFLOWS.md) - 實際開發工作流程範例

---

## 📄 memory.jsonl

記憶檔案採用 JSONL (JSON Lines) 格式，每一行都是一個 JSON 物件，用於定義專案的知識圖譜。

### 檔案結構

記憶檔案包含兩種類型的記錄：

1. **實體（Entity）**：定義專案中的核心概念
   ```json
   {"type":"entity","name":"實體名稱","label":"分類","observations":["觀察1","觀察2"]}
   ```

2. **關係（Relation）**：定義實體之間的關聯
   ```json
   {"type":"relation","from":"來源實體","to":"目標實體","relationType":"關係類型"}
   ```

### 📊 目前包含的知識

**版本 v4.2** - AI Tool Integration（工具整合增強）

#### 實體統計（167 個實體，+6 from v4.1）
- **專案**：ng-alain-gighub（企業級資源中心）
- **技術棧**：Angular 20、NG-ZORRO、@delon、TypeScript、Supabase、RxJS
- **AI 工具**：Sequential Thinking Tool、Software Planning Tool、Tool-Assisted Development Pattern ✨
- **架構設計**：Git-like Branch Model、Database Schema、Layered Architecture、Five Layer Architecture
- **核心原則**：OnPush Strategy、SOLID Principles、Code Quality、Enterprise Development Principles、UI Component Priority、Consistency Principle、Composability Principle、Dependency Direction Principle、Low Coupling High Cohesion
- **功能特性**：Staging Area Mechanism（48h 可撤回）、Todo Center System（五種狀態）、Issue Synchronization、Activity Logging System、Document Management System、Task Tree Structure、Data Analysis System、Notification System、Bot System、Workspace Context System、File Upload Standards、Search Functionality、Pagination Standards、Realtime Communication System、Explore Module、Dashboard Module、Daily Report System
- **設計模式**：SHARED_IMPORTS、Repository Pattern、Component Design Patterns、Modal Design Patterns、Table Design Patterns、Form Design Patterns、Layout Patterns、ErrorStateService Pattern、BlueprintActivityService Pattern、Aggregation Refresh Pattern、Facade Coordination Pattern、Supabase Storage Pattern、Workspace Context Implementation、Task State Machine、Task Dependency Management
- **安全性**：Authentication Flow、Security Principles、Security Best Practices、Branch Permission Rules、RLS Policy Patterns、Security Scanning
- **文檔導航**（✨ v4.0 新增）：
  - Documentation Structure（232 個文檔的完整結構）⭐
  - Documentation Priority System（優先級系統）⭐
  - Reading Paths（不同角色的閱讀路徑）⭐
  - NG-ZORRO Component Index（73 個組件索引）
  - DELON Package Index（11 個套件索引）
  - Core Documentation Files（核心文檔引用）
  - Quick Reference Documents（快速參考）
  - Architecture Diagrams（20 個架構圖）
  - Module Documentation（模組文檔）
  - Workspace Context Documentation（工作區文檔）
  - Cursor IDE Rules（29 個規則）
  - GitHub Agents Configuration（Agent 配置）
- **標準規範**：
  - API Design Standards ⭐
  - State Management Rules ⭐
  - Error Handling Standards ⭐
  - Form Validation Standards ⭐
  - Routing Standards ⭐
  - Service Design Standards ⭐
  - Naming Conventions ⭐
  - CSS/LESS Standards ⭐
  - Import Order Standards ⭐
  - Database Table Structure ⭐
  - Migration Standards ⭐
  - Environment Configuration ⭐
  - Internationalization (i18n) ⭐
  - Theme Customization ⭐
  - Responsive Design ⭐
  - Keyboard Shortcuts ⭐
  - Loading States ⭐
  - Empty States ⭐
- **效能優化**：Performance Optimization、Performance Benchmarks、Performance Optimization Techniques、Database Query Optimization、Build Optimization、Caching Strategy、Performance Monitoring
- **開發流程**（+12 新增）：
  - Code Review Checklist ⭐
  - Git Workflow ⭐
  - CI/CD Pipeline ⭐
  - Monitoring & Analytics ⭐
  - Backup & Recovery ⭐
  - Dependency Management ⭐
  - Logging Standards ⭐
  - Documentation Maintenance ⭐
  - Team Collaboration ⭐
  - Onboarding Process ⭐
- **約束條件**：Forbidden Practices

#### 關係統計（207 個關係，+14 from v4.1）
- **技術使用關係**：ng-alain-gighub → Angular 20/NG-ZORRO/@delon/Supabase/TypeScript/Git-like Branch Model/Database Schema
- **AI 工具關係**：AI Tool Integration → Sequential Thinking Tool/Software Planning Tool、Tool-Assisted Development Pattern → Five Layer Development Order ✨
- **架構實作關係**：Five Layer Architecture → Layered Architecture、Git-like Branch Model → Database Schema
- **技術整合關係**：Angular 20 → NG-ZORRO/RxJS/OnPush Strategy、@delon → NG-ZORRO/Supabase
- **安全實作關係**：Supabase → Authentication Flow → Security Principles、Branch Permission Rules → Security Best Practices、RLS Policy Patterns → Security Principles
- **品質保證關係**：SOLID Principles/Testing Strategy/Code Review Standards → Code Quality、Code Review Checklist → Code Quality
- **效能關係**：Performance Optimization Techniques → Performance Benchmarks、Performance Monitoring → Performance Benchmarks
- **支援關係**：Staging Area Mechanism/Issue Synchronization → Git-like Branch Model、Notification System → Todo Center System
- **組織關係**：Task Tree Structure/Data Analysis System/Activity Logging System → Git-like Branch Model、Workspace Context System → Git-like Branch Model
- **原則實作**：SRP Enforcement → SOLID Principles、Consistency Principle → Code Quality Checklist
- **UI 模式關係**：Modal/Table/Form/Layout Design Patterns → NG-ZORRO/@delon、Theme Customization → NG-ZORRO、Responsive Design → NG-ZORRO
- **DevOps 關係**：Git Workflow → CI/CD Pipeline、CI/CD Pipeline → Migration Standards、Monitoring & Analytics → Performance Monitoring、Security Scanning → Security Principles、Team Collaboration → Git Workflow、Onboarding Process → Documentation
- **文檔關係**（✨ v4.0 新增）：Documentation Structure → ng-alain-gighub、Documentation Priority System → Documentation Structure、Reading Paths → Documentation Structure、NG-ZORRO Component Index → NG-ZORRO、DELON Package Index → @delon、Core Documentation Files → Documentation Structure/Git-like Branch Model/Database Schema、Cursor IDE Rules → Code Quality、GitHub Agents Configuration → ng-alain-gighub、Module Documentation → Layered Architecture、Quick Reference Documents → Documentation Structure、Architecture Diagrams → Documentation Structure、Workspace Context Documentation → Workspace Context System
- **核心服務模式關係**（✨ v4.1 新增）：ErrorStateService Pattern → Facades Layer Development/Error Handling Strategy、BlueprintActivityService Pattern → Facades Layer Development/Activity Logging System、Aggregation Refresh Pattern → Facades Layer Development/Realtime Communication System、Facade Coordination Pattern → Facades Layer Development/ErrorStateService Pattern/BlueprintActivityService Pattern、Supabase Storage Pattern → Document Management System/File Upload Standards、Workspace Context Implementation → Workspace Context System/Route Parameter Replacement、Task State Machine → Task Tree Structure、Task Dependency Management → Task Tree Structure、Realtime Communication System → Aggregation Refresh Pattern/Supabase、Explore Module → Workspace Context System/Search Functionality、Dashboard Module → Data Analysis System/Aggregation Refresh Pattern、Daily Report System → Task Execution System/Supabase Storage Pattern

### 🎯 使用目的

這個記憶檔案幫助 GitHub Copilot 理解：

1. **專案技術棧**：使用的框架、函式庫及其版本
2. **架構設計**：Git-like 分支模型、51 張資料表架構、五層架構開發順序
3. **核心原則**：SOLID、DRY、KISS、YAGNI、一致性原則、可組合性原則、依賴方向原則
4. **開發規範**：程式碼風格、命名規則、最佳實踐、UI 元件優先級
5. **功能特性**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步、活動記錄、文件管理
6. **安全原則**：認證流程、權限控制（Owner/Collaborator/Viewer）、資料保護、RLS 策略
7. **測試策略**：單元測試（≥80% 覆蓋率）、E2E 測試要求
8. **效能優化**：OnPush 策略、Lazy Loading、快取機制、Bundle 優化、效能基準（LCP < 2.5s）
9. **開發流程**：驗證序列（lint → lint:style → type-check → build → test）、Git workflow、CI/CD
10. **禁止事項**：不應該做的事情與限制（Agent 操作約束）
11. **文檔導航**（✨ v4.0 新增）：完整的文檔結構（232 個文檔）、優先級系統（⭐ 標記）、不同角色的閱讀路徑、快速參考文檔、核心架構圖、組件索引

### 📝 維護建議

當專案有以下變更時，應更新此檔案：

1. **技術棧升級**：框架或函式庫版本變更
2. **架構調整**：新增或修改核心架構設計
3. **規範變更**：開發規範或編碼標準更新
4. **新增限制**：發現新的禁止事項或約束條件

### 🔍 驗證方法

使用以下命令驗證 JSONL 格式：

```bash
# 列出所有實體
cat memory.jsonl | jq -r 'select(.type=="entity") | .name'

# 列出所有關係
cat memory.jsonl | jq -r 'select(.type=="relation") | "\(.from) → \(.to) (\(.relationType))"'

# 統計實體數量
cat memory.jsonl | jq -s '[.[] | select(.type=="entity")] | length'

# 統計關係數量
cat memory.jsonl | jq -s '[.[] | select(.type=="relation")] | length'
```

### 📚 相關文件

- [專案總覽](../../AGENTS.md) - AI 助手配置總覽
- [開發指引](../../.copilot-instructions.md) - GitHub Copilot 主要開發規範
- [架構文件](../../docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型詳解
- [資料表結構](../../docs/22-完整SQL表結構定義.md) - 51 張資料表完整定義

### 🤖 Memory MCP 說明

Memory MCP 是 GitHub Copilot 的記憶系統，允許：

- **持久化知識**：儲存專案特定的知識與規範
- **上下文感知**：Copilot 可以參考這些知識提供更準確的建議
- **團隊共享**：整個團隊共享相同的專案知識基礎
- **版本控制**：記憶檔案可以透過 Git 版本控制追蹤變更

---

**版本歷史**：
- **v4.2** (2025-11-21): AI Tool Integration - 整合 Sequential Thinking 和 Software Planning Tool ✨🚀
  - 新增 6 個實體：Sequential Thinking Tool、Software Planning Tool、Tool-Assisted Development Pattern、Thinking-First Development、AI Tool Integration、Structured Problem Solving
  - 新增 14 個關係：連接工具與開發流程、質量標準
  - 新增 2 個完整指南：TOOL-GUIDE.md（18KB）、DEVELOPMENT-WORKFLOWS.md（23KB）
  - 重點：提供完整的 AI 工具使用指南和實際開發工作流程範例
  - 總計：167 個實體、207 個關係（從 v4.1 的 161/193 增加）
- **v4.1** (2025-01-21): 核心服務實現模式補充 - 添加實現細節 ✨
  - 新增 12 個核心服務實現模式實體：ErrorStateService Pattern、BlueprintActivityService Pattern、Aggregation Refresh Pattern、Facade Coordination Pattern、Supabase Storage Pattern、Workspace Context Implementation、Task State Machine、Task Dependency Management、Realtime Communication System、Explore Module、Dashboard Module、Daily Report System
  - 新增 23 個關係：連接核心服務模式與現有架構
  - 重點：補充核心服務的具體實現模式，幫助 AI 助手理解代碼結構
  - 總計：161 個實體、193 個關係（從 v4.0 的 149/170 增加）
- **v4.0.1** (2025-11-20): 版本整合 - 移除舊備份檔案 🧹
  - **整合完成**：移除 memory.jsonl.v3.0-backup（已合併至主檔案）
  - **統一版本**：現在只有一個 memory.jsonl 檔案（149 實體 + 170 關係）
  - **清理目的**：避免版本混淆，確保所有 AI 助手使用相同的知識庫
- **v4.0** (2025-11-20): 文檔整合與組織化 - 添加文檔導航知識 ✨
  - 新增 12 個文檔實體：Documentation Structure、Documentation Priority System、Reading Paths、NG-ZORRO Component Index、DELON Package Index、Core Documentation Files、Quick Reference Documents、Architecture Diagrams、Module Documentation、Workspace Context Documentation、Cursor IDE Rules、GitHub Agents Configuration
  - 新增 14 個文檔關係：連接文檔系統與專案核心
  - 組織化：移除 9 個重複實體、6 個重複關係
  - 按類別重新組織所有實體：提高可讀性
  - 總計：149 個實體、170 個關係（從 v3.0 的 129/143 增加）
  - 重點：幫助 AI 助手理解專案的 232 個文檔結構和閱讀路徑
- **v3.0** (2025-11-20): Phase 5 完成 - 擴展詳細實作規範與 UI/DevOps 標準
  - 新增 45 個實體：涵蓋完整開發生命週期
  - 新增 40 個關係：串連所有新實體與現有核心原則
  - 總計：129 個實體、137 個關係（+53.6% 實體、+41.2% 關係）
- **v2.0** (2025-11-20): 新增 61 個企業標準實體和 73 個關係
  - 建立完整的企業級開發標準記憶庫
  - 總計：84 個實體、97 個關係
- **v1.0** (2025-11-19): 初始版本，基礎專案知識
  - 基礎技術棧、架構設計、開發原則
  - 總計：23 個實體、24 個關係

**最後更新**：2025-11-21（v4.2 AI Tool Integration）  
**維護者**：開發團隊  
**下次檢視**：專案重大架構變更時
