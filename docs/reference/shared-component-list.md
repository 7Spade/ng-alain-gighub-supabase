# 共用元件清單 (Shared Components)

## 📑 目錄

- [📋 元件總覽](#-元件總覽)
  - [元件分類](#元件分類)
- [1️⃣ UI 基礎元件](#1-ui-基礎元件)
  - [1.1 FormErrorComponent](#11-formerrorcomponent)
  - [1.2 LoadingIndicatorComponent](#12-loadingindicatorcomponent)
  - [1.3 EmptyStateComponent](#13-emptystatecomponent)
  - [1.4 ConfirmationDialogService](#14-confirmationdialogservice)
- [2️⃣ 檔案管理元件](#2-檔案管理元件)
  - [2.1 PhotoGalleryComponent](#21-photogallerycomponent)
- [3️⃣ 協作通訊元件](#3-協作通訊元件)
  - [3.1 TodoWidgetComponent](#31-todowidgetcomponent)
  - [3.2 CommentThreadComponent](#32-commentthreadcomponent)
- [4️⃣ 數據分析元件](#4-數據分析元件)
  - [4.1 ChartWrapperComponent](#41-chartwrappercomponent)
- [5️⃣ 品質驗收元件](#5-品質驗收元件)
  - [5.1 QcCameraComponent](#51-qccameracomponent)
- [📦 使用方式](#-使用方式)
  - [在模組中使用](#在模組中使用)
  - [個別導入](#個別導入)
- [🧪 測試指南](#-測試指南)
  - [執行測試](#執行測試)
  - [測試狀態](#測試狀態)
- [🎨 設計原則](#-設計原則)
- [📚 相關文件](#-相關文件)
- [🔄 版本歷史](#-版本歷史)
  - [v1.0 (2025-11-16)](#v10-2025-11-16)
- [🚀 未來計劃](#-未來計劃)
  - [Phase 2: 增強現有元件](#phase-2-增強現有元件)
  - [Phase 3: 新增元件](#phase-3-新增元件)
  - [Phase 4: 文檔和範例](#phase-4-文檔和範例)
- [✨ 貢獻指南](#-貢獻指南)

---


> **目的**：列出所有已實作的企業級共用元件，提供使用指南和範例

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊

- --

## 📋 元件總覽

本專案已實作 9 個企業級共用元件，涵蓋 UI 基礎、檔案管理、協作通訊、數據分析和品質驗收等領域。

### 元件分類

| 分類 | 元件數量 | 元件列表 |
|------|---------|---------|
| **UI 基礎元件** | 4 | FormError, LoadingIndicator, EmptyState, ConfirmationDialog |
| **檔案管理元件** | 1 | PhotoGallery |
| **協作通訊元件** | 2 | TodoWidget, CommentThread |
| **數據分析元件** | 1 | ChartWrapper |
| **品質驗收元件** | 1 | QcCamera |

- --

## 1️⃣ UI 基礎元件

### 1.1 FormErrorComponent

**用途**：統一顯示表單驗證錯誤訊息

**位置**：`src/app/shared/components/form-error/`

**功能特性**：
- 自動轉換 Angular 驗證錯誤為中文訊息
- 支援多種驗證類型（required, email, minlength, maxlength, min, max, pattern）
- OnPush 變更檢測
- 使用 Angular Signals

**使用範例**：
```html
<input
  nz-input
  formControlName="email"
  placeholder="電子郵件" />
<app-form-error [errors]="form.get('email')?.errors" />
```

**測試覆蓋率**：✅ 已提供單元測試

- --

### 1.2 LoadingIndicatorComponent

**用途**：統一的載入中狀態顯示

**位置**：`src/app/shared/components/loading-indicator/`

**功能特性**：
- 三種尺寸（small, default, large）
- 支援全螢幕模式
- 自訂載入文字
- OnPush 變更檢測

**使用範例**：
```html
<!-- 基本使用 -->
<app-loading-indicator [loading]="isLoading()" />

<!-- 全螢幕模式 -->
<app-loading-indicator
  [loading]="isLoading()"
  [fullscreen]="true"
  [text]="'處理中...'" />
```

**測試覆蓋率**：✅ 已提供單元測試

- --

### 1.3 EmptyStateComponent

**用途**：統一的空資料狀態顯示

**位置**：`src/app/shared/components/empty-state/`

**功能特性**：
- 自訂圖示和描述
- 支援操作按鈕
- 可配置圖片
- OnPush 變更檢測

**使用範例**：
```html
<!-- 基本使用 -->
<app-empty-state [description]="'暫無資料'" />

<!-- 帶操作按鈕 -->
<app-empty-state
  [description]="'暫無任務'"
  [icon]="'inbox'"
  [actionText]="'建立新任務'"
  (action)="createTask()" />
```

**測試覆蓋率**：✅ 已提供單元測試

- --

### 1.4 ConfirmationDialogService

**用途**：統一的確認對話框服務

**位置**：`src/app/shared/components/confirmation-dialog/`

**功能特性**：
- 多種對話框類型（confirm, delete, warning, success, error, info）
- 支援非同步操作
- 自訂按鈕文字
- 基於 NzModalService

**使用範例**：
```typescript
// 注入服務
constructor(private confirmService: ConfirmationDialogService) {}

// 確認對話框
handleDelete() {
  this.confirmService.confirmDelete({
    itemName: '此任務',
    onOk: () => this.deleteTask()
  });
}

// 成功提示
handleSuccess() {
  this.confirmService.success({
    title: '操作成功',
    content: '任務已建立'
  });
}
```

**測試覆蓋率**：✅ 已提供單元測試

- --

## 2️⃣ 檔案管理元件

### 2.1 PhotoGalleryComponent

**用途**：顯示照片集合，支援 Lightbox 檢視和 EXIF 資訊

**位置**：`src/app/shared/components/photo-gallery/`

**功能特性**：
- 照片網格佈局（響應式）
- Lightbox 模態框檢視
- EXIF 資訊顯示（相機、鏡頭、ISO、光圈、快門、焦距、GPS）
- 照片導航（上一張/下一張）
- 支援縮圖優化
- Hover 顯示標題

**資料介面**：
```typescript
interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  exif?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    dateTaken?: string;
    gps?: {
      latitude: number;
      longitude: number;
    };
  };
}
```

**使用範例**：
```html
<app-photo-gallery
  [photos]="photoList()"
  [showExif]="true" />
```

**測試覆蓋率**：⏳ 待補充

- --

## 3️⃣ 協作通訊元件

### 3.1 TodoWidgetComponent

**用途**：個人待辦清單小工具，用於側邊欄或儀表板

**位置**：`src/app/shared/components/todo-widget/`

**功能特性**：
- 五種狀態分類（🟦 待執行、🟨 暫存中、🟧 品管中、🟥 驗收中、⚠️ 問題追蹤）
- Tab 切換篩選
- 優先級標示（低、中、高、緊急）
- 狀態徽章
- 點擊事件支援
- 查看全部連結

**資料介面**：
```typescript
interface TodoItem {
  id: string;
  title: string;
  status: 'pending' | 'staging' | 'qc' | 'acceptance' | 'issue';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignee?: string;
}
```

**使用範例**：
```html
<app-todo-widget
  [todos]="todoList()"
  [loading]="isLoading()"
  (itemClick)="handleItemClick($event)"
  (statusChange)="handleStatusChange($event)"
  (viewAll)="navigateToTodoCenter()" />
```

**測試覆蓋率**：⏳ 待補充

- --

### 3.2 CommentThreadComponent

**用途**：巢狀留言討論，支援 @提及和即時更新

**位置**：`src/app/shared/components/comment-thread/`

**功能特性**：
- 巢狀留言（無限層級）
- @提及功能（自動高亮）
- 編輯/刪除權限控制
- Enter 發送、Shift+Enter 換行
- 顯示編輯狀態
- 回覆功能
- 用戶頭像顯示

**資料介面**：
```typescript
interface CommentData {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: CommentData[];
  mentions?: string[];
}
```

**使用範例**：
```html
<app-comment-thread
  [comments]="comments()"
  [currentUserId]="userId()"
  [currentUserName]="userName()"
  [currentUserAvatar]="userAvatar()"
  (commentSubmit)="handleSubmit($event)"
  (commentEdit)="handleEdit($event)"
  (commentDelete)="handleDelete($event)"
  (commentReply)="handleReply($event)" />
```

**測試覆蓋率**：⏳ 待補充

- --

## 4️⃣ 數據分析元件

### 4.1 ChartWrapperComponent

**用途**：統一的圖表顯示介面，支援多種圖表類型

**位置**：`src/app/shared/components/chart-wrapper/`

**功能特性**：
- 支援多種圖表類型（折線、柱狀、圓餅、環圈、雷達、極區）
- 載入狀態處理
- 資料預覽
- 自訂高度
- 圖表描述
- 預留 ECharts/ngx-charts 整合接口

**資料介面**：
```typescript
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
```

**使用範例**：
```html
<app-chart-wrapper
  [type]="'bar'"
  [data]="chartData()"
  [title]="'月度統計'"
  [height]="400"
  [description]="'近三個月任務完成統計'"
  [loading]="isLoading()" />
```

**測試覆蓋率**：⏳ 待補充

- --

## 5️⃣ 品質驗收元件

### 5.1 QcCameraComponent

**用途**：整合相機功能，支援拍照和照片標註

**位置**：`src/app/shared/components/qc-camera/`

**功能特性**：
- 相機整合（預留 WebRTC MediaDevices API）
- 拍照功能
- 照片標註（文字標註）
- 照片管理（編輯/刪除）
- 從檔案上傳
- 已拍攝照片網格預覽
- 標註模態框

**資料介面**：
```typescript
interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  annotations?: {
    text: string;
    x: number;
    y: number;
  }[];
}
```

**使用範例**：
```html
<app-qc-camera
  (photoCapture)="handlePhotoCapture($event)"
  (photosComplete)="handleComplete($event)" />
```

**事件處理**：
```typescript
handlePhotoCapture(photo: CapturedPhoto) {
  console.log('照片已拍攝:', photo);
}

handleComplete(photos: CapturedPhoto[]) {
  console.log('完成拍攝，共', photos.length, '張照片');
  // 上傳照片到 Storage
  this.uploadPhotos(photos);
}
```

**測試覆蓋率**：⏳ 待補充

- --

## 📦 使用方式

### 在模組中使用

所有元件已加入 `SHARED_IMPORTS` 陣列，可直接在 standalone 元件中使用：

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <app-loading-indicator [loading]="isLoading()" />
    <app-empty-state *ngIf="items().length === 0" />
  `
})
export class MyComponent {
  isLoading = signal(false);
  items = signal([]);
}
```

### 個別導入

也可以從 `@shared` 個別導入：

```typescript
import { FormErrorComponent } from '@shared';
import { LoadingIndicatorComponent } from '@shared';
```

- --

## 🧪 測試指南

### 執行測試

```bash
# 執行所有測試
yarn test

# 執行特定元件測試
ng test --include='**/form-error.component.spec.ts'

# 產生覆蓋率報告
yarn test-coverage
```

### 測試狀態

| 元件 | 單元測試 | 覆蓋率目標 | 狀態 |
|------|---------|-----------|------|
| FormErrorComponent | ✅ | 90%+ | 已完成 |
| LoadingIndicatorComponent | ✅ | 90%+ | 已完成 |
| EmptyStateComponent | ✅ | 90%+ | 已完成 |
| ConfirmationDialogService | ✅ | 90%+ | 已完成 |
| PhotoGalleryComponent | ⏳ | 85%+ | 待補充 |
| TodoWidgetComponent | ⏳ | 85%+ | 待補充 |
| CommentThreadComponent | ⏳ | 85%+ | 待補充 |
| ChartWrapperComponent | ⏳ | 80%+ | 待補充 |
| QcCameraComponent | ⏳ | 80%+ | 待補充 |

- --

## 🎨 設計原則

所有共用元件遵循以下設計原則：

1. **Standalone Components**：所有元件都是獨立元件
2. **OnPush 變更檢測**：使用 `ChangeDetectionStrategy.OnPush`
3. **Angular Signals**：使用 Signals 進行響應式狀態管理
4. **TypeScript 嚴格模式**：完整的類型定義
5. **JSDoc 註解**：詳細的元件和方法說明
6. **使用範例**：每個元件都提供使用範例
7. **可訪問性**：遵循 WCAG 2.1 標準
8. **響應式設計**：適配各種螢幕尺寸

- --

## 📚 相關文件

- [系統架構思維導圖](./10-系統架構思維導圖.mermaid.md)
- [帳戶層流程圖](./13-帳戶層流程圖.mermaid.md)
- [業務流程圖](./14-業務流程圖.mermaid.md)
- [元件模組視圖](./19-元件模組視圖.mermaid.md)
- [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md)
- [測試指南](./38-測試指南.md)

- --

## 🔄 版本歷史

### v1.0 (2025-11-16)
- ✅ 實作 9 個企業級共用元件
- ✅ 加入 SHARED_IMPORTS 陣列
- ✅ 通過編譯驗證
- ✅ 提供 4 個元件的單元測試
- ✅ 完整的 JSDoc 註解和使用範例

- --

## 🚀 未來計劃

### Phase 2: 增強現有元件
- [ ] 為剩餘 5 個元件補充單元測試
- [ ] PhotoGallery 整合實際的 EXIF 解析庫
- [ ] ChartWrapper 整合 ECharts 或 ngx-charts
- [ ] QcCamera 整合 WebRTC MediaDevices API

### Phase 3: 新增元件
- [ ] FileUploaderComponent（拖拽上傳、進度顯示）
- [ ] DataTableComponent（進階表格元件）
- [ ] TimelineComponent（時間軸元件）
- [ ] NotificationBadgeComponent（通知徽章）

### Phase 4: 文檔和範例
- [ ] Storybook 整合
- [ ] 元件使用範例頁面
- [ ] API 文檔自動生成

- --

## ✨ 貢獻指南

如需新增共用元件，請遵循以下流程：

1. 在 `src/app/shared/components/` 建立元件目錄
2. 實作元件（Standalone + OnPush + Signals）
3. 撰寫單元測試（目標覆蓋率 85%+）
4. 加入 `src/app/shared/index.ts` 導出
5. 加入 `src/app/shared/shared-imports.ts` 的 SHARED_IMPORTS 陣列
6. 更新本文檔
7. 提交 PR

- --

**維護者**：開發團隊
**更新日期**：2025-11-16
