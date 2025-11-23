# Input - 輸入框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzInputModule` |
| **官方文檔** | [Input](https://ng.ant.design/components/input/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzInputModule],
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

請參考 [官方文檔](https://ng.ant.design/components/input/en) 查看詳細用法和示例。

## API

### nz-input 組件

`nz-input` 組件是最基本的表單欄位包裝器，支持所有標準 HTML input 屬性和 Ng-Zorro 特定屬性。

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzSize]` | 輸入框大小 | `'large' \| 'small' \| 'default'` | `'default'` | - |
| `[nzAutosize]` | 高度自動調整功能，僅用於 `textarea` | `boolean \| { minRows: number, maxRows: number }` | `false` | - |
| `[nzVariant]` | Input 變體 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` | 20.0.0 |
| `[nzStatus]` | 設置驗證狀態 | `'error' \| 'warning'` | `-` | - |

### 標準 HTML 屬性

`nz-input` 組件支持所有標準 HTML input 屬性，如 `type`、`placeholder`、`disabled`、`readonly` 等。

## 相關資源

- [官方文檔](https://ng.ant.design/components/input/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

