# Popover - 氣泡卡片

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPopoverModule` |
| **官方文檔** | [Popover](https://ng.ant.design/components/popover/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzPopoverModule],
  // ...
})
export class ExampleComponent {}
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 ng-zorro-antd 組件
  // ...
})
export class ExampleComponent {}
```

## 基本用法

請參考 [官方文檔](https://ng.ant.design/components/popover/en) 查看詳細用法和示例。

## API

### nz-popover 指令

氣泡卡片組件，當用戶與目標元素交互時（例如點擊或懸停）顯示浮動卡片。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzPopoverArrowPointAtCenter]` | 箭頭是否指向錨點中心 | `boolean` | `false` |
| `[nzPopoverTitle]` | 氣泡卡片標題 | `string \| TemplateRef<void>` | `-` |
| `[nzPopoverTitleContext]` | 標題的上下文 | `object` | `-` |
| `[nzPopoverContent]` | 氣泡卡片內容 | `string \| TemplateRef<void>` | `-` |
| `[nzPopoverContentContext]` | 內容的上下文 | `object` | `-` |
| `[nzPopoverTrigger]` | 觸發行為 | `'click' \| 'focus' \| 'hover' \| null` | `'hover'` |
| `[nzPopoverPlacement]` | 氣泡卡片位置 | `'top' \| 'left' \| 'right' \| 'bottom' \| 'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight' \| 'leftTop' \| 'leftBottom' \| 'rightTop' \| 'rightBottom' \| Array<string>` | `'top'` |
| `[nzPopoverOrigin]` | 用於定位氣泡卡片的元素 | `ElementRef` | `-` |
| `[nzPopoverVisible]` | 控制氣泡卡片的顯示/隱藏 | `boolean` | `false` |
| `[nzPopoverMouseEnterDelay]` | 鼠標移入後延遲多少秒顯示 | `number` | `0.15` |
| `[nzPopoverMouseLeaveDelay]` | 鼠標移出後延遲多少秒隱藏 | `number` | `0.1` |
| `[nzPopoverOverlayClassName]` | 氣泡卡片的 CSS 類名 | `string` | `-` |
| `[nzPopoverOverlayStyle]` | 氣泡卡片的樣式 | `object` | `-` |
| `[nzPopoverBackdrop]` | 是否為覆蓋層附加背景 | `boolean` | `false` |
| `[nzPopoverOverlayClickable]` | 是否允許點擊背景關閉氣泡卡片，僅當 `nzPopoverTrigger` 為 `'click'` 時有效 | `boolean` | `true` |
| `(nzPopoverVisibleChange)` | 顯示/隱藏時觸發 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `show()` | 顯示氣泡卡片 |
| `hide()` | 隱藏氣泡卡片 |
| `updatePosition()` | 更新氣泡卡片位置 |

> **注意**：確保 `[nz-popover]` 節點可以接收 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

## 相關資源

- [官方文檔](https://ng.ant.design/components/popover/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

