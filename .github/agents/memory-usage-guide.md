# 📚 專案記憶庫使用指南

> **目的**：教導 GitHub Copilot Agents 如何有效使用專案記憶庫（memory.jsonl），提升開發效率與代碼質量

**版本**：v1.0.0  
**最後更新**：2025-01-15  
**記憶庫版本**：v4.0（149 實體 + 170 關係）

---

## 🎯 為什麼要使用記憶庫？

專案記憶庫是一個**知識圖譜**，包含：
- ✅ 經過驗證的架構設計原則
- ✅ 企業級開發標準與最佳實踐
- ✅ 過往經驗與學到的教訓
- ✅ 文檔結構與閱讀路徑
- ✅ 設計模式與反模式
- ✅ 安全規範與權限規則

**使用記憶庫的好處**：
1. **避免重複錯誤**：學習過往經驗，不再犯同樣的錯
2. **保持一致性**：遵循已驗證的模式和規範
3. **加速開發**：快速找到相關知識，減少摸索時間
4. **提升質量**：基於企業標準開發，確保代碼質量
5. **知識傳承**：新 Agent 快速了解專案規範

---

## 📍 記憶庫位置

**主檔案**：`.github/copilot/memory.jsonl`

**相關文檔**：
- `.github/copilot/README.md` - 記憶庫說明
- `.github/copilot/MEMORY_SUMMARY.md` - 記憶庫摘要
- `.github/copilot/USAGE-GUIDE.md` - 詳細使用指南

---

## 🔍 如何查詢記憶庫

### 方法 1：使用 grep 搜尋

```bash
# 搜尋特定關鍵字
grep -i "關鍵字" .github/copilot/memory.jsonl

# 搜尋實體名稱
grep '"name"' .github/copilot/memory.jsonl | grep -i "關鍵字"

# 搜尋觀察內容
grep '"observations"' .github/copilot/memory.jsonl | grep -i "關鍵字"
```

### 方法 2：使用 jq 查詢（推薦）

```bash
# 列出所有實體
cat .github/copilot/memory.jsonl | jq -r 'select(.type=="entity") | .name'

# 搜尋特定實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("關鍵字"))'

# 搜尋特定類型的實體
cat .github/copilot/memory.jsonl | jq 'select(.entityType=="Architecture")'

# 搜尋實體的觀察內容
cat .github/copilot/memory.jsonl | jq 'select(.type=="entity") | select(.observations[] | contains("關鍵字"))'

# 列出所有關係
cat .github/copilot/memory.jsonl | jq -r 'select(.type=="relation") | "\(.from) → \(.to) (\(.relationType))"'

# 搜尋特定實體的關係
cat .github/copilot/memory.jsonl | jq 'select(.type=="relation" and (.from=="實體名稱" or .to=="實體名稱"))'
```

### 方法 3：直接閱讀文件

使用編輯器打開 `.github/copilot/memory.jsonl`，然後使用內建搜尋功能（Ctrl+F / Cmd+F）。

---

## 📋 記憶庫結構

### 實體（Entity）格式

```json
{
  "type": "entity",
  "name": "實體名稱",
  "entityType": "分類",
  "label": "標籤（可選）",
  "observations": [
    "觀察 1",
    "觀察 2",
    "觀察 3"
  ]
}
```

### 關係（Relation）格式

```json
{
  "type": "relation",
  "from": "來源實體",
  "to": "目標實體",
  "relationType": "關係類型"
}
```

---

## 🗺️ 記憶庫內容地圖（v4.0）

### 架構設計（Architecture）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Git-like Branch Model | ⭐⭐⭐⭐⭐ | Git-like 分支模型核心架構 |
| Database Schema | ⭐⭐⭐⭐⭐ | 51 張資料表架構 |
| Five Layer Architecture | ⭐⭐⭐⭐⭐ | 五層架構開發順序 |
| Layered Architecture | ⭐⭐⭐⭐ | 分層架構（routes → shared → core） |
| Database Table Structure | ⭐⭐⭐⭐ | 資料表結構規範 |

### 開發實踐（Development Practice）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Five Layer Development Order | ⭐⭐⭐⭐⭐ | 標準開發順序 |
| Types Layer Development | ⭐⭐⭐⭐⭐ | Types 層開發規範 |
| Repositories Layer Development | ⭐⭐⭐⭐⭐ | Repositories 層開發規範 |
| Models Layer Development | ⭐⭐⭐⭐⭐ | Models 層開發規範 |
| Services Layer Development | ⭐⭐⭐⭐⭐ | Services 層開發規範 |
| Facades Layer Development | ⭐⭐⭐⭐⭐ | Facades 層開發規範 |
| Routes Components Layer Development | ⭐⭐⭐⭐⭐ | Routes/Components 層開發規範 |
| Development Pre-Check | ⭐⭐⭐⭐ | 開發前檢查清單 |
| Development Post-Check | ⭐⭐⭐⭐ | 開發後檢查清單 |

### 設計模式（Pattern）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Repository Pattern | ⭐⭐⭐⭐⭐ | 資料存取模式 |
| SHARED_IMPORTS | ⭐⭐⭐⭐⭐ | 共用模組導入模式 |
| Component Design Patterns | ⭐⭐⭐⭐ | 組件設計模式 |
| Modal Design Patterns | ⭐⭐⭐ | Modal 設計模式 |
| Table Design Patterns | ⭐⭐⭐ | Table 設計模式 |
| Form Design Patterns | ⭐⭐⭐ | Form 設計模式 |

### 開發原則（Principle）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Four Core Development Principles | ⭐⭐⭐⭐⭐ | 四大核心開發原則 |
| SOLID Principles | ⭐⭐⭐⭐⭐ | SOLID 原則 |
| OnPush Strategy | ⭐⭐⭐⭐⭐ | 強制 OnPush 策略 |
| UI Component Priority | ⭐⭐⭐⭐⭐ | UI 元件優先級 |
| Consistency Principle | ⭐⭐⭐⭐ | 一致性原則 |
| Composability Principle | ⭐⭐⭐⭐ | 可組合性原則 |
| Dependency Direction Principle | ⭐⭐⭐⭐ | 依賴方向原則 |
| Low Coupling High Cohesion | ⭐⭐⭐⭐ | 低耦合高內聚 |

### 安全規範（Security）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Security Best Practices | ⭐⭐⭐⭐⭐ | 安全最佳實踐 |
| Authentication Flow | ⭐⭐⭐⭐⭐ | 認證流程 |
| Branch Permission Rules | ⭐⭐⭐⭐ | 分支權限規則 |
| RLS Policy Patterns | ⭐⭐⭐⭐ | RLS 策略模式 |

### 文檔導航（Documentation）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| Documentation Structure | ⭐⭐⭐⭐⭐ | 232 個文檔結構 |
| Documentation Priority System | ⭐⭐⭐⭐ | 文檔優先級系統 |
| Reading Paths | ⭐⭐⭐⭐ | 不同角色閱讀路徑 |
| Core Documentation Files | ⭐⭐⭐⭐ | 核心文檔引用 |
| Quick Reference Documents | ⭐⭐⭐ | 快速參考文檔 |

### 標準規範（Standard）
| 實體名稱 | 重要度 | 說明 |
|---------|--------|------|
| API Design Standards | ⭐⭐⭐⭐ | API 設計標準 |
| State Management Rules | ⭐⭐⭐⭐ | 狀態管理規則 |
| Error Handling Standards | ⭐⭐⭐⭐ | 錯誤處理標準 |
| Naming Conventions | ⭐⭐⭐⭐ | 命名規範 |
| Testing Strategy | ⭐⭐⭐⭐ | 測試策略 |

---

## 🎯 常見使用場景

### 場景 1：開發新功能

**步驟**：
1. 查詢 "Five Layer Development Order" → 了解開發順序
2. 查詢 "Repository Pattern" → 了解資料存取模式
3. 查詢 "Security Best Practices" → 確保安全性
4. 查詢 "UI Component Priority" → 選擇正確的 UI 元件
5. 查詢 "Testing Strategy" → 了解測試要求

**查詢命令**：
```bash
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Five Layer")) | .observations'
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Repository Pattern")) | .observations'
```

### 場景 2：代碼審查

**步驟**：
1. 查詢 "Four Core Development Principles" → 檢查是否符合核心原則
2. 查詢 "Code Review Standards" → 了解審查標準
3. 查詢 "SOLID Principles" → 檢查 SOLID 原則
4. 查詢 "Testing Strategy" → 檢查測試覆蓋率
5. 查詢 "Forbidden Practices" → 檢查禁止事項

**查詢命令**：
```bash
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Four Core")) | .observations'
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Forbidden")) | .observations'
```

### 場景 3：架構設計

**步驟**：
1. 查詢 "Git-like Branch Model" → 了解分支模型
2. 查詢 "Database Schema" → 了解資料表結構
3. 查詢 "Five Layer Architecture" → 了解分層架構
4. 查詢 "Dependency Direction Principle" → 確認依賴方向
5. 查詢 "Low Coupling High Cohesion" → 確保低耦合高內聚

**查詢命令**：
```bash
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Git-like")) | .observations'
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Database Schema")) | .observations'
```

### 場景 4：UI 開發

**步驟**：
1. 查詢 "UI Component Priority" → 了解 UI 元件優先級
2. 查詢 "OnPush Strategy" → 確保使用 OnPush
3. 查詢 "NG-ZORRO" → 了解 NG-ZORRO 使用規範
4. 查詢 "Component Design Patterns" → 了解組件設計模式
5. 查詢 "Responsive Design" → 確保響應式設計

**查詢命令**：
```bash
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("UI Component")) | .observations'
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("OnPush")) | .observations'
```

### 場景 5：安全相關

**步驟**：
1. 查詢 "Security Best Practices" → 了解安全最佳實踐
2. 查詢 "Authentication Flow" → 了解認證流程
3. 查詢 "Branch Permission Rules" → 了解權限規則
4. 查詢 "RLS Policy Patterns" → 了解 RLS 策略
5. 查詢 "Supabase" → 了解 Supabase 使用規範

**查詢命令**：
```bash
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Security")) | .observations'
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Authentication")) | .observations'
```

---

## 💡 最佳實踐

### ✅ 應該做的事

1. **任務開始前**：先查詢記憶庫相關實體
2. **設計決策時**：參考記憶庫中的原則和模式
3. **代碼實作時**：遵循記憶庫中的標準和規範
4. **遇到問題時**：搜尋記憶庫看是否有過往經驗
5. **完成任務後**：考慮是否需要更新記憶庫

### ❌ 不應該做的事

1. **不要忽略記憶庫**：記憶庫包含經過驗證的知識
2. **不要自創規範**：優先使用記憶庫中已有的規範
3. **不要重複犯錯**：學習記憶庫中記錄的教訓
4. **不要孤立開發**：記憶庫是團隊知識共享的基礎

---

## 🔄 如何更新記憶庫

### 何時應該更新？

- ✅ 發現新的最佳實踐
- ✅ 學到重要的教訓
- ✅ 架構或規範有變更
- ✅ 發現文檔中遺漏的重要資訊

### 更新格式

**新增實體**：
```json
{
  "type": "entity",
  "name": "實體名稱",
  "entityType": "分類",
  "observations": [
    "觀察 1",
    "觀察 2"
  ]
}
```

**新增關係**：
```json
{
  "type": "relation",
  "from": "來源實體",
  "to": "目標實體",
  "relationType": "關係類型"
}
```

### 更新流程

1. **確認必要性**：確認資訊是否真的需要記錄
2. **檢查重複**：確保不與現有實體重複
3. **格式正確**：遵循 JSONL 格式
4. **提交 PR**：透過 PR 流程審查更新
5. **更新文檔**：同步更新 MEMORY_SUMMARY.md

---

## 📊 記憶庫統計（v4.0）

### 實體統計（149 個）
- **Architecture**：5 個（架構設計）
- **Development Practice**：9 個（開發實踐）
- **Pattern**：6 個（設計模式）
- **Principle**：8 個（開發原則）
- **Security**：4 個（安全規範）
- **Documentation**：12 個（文檔導航）
- **Standard**：30+ 個（標準規範）
- **Feature**：15+ 個（功能特性）
- **其他**：60+ 個（技術棧、工具、約束等）

### 關係統計（170 個）
- **uses**：技術使用關係（30+ 個）
- **implements**：架構實作關係（40+ 個）
- **integrates**：技術整合關係（20+ 個）
- **enforces**：原則實作關係（30+ 個）
- **supports**：支援關係（25+ 個）
- **requires**：依賴關係（25+ 個）

---

## 🔗 相關資源

### 記憶庫文檔
- [README.md](../copilot/README.md) - 記憶庫說明
- [MEMORY_SUMMARY.md](../copilot/MEMORY_SUMMARY.md) - 記憶庫摘要
- [USAGE-GUIDE.md](../copilot/USAGE-GUIDE.md) - 詳細使用指南
- [AUTO-LOAD-IMPLEMENTATION.md](../copilot/AUTO-LOAD-IMPLEMENTATION.md) - 自動載入機制

### Agent 配置
- [agent-startup-checklist.md](./agent-startup-checklist.md) - Agent 啟動檢查清單
- [ng-alain-github-agent.md](./ng-alain-github-agent.md) - 主 Agent 配置
- [QUICK-START.md](./QUICK-START.md) - 快速開始指南

### 系統架構
- [01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構思維導圖
- [20-完整架構流程圖.mermaid.md](../../docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型
- [22-完整SQL表結構定義.md](../../docs/22-完整SQL表結構定義.md) - 51 張表結構

---

**最後更新**：2025-01-15  
**版本**：v1.0.0  
**維護者**：開發團隊
