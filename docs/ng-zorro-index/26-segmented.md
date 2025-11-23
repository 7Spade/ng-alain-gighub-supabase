# Segmented - 分段控制器

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSegmentedModule` |
| **官方文檔** | [Segmented](https://ng.ant.design/components/segmented/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSegmentedModule],
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

請參考 [官方文檔](https://ng.ant.design/components/segmented/en) 查看詳細用法和示例。

## API

### nz-segmented 組件

分段控制器組件，用於在多個選項之間進行選擇。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzBlock]` | 將寬度調整為父元素的寬度 | `boolean` | `false` | - |
| `[nzDisabled]` | 是否禁用整個組件 | `boolean` | `false` | - |
| `[nzOptions]` | 數據配置選項 | `string[] \| number[] \| Array<{ label: string; value: string \| number; icon: string; disabled?: boolean; }>` | `-` | - |
| `[nzSize]` | 控件大小 | `'large' \| 'default' \| 'small'` | `-` | - |
| `[nzShape]` | 組件形狀 | `'default' \| 'round'` | `'default'` | 20.3.0 |
| `[nzVertical]` | 排列方向 | `boolean` | `false` | 20.2.0 |
| `[nzName]` | 所有 `input[type="radio"]` 的 `name` 屬性 | `string` | `-` | 20.3.0 |
| `[ngModel]` | 當前選中項的值 | `string \| number` | `-` | - |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzValueChange)` | 當前選中項變化時觸發 | `EventEmitter<string \| number>` |
| `(ngModelChange)` | 當前選中項變化時觸發 | `EventEmitter<string \| number>` |

### nz-segmented-item 子組件

分段控制器中的單個選項。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzIcon]` | 選項中的圖標 | `string` | `-` |
| `[nzValue]` | 選項的值 | `string \| number` | `-` |
| `[nzDisabled]` | 是否禁用該選項 | `boolean` | `false` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/segmented/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

