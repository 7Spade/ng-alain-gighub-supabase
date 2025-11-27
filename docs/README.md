# ng-alain-gighub-supabase 文檔中心

> 企業級 Angular 20 + ng-alain + Supabase 應用程式完整技術文檔

**最後更新**：2025-11-27  
**文檔版本**：v2.1 (架構文檔重組版)

---

## 📚 文檔概覽

### 🤖 GitHub Copilot 配置

| 文件 | 說明 | 數量 |
|------|------|------|
| [README.agents.md](./README.agents.md) | Custom Agents 使用指南 | 49 個代理 |
| [README.instructions.md](./README.instructions.md) | Instructions 使用指南 | 22 個指令 |
| [README.prompts.md](./README.prompts.md) | Prompts 使用指南 | 71 個提示 |
| [README.collections.md](./README.collections.md) | Collections 使用指南 | 12 個集合 |

---

## 📁 文檔目錄

### 🏛️ 核心架構文檔

| 目錄 | 說明 | 文檔數 |
|------|------|--------|
| [architecture/](./architecture/) | **系統架構設計** - 完整架構圖與設計文檔 | 20 |

> 📌 架構文檔已於 2025-11-27 重新整理編號，採用十進位分類法：
> - 00: 基礎文檔
> - 01-09: 系統總覽
> - 10-19: 元件架構
> - 20-29: 資料架構
> - 30-39: 行為與事件
> - 40-49: 安全與存取
> - 50-59: 基礎設施
> - 60-69: 設計決策

---

### 📖 開發文檔

| 目錄 | 說明 | 目標讀者 |
|------|------|----------|
| [development/](./development/) | 開發入門指南 | 新成員、開發者 |
| [guides/](./guides/) | 完整開發指南集 (22+) | 所有開發者 |
| [specs/](./specs/) | 開發規範與 PRD | 開發者、架構師 |
| [standards/](./standards/) | 編碼標準與風格指南 | 所有開發者 |

---

### 🛠️ 環境與部署

| 目錄 | 說明 | 目標讀者 |
|------|------|----------|
| [setup/](./setup/) | 環境設定指南 | 新成員、DevOps |
| [deployment/](./deployment/) | 部署與回滾指南 | DevOps |

---

### 🔐 安全與參考

| 目錄 | 說明 | 目標讀者 |
|------|------|----------|
| [security/](./security/) | 安全評估與最佳實踐 | 安全團隊 |
| [reference/](./reference/) | API、資料庫、元件參考 (11) | 所有開發者 |

---

### ☁️ Supabase 整合

| 目錄 | 說明 | 目標讀者 |
|------|------|----------|
| [supabase/](./supabase/) | Supabase 企業級整合文檔 | 後端開發者 |
| ├─ architecture/ | Supabase 架構設計 | 架構師 |
| ├─ development/ | Supabase 開發指南 | 開發者 |
| ├─ deployment/ | Supabase 部署指南 | DevOps |
| ├─ security/ | Supabase 安全配置 | 安全團隊 |
| ├─ best-practices/ | Supabase 最佳實踐 | 所有開發者 |
| └─ api-reference/ | Supabase API 參考 | 開發者 |

---

### 📋 工作區系統

| 目錄 | 說明 | 目標讀者 |
|------|------|----------|
| [workspace/](./workspace/) | 工作區上下文系統文檔 (40+) | 前端開發者 |

---

## 🎯 快速導覽

### 👋 新成員入門路徑

1. **環境設定**：[setup/environment.md](./setup/environment.md)
2. **Supabase 設定**：[setup/supabase.md](./setup/supabase.md)
3. **架構概覽**：[architecture/00-architecture-design.md](./architecture/00-architecture-design.md)
4. **開發入門**：[development/getting-started.md](./development/getting-started.md)
5. **編碼標準**：[standards/coding-standards.md](./standards/coding-standards.md)

### 🏗️ 架構師路徑

1. **主架構文檔**：[architecture/00-architecture-design.md](./architecture/00-architecture-design.md)
2. **系統上下文**：[architecture/01-system-context.md](./architecture/01-system-context.md)
3. **元件架構**：[architecture/11-component-diagram.md](./architecture/11-component-diagram.md)
4. **安全矩陣**：[architecture/40-security-rls-matrix.md](./architecture/40-security-rls-matrix.md)
5. **設計決策**：[architecture/60-layers-atomization.md](./architecture/60-layers-atomization.md)

### 💻 開發者路徑

1. **開發最佳實踐**：[guides/development-best-practices.md](./guides/development-best-practices.md)
2. **狀態管理**：[guides/frontend-state-management-guide.md](./guides/frontend-state-management-guide.md)
3. **API 參考**：[reference/api-documentation.md](./reference/api-documentation.md)
4. **SQL Schema**：[reference/sql-schema-definition.md](./reference/sql-schema-definition.md)
5. **測試指南**：[guides/testing-guide.md](./guides/testing-guide.md)

### 🔧 DevOps 路徑

1. **部署指南**：[deployment/DEPLOYMENT.md](./deployment/DEPLOYMENT.md)
2. **回滾指南**：[deployment/ROLLBACK.md](./deployment/ROLLBACK.md)
3. **Supabase CI/CD**：[supabase/deployment/cicd.md](./supabase/deployment/cicd.md)
4. **監控告警**：[guides/monitoring-alerting-guide.md](./guides/monitoring-alerting-guide.md)

---

## 📊 文檔統計

| 類別 | 文檔數量 |
|------|----------|
| 架構文檔 | 20 |
| 開發指南 | 22+ |
| 開發規範 | 14+ |
| 參考文檔 | 11 |
| 工作區文檔 | 40+ |
| Supabase 文檔 | 20+ |
| **總計** | **130+** |

---

## 🔗 相關連結

### 專案根目錄

- [README.md](../README.md) - 專案主要說明
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 貢獻指南
- [CHANGELOG.md](./CHANGELOG.md) - 變更記錄

### GitHub Copilot 配置

- [.github/agents/](../.github/agents/) - Custom Agents
- [.github/instructions/](../.github/instructions/) - Instructions
- [.github/prompts/](../.github/prompts/) - Prompts

### 外部文檔

- [Angular 官方文檔](https://angular.dev)
- [ng-alain 文檔](https://ng-alain.com)
- [ng-zorro-antd 文檔](https://ng.ant.design)
- [Supabase 文檔](https://supabase.com/docs)

---

## 📝 維護記錄

| 日期 | 版本 | 變更說明 |
|------|------|----------|
| 2025-11-27 | v2.1 | 架構文檔重新整理與編號 |
| 2025-11-26 | v2.0 | Copilot 配置清理與更新 |
| 2025-11-25 | v1.5 | 同步 awesome-copilot 配置 |
| 2025-11-23 | v1.0 | 初始化文件結構 |

---

**維護者**：開發團隊  
**問題回報**：[GitHub Issues](https://github.com/7Spade/ng-alain-gighub-supabase/issues)
