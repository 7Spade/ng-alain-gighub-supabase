# Checkbox - 多選框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCheckboxModule` |
| **官方文檔** | [Checkbox](https://ng.ant.design/components/checkbox/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCheckboxModule],
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

請參考 [官方文檔](https://ng.ant.design/components/checkbox/en) 查看詳細用法和示例。

## API

### nz-checkbox 組件

多選框組件，用於單個多選框選擇或切換。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzId]` | 內部 input 元素的 `id` 值 | `string` | `-` |
| `[nzName]` | 內部 input 元素的 `name` 值 | `string` | `-` |
| `[nzAutoFocus]` | 自動聚焦多選框 | `boolean` | `false` |
| `[nzDisabled]` | 禁用多選框 | `boolean` | `false` |
| `[(ngModel)]` | 綁定多選框的選中狀態，支持雙向綁定 | `boolean` | `false` |
| `[nzIndeterminate]` | 設置半選狀態 | `boolean` | `false` |
| `[nzValue]` | 與 `nz-checkbox-wrapper` 的 change 回調一起使用 | `any` | `-` |
| `(ngModelChange)` | 選中狀態改變時觸發 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `focus()` | 聚焦多選框 |
| `blur()` | 移除多選框焦點 |

### nz-checkbox-wrapper 組件

多選框組容器，用於包裹一組多選框。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `(nzOnChange)` | 選中項改變時觸發 | `EventEmitter<string[]>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/checkbox/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

