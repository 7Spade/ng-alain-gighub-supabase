# Grid - 柵格

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzGridModule` |
| **官方文檔** | [Grid](https://ng.ant.design/components/grid/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzGridModule],
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

請參考 [官方文檔](https://ng.ant.design/components/grid/en) 查看詳細用法和示例。

## API

### nz-row 組件

行組件，定義水平網格。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAlign]` | 垂直對齊方式 | `'top' \| 'middle' \| 'bottom'` | `-` |
| `[nzGutter]` | 柵格間隔，可以是像素值或響應式對象，如 `{ xs: 8, sm: 16, md: 24 }`，也可以是數組 `[horizontal, vertical]` | `string \| number \| object \| [number, number] \| [object, object]` | `-` |
| `[nzJustify]` | 水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `-` |

### nz-col 組件

列組件，定義列佈局。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzFlex]` | flex 佈局屬性 | `string \| number` | `-` |
| `[nzOffset]` | 柵格左側的間隔格數 | `number` | `0` |
| `[nzOrder]` | 柵格順序 | `number` | `0` |
| `[nzPull]` | 柵格向左移動格數 | `number` | `0` |
| `[nzPush]` | 柵格向右移動格數 | `number` | `0` |
| `[nzSpan]` | 柵格佔據的列數，`0` 對應 `display: none` | `number` | `-` |
| `[nzXs]` | `<576px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |
| `[nzSm]` | `≥576px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |
| `[nzMd]` | `≥768px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |
| `[nzLg]` | `≥992px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |
| `[nzXl]` | `≥1200px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |
| `[nzXXl]` | `≥1600px` 響應式柵格，可為柵格數或一個包含其他屬性的對象 | `number \| object` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/grid/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

