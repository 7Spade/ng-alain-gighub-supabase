# 一致性規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 一致性規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

全專案需統一採用 Angular 官方 Style Guide。

所有 Component / Service / Model 必須使用相同架構模板（Plop / Schematics）。

Import path 格式必須一致（都使用絕對路徑 alias，不可混用相對）。

所有 feature 的資料夾結構必須保持一致（pages → components → facades → services → repositories）。

所有 UI 互動行為需一致，例如：按鈕 loading、錯誤訊息格式、modal 操作流程。

API response handling 流程需一致：Repository → Model → Service → Facade → UI，不得跳階。

所有 Log 必須採用統一 logger utility，不可自行 console.log。

Error handling 流程必須統一：Interceptor → ErrorService → Facade → UI。

所有 async 作業統一使用 signal / RxJS，不可隨意混用不一致的風格。

Commit message 格式（Conventional Commits）強制統一。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
