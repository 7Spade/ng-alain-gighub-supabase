# Slider - 滑動輸入條

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSliderModule` |
| **官方文檔** | [Slider](https://ng.ant.design/components/slider/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSliderModule],
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

請參考 [官方文檔](https://ng.ant.design/components/slider/en) 查看詳細用法和示例。

## API

### nz-slider 組件

滑動輸入條組件，用於在數值區間內進行選擇。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDisabled]` | 滑塊為禁用狀態 | `boolean` | `false` |
| `[nzDots]` | 是否只能拖拽到標記點 | `boolean` | `false` |
| `[nzIncluded]` | `marks` 不為空時有效，值為 `true` 時表示變為包含關係，`false` 表示並列關係 | `boolean` | `true` |
| `[nzMarks]` | 刻度標記，key 的類型必須為 `number` 且取值在閉區間 `[min, max]` 內，每個標記可以單獨設置樣式 | `object` | `{ number: string/HTML }` 或 `{ number: { style: object, label: string/HTML } }` |
| `[nzMax]` | 最大值 | `number` | `100` |
| `[nzMin]` | 最小值 | `number` | `0` |
| `[nzRange]` | 雙滑塊模式 | `boolean` | `false` |
| `[nzStep]` | 步長，取值必須大於 0，並且可被 (max - min) 整除。當 `marks` 不為空時，可以設置 `step` 為 `null`，此時 Slider 的可選值僅有標記點上的值 | `number \| null` | `1` |
| `[nzTipFormatter]` | Slider 會把當前值傳給 `tipFormatter`，並在 Tooltip 中顯示 `tipFormatter` 的返回值，若為 `null`，則隱藏 Tooltip | `(value: number) => string \| TemplateRef<void>` | `-` |
| `[ngModel]` | 設置當前取值。當 `range` 為 `false` 時，使用 `number`，否則使用 `[number, number]` | `number \| number[]` | `-` |
| `[nzVertical]` | 是否為垂直方向 | `boolean` | `false` |
| `[nzReverse]` | 反向坐標系 | `boolean` | `false` |
| `[nzTooltipVisible]` | 設置為 `always` 時 Tooltip 將始終顯示；設置為 `never` 時 Tooltip 將始終不顯示 | `'default' \| 'always' \| 'never'` | `'default'` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/slider/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

