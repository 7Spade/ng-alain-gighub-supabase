# 效能規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 效能規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

所有路由都強制 lazy loading。

使用 defer loading 加載非必要 UI。

SSR / SSG 與 hydration 作為企業標準。

LCP (Largest Contentful Paint) < 2.5s 為基準。

FID/INP (First Input Delay/Interaction to Next Paint) < 100ms。

CLS (Cumulative Layout Shift) < 0.1。

頁面載入時間 < 3 秒。

API 回應時間 < 500ms（95 百分位）。

資料庫查詢時間 < 100ms（簡單查詢）。

禁止大型第三方 library（需評估 bundle impact）。

必須使用 trackBy。

Component 必須 pure，我們禁止太多副作用（除了 effect）。

避免在 ngOnInit 放重運算。

使用 Web Worker 處理 heavy compute。

大量表格使用 virtual scroll。

定期監控 Bundle 大小（使用 `yarn analyze`）。

主 Bundle 保持在合理大小。

使用 Code Splitting 分割大型依賴。

使用 OnPush 變更檢測策略。

圖片使用 lazy loading（`loading="lazy"`）。

使用 CDN 快取靜態資源。

設定適當的 HTTP 快取標頭。

啟用 Gzip/Brotli 壓縮。

JavaScript Bundle < 500KB（gzipped）。

CSS Bundle < 50KB（gzipped）。

避免在模板中使用複雜運算（使用 `computed()` Signal）。

使用 `@defer` 延遲載入非關鍵元件。

優化圖片大小和格式（WebP/AVIF）。

避免記憶體洩漏。

常用查詢欄位建立索引。

避免 N+1 查詢。

使用分頁限制結果。

使用 Connection Pooling。

實作查詢快取（Redis）。

批次查詢合併。

使用 Cursor-based 分頁查詢。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
