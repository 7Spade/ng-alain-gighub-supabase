# 測試規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 測試規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

單元測試 coverage ≥ 80%。

任何 service 必須有獨立單元測試。

Component 測試需使用 Test Harness（Material/Zorro）。

e2e 必須覆蓋 user critical path。

mock API 不得依賴真實伺服器。

utils 需 100% 覆蓋率。

每個 PR 必須跑單元測試。

snapshot testing 禁止使用。

關鍵業務邏輯需 100% 覆蓋率（Git-like 分支模型、PR 機制、暫存區等）。

使用 Karma + Jasmine 進行單元測試。

使用 Angular Testing Utilities（TestBed、ComponentFixture、DebugElement）。

使用 `describe` 和 `it` 組織測試案例。

使用 `beforeEach` 和 `afterEach` 進行設置和清理。

使用 `expect` 進行斷言。

使用 `async` 和 `fakeAsync` 處理非同步操作。

使用 Mocks 和 Spies 隔離依賴。

測試邊界條件和錯誤情況。

保持測試獨立，不依賴執行順序。

測試案例名稱必須清晰可讀。

每個測試案例只測試一個功能。

Git-like 與暫存測試場景必須覆蓋：
- Fork / 分支建立（驗證 RLS + branch_roles）
- Pull Request 審查（檢查錯誤碼）
- 暫存區 48h 到期機制
- 撤回與確認行為

使用 `TestBed.runInInjectionContext` 測試 `inject()` 函數。

測試 Signals 使用 `computed()` 和 `effect()`。

測試表單驗證和錯誤處理。

測試路由守衛和權限驗證。

定期執行 `yarn test-coverage` 檢查覆蓋率。

覆蓋率報告輸出到 `coverage/` 目錄。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
