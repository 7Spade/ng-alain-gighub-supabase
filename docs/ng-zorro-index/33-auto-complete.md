# AutoComplete - 自動完成

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAutocompleteModule` |
| **官方文檔** | [AutoComplete](https://ng.ant.design/components/auto-complete/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzAutocompleteModule],
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

請參考 [官方文檔](https://ng.ant.design/components/auto-complete/en) 查看詳細用法和示例。

## API

### nz-input 與 nzAutocomplete 綁定

用於將自動完成功能綁定到輸入元素。

| 參數 | 說明 | 類型 |
|------|------|------|
| `[nzAutocomplete]` | 綁定 `nzAutocomplete` 組件到輸入框 | `NzAutocompleteComponent` |

### nz-autocomplete 組件

定義自動完成下拉框及其選項。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzBackfill]` | 使用鍵盤選擇時，是否將選中項回填到輸入框 | `boolean` | `false` |
| `[nzDataSource]` | 自動完成的數據源，可以是字符串數組或對象數組 | `AutocompleteDataSource` | `-` |
| `[nzDefaultActiveFirstOption]` | 是否默認高亮第一個選項 | `boolean` | `true` |
| `[nzWidth]` | 下拉框的自定義寬度（像素） | `number` | 觸發元素的寬度 |
| `[nzOverlayClassName]` | 下拉框根元素的 CSS 類名 | `string` | `-` |
| `[nzOverlayStyle]` | 下拉框根元素的內聯樣式 | `object` | `-` |
| `[compareWith]` | 用於比較選項值的比較函數，類似於 Angular 的 `SelectControlValueAccessor` | `(o1: any, o2: any) => boolean` | `(o1, o2) => o1 === o2` |

### nz-auto-option 組件

表示自動完成下拉框中的單個選項。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzValue]` | 選項的值，綁定到輸入框的模型 | `any` | `-` |
| `[nzLabel]` | 選項的顯示文本 | `string` | `-` |
| `[nzDisabled]` | 禁用該選項 | `boolean` | `false` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/auto-complete/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

