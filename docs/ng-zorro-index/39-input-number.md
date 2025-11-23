# InputNumber - 數字輸入框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzInputNumberModule` |
| **官方文檔** | [InputNumber](https://ng.ant.design/components/input-number/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzInputNumberModule],
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

請參考 [官方文檔](https://ng.ant.design/components/input-number/en) 查看詳細用法和示例。

## API

### nz-input-number 組件

數字輸入框組件，用於輸入數值。

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[ngModel]` | 當前值，雙向綁定 | `number` | `-` | - |
| `[nzId]` | 輸入框的 ID | `string` | `-` | - |
| `[nzPlaceHolder]` | 輸入框佔位符 | `string` | `-` | - |
| `[nzAutoFocus]` | 自動獲得焦點 | `boolean` | `false` | - |
| `[nzVariant]` | InputNumber 的變體 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` | 20.0.0 |
| `[nzControls]` | 是否顯示上下按鈕 | `boolean` | `true` | - |
| `[nzDisabled]` | 禁用 | `boolean` | `false` | - |
| `[nzFormatter]` | 指定輸入框展示值的格式 | `(value: number) => string` | `-` | - |
| `[nzKeyboard]` | 是否啟用鍵盤快捷鍵 | `boolean` | `true` | - |
| `[nzMax]` | 最大值 | `number` | `Number.MAX_SAFE_INTEGER` | - |
| `[nzMin]` | 最小值 | `number` | `Number.MIN_SAFE_INTEGER` | - |
| `[nzParser]` | 指定從 `formatter` 裡轉換回數字的方式，和 `formatter` 搭配使用 | `(value: string) => number` | `-` | - |
| `[nzPrecision]` | 數值精度 | `number` | `-` | - |
| `[nzSize]` | 輸入框大小 | `'large' \| 'small' \| 'default'` | `'default'` | - |
| `[nzStep]` | 每次改變步數，可以為小數 | `number` | `1` | - |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` | - |

## 相關資源

- [官方文檔](https://ng.ant.design/components/input-number/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

