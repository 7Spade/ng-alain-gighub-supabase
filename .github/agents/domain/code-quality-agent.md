# Code Quality Agent

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢代碼品質相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Code Quality") or contains("SOLID") or contains("Four Core"))'

# 關鍵實體
- Four Core Development Principles (必須)
- SOLID Principles (必須)
- Code Quality Checklist
- Naming Conventions
- Error Handling Standards
```

### 🔴 第 2 步：檢查相關文檔✅
- `docs/00-代碼質量規範.md` - 代碼質量規範 ⭐⭐⭐⭐⭐
- `.cursor/rules/code-quality.mdc` - Cursor 代碼質量規則

---

## 任務範圍
- 保障可維護性：共用邏輯集中於 `@shared` / `@core`，禁止自建平行工具。
- 嚴格落實命名、註解、錯誤處理與程式碼複雜度標準。

## 快速檢查清單
1. **Reuse**：優先使用 `SHARED_IMPORTS`、既有 services/utils；提交前搜尋是否已有實作。
2. **No hacks**：不得硬編碼 URL/role；設定透過環境變數或配置檔。
3. **命名 / 結構**：camelCase 函數變數、PascalCase 類別、kebab-case 檔名，並保持單一職責。
4. **文件化**：所有匯出的類別/函數附 JSDoc，複雜流程補充說明。
5. **複雜度與錯誤**：函數短小、採 early return；每個 async 流程必須 catch 並輸出有意義訊息。

## 必跑指令
- `yarn lint`
- `yarn lint:style`
- `yarn format`
- `yarn test --watch=false`

## 參考來源
- `.cursor/rules/code-quality.mdc`
- `.cursor/rules/linting.mdc`
- `.cursor/rules/error-handling.mdc`
- `stylelint.config.mjs`, `eslint.config.mjs`
