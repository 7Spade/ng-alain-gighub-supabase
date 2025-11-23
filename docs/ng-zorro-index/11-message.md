# Message - 全局提示（服務）

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzMessageService` |
| **官方文檔** | [Message](https://ng.ant.design/components/message/en) |
| **Schematics 命令** | 暫無專用 schematics |

> **注意**：`Message` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

## 使用方式

### 使用服務

```typescript
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-example',
  standalone: true,
  // ...
})
export class ExampleComponent {
  private message = inject(NzMessageService);

  showMessage() {
    this.message.success('操作成功！');
    this.message.error('操作失敗！');
    this.message.warning('警告信息！');
    this.message.info('提示信息！');
  }
}
```

## 基本用法

```typescript
// 成功提示
this.message.success('這是一條成功提示');

// 錯誤提示
this.message.error('這是一條錯誤提示');

// 警告提示
this.message.warning('這是一條警告提示');

// 信息提示
this.message.info('這是一條信息提示');
```

## API

### NzMessageService

全局提示服務，用於顯示全局提示消息。

#### 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `success(content, [options])` | 顯示成功提示 | `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `error(content, [options])` | 顯示錯誤提示 | `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `info(content, [options])` | 顯示信息提示 | `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `warning(content, [options])` | 顯示警告提示 | `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `loading(content, [options])` | 顯示加載提示 | `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `create(type, content, [options])` | 創建指定類型的提示 | `type: 'success' \| 'info' \| 'warning' \| 'error' \| 'loading'`, `content: string \| TemplateRef<void>`, `options?: NzMessageOptions` | `string` (消息 ID) |
| `remove(id)` | 移除指定 ID 的提示，如果不提供 ID，則移除所有提示 | `id?: string` | `void` |

#### NzMessageOptions 配置選項

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `nzDuration` | 持續時間（毫秒），設置為 0 時不自動消失 | `number` | `3000` |
| `nzPauseOnHover` | 鼠標懸停時是否暫停自動消失 | `boolean` | `true` |
| `nzAnimate` | 是否啟用動畫 | `boolean` | `true` |
| `nzTop` | 消息距離頂部的位置 | `number` | `24` |
| `nzMaxStack` | 最大顯示數量，超過限制時，最早的消息會被自動移除 | `number` | `7` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/message/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

