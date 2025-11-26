# ng-alain-gighub-supabase 文件

此資料夾包含本專案的完整技術文件與 GitHub Copilot 配置說明。

**最後更新**：2025-11-26

---

## 📚 文件概覽

### 核心文件

| 文件 | 說明 |
|------|------|
| [README.agents.md](./README.agents.md) | GitHub Copilot Custom Agents 使用指南（49 個代理）|
| [README.instructions.md](./README.instructions.md) | GitHub Copilot Instructions 使用指南（22 個指令）|
| [README.prompts.md](./README.prompts.md) | GitHub Copilot Prompts 使用指南（71 個提示）|
| [README.collections.md](./README.collections.md) | GitHub Copilot Collections 使用指南 |

### 專案文件

| 目錄 | 說明 |
|------|------|
| [architecture/](./architecture/) | 系統架構圖與資料庫設計 |
| [development/](./development/) | 開發指南與最佳實踐 |
| [deployment/](./deployment/) | 部署指南 |
| [guides/](./guides/) | 使用指南 |
| [reference/](./reference/) | 參考資料 |
| [security/](./security/) | 安全性文件 |
| [setup/](./setup/) | 環境設定 |
| [specs/](./specs/) | 技術規範 |
| [standards/](./standards/) | 開發標準 |
| [supabase/](./supabase/) | Supabase 後端整合文件 |
| [workspace/](./workspace/) | 工作區設定 |

---

## 🎯 快速導覽

### 新手入門

1. **環境設定**：[docs/supabase/development/setup.md](./supabase/development/setup.md)
2. **架構概覽**：[docs/architecture/01-system-architecture-mindmap.mermaid.md](./architecture/01-system-architecture-mindmap.mermaid.md)
3. **RLS 與安全**：[docs/supabase/security/rls.md](./supabase/security/rls.md)

### GitHub Copilot 配置

本專案包含精心挑選的 GitHub Copilot 配置，專為 Angular / ng-alain / Supabase 企業級開發設計：

| 類型 | 數量 | 說明 |
|------|------|------|
| **Agents** | 49 | 專案專屬代理、通用開發代理、進階自主代理 |
| **Instructions** | 22 | Angular、TypeScript、測試、安全性、CI/CD 指令 |
| **Prompts** | 71 | 文件產出、架構規劃、GitHub 整合、PostgreSQL 提示 |

---

## 📁 完整目錄結構

```
docs/
├── README.md                          # 本文件
├── README.agents.md                   # Agents 使用指南
├── README.collections.md              # Collections 使用指南
├── README.instructions.md             # Instructions 使用指南
├── README.prompts.md                  # Prompts 使用指南
├── CHANGELOG.md                       # 變更記錄
├── architecture/                      # 系統架構
├── deployment/                        # 部署指南
├── development/                       # 開發指南
├── guides/                            # 使用指南
├── reference/                         # 參考資料
├── security/                          # 安全性文件
├── setup/                             # 環境設定
├── specs/                             # 技術規範
├── standards/                         # 開發標準
├── supabase/                          # Supabase 整合
│   ├── architecture/                  # Supabase 架構
│   ├── development/                   # 開發設定
│   └── security/                      # 安全設定
└── workspace/                         # 工作區設定
```

---

## 🔗 相關連結

- **專案 README**：[../README.md](../README.md)
- **貢獻指南**：[../CONTRIBUTING.md](../CONTRIBUTING.md)
- **Copilot 配置**：[../.github/](./.github/)
  - [Agents](../.github/agents/)
  - [Instructions](../.github/instructions/)
  - [Prompts](../.github/prompts/)

---

## 維護記錄

- **2025-11-26**: 更新文件以反映 Copilot 配置清理後的狀態
- **2025-11-25**: 從 awesome-copilot 同步有價值的配置
- **2025-11-23**: 初始化文件結構
