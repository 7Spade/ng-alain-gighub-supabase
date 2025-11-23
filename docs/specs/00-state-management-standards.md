# 狀態管理規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 狀態管理規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

Signals 為預設 state solution。

RxJS 僅用於 multi-stream event、websocket、long polling。

每個 feature 必須有自己的 facade。

禁止使用 BehaviorSubject 當全域狀態。

全域設定使用 AppState（signal 模式）。

禁止在 component 使用 shareReplay 或 publishReplay。

禁止在 component map/switchMap → 直接在 service。

API response → repository → model → service → facade → UI。

使用 `signal()` 建立響應式狀態。

使用 `computed()` 建立衍生狀態，自動追蹤依賴。

使用 `effect()` 處理副作用（需謹慎使用，避免循環依賴）。

Services 應暴露 `ReadonlySignal` 給元件使用狀態。

禁止在元件中直接修改 Signal（使用 `update()` 或 `set()` 方法）。

禁止在模板中直接寫入 Signal（Signal 為唯讀）。

在模板中呼叫 Signal 必須使用括號：`{{ mySignal() }}`。

使用 `readonly` 修飾符保護 Signal 的不可變性。

禁止在 Signal 中使用 `any` 型別。

Facade 必須可被 stub/mock，用於大型企業測試需求。

狀態更新時機必須正確（確保 loading 狀態的設置和清除是配對的）。

避免在子元件中修改父元件依賴的狀態。

檢查單例服務的使用，確保多個元件使用同一個服務時不會互相干擾。

優先加載主要功能，輔助功能非阻塞加載。

使用 `resource()` 管理非同步資料。

使用 `rxResource()` 整合 RxJS 資料流。

狀態管理必須遵循單一職責原則。

避免全局狀態污染（單例服務的狀態是全局的）。

狀態更新必須通過明確的方法（`set()`、`update()`）。

禁止在 Signal 中儲存複雜物件（使用不可變資料結構）。

使用 `computed()` 避免在模板中重複計算。

狀態初始化必須在元件或服務的建構函數中完成。

禁止在 `effect()` 中修改依賴的 Signal（會導致循環依賴）。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
