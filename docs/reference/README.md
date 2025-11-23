# 參考文檔 (Reference Documentation)

> **目的**: 本目錄包含 ng-alain-gighub 專案的技術參考文檔與查詢資料

## 目標讀者 (Audience)

- 所有開發者
- 架構師
- 資料庫管理員
- AI Agents
- 技術寫作人員

## 文檔清單

### 資料庫參考 (Database Reference)

- **sql-schema-definition.md** ⭐⭐⭐⭐⭐ - 完整 SQL 表結構定義
  - 51 張資料表完整定義
  - 欄位說明
  - 索引與約束
  - 關聯關係

- **database-table-overview.md** - 資料表清單總覽
  - 11 個業務模組
  - 表名稱清單
  - 用途說明
  - 快速索引

- **data-model-mapping.md** - 資料模型對照表
  - 前端模型
  - 後端模型
  - DTO 轉換
  - 類型映射

- **state-enum-definitions.md** - 狀態枚舉值定義
  - 所有狀態枚舉
  - 值說明
  - 轉換規則
  - 使用範例

### API 參考 (API Reference)

- **api-documentation.md** - API 接口詳細文檔
  - RESTful API 列表
  - 請求/響應格式
  - 錯誤代碼
  - 範例請求

### 元件參考 (Component Reference)

- **shared-component-list.md** - 共用元件清單
  - 專案共用元件
  - 使用方式
  - Props 說明
  - 範例代碼

- **shared-imports-guide.md** ⭐ - SHARED_IMPORTS 使用指南
  - 共用模組匯入
  - 使用方式
  - 最佳實踐
  - 避免循環依賴

- **ng-zorro-component-cli-reference.md** - NG-ZORRO 組件清單與 CLI 指令
  - NG-ZORRO 組件清單
  - CLI 產生指令
  - 快速參考
  - 常用範例

### 套件索引 (Package Index)

- **delon-index.md** - @delon 套件索引
  - @delon/* 套件總覽
  - 快速索引
  - 使用指引
  - 詳見 [delon-index/](../delon-index/)

### 術語與詞彙 (Glossary)

- **glossary.md** - 詞彙表
  - 專案術語
  - 技術名詞
  - 縮寫說明
  - 中英對照

### AI 配置 (AI Configuration)

- **ai-assistant-role-configuration.md** - AI 助手角色配置
  - AI Agent 角色
  - 配置說明
  - 使用指引
  - 限制說明

## 使用方法 (Usage)

### 資料庫查詢

需要查詢資料表結構時：
1. 先查 **database-table-overview.md** 找到對應模組
2. 再查 **sql-schema-definition.md** 獲取詳細定義
3. 使用 **state-enum-definitions.md** 查詢狀態值

### API 開發

開發 API 相關功能時：
1. 參考 **api-documentation.md** 了解現有 API
2. 遵循 [specs/00-api-standards.md](../specs/00-api-standards.md) 開發新 API
3. 使用 **data-model-mapping.md** 進行資料轉換

### 元件開發

使用共用元件時：
1. 查詢 **shared-component-list.md** 確認是否已有類似元件
2. 參考 **shared-imports-guide.md** 正確匯入
3. 使用 **ng-zorro-component-cli-reference.md** 快速產生 NG-ZORRO 元件

### 術語統一

編寫文檔或代碼時：
1. 參考 **glossary.md** 使用統一術語
2. 確保中英文術語一致性
3. 新術語應更新到詞彙表

## 快速索引

### 按業務模組查詢

| 模組 | 資料表數 | 參考文檔 |
|------|---------|---------|
| 使用者與認證 | 5 | sql-schema-definition.md#users |
| 專案管理 | 8 | sql-schema-definition.md#projects |
| 工作區系統 | 3 | sql-schema-definition.md#workspaces |
| 任務與待辦 | 7 | sql-schema-definition.md#tasks |
| 問題管理 | 6 | sql-schema-definition.md#issues |
| 合併請求 | 5 | sql-schema-definition.md#pull-requests |
| 文件管理 | 5 | sql-schema-definition.md#files |
| 活動記錄 | 4 | sql-schema-definition.md#activities |
| 通知系統 | 3 | sql-schema-definition.md#notifications |
| 搜尋系統 | 2 | sql-schema-definition.md#search |
| 暫存區 | 3 | sql-schema-definition.md#staging |

### 按技術棧查詢

| 技術 | 參考文檔 |
|------|---------|
| Angular 20+ | [delon-index/](../delon-index/), [ng-zorro-index/](../ng-zorro-index/) |
| NG-ZORRO | ng-zorro-component-cli-reference.md, [ng-zorro-index/README.md](../ng-zorro-index/README.md) |
| @delon/* | delon-index.md, [delon-index/README.md](../delon-index/README.md) |
| Supabase | api-documentation.md, sql-schema-definition.md |
| TypeScript | glossary.md |

### 常用查詢

| 需求 | 參考文檔 |
|------|---------|
| 如何匯入共用模組？ | shared-imports-guide.md |
| 資料表有哪些欄位？ | sql-schema-definition.md |
| API 如何調用？ | api-documentation.md |
| 狀態值有哪些？ | state-enum-definitions.md |
| 術語如何翻譯？ | glossary.md |
| NG-ZORRO 有哪些元件？ | ng-zorro-component-cli-reference.md |

## 文檔特性

### 🔍 可搜尋
所有文檔支援全文搜尋，使用 Ctrl+F (Cmd+F) 快速查找。

### 📋 可複製
程式碼範例可直接複製使用。

### 🔗 交叉引用
文檔之間有完整的交叉引用連結。

### 📱 響應式
在各種裝置上都能良好閱讀。

## 維護指引

### 更新資料庫結構
當資料庫結構變更時：
1. 更新 **sql-schema-definition.md**
2. 同步更新 **database-table-overview.md**
3. 檢查 **data-model-mapping.md** 是否需要調整
4. 更新 **state-enum-definitions.md**（如有新狀態）

### 新增 API
新增 API 時：
1. 在 **api-documentation.md** 記錄新 API
2. 更新相關的請求/響應範例
3. 同步更新前端模型（**data-model-mapping.md**）

### 新增共用元件
新增共用元件時：
1. 在 **shared-component-list.md** 記錄
2. 更新 **shared-imports-guide.md**（如需要）
3. 提供使用範例

### 術語管理
遇到新術語時：
1. 討論並確定統一翻譯
2. 更新 **glossary.md**
3. 在相關文檔中使用統一術語

## 參考資源 (References)

### 官方文檔
- [PostgreSQL 官方文檔](https://www.postgresql.org/docs/)
- [Supabase 文檔](https://supabase.com/docs)
- [Angular API 參考](https://angular.dev/api)
- [NG-ZORRO API](https://ng.ant.design/components/)
- [@delon 文檔](https://ng-alain.com/components/)

### 開發規範
- [specs/00-api-standards.md](../specs/00-api-standards.md) - API 開發規範
- [specs/00-component-standards.md](../specs/00-component-standards.md) - 元件開發規範
- [specs/00-naming-standards.md](../specs/00-naming-standards.md) - 命名規範

### 架構設計
- [architecture/20-complete-architecture-flowchart.mermaid.md](../architecture/20-complete-architecture-flowchart.mermaid.md)
- [architecture/21-architecture-review-report.md](../architecture/21-architecture-review-report.md)

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**文檔數量**: 11 個參考文檔  
**資料表總數**: 51 張表（11 個模組）
