# Memory.jsonl 使用指南

> **目的**：為 AI 助手提供完整的記憶庫使用指南，確保每次任務執行都能正確查閱和使用專案知識。

## 📋 目錄

- [為什麼需要記憶庫](#為什麼需要記憶庫)
- [記憶庫結構](#記憶庫結構)
- [如何查詢記憶庫](#如何查詢記憶庫)
- [使用場景範例](#使用場景範例)
- [更新記憶庫](#更新記憶庫)
- [最佳實踐](#最佳實踐)

---

## 為什麼需要記憶庫

### 問題
AI 助手在每次對話時都是「無記憶」的，無法記住專案的：
- 架構設計原則
- 開發標準和規範
- 已知的模式和最佳實踐
- 文檔組織結構

### 解決方案
**memory.jsonl** 提供一個持久化的知識圖譜，包含：
- **161 個實體**：專案中的核心概念、規範、模式、實現細節
- **193 個關係**：實體之間的關聯和依賴
- **完整上下文**：架構、安全、效能、測試、文檔、核心服務實現模式

---

## 記憶庫結構

### 實體（Entity）

實體代表專案中的核心概念。每個實體包含：

```json
{
  "type": "entity",
  "name": "實體名稱",
  "entityType": "分類",
  "observations": ["觀察1", "觀察2", "觀察3"]
}
```

**範例**：
```json
{
  "type": "entity",
  "name": "OnPush Strategy",
  "entityType": "Principle",
  "observations": [
    "所有元件必須使用 ChangeDetectionStrategy.OnPush",
    "NG-ZORRO 全採用 OnPush，自訂元件必須跟隨",
    "使用 Signals 或建立新物件/陣列觸發檢測",
    "需要時使用 ChangeDetectorRef.markForCheck() 手動標記"
  ]
}
```

### 關係（Relation）

關係定義實體之間的連接。每個關係包含：

```json
{
  "type": "relation",
  "from": "來源實體",
  "to": "目標實體",
  "relationType": "關係類型"
}
```

**範例**：
```json
{
  "type": "relation",
  "from": "Angular 20",
  "to": "OnPush Strategy",
  "relationType": "requires"
}
```

### 實體分類

記憶庫中的實體按以下類別組織（共 33 個類別）：

| 類別 | 數量 | 說明 |
|------|------|------|
| **Standard** | 48 | 開發標準和編碼規範 |
| **Feature** | 18 | 專案功能和特性（包含 Realtime Communication System, Explore Module, Dashboard Module, Daily Report System） |
| **Principle** | 13 | 核心開發原則（SOLID, DRY, KISS 等） |
| **Documentation** | 9 | 文檔結構和文件 |
| **UI Pattern** | 7 | 使用者介面設計模式 |
| **Development Practice** | 6 | 各層級開發實踐 |
| **Security** | 6 | 安全最佳實踐和標準 |
| **Architecture** | 5 | 系統架構模式 |
| **DevOps** | 5 | DevOps 實踐和 CI/CD |
| **Pattern** | 12 | 設計模式（Repository, Facade, ErrorStateService, BlueprintActivityService, Aggregation Refresh, Facade Coordination, Supabase Storage, Workspace Context Implementation, Task State Machine, Task Dependency Management 等） |
| **Workspace** | 3 | 工作區上下文系統 |
| **Performance** | 3 | 效能優化技術 |
| 其他 | 25 | 其他專門類別 |

---

## 如何查詢記憶庫

### 方法 1：按名稱查詢實體

查詢特定實體的詳細資訊：

```bash
# 查詢 "OnPush Strategy" 實體
cat memory.jsonl | jq 'select(.type=="entity" and .name=="OnPush Strategy")'
```

### 方法 2：按類別查詢實體

查詢特定類別的所有實體：

```bash
# 查詢所有 Security 類別的實體
cat memory.jsonl | jq 'select(.type=="entity" and .entityType=="Security")'
```

### 方法 3：查詢相關關係

查詢特定實體的所有關係：

```bash
# 查詢與 "Angular 20" 相關的所有關係
cat memory.jsonl | jq 'select(.type=="relation" and (.from=="Angular 20" or .to=="Angular 20"))'
```

### 方法 4：搜尋關鍵字

在觀察中搜尋特定關鍵字：

```bash
# 搜尋包含 "RLS" 的所有實體
cat memory.jsonl | jq 'select(.type=="entity" and (.observations | tostring | contains("RLS")))'
```

---

## 使用場景範例

### 場景 1：開發新功能

**任務**：實作用戶管理功能

**查詢步驟**：

1. **查詢開發順序**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Five Layer Development Order")'
   ```
   → 了解 Types → Repositories → Models → Services → Facades → Routes 的順序

2. **查詢安全規範**
   ```bash
   cat memory.jsonl | jq 'select(.type=="entity" and .entityType=="Security")'
   ```
   → 了解 RLS 策略、認證流程、權限規則

3. **查詢 UI 規範**
   ```bash
   cat memory.jsonl | jq 'select(.name=="UI Component Priority")'
   ```
   → 了解優先使用 NG-ZORRO 元件，避免原生 HTML

4. **查詢測試策略**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Testing Strategy")'
   ```
   → 了解測試覆蓋率要求（≥80%）

### 場景 2：代碼審查

**任務**：審查 PR 中的代碼變更

**查詢步驟**：

1. **查詢審查標準**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Code Review Standards")'
   ```

2. **查詢核心原則**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Four Core Development Principles")'
   ```
   → 檢查：常見做法、企業標準、符合邏輯、符合常理

3. **查詢驗證序列**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Development Validation Sequence")'
   ```
   → 確認已執行 lint → lint:style → type-check → build → test

### 場景 3：架構設計

**任務**：設計新模組架構

**查詢步驟**：

1. **查詢架構模式**
   ```bash
   cat memory.jsonl | jq 'select(.type=="entity" and .entityType=="Architecture")'
   ```

2. **查詢分支模型**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Git-like Branch Model")'
   ```

3. **查詢依賴原則**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Dependency Direction Principle")'
   ```

4. **查詢設計模式**
   ```bash
   cat memory.jsonl | jq 'select(.type=="entity" and .entityType=="Pattern")'
   ```

### 場景 4：效能優化

**任務**：優化應用效能

**查詢步驟**：

1. **查詢效能基準**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Performance Benchmarks")'
   ```
   → 目標：LCP < 2.5s, FID < 100ms, CLS < 0.1

2. **查詢優化技術**
   ```bash
   cat memory.jsonl | jq 'select(.name=="Performance Optimization Techniques")'
   ```

3. **查詢 OnPush 策略**
   ```bash
   cat memory.jsonl | jq 'select(.name=="OnPush Strategy")'
   ```

---

## 更新記憶庫

### 何時更新

當發現以下情況時應更新記憶庫：

1. **新的架構模式**：專案採用新的設計模式或架構原則
2. **新的開發標準**：建立新的編碼規範或最佳實踐
3. **新的功能特性**：實作重要的新功能
4. **新的工具或技術**：引入新的技術棧或工具
5. **規範變更**：現有規範或標準有重大更新

### 更新步驟

1. **識別新知識**
   - 確認是否是新的實體或關係
   - 檢查是否與現有實體重複

2. **定義實體**
   ```json
   {
     "type": "entity",
     "name": "新實體名稱",
     "entityType": "分類",
     "observations": [
       "觀察1：具體描述",
       "觀察2：具體描述",
       "觀察3：引用來源文檔"
     ]
   }
   ```

3. **定義關係**
   ```json
   {
     "type": "relation",
     "from": "新實體",
     "to": "相關實體",
     "relationType": "關係類型"
   }
   ```

4. **驗證格式**
   ```bash
   # 驗證 JSON 格式
   cat memory.jsonl | jq '.' > /dev/null && echo "格式正確" || echo "格式錯誤"
   ```

5. **更新摘要**
   - 更新 `MEMORY_SUMMARY.md` 中的統計資訊
   - 更新版本號和更新日期

### 更新範例

**新增實體**：
```json
{
  "type": "entity",
  "name": "SSR Support",
  "entityType": "Feature",
  "observations": [
    "支援伺服器端渲染（Server-Side Rendering）",
    "使用 Angular Universal",
    "提升首次內容繪製（FCP）效能",
    "改善 SEO 友善度",
    "參考：docs/55-SSR-Implementation-Guide.md"
  ]
}
```

**新增關係**：
```json
{
  "type": "relation",
  "from": "SSR Support",
  "to": "Performance Optimization",
  "relationType": "improves"
}
```

---

## 最佳實踐

### 對於 AI 助手

1. **任務開始前先查詢**
   - 不要假設已知專案規範
   - 總是先查詢記憶庫相關實體

2. **多角度查詢**
   - 按名稱查詢（精確匹配）
   - 按類別查詢（相關實體）
   - 按關鍵字搜尋（模糊匹配）

3. **理解關係**
   - 查詢實體的所有關係
   - 理解依賴和影響範圍

4. **引用來源**
   - 在回覆中引用記憶庫實體
   - 說明為何遵循特定規範

5. **建議更新**
   - 發現新模式時建議更新記憶庫
   - 提供具體的實體定義建議

### 對於開發團隊

1. **保持更新**
   - 定期審查記憶庫內容
   - 及時添加新的規範和模式

2. **保持準確**
   - 確保觀察描述準確具體
   - 引用文檔來源（可追溯）

3. **保持組織**
   - 使用一致的分類體系
   - 避免重複實體

4. **保持簡潔**
   - 每個觀察專注一個要點
   - 避免冗長描述

5. **版本控制**
   - 記錄每次更新的版本號
   - 維護 MEMORY_SUMMARY.md

---

## 常見問題

### Q1：記憶庫會自動加載嗎？

A：是的。所有 Agent 配置文件（`AGENTS.md`, `.copilot-instructions.md`, `.github/agents/*.md`）都在開頭包含對記憶庫的引用，提醒 AI 助手查閱。

### Q2：如何知道查詢哪些實體？

A：根據任務類型：
- 開發功能 → 查詢 Development Practice, Pattern, Standard
- 代碼審查 → 查詢 Principle, Standard, Code Review Standards
- 架構設計 → 查詢 Architecture, Pattern, Dependency Direction
- 效能優化 → 查詢 Performance, OnPush Strategy

### Q3：記憶庫太大會影響效能嗎？

A：不會。記憶庫以 JSONL 格式儲存，AI 助手只查詢需要的部分，不會一次載入全部內容。

### Q4：可以刪除舊的實體嗎？

A：可以，但需謹慎：
- 確認實體已過時且不再使用
- 檢查是否有其他實體依賴此關係
- 更新 MEMORY_SUMMARY.md

### Q5：如何避免實體重複？

A：更新前先搜尋：
```bash
cat memory.jsonl | jq 'select(.type=="entity" and .name=="實體名稱")'
```

---

## 相關資源

- [memory.jsonl](./memory.jsonl) - 主記憶檔案
- [MEMORY_SUMMARY.md](./MEMORY_SUMMARY.md) - 記憶庫摘要
- [README.md](./README.md) - 基本說明
- [AGENTS.md](../../AGENTS.md) - AI 助手總覽
- [docs/43-Agent開發指南與限制說明.md](../../docs/43-Agent開發指南與限制說明.md) - Agent 開發指南

---

**最後更新**：2025-01-21  
**版本**：v1.1.0（更新統計數據以反映 v4.1 新增內容）  
**維護者**：開發團隊
