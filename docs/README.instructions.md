# GitHub Copilot Instructions

本文件說明本專案保留的 GitHub Copilot 開發指令檔案，為程式碼生成提供上下文感知的指引。

**最後更新**：2025-11-26  
**檔案位置**：[.github/instructions/](../.github/instructions/)  
**指令數量**：22 個

---

## 如何運作

Instructions 檔案會自動被 GitHub Copilot 讀取，並根據 `applyTo` 配置應用於對應的檔案類型。當您在符合條件的檔案中編輯時，Copilot 會自動套用相關的最佳實踐。

---

## 指令分類索引

### Angular 開發類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [angular.instructions.md](../.github/instructions/angular.instructions.md) | Angular 專屬編碼標準與最佳實踐 | Angular 組件、服務、模組開發 |

**自動套用**：`**/*.ts, **/*.html, **/*.scss, **/*.css`

---

### TypeScript 開發類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [typescript-5-es2022.instructions.md](../.github/instructions/typescript-5-es2022.instructions.md) | TypeScript 5.x + ES2022 開發指南 | TypeScript 專案開發 |
| [typescript-mcp-server.instructions.md](../.github/instructions/typescript-mcp-server.instructions.md) | TypeScript MCP 伺服器開發指南 | Model Context Protocol 伺服器開發 |

**自動套用**：`**/*.ts, **/*.js, **/package.json`

---

### 測試類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [playwright-typescript.instructions.md](../.github/instructions/playwright-typescript.instructions.md) | Playwright 測試生成指令 | E2E 測試開發、測試結構、定位器、斷言最佳實踐 |

---

### 無障礙功能類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [a11y.instructions.md](../.github/instructions/a11y.instructions.md) | 無障礙程式碼指引 | 確保程式碼符合 WCAG 標準、鍵盤導航、螢幕閱讀器支援 |

---

### 安全性類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [security-and-owasp.instructions.md](../.github/instructions/security-and-owasp.instructions.md) | OWASP Top 10 安全編碼指引 | 安全程式碼撰寫、注入防護、驗證、加密 |

---

### CI/CD 與 DevOps 類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [actions.instructions.md](../.github/instructions/actions.instructions.md) | GitHub Actions 工作流程指引 | GitHub Actions YAML 檔案撰寫 |
| [github-actions-ci-cd-best-practices.instructions.md](../.github/instructions/github-actions-ci-cd-best-practices.instructions.md) | GitHub Actions CI/CD 最佳實踐 | 完整 CI/CD 管線設計、安全性、效能最佳化 |
| [devops-core-principles.instructions.md](../.github/instructions/devops-core-principles.instructions.md) | DevOps 核心原則 | CALMS 文化、DORA 指標、軟體交付最佳實踐 |

**自動套用**：`.github/workflows/**/*.yml`

---

### 程式碼品質類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [object-calisthenics.instructions.md](../.github/instructions/object-calisthenics.instructions.md) | Object Calisthenics 原則 | 業務領域程式碼的乾淨、可維護設計 |
| [self-explanatory-code-commenting.instructions.md](../.github/instructions/self-explanatory-code-commenting.instructions.md) | 自解釋程式碼註解指引 | 撰寫少量但有效的註解，解釋「為什麼」而非「做什麼」|

**自動套用**：`**/*.{cs,ts,java}`

---

### 效能最佳化類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [performance-optimization.instructions.md](../.github/instructions/performance-optimization.instructions.md) | 效能最佳化完整指南 | 前端、後端、資料庫效能調優，含檢查清單與故障排除 |

---

### Shell 腳本類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [shell.instructions.md](../.github/instructions/shell.instructions.md) | Shell 腳本最佳實踐 | Bash、sh、zsh 腳本撰寫 |

**自動套用**：`**/*.sh`

---

### 文件與本地化類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [markdown.instructions.md](../.github/instructions/markdown.instructions.md) | Markdown 文件撰寫標準 | 文件撰寫、內容結構、格式規範 |
| [localization.instructions.md](../.github/instructions/localization.instructions.md) | 本地化指引 | Markdown 文件翻譯與多語言支援 |

**自動套用**：`**/*.md`

---

### Copilot 配置類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [instructions.instructions.md](../.github/instructions/instructions.instructions.md) | 自訂指令檔案建立指南 | 建立高品質的 Copilot 自訂指令檔案 |
| [prompt.instructions.md](../.github/instructions/prompt.instructions.md) | Prompt 檔案建立指南 | 建立高品質的 Copilot Prompt 檔案 |
| [taming-copilot.instructions.md](../.github/instructions/taming-copilot.instructions.md) | Copilot 控制指引 | 防止 Copilot 過度修改程式碼庫 |

---

### 工作流程類

| 指令檔案 | 描述 | 適用場景 |
|----------|------|----------|
| [spec-driven-workflow-v1.instructions.md](../.github/instructions/spec-driven-workflow-v1.instructions.md) | 規格驅動工作流程 | 結構化軟體開發流程：需求 → 設計 → 實作 → 驗證 |
| [task-implementation.instructions.md](../.github/instructions/task-implementation.instructions.md) | 任務實作指引 | 任務計畫實作與進度追蹤（by microsoft/edge-ai）|
| [tasksync.instructions.md](../.github/instructions/tasksync.instructions.md) | TaskSync V4 | 任務完成後透過終端機提供新指令或回饋 |
| [memory-bank.instructions.md](../.github/instructions/memory-bank.instructions.md) | Memory Bank | AI 記憶重置後的專案知識庫維護 |

---

## 使用指南

### 按開發階段使用

| 階段 | 推薦指令 |
|------|----------|
| **開發前準備** | `spec-driven-workflow-v1.instructions.md` |
| **Angular 開發** | `angular.instructions.md` + `typescript-5-es2022.instructions.md` |
| **測試撰寫** | `playwright-typescript.instructions.md` |
| **程式碼審查** | `object-calisthenics.instructions.md` + `security-and-owasp.instructions.md` |
| **效能調優** | `performance-optimization.instructions.md` |
| **無障礙檢查** | `a11y.instructions.md` |
| **CI/CD 設定** | `github-actions-ci-cd-best-practices.instructions.md` |
| **文件撰寫** | `markdown.instructions.md` |

### 按檔案類型自動套用

| 檔案類型 | 自動套用的指令 |
|----------|----------------|
| `*.ts` | `angular.instructions.md`, `typescript-5-es2022.instructions.md` |
| `*.html`, `*.scss`, `*.css` | `angular.instructions.md` |
| `*.sh` | `shell.instructions.md` |
| `*.md` | `markdown.instructions.md` |
| `.github/workflows/*.yml` | `actions.instructions.md`, `github-actions-ci-cd-best-practices.instructions.md` |

---

## 主要指令說明

### `angular.instructions.md`
適用於 Angular 20+ 專案，涵蓋：
- Standalone Components 設計
- Angular Signals 狀態管理
- ng-zorro-antd UI 元件使用
- OnPush 變更檢測策略
- Lazy Loading 路由配置
- RxJS 資料流處理

### `typescript-5-es2022.instructions.md`
適用於 TypeScript 5.x 專案，涵蓋：
- 嚴格模式型別檢查
- ES2022 特性使用
- ESM 模組系統
- 非同步程式碼處理
- 安全實踐

### `security-and-owasp.instructions.md`
基於 OWASP Top 10，涵蓋：
- 注入攻擊防護
- 驗證與授權
- 敏感資料保護
- XSS 防護
- 安全配置

### `performance-optimization.instructions.md`
全面的效能指引，涵蓋：
- 前端效能（DOM、資產、網路）
- 後端效能（演算法、並行、快取）
- 資料庫效能（查詢、索引、正規化）
- 程式碼審查檢查清單

---

## 維護記錄

- **2025-11-26**: 更新文件以反映 Copilot 配置清理後的狀態
  - 移除：Joyride（Clojure）、MS SQL DBA、Node.js Vitest、PowerShell 等專用指令
  - 保留：22 個 Angular、TypeScript、測試、安全性、CI/CD、效能等相關指令
- **2025-11-25**: 從 awesome-copilot 複製有價值的 instructions
- **2025-11-23**: 初始化指令目錄

---

## 來源

部分指令精選自 [awesome-copilot](https://github.com/github/awesome-copilot) 開源專案。
