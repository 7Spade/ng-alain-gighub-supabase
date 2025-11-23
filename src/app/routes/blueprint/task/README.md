# Task Module

任務模塊處理藍圖內的個別任務，包含指派與狀態追蹤。

## 模塊結構

```
task/
├── task-list/               # 任務列表元件
│   ├── task-list.component.ts
│   └── task-list.component.html
├── task-detail/             # 任務詳情元件
│   ├── task-detail.component.ts
│   └── task-detail.component.html
├── routes.ts                # 任務路由
└── README.md                # 本檔案
```

## 路由結構

- `/blueprint/:id/tasks` - 特定藍圖的任務列表
- `/blueprint/:id/tasks/:taskId` - 任務詳情

## 任務屬性

### 狀態 (TaskStatus)
- `todo` - 待辦
- `in_progress` - 進行中
- `done` - 完成
- `blocked` - 阻塞

### 優先級 (TaskPriority)
- `low` - 低
- `medium` - 中
- `high` - 高
- `critical` - 緊急

## 功能特色

### 已實作
- ✅ 任務列表顯示（使用 ST 表格）
- ✅ 任務狀態與優先級徽章
- ✅ 任務詳情頁面骨架
- ✅ 返回導航

### 待實作
- ⏳ Supabase 整合
- ⏳ 任務表單（建立/編輯）
- ⏳ 任務指派功能
- ⏳ 狀態變更追蹤
- ⏳ 任務篩選與排序
- ⏳ 批次操作

## 使用範例

```typescript
// 載入特定藍圖的任務
this.http.get(`/api/blueprints/${blueprintId}/tasks`);

// 建立新任務
const newTask: CreateTaskDto = {
  blueprint_id: 'xxx',
  title: '實作功能 A',
  priority: 'high'
};

// 更新任務狀態
const update: UpdateTaskDto = {
  status: 'done'
};
```

