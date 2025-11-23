# 可組合性規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 可組合性規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

所有 component 必須為可組合（Composable）的小單元，而不是 monolithic。

Shared component 必須具備 inputs / outputs 明確定義，不可綁定特定業務邏輯。

Component 必須「單一責任」：UI 相關 → UI；邏輯 → Facade；資料 → Repository。

Shared component 禁止耦合任何業務 model 或 service。

所有 UI component 必須 pure（不可有 side effect / fetch API）。

Component 設計應盡量「stateless」，狀態放在 facade（signals）。

企業級規範：所有複雜 UI 邏輯都必須封裝為 Directive，避免複製貼上。

多次使用的 business logic 必須抽到 Service，禁止藏在 component。

所有 utilities 必須 pure function，且獨立測試。

任何功能（feature）必須可獨立 lazy-load，不可牽動其他 feature。

API repository 必須可替換（可 mock / 可切後端 / 可切 fake backend）。

所有 Facade 必須可被 stub/mock，用於大型企業測試需求。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
