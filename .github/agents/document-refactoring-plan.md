# 文檔重構計劃

> **版本**: 1.0.0  
> **建立日期**: 2025-01-20  
> **狀態**: 進行中

## 目的

本文檔記錄 ng-alain-gighub 專案文檔標準化的詳細重構計劃，包括檔案重命名、目錄重組與內容修正。

---

## 文檔分類與重命名對照表

### 根目錄文檔

| 當前檔名 | 新檔名 | 狀態 | 說明 |
|----------|--------|------|------|
| README.md | README.md | ✅ 保持 | 專案主說明 |
| README-zh_CN.md | README-zh_CN.md | ✅ 保持 | 簡體中文版 |
| CONTRIBUTING.md | CONTRIBUTING.md | ✅ 保持 | 貢獻指南 |
| AGENTS.md | AGENTS.md | ✅ 保持 | AI Agent 總覽 |
| CLAUDE.md | CLAUDE.md | ✅ 保持 | Claude AI 配置 |
| GEMINI.md | GEMINI.md | ✅ 保持 | Gemini AI 配置 |

### Copilot 指引文檔

| 當前檔名 | 新檔名 | 狀態 |
|----------|--------|------|
| .copilot-instructions.md | .copilot-instructions.md | ✅ 保持 |
| .copilot-review-instructions.md | .copilot-review-instructions.md | ✅ 保持 |
| .copilot-commit-message-instructions.md | .copilot-commit-message-instructions.md | ✅ 保持 |
| .copilot-pull-request-description-instructions.md | .copilot-pull-request-description-instructions.md | ✅ 保持 |
| .copilot-test-instructions.md | .copilot-test-instructions.md | ✅ 保持 |

---

## docs/ 目錄重構計劃

### 規範文檔 (Specifications) → `docs/specs/`

| 序號 | 當前檔名 | 新檔名 | 英文檔名建議 |
|------|----------|--------|-------------|
| 00 | 00-現代化語法規範.md | 00-modern-syntax-standards.md | ✅ |
| 00 | 00-API規範.md | 00-api-standards.md | ✅ |
| 00 | 00-Component規範.md | 00-component-standards.md | ✅ |
| 00 | 00-DevOps規範.md | 00-devops-standards.md | ✅ |
| 00 | 00-State規範.md | 00-state-management-standards.md | ✅ |
| 00 | 00-SRP.md | 00-single-responsibility-principle.md | ✅ |
| 00 | 00-一致性規範.md | 00-consistency-standards.md | ✅ |
| 00 | 00-可組合性規範.md | 00-composability-standards.md | ✅ |
| 00 | 00-可維護性規範.md | 00-maintainability-standards.md | ✅ |
| 00 | 00-命名標準化規範.md | 00-naming-standards.md | ✅ |
| 00 | 00-安全規範.md | 00-security-standards.md | ✅ |
| 00 | 00-性能規範.md | 00-performance-standards.md | ✅ |
| 00 | 00-架構治理規範.md | 00-architecture-governance-standards.md | ✅ |
| 00 | 00-測試規範.md | 00-testing-standards.md | ✅ |
| 00 | 00-文檔總覽與索引.md | 00-documentation-overview.md | ✅ |

### 架構文檔 (Architecture) → `docs/architecture/`

| 序號 | 當前檔名 | 新檔名 |
|------|----------|--------|
| 01 | 01-系統架構思維導圖.mermaid.md | 01-system-architecture-mindmap.mermaid.md |
| 02 | 02-專案結構流程圖.mermaid.md | 02-project-structure-flowchart.mermaid.md |
| 03 | 03-系統上下文圖.mermaid.md | 03-system-context-diagram.mermaid.md |
| 04 | 04-業務流程圖.mermaid.md | 04-business-process-flowchart.mermaid.md |
| 05 | 05-帳戶層流程圖.mermaid.md | 05-account-layer-flowchart.mermaid.md |
| 06 | 06-實體關係圖.mermaid.md | 06-entity-relationship-diagram.mermaid.md |
| 07 | 07-資料生命週期-ETL-流程圖.mermaid.md | 07-data-lifecycle-etl-flowchart.mermaid.md |
| 08 | 08-Storage-Bucket結構視圖.mermaid.md | 08-storage-bucket-structure-view.mermaid.md |
| 09 | 09-安全與-RLS-權限矩陣.md | 09-security-rls-permission-matrix.md |
| 10 | 10-容器圖.mermaid.md | 10-container-diagram.mermaid.md |
| 11 | 11-元件模組視圖.mermaid.md | 11-component-module-view.mermaid.md |
| 12 | 12-元件模組視圖-補充.md | 12-component-module-view-supplement.md |
| 13 | 13-序列圖.mermaid.md | 13-sequence-diagram.mermaid.md |
| 14 | 14-狀態圖.mermaid.md | 14-state-diagram.mermaid.md |
| 15 | 15-領域事件時間軸圖.mermaid.md | 15-domain-event-timeline.mermaid.md |
| 17 | 17-Supabase架構流程圖.mermaid.md | 17-supabase-architecture-flowchart.mermaid.md |
| 18 | 18-部署基礎設施視圖.mermaid.md | 18-deployment-infrastructure-view.mermaid.md |
| 20 | 20-完整架構流程圖.mermaid.md | 20-complete-architecture-flowchart.mermaid.md |
| 21 | 21-架構審查報告.md | 21-architecture-review-report.md |

### 開發指南 (Guides) → `docs/guides/`

| 序號 | 當前檔名 | 新檔名 |
|------|----------|--------|
| 24 | 24-開發前檢查清單.md | pre-development-checklist.md |
| 25 | 25-快速開始指南.md | getting-started.md |
| 28 | 28-開發工作流程.md | development-workflow.md |
| 29 | 29-常見問題-FAQ.md | frequently-asked-questions.md |
| 30 | 30-錯誤處理指南.md | error-handling-guide.md |
| 31 | 31-測試指南.md | testing-guide.md |
| 32 | 32-部署指南.md | deployment-guide.md |
| 33 | 33-效能優化指南.md | performance-optimization-guide.md |
| 34 | 34-安全檢查清單.md | security-checklist.md |
| 42 | 42-開發最佳實踐指南.md | development-best-practices.md |
| 43 | 43-Agent開發指南與限制說明.md | agent-development-guide.md |
| 44 | 44-企業級任務系統開發指令.md | enterprise-task-system-instructions.md |
| 45 | 45-版本管理與發布指南.md | version-management-release-guide.md |
| 46 | 46-監控與告警配置指南.md | monitoring-alerting-guide.md |
| 47 | 47-災難恢復與備份指南.md | disaster-recovery-backup-guide.md |
| 48 | 48-代碼審查規範.md | code-review-standards.md |
| 49 | 49-前端狀態管理指南.md | frontend-state-management-guide.md |
| 50 | 50-RLS策略開發指南.md | rls-policy-development-guide.md |
| 51 | 51-Edge-Function開發指南.md | edge-function-development-guide.md |
| 52 | 52-前端路由設計指南.md | frontend-routing-design-guide.md |
| 53 | 53-國際化與本地化指南.md | i18n-localization-guide.md |
| 54 | 54-UI-UX設計規範.md | ui-ux-design-standards.md |
| 55 | 55-移動端適配指南.md | mobile-adaptation-guide.md |
| 56 | 56-第三方服務整合指南.md | third-party-integration-guide.md |
| 57 | 57-Redis使用指南.md | redis-usage-guide.md |
| 60 | 60-開發者快速檢查清單.md | developer-quick-checklist.md |
| 61 | 61-開發疑難排解指南.md | development-troubleshooting-guide.md |

### 參考文檔 (Reference) → `docs/reference/`

| 序號 | 當前檔名 | 新檔名 |
|------|----------|--------|
| 22 | 22-完整SQL表結構定義.md | sql-schema-definition.md |
| 23 | 23-資料表清單總覽.md | database-table-overview.md |
| 26 | 26-API-接口詳細文檔.md | api-documentation.md |
| 27 | 27-資料模型對照表.md | data-model-mapping.md |
| 35 | 35-詞彙表.md | glossary.md |
| 36 | 36-狀態枚舉值定義.md | state-enum-definitions.md |
| 37 | 37-SHARED_IMPORTS-使用指南.md | shared-imports-guide.md |
| 38 | 38-ng-zorro-antd-組件清單與CLI指令.md | ng-zorro-component-cli-reference.md |
| 39 | 39-DELON-Index-索引.md | delon-index.md |
| 40 | 40-共用元件清單.md | shared-component-list.md |
| 41 | 41-AI助手角色配置.md | ai-assistant-role-configuration.md |

### 工作區文檔 (Workspace Context) → `docs/workspace/`

| 當前檔名 | 新檔名 |
|----------|--------|
| 58-工作區上下文功能總覽.md | workspace-context-overview.md |
| 工作區上下文使用與規劃指南.md | workspace-context-usage-guide.md |
| 工作區上下文切換流程圖.mermaid.md | workspace-context-switch-flowchart.mermaid.md |
| 工作區上下文系統架構審查.md | workspace-context-architecture-review.md |
| 工作區系統-快速參考指南.md | workspace-system-quick-reference.md |
| 個人上下文菜單功能說明-user-data.md | user-context-menu-documentation.md |
| 團隊上下文菜單功能說明-team-data.md | team-context-menu-documentation.md |
| 組織上下文菜單功能說明-organization-data.md | organization-context-menu-documentation.md |

### 特殊文檔

| 當前檔名 | 新位置 | 新檔名 |
|----------|--------|--------|
| README.md | docs/ | README.md (保持) |
| CHANGELOG.md | docs/ | CHANGELOG.md (保持) |
| markdown-organization-report.md | docs/archive/ | markdown-organization-report.md |

---

## 目錄結構重組

### 新增目錄

```text
├── specs/              # 新增：開發規範
├── architecture/       # 新增：架構文檔
├── guides/            # 新增：開發指南
├── reference/         # 新增：參考資料
├── workspace/         # 新增：工作區文檔
├── delon-index/       # 重命名：DELON-Index → delon-index
├── ng-zorro-index/    # 重命名：NG-ZORRO-Index → ng-zorro-index
└── archive/           # 保持：歸檔文檔
```

### 子目錄索引

每個新目錄需要建立 `README.md` 索引檔案。

---

## 內容修正清單

### 必要修正項目

所有文檔需要檢查並修正：

1. **檔案命名**
   - [ ] 改為 kebab-case
   - [ ] 移除空格與特殊字元
   - [ ] 統一使用英文檔名（中文作為 H1）

2. **標題結構**
   - [ ] 確保有 H1 標題
   - [ ] 修正跳級問題（H1→H3）
   - [ ] 標題使用繁體中文

3. **必要章節**
   - [ ] 新增「目的」章節
   - [ ] 新增「目標讀者」章節
   - [ ] 檢查是否有「使用方法」（指南類）
   - [ ] 檢查是否有「參考資源」

4. **格式修正**
   - [ ] 修正列表編號
   - [ ] 統一列表符號（-）
   - [ ] 程式碼區塊標註語言
   - [ ] 表格格式對齊

5. **語言統一**
   - [ ] 繁體中文（台灣用語）
   - [ ] 技術術語統一
   - [ ] 避免簡體用語

6. **連結更新**
   - [ ] 更新內部連結
   - [ ] 檢查連結有效性
   - [ ] 使用相對路徑

---

## 實施階段

### Phase 1: 建立新目錄結構 ✅
- [x] 建立 `docs/specs/`
- [x] 建立 `docs/architecture/`
- [x] 建立 `docs/guides/`
- [x] 建立 `docs/reference/`
- [x] 建立 `docs/workspace/`

### Phase 2: 移動與重命名檔案
- [ ] 移動規範文檔到 `specs/`
- [ ] 移動架構文檔到 `architecture/`
- [ ] 移動指南文檔到 `guides/`
- [ ] 移動參考文檔到 `reference/`
- [ ] 移動工作區文檔到 `workspace/`
- [ ] 重命名 `DELON-Index/` → `delon-index/`
- [ ] 重命名 `NG-ZORRO-Index/` → `ng-zorro-index/`

### Phase 3: 修正文檔內容
- [ ] 批次修正所有文檔的標題結構
- [ ] 新增缺失的必要章節
- [ ] 統一術語使用
- [ ] 修正格式問題
- [ ] 更新所有內部連結

### Phase 4: 建立索引與 TOC
- [ ] 建立各子目錄的 README.md
- [ ] 更新 `docs/README.md` 主索引
- [ ] 建立完整的 TOC
- [ ] 建立文檔用途清單

### Phase 5: 驗證與測試
- [ ] 檢查所有連結
- [ ] 驗證 Markdown 語法
- [ ] 確認目錄結構
- [ ] 最終審查

---

## 工具與腳本

### 需要開發的工具

1. **檔案重命名腳本**
   - 批次重命名檔案
   - 更新引用連結

2. **內容修正腳本**
   - 標題層級檢查
   - 術語統一替換
   - 格式修正

3. **連結檢查工具**
   - 檢查死連結
   - 更新相對路徑

4. **索引生成器**
   - 自動生成 TOC
   - 生成文檔摘要

---

## 風險與注意事項

### 風險

1. **檔案連結失效**：大量檔案重命名會導致現有連結失效
2. **Git 歷史**：重命名檔案可能影響 Git blame 追蹤
3. **外部引用**：其他專案或文件可能引用舊路徑

### 緩解措施

1. **分階段執行**：先建立新結構，再逐步移動
2. **保留重定向**：在舊位置留下指向新位置的說明
3. **批次更新連結**：使用腳本統一更新所有引用
4. **版本控制**：每個階段都要 commit，便於回溯

---

## 進度追蹤

### 完成項目
- [x] 建立標準化規範文檔
- [x] 建立重構計劃
- [ ] 建立新目錄結構
- [ ] ...

### 待完成項目
- [ ] 移動檔案
- [ ] 重命名檔案
- [ ] 修正內容
- [ ] 更新連結
- [ ] 建立索引
- [ ] 驗證測試

---

**最後更新**: 2025-01-20  
**負責人**: AI Agent Team  
**預計完成**: 2025-01-22
