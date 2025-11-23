# 現代化語法規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 現代化語法規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

使用 `signal()` 建立響應式狀態，取代 BehaviorSubject。

使用 `computed()` 建立衍生狀態，自動追蹤依賴。

使用 `effect()` 處理副作用（需謹慎使用，避免循環依賴）。

使用 `input()` 取代 `@Input()` 裝飾器。

使用 `output()` 取代 `@Output()` 裝飾器。

使用 `input.required()` 標記必填輸入。

使用 `viewChild()` 取代 `@ViewChild()` 裝飾器。

使用 `contentChild()` 取代 `@ContentChild()` 裝飾器。

使用 `viewChildren()` 取代 `@ViewChildren()` 裝飾器。

使用 `contentChildren()` 取代 `@ContentChildren()` 裝飾器。

在模板中呼叫 Signal 必須使用括號：`{{ mySignal() }}`。

使用 `inject()` 取代 constructor DI（除非需要 mock）。

使用 `@if` 取代 `*ngIf`。

使用 `@for` 取代 `*ngFor`。

使用 `@switch` 取代 `[ngSwitch]`。

在 `@for` 中使用 `track` 函數優化效能。

在 `@for` 中使用 `@empty` 區塊處理空列表。

使用 `@defer` 延遲載入非關鍵元件。

`@defer` 必須搭配 `@placeholder`、`@loading`、`@error` 提供視覺回饋。

根據場景選擇 `@defer` 觸發條件：`on idle`、`on viewport`、`on hover`。

使用 `bootstrapApplication()` 取代 `bootstrapModule()`。

所有元件、指令、管道必須為 Standalone。

禁止建立 NgModule（除非必要）。

使用 Typed Forms 確保表單型別安全。

所有表單欄位必須有明確的型別定義。

使用 `resource()` 管理非同步資料。

使用 `rxResource()` 整合 RxJS 資料流。

在模板中避免複雜表達式，優先使用 `computed()` Signal。

Signal Inputs 自動提供型別安全，無需額外型別註解。

Signal Queries 回傳 Signal，在模板中必須使用括號呼叫。

使用 `withViewTransitions()` 啟用路由視圖轉場。

透過 `onViewTransitionCreated` 過濾僅 fragment/query 變更的導航。

自訂 `::view-transition-old/new` CSS 動畫需考慮 `prefers-reduced-motion`。

Services 應暴露 `ReadonlySignal` 給元件使用狀態。

禁止在元件中直接修改 Signal（使用 `update()` 或 `set()` 方法）。

使用 `signalControl()` 將表單控制項映射為 Signal。

禁止在模板中直接寫入 Signal（Signal 為唯讀）。

使用 `ng generate @angular/core:signal-input-migration` 遷移 `@Input`。

使用 `ng generate @angular/core:signal-queries-migration` 遷移查詢。

使用 `ng generate @angular/core:standalone` 自動遷移 Standalone。

啟用 `strictTemplates` 進行更好的型別檢查。

Angular 會自動偵測未使用的 Standalone imports。

禁止在 Signal 中使用 `any` 型別。

使用 `readonly` 修飾符保護 Signal 的不可變性。


---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
