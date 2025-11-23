# Tooltip - 文字提示

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTooltipModule` |
| **官方文檔** | [Tooltip](https://ng.ant.design/components/tooltip/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTooltipModule],
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

請參考 [官方文檔](https://ng.ant.design/components/tooltip/en) 查看詳細用法和示例。

## API

### nz-tooltip 指令

文字提示組件，當用戶懸停在元素上時顯示提示信息。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTooltipArrowPointAtCenter]` | 箭頭是否指向錨點中心 | `boolean` | `false` |
| `[nzTooltipTitle]` | 提示文字（必填） | `string \| TemplateRef<void>` | `-` |
| `[nzTooltipTitleContext]` | 提示文字的上下文 | `object` | `-` |
| `[nzTooltipTrigger]` | 觸發行為 | `'click' \| 'focus' \| 'hover' \| null` | `'hover'` |
| `[nzTooltipPlacement]` | 提示框位置 | `'top' \| 'left' \| 'right' \| 'bottom' \| 'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight' \| 'leftTop' \| 'leftBottom' \| 'rightTop' \| 'rightBottom' \| Array<string>` | `'top'` |
| `[nzTooltipColor]` | 提示框背景顏色 | `string` | `-` |
| `[nzTooltipOrigin]` | 用於定位提示框的元素 | `ElementRef` | `-` |
| `[nzTooltipVisible]` | 控制提示框的顯示/隱藏 | `boolean` | `false` |
| `[nzTooltipMouseEnterDelay]` | 鼠標移入後延遲多少秒顯示 | `number` | `0.15` |
| `[nzTooltipMouseLeaveDelay]` | 鼠標移出後延遲多少秒隱藏 | `number` | `0.1` |
| `[nzTooltipOverlayClassName]` | 提示框的 CSS 類名 | `string` | `-` |
| `[nzTooltipOverlayStyle]` | 提示框的樣式 | `object` | `-` |
| `(nzTooltipVisibleChange)` | 顯示/隱藏時觸發 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `show()` | 顯示提示框 |
| `hide()` | 隱藏提示框 |
| `updatePosition()` | 更新提示框位置 |

## 相關資源

- [官方文檔](https://ng.ant.design/components/tooltip/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

