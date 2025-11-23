# Drawer - 抽屜

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDrawerModule` |
| **官方文檔** | [Drawer](https://ng.ant.design/components/drawer/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDrawerModule],
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

請參考 [官方文檔](https://ng.ant.design/components/drawer/en) 查看詳細用法和示例。

## API

### nz-drawer 組件

抽屜組件，從屏幕邊緣滑入的抽屜式面板。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzClosable]` | 是否顯示右上角關閉按鈕 | `boolean` | `true` |
| `[nzMaskClosable]` | 點擊遮罩是否可以關閉 | `boolean` | `true` |
| `[nzMask]` | 是否顯示遮罩 | `boolean` | `true` |
| `[nzKeyboard]` | 是否支持按 ESC 關閉 | `boolean` | `true` |
| `[nzWidth]` | 抽屜寬度 | `number \| string` | `256` |
| `[nzHeight]` | 抽屜高度，僅當 `nzPlacement` 為 `'top'` 或 `'bottom'` 時生效，優先級高於 `nzSize` | `number \| string` | `-` |
| `[nzZIndex]` | 抽屜的 `z-index` | `number` | `1000` |
| `[nzPlacement]` | 抽屜的放置位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `[nzOffsetX]` | X 坐標偏移量（像素），僅當 `nzPlacement` 為 `'right'` 或 `'left'` 時生效 | `number` | `0` |
| `[nzOffsetY]` | Y 坐標偏移量（像素），僅當 `nzPlacement` 為 `'top'` 或 `'bottom'` 時生效 | `number` | `0` |
| `[nzCloseIcon]` | 自定義關閉圖標 | `string \| TemplateRef<void> \| null` | `-` |
| `[nzMaskStyle]` | 遮罩的樣式 | `object` | `-` |
| `[nzBodyStyle]` | 抽屜主體的樣式 | `object` | `-` |
| `[nzTitle]` | 抽屜的標題 | `string \| TemplateRef<void>` | `-` |
| `[nzFooter]` | 抽屜的底部 | `string \| TemplateRef<void>` | `-` |
| `[nzWrapClassName]` | 抽屜容器的 CSS 類名 | `string` | `-` |
| `[nzVisible]` | 抽屜是否可見，支持雙向綁定 | `boolean` | `false` |
| `[nzNoAnimation]` | 禁用動畫 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnClose)` | 點擊遮罩、關閉按鈕或取消按鈕時觸發 | `EventEmitter<MouseEvent>` |
| `(afterOpen)` | 打開後觸發 | `Observable<void>` |
| `(afterClose)` | 關閉後觸發 | `Observable<R>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/drawer/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

