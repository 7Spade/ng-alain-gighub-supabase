# Progress - 進度條

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzProgressModule` |
| **官方文檔** | [Progress](https://ng.ant.design/components/progress/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzProgressModule],
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

請參考 [官方文檔](https://ng.ant.design/components/progress/en) 查看詳細用法和示例。

## API

### nz-progress 組件

進度條組件，用於展示操作進度。

#### 通用屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzType]` | 設置進度條類型 | `'line' \| 'circle' \| 'dashboard'` | `'line'` |
| `[nzFormat]` | 內容的模板函數 | `(percent: number) => string` | `(percent) => percent + '%'` |
| `[nzPercent]` | 設置進度的完成百分比 | `number` | `0` |
| `[nzShowInfo]` | 是否顯示進度數值和狀態圖標 | `boolean` | `true` |
| `[nzStatus]` | 設置進度條狀態 | `'success' \| 'exception' \| 'active' \| 'normal'` | `'normal'` |
| `[nzStrokeLinecap]` | 設置進度條線條的樣式 | `'round' \| 'square'` | `'round'` |
| `[nzStrokeColor]` | 進度條的顏色 | `string \| object` | `-` |
| `[nzSuccessPercent]` | 分段成功百分比 | `number` | `0` |

#### `nzType="line"` 專用屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzStrokeWidth]` | 設置進度條的寬度（像素） | `number` | `8` |
| `[nzSteps]` | 階梯進度條的總步數 | `number` | `-` |

#### `nzType="circle"` 專用屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzWidth]` | 設置圓形進度條的畫布寬度（像素） | `number` | `132` |
| `[nzStrokeWidth]` | 設置圓形進度條的寬度，為畫布寬度的百分比 | `number` | `6` |

#### `nzType="dashboard"` 專用屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzWidth]` | 設置儀表盤進度條的畫布寬度（像素） | `number` | `132` |
| `[nzStrokeWidth]` | 設置儀表盤進度條的寬度，為畫布寬度的百分比 | `number` | `6` |
| `[nzGapDegree]` | 間隙角度，範圍 0-360 | `number` | `0` |
| `[nzGapPosition]` | 間隙位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/progress/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

