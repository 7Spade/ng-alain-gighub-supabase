# 架構治理規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 架構治理規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

採用 Standalone Components（禁止建立 NgModule）。

採用 分層架構：routes → shared → core。

任何跨層通訊需透過明確的 public API（barrel file）。

禁止循環依賴（以 Nx enforce or lint rule）。

所有 UI component 必須為 Presentational（不含業務邏輯）。

所有 Service 必須為業務服務或基礎設施服務。

嚴禁在 Component 直接呼叫 HttpClient。

所有 API Call 必須被 Repository 層封裝。

DB model / API DTO 不可直接當 UI model 使用。

Routing 使用 feature-based lazy loading。

Component >500 行必須拆模組。

禁止 fat components：template <300 行、ts <300 行。

Signals 取代 RxJS state（除非必須多 event stream）。

使用 inject() 取代 constructor DI（除非要 mock）。

服務必須純粹邏輯，不能綁定 UI 或路徑。

禁止在 service 使用 localStorage（改用 StorageService abstraction）。

全域設定與狀態統一放在 AppConfig / AppState。

Feature 間的互動必須透過 Application Facade。

禁止把共用元件放在公共 root（以避免無限增大 shared）。

Feature 模組不可依賴 shared 的 business service。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
