# ColorPicker - 顏色選擇器

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzColorPickerModule` |
| **官方文檔** | [ColorPicker](https://ng.ant.design/components/color-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzColorPickerModule],
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

請參考 [官方文檔](https://ng.ant.design/components/color-picker/en) 查看詳細用法和示例。

## API

### nz-color-picker 組件

顏色選擇器組件，用於選擇顏色。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzValue]` | 顏色值 | `string \| NzColor` | `-` |
| `[nzFormat]` | 顏色格式 | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` |
| `[nzDefaultValue]` | 默認顏色值 | `string \| NzColor` | `false` |
| `[nzShowText]` | 是否顯示顏色值文字 | `boolean` | `false` |
| `[nzSize]` | 組件大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzDisabledAlpha]` | 是否禁用透明度選擇 | `boolean` | `false` |
| `[nzAllowClear]` | 是否允許清除選中的顏色 | `boolean` | `false` |
| `[nzTrigger]` | 觸發方式 | `'click' \| 'hover'` | `'click'` |
| `[nzOpen]` | 控制彈出層顯示，支持雙向綁定 | `boolean` | `false` |
| `[nzTitle]` | 顏色選擇器的標題 | `TemplateRef<void> \| string` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnChange)` | 顏色值改變時觸發 | `EventEmitter<{ color: NzColor, format: string }>` |
| `(nzOnClear)` | 清除顏色時觸發 | `EventEmitter<boolean>` |
| `(nzOnFormatChange)` | 顏色格式改變時觸發 | `EventEmitter<'rgb' \| 'hex' \| 'hsb'>` |
| `(nzOnOpenChange)` | 彈出層顯示/隱藏時觸發 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/color-picker/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

