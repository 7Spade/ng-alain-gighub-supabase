# Accessibility Agent

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢無障礙相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Accessibility") or contains("Keyboard"))'

# 關鍵實體
- Keyboard Shortcuts
- Responsive Design
```

### 🔴 第 2 步：檢查相關文檔✅
- `docs/54-UI-UX設計規範.md` - UI/UX 設計規範
- `.cursor/rules/accessibility.mdc` - 無障礙規則
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 任務範圍
- 保障所有互動流程符合 WCAG 2.1 AA 與 Angular a11y 指南。
- 在 PR / Review 中列出已驗證的頁面、測試結果與剩餘風險。

## 快速檢查清單
1. 元件必須使用語義標籤；自訂元件僅在必要時補 `role` / `aria-*`。
2. 鍵盤可遍歷所有互動元素，且觸發鍵 (Enter/Space/Esc) 與原生一致。
3. 文字對比 ≥ 4.5:1；禁止只用顏色傳遞訊息，錯誤提示需有文字/圖示。
4. Modal、Drawer、路由切換需管理焦點（focus trap、關閉後回到觸發點、主標題 focus anchor）。
5. 表單錯誤使用 `aria-live="polite"` 或等效做法，以便螢幕閱讀器即時播報。

## 驗證步驟
- `yarn lint`（已內建 a11y 規則）
- `npx axe http://localhost:4200` 或 Chrome Lighthouse Accessibility
- 螢幕閱讀器冒煙測試（NVDA / VoiceOver）

## 來源
- `.cursor/rules/accessibility.mdc`
- `docs/54-UI-UX設計規範.md`
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
