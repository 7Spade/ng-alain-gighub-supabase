# Blueprint Module

藍圖模塊管理專案藍圖與架構定義，為上下文切換器提供基礎架構。

## 模塊結構

```
blueprint/
├── types/                    # 型別定義
│   ├── blueprint.types.ts    # 藍圖相關型別
│   ├── task.types.ts         # 任務相關型別
│   └── index.ts              # 型別匯出
├── blueprint-list/           # 藍圖列表元件
├── blueprint-detail/         # 藍圖詳情元件
├── task/                     # 任務子模塊
│   ├── task-list/            # 任務列表元件
│   ├── task-detail/          # 任務詳情元件
│   └── routes.ts             # 任務路由
├── routes.ts                 # 藍圖路由
└── README.md                 # 本檔案
```

## 路由結構

- `/blueprint` - 藍圖列表
- `/blueprint/:id` - 藍圖詳情
- `/blueprint/:id/tasks` - 特定藍圖的任務列表
- `/blueprint/:id/tasks/:taskId` - 任務詳情

## 功能特色

### 已實作
- ✅ 基礎路由結構
- ✅ 型別定義 (Blueprint, Task)
- ✅ 列表與詳情頁面骨架
- ✅ 使用 @delon/abc 元件 (ST 表格, PageHeader)
- ✅ 預留上下文切換器整合點

### 待實作
- ⏳ Supabase 整合 (CRUD 操作)
- ⏳ 表單驗證與提交
- ⏳ 即時資料更新
- ⏳ 權限管理
- ⏳ 上下文切換器功能

## 開發指南

### 建立新藍圖
1. 導航至 `/blueprint`
2. 點擊「建立藍圖」按鈕
3. 填寫表單並儲存

### 管理任務
1. 從藍圖列表點擊「任務」按鈕
2. 或在藍圖詳情頁點擊「檢視任務」
3. 建立、編輯或檢視任務

## 技術棧
- Angular 20.3.x (Standalone Components)
- ng-alain 20.1.0
- @delon/abc (ST, PageHeader)
- ng-zorro-antd (UI 元件)
- TypeScript 5.8.x

