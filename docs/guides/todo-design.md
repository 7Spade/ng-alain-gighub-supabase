---
title: 待辦事項 (Todo) 功能設計
---

## 概要

此文件定義專案中 `todo`（待辦事項）功能的設計與實作指引。當使用者被指派任務或系統建立相關待辦項時，該待辦事項會出現在使用者的待辦列表中（藍圖內顯示）。

## 目的與範圍

- 目的：提供一個輕量、即時、可追蹤的待辦系統，用於記錄指派給使用者的任務或藍圖內檢查項。
- 範圍：UI/UX 規格、資料模型、API 合約、即時/通知行為、授權與可測試標準。

## 使用情境 (User Flows)

1. 管理者或系統在藍圖上建立任務並指派給使用者 → 被指派的使用者收到通知，該 `todo` 出現在其清單。
2. 使用者標記 `in-progress` / `done` → 系統更新狀態並可觸發後續事件（例如關閉相關任務、發送週報）。
3. 使用者可為 `todo` 新增評論或上傳附件。

## UX / UI 元件

- 列表視圖：標題、狀態、優先度、到期日、關聯藍圖/任務、指派者。
- 卡片/詳細視圖：完整描述、附件、評論區、活動記錄、狀態操作按鈕。
- 快捷建立面板：在藍圖上下文可快速建立 `todo`（預填關聯欄位）。

建議使用元件：ng-zorro 的 `nz-list` / `nz-card` / `nz-tag`、表單使用 `@delon/form` 或 `Reactive Forms`。

## 資料模型 (建議)

Table: `todos`

- `id` (uuid, PK)
- `title` (string, required)
- `description` (text)
- `assignee_id` (uuid, nullable)
- `creator_id` (uuid)
- `blueprint_id` (uuid, nullable) -- 關聯藍圖
- `task_id` (uuid, nullable) -- 關聯任務
- `status` (enum: open, in_progress, done, cancelled)
- `priority` (enum: low, normal, high)
- `due_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

關聯表：`todo_comments`, `todo_attachments`（可儲存檔案的 metadata，實際檔案放 Supabase Storage）。

## API 設計 (REST / GraphQL)

- GET `/api/todos?assignee={id}&status={}` -- 取得使用者待辦列表
- GET `/api/todos/{id}` -- 取得單一待辦詳細
- POST `/api/todos` -- 建立待辦
- PATCH `/api/todos/{id}` -- 更新（狀態變更、指派變更）
- POST `/api/todos/{id}/comments` -- 新增評論

回應應包含變更時間與事件版本號，方便前端做衝突處理。

## 即時與通知

- 使用 Supabase Realtime 或 WebSocket 推播：當 `todo` 建立或狀態變更時推送到相關使用者。
- 系統通知（站內）與 Email（選項）：新任務指派、到期提醒、狀態變更。

## 權限與可見性

- 一般原則：只有 `assignee`、`creator`、以及擁有對應藍圖存取權的使用者可讀取/更新。
- 管理者/特定角色可檢視跨藍圖報表。

## UI/UX 細節

- 列表排序：優先以狀態、優先度、到期日排序。
- 快速操作列：在清單每一項提供「標為完成」、「延後」、「轉為任務」等操作。
- 可批次選取多個 `todo` 進行狀態更新或改指派者。

## 儲存策略與備份

- 主要資料存在 Supabase Postgres，檔案附件存 Supabase Storage。
- 定期備份策略依專案部署流程（見 `docs/deployment/DEPLOYMENT.md`）。

## 測試與驗收標準

- 單元測試：API 行為（建立、更新、查詢）、權限檢查。
- E2E：指派流程、即時通知、附件上傳。
- 驗收條件：指派後 5 秒內可在前端看到新待辦；狀態變更能正確紀錄歷史。

## 資料庫範例 (Postgres / Supabase)

```sql
CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assignee_id uuid,
  creator_id uuid NOT NULL,
  blueprint_id uuid,
  task_id uuid,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normal',
  due_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 尚未決定 / 待討論事項

- 是否允許匿名任務或跨組織指派？
- 到期通知的頻率與重試策略。

---

如需我把此設計轉成 API 規格文件或 front-end component mockup，我可以繼續產出。
