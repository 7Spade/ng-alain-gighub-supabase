---
title: 日誌 (Diary) 每日記錄 功能設計
---

## 概要

此文件描述藍圖內用於記錄每日工地情況的 `diary`（每日記錄）設計。包含資料模型、使用流程、UI 建議、同步/儲存策略與匯出需求。

## 目的與範圍

- 目的：為專案/藍圖提供每日工地紀錄，包含進度、問題、天氣、現場照片與相關待辦或任務連結。
- 範圍：前端編輯器、檔案上傳、資料模型、API、權限與匯出功能。

## 使用情境 (User Flows)

1. 工地負責人於每日結束時新增 `diary` 條目，填寫當日摘要、進度、上傳照片、標記問題項目。
2. 系統自動於指定時間提醒相關負責人填寫日誌（可選）。
3. 其他成員於日誌下留言或追蹤問題，並可從日誌建立 `todo` 或任務。

## 資料模型 (建議)

Table: `diaries`

- `id` (uuid, PK)
- `blueprint_id` (uuid, required)
- `date` (date, required)
- `author_id` (uuid)
- `summary` (text)
- `progress_percent` (int 0-100)
- `weather` (text / enum)
- `photos` (jsonb) -- array of storage urls/metadata
- `attachments` (jsonb)
- `issues` (jsonb) -- 當日發現的問題清單
- `created_at`, `updated_at`

另建 `diary_comments`, `diary_history` 以保存留言與變更紀錄。

## UI/UX 建議

- 日曆檢視：可按日期瀏覽日誌。
- 列表檢視：顯示日期、作者、簡短摘要、進度條、照片縮圖。
- 編輯器：富文本 + 清單 + 拖放照片上傳 + 快速建立 `todo` 按鈕。
- 行動優先：照片拍照上傳與離線儲存能力（行動網路不穩時暫存）。

推薦元件：ng-zorro 的 `nz-calendar`, `nz-upload`, `nz-image`，編輯器可用 `ngx-tinymce`（專案已包含）。

## API 與整合

- GET `/api/diaries?blueprint_id={}&date={}`
- POST `/api/diaries` -- 建立日誌（包含 attachments metadata）
- PATCH `/api/diaries/{id}` -- 更新
- POST `/api/diaries/{id}/export` -- 匯出（PDF/CSV）

附件實際儲存在 Supabase Storage，API 僅儲存其 metadata（url、size、mime、storage_path）。

## 即時與同步

- 可用 Supabase Realtime 推送新建或更新事件。
- 行動離線策略：本地暫存（IndexedDB），恢復連線後上傳與同步，後端使用時間戳解衝突。

## 權限

- 一般閱讀：有藍圖存取權者。
- 建立/編輯：被授權為藍圖負責人或具編輯權限者。
- 匿名或公開日誌應由配置決定（大多數情況下為私有）。

## 匯出與報表

- 每日匯出 PDF（含照片）與 CSV（供數據分析）。
- 支援期間匯出（範圍日期）與按藍圖匯出。

## 測試與驗收

- 單元：API 行為、授權、檔案上傳 metadata 處理。
- E2E：照片上傳、離線儲存恢復、建立 todo 的連動。
- 驗收條件：日誌含照片時匯出 PDF 正確包含影像；離線建立後恢復連線資料一致無遺失。

## 資料庫範例

```sql
CREATE TABLE diaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id uuid NOT NULL,
  date date NOT NULL,
  author_id uuid NOT NULL,
  summary text,
  progress_percent int,
  weather text,
  photos jsonb,
  attachments jsonb,
  issues jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 尚未決定 / 待討論

- 圖片是否需自動壓縮與縮圖生成（以節省儲存與網路流量）？
- 匯出樣式（PDF 模版）由產品團隊提供樣式定義。

---

如果要，我可以把 `diary` 的前端編輯器 mock 與 API contract (OpenAPI) 一併產出。
