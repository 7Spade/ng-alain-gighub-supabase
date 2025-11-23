# Redis Database Schema for GitHub Copilot Agent

> **目的**：定義 GitHub Copilot Agent 使用的 Redis 資料庫架構，提供最適合 Agent 學習、成長和知識累積的資料結構

**版本**：v1.0.0  
**最後更新**：2025-11-21  
**適用對象**：所有 GitHub Copilot Agents

**相關文檔**：
- [Redis External Brain Guide](../../.github/agents/redis-external-brain-guide.md)
- [Redis Usage Guide](../guides/redis-usage-guide.md)
- [Memory Usage Guide](../../.github/agents/memory-usage-guide.md)

---

## 📋 目錄

1. [設計原則](#設計原則)
2. [鍵命名規範](#鍵命名規範)
3. [核心資料結構](#核心資料結構)
4. [TTL 策略](#ttl-策略)
5. [查詢模式](#查詢模式)
6. [最佳實踐](#最佳實踐)
7. [快速參考](#快速參考)
8. [Agent 工作流程整合](#agent-工作流程整合)

---

## 🎯 設計原則

### 1. 與 memory.jsonl 互補而非取代

**memory.jsonl（長期知識圖譜 - 149 實體 + 170 關係）**：
- ✅ 經過驗證的架構設計原則
- ✅ 企業級開發標準與最佳實踐
- ✅ 穩定的設計模式與反模式
- ✅ 232 個文檔的結構與閱讀路徑
- ✅ SOLID、DRY、KISS 等核心原則
- ✅ 五層架構開發順序
- ✅ Git-like 分支模型架構
- ✅ 51 張資料表結構

**Redis（動態學習資料庫）**：
- ✅ 用戶個人偏好與開發習慣
- ✅ 專案特定的動態知識
- ✅ 歷史決策記錄與經驗教訓
- ✅ 臨時快取數據（天氣、API 回應）
- ✅ 會話狀態與上下文
- ✅ 統計數據與成長追蹤
- ✅ 即時錯誤模式與修正策略

### 2. 分層設計

\`\`\`
┌──────────────────────────────────────────────────────────┐
│ Layer 1: 專案元資料（Project Metadata）                    │
│ - 專案基本資訊、技術棧版本、架構版本                          │
│ - TTL: 永久或長期（30天）                                   │
│ - 範例: ngalain:project:metadata                          │
└──────────────────────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 2: 使用者偏好（User Preferences）                    │
│ - 代碼風格、UI 偏好、工作流程習慣                            │
│ - TTL: 長期（30天）                                        │
│ - 範例: ngalain:user:preferences:{category}               │
└──────────────────────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 3: 專案知識（Project Knowledge）                     │
│ - 架構決策、API 慣例、命名規範、檔案結構                     │
│ - TTL: 中期（7天）                                         │
│ - 範例: ngalain:knowledge:{domain}                        │
└──────────────────────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 4: 歷史記錄（Historical Records）                    │
│ - 決策記錄、錯誤修正、模式發現、經驗教訓                      │
│ - TTL: 短期（3天，90天後歸檔）                              │
│ - 範例: ngalain:history:{type}:{timestamp}                │
└──────────────────────────────────────────────────────────┘
          ↓
┌──────────────────────────────────────────────────────────┐
│ Layer 5: 會話與快取（Session & Cache）                     │
│ - 會話狀態、臨時數據、查詢快取、天氣數據                      │
│ - TTL: 極短期（1小時-1天）                                  │
│ - 範例: ngalain:session:{id}, ngalain:cache:{category}    │
└──────────────────────────────────────────────────────────┘
\`\`\`

### 3. 可擴展性設計

- ✅ 使用命名空間前綴支援多專案（`ngalain:*`）
- ✅ 使用版本號支援 Schema 演進（`redis_schema_version`）
- ✅ 使用 JSON 格式支援靈活資料結構
- ✅ 支援未來新增資料類型（透過新 category）
- ✅ 與現有 MCP 工具整合（Redis MCP Server）

---

## 🔑 鍵命名規範

### 命名格式

\`\`\`typescript
{namespace}:{category}:{subcategory}:{identifier}
\`\`\`

**範例**：
\`\`\`
ngalain:project:metadata
ngalain:user:preferences:code_style
ngalain:knowledge:architecture
ngalain:history:decisions:20251121_130000
ngalain:session:abc123def456
ngalain:cache:weather:taipei:20251121
\`\`\`

### 命名空間（Namespace）

| 命名空間 | 專案 | 說明 |
|---------|------|------|
| `ngalain` | ng-alain-gighub | 本專案專用 |
| 未來可擴展 | 其他專案 | 預留擴展空間 |

### 分類（Category）

| 分類 | 說明 | 範例鍵名 | TTL |
|------|------|---------|-----|
| `project` | 專案元資料 | `ngalain:project:metadata` | 30天 |
| `user` | 使用者偏好 | `ngalain:user:preferences:code_style` | 30天 |
| `knowledge` | 專案知識 | `ngalain:knowledge:architecture` | 7天 |
| `history` | 歷史記錄 | `ngalain:history:decisions:20251121_001` | 3天 |
| `patterns` | 模式與慣例 | `ngalain:patterns:repository` | 7天 |
| `errors` | 錯誤與修正 | `ngalain:errors:common` | 7天 |
| `stats` | 統計數據 | `ngalain:stats:tasks` | 永久 |
| `session` | 會話狀態 | `ngalain:session:abc123` | 4小時 |
| `cache` | 臨時快取 | `ngalain:cache:weather:taipei` | 1-6小時 |

### 命名規則

✅ **DO（應該做的）**：
- 使用小寫字母和數字
- 使用底線 `_` 分隔單字
- 使用冒號 `:` 分隔層級
- 使用 ISO 8601 格式的日期時間（`YYYYMMDD_hhmmss`）
- 包含足夠的上下文資訊
- 使用語義化且易理解的名稱

❌ **DON'T（不應該做的）**：
- 不使用空格
- 不使用特殊字符（除了 `:` `_` `-`）
- 不使用過於簡短的縮寫
- 不使用無意義的名稱（如 `key1`, `data`, `temp`）
- 不使用中文字符

---

## 📦 核心資料結構

### 1. 專案元資料（Project Metadata）

**鍵名**：`ngalain:project:metadata`

**用途**：儲存專案基本資訊，供 Agent 快速了解專案背景

**資料結構**：
\`\`\`typescript
interface ProjectMetadata {
  // 基本資訊
  name: string;                     // "ng-alain-gighub"
  version: string;                  // "1.0.0"
  description: string;              // 專案描述
  
  // 技術棧
  tech_stack: {
    frontend: string[];             // ["Angular 20.3.x", "NG-ZORRO 20.3.x"]
    backend: string[];              // ["Supabase", "PostgreSQL 15+"]
    tools: string[];                // ["TypeScript 5.9+", "RxJS 7.8.x"]
  };
  
  // 架構資訊
  architecture: {
    model: string;                  // "Git-like Branch Model"
    layers: number;                 // 6 (Types → Components)
    database_tables: number;        // 51
    core_modules: number;           // 9
    rls_enabled: boolean;           // true
  };
  
  // 文檔資訊
  documentation: {
    total_docs: number;             // 232
    core_docs: number;              // 14 (00- prefix)
    architecture_diagrams: number;  // 20 (01-20)
    memory_entities: number;        // 149
    memory_relations: number;       // 170
  };
  
  // 元資料
  created_at: string;               // ISO 8601
  updated_at: string;               // ISO 8601
  redis_schema_version: string;     // "1.0.0"
}
\`\`\`

**JSON 範例**：
\`\`\`json
{
  "name": "ng-alain-gighub",
  "version": "1.0.0",
  "description": "企業級資源中心（Git-like 分支模型）",
  "tech_stack": {
    "frontend": ["Angular 20.3.x", "NG-ZORRO 20.3.x", "ng-alain 20.x"],
    "backend": ["Supabase", "PostgreSQL 15+"],
    "tools": ["TypeScript 5.9+", "RxJS 7.8.x", "Angular Signals"]
  },
  "architecture": {
    "model": "Git-like Branch Model",
    "layers": 6,
    "database_tables": 51,
    "core_modules": 9,
    "rls_enabled": true
  },
  "documentation": {
    "total_docs": 232,
    "core_docs": 14,
    "architecture_diagrams": 20,
    "memory_entities": 149,
    "memory_relations": 170
  },
  "created_at": "2025-11-21T00:00:00Z",
  "updated_at": "2025-11-21T13:00:00Z",
  "redis_schema_version": "1.0.0"
}
\`\`\`

**TTL**：30 天（定期更新）

**使用場景**：
- Agent 啟動時載入專案背景
- 快速了解技術棧與架構
- 驗證 Redis Schema 版本

---

### 2. 使用者偏好（User Preferences）

#### 2.1 代碼風格偏好

**鍵名**：`ngalain:user:preferences:code_style`

**用途**：記錄用戶的代碼風格偏好，Agent 產生代碼時遵循

**資料結構**：
\`\`\`typescript
interface CodeStylePreferences {
  // TypeScript 風格
  indentation: string;              // "2 spaces" | "4 spaces" | "tabs"
  quotes: string;                   // "single" | "double"
  semicolons: boolean;              // true | false
  trailing_comma: string;           // "none" | "es5" | "all"
  
  // 命名規範偏好
  naming_convention: {
    variables: string;              // "camelCase"
    constants: string;              // "UPPER_SNAKE_CASE"
    types: string;                  // "PascalCase"
    interfaces: string;             // "IPascalCase" | "PascalCase"
    files: string;                  // "kebab-case" | "PascalCase"
  };
  
  // Angular 風格偏好
  component_structure: string;      // "standalone" (必須)
  change_detection: string;         // "OnPush" (必須)
  template_syntax: string;          // "@if/@for/@switch" (必須)
  dependency_injection: string;     // "inject()" (推薦)
  
  // 測試風格
  test_framework: string;           // "jasmine" | "jest"
  test_coverage_target: number;     // 0.80 (80%)
  test_style: string;               // "describe/it" | "test"
  
  // 註釋風格
  comments_style: string;           // "TSDoc" | "JSDoc" | "minimal"
  inline_comments: boolean;         // true | false
  
  // 元資料
  updated_at: string;
  usage_count: number;              // 使用次數統計
}
\`\`\`

**JSON 範例**：
\`\`\`json
{
  "indentation": "2 spaces",
  "quotes": "single",
  "semicolons": true,
  "trailing_comma": "es5",
  "naming_convention": {
    "variables": "camelCase",
    "constants": "UPPER_SNAKE_CASE",
    "types": "PascalCase",
    "interfaces": "PascalCase",
    "files": "kebab-case"
  },
  "component_structure": "standalone",
  "change_detection": "OnPush",
  "template_syntax": "@if/@for/@switch",
  "dependency_injection": "inject()",
  "test_framework": "jasmine",
  "test_coverage_target": 0.80,
  "test_style": "describe/it",
  "comments_style": "TSDoc",
  "inline_comments": false,
  "updated_at": "2025-11-21T13:00:00Z",
  "usage_count": 47
}
\`\`\`

**TTL**：30 天

**使用場景**：
- Agent 產生代碼時應用風格偏好
- 代碼審查時檢查風格一致性
- 記錄用戶習慣的變化

---

(繼續在下一個訊息中完成其餘部分...)
