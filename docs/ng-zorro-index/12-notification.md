# Notification - 通知提醒框（服務）

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzNotificationService` |
| **官方文檔** | [Notification](https://ng.ant.design/components/notification/en) |
| **Schematics 命令** | 暫無專用 schematics |

> **注意**：`Notification` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

## 使用方式

### 使用服務

```typescript
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-example',
  standalone: true,
  // ...
})
export class ExampleComponent {
  private notification = inject(NzNotificationService);

  showNotification() {
    this.notification.success('通知標題', '這是一條成功通知');
    this.notification.error('通知標題', '這是一條錯誤通知');
    this.notification.warning('通知標題', '這是一條警告通知');
    this.notification.info('通知標題', '這是一條信息通知');
  }
}
```

## 基本用法

```typescript
// 成功通知
this.notification.success('成功', '這是一條成功通知');

// 錯誤通知
this.notification.error('錯誤', '這是一條錯誤通知');

// 警告通知
this.notification.warning('警告', '這是一條警告通知');

// 信息通知
this.notification.info('信息', '這是一條信息通知');
```

## API

### NzNotificationService

通知提醒框服務，用於顯示全局通知消息。

#### 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `blank(title, content, [options])` | 顯示無圖標的通知 | `title: string \| TemplateRef<void>`, `content: NzNotificationContentType`, `options?: NzNotificationOptions` | `string` (通知 ID) |
| `success(title, content, [options])` | 顯示成功通知 | `title: string \| TemplateRef<void>`, `content: NzNotificationContentType`, `options?: NzNotificationOptions` | `string` (通知 ID) |
| `error(title, content, [options])` | 顯示錯誤通知 | `title: string \| TemplateRef<void>`, `content: NzNotificationContentType`, `options?: NzNotificationOptions` | `string` (通知 ID) |
| `info(title, content, [options])` | 顯示信息通知 | `title: string \| TemplateRef<void>`, `content: NzNotificationContentType`, `options?: NzNotificationOptions` | `string` (通知 ID) |
| `warning(title, content, [options])` | 顯示警告通知 | `title: string \| TemplateRef<void>`, `content: NzNotificationContentType`, `options?: NzNotificationOptions` | `string` (通知 ID) |
| `remove(id)` | 移除指定 ID 的通知，如果不提供 ID，則移除所有通知 | `id?: string` | `void` |

#### NzNotificationOptions 配置選項

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `nzKey` | 通知的唯一標識符 | `string` | `-` |
| `nzDuration` | 持續時間（毫秒），設置為 0 時不自動消失 | `number` | `4500` |
| `nzPauseOnHover` | 鼠標懸停時是否暫停自動消失 | `boolean` | `true` |
| `nzAnimate` | 是否啟用動畫 | `boolean` | `true` |
| `nzStyle` | 通知的自定義內聯樣式 | `object` | `-` |
| `nzClass` | 通知的自定義 CSS 類 | `object` | `-` |
| `nzData` | 用作通知模板上下文的數據 | `any` | `-` |
| `nzCloseIcon` | 自定義關閉按鈕的圖標 | `TemplateRef<void> \| string` | `-` |
| `nzButton` | 通知的自定義按鈕 | `TemplateRef<{ $implicit: NzNotificationComponent }> \| string` | `-` |
| `nzPlacement` | 通知的位置 | `'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight'` | `'topRight'` |
| `nzTop` | 通知距離頂部的位置（僅當 `nzPlacement` 為 `topLeft` 或 `topRight` 時有效） | `number` | `24` |
| `nzBottom` | 通知距離底部的位置（僅當 `nzPlacement` 為 `bottomLeft` 或 `bottomRight` 時有效） | `number` | `24` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/notification/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

