# Radio - 單選框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzRadioModule` |
| **官方文檔** | [Radio](https://ng.ant.design/components/radio/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzRadioModule],
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

請參考 [官方文檔](https://ng.ant.design/components/radio/en) 查看詳細用法和示例。

## API

### nz-radio 組件

單選框組件，可以單獨使用或在單選框組內使用。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAutoFocus]` | 自動聚焦單選框 | `boolean` | `false` |
| `[nzDisabled]` | 禁用單選框 | `boolean` | `false` |
| `[(ngModel)]` | 綁定單選框的選中狀態，支持雙向綁定 | `boolean` | `false` |
| `[nzValue]` | 與此單選框關聯的值，與 `nz-radio-group` 一起使用 | `any` | `-` |
| `(ngModelChange)` | 選中狀態改變時觸發 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `blur()` | 移除單選框焦點 |
| `focus()` | 聚焦單選框 |

### nz-radio-group 組件

單選框組容器，用於包裹一組單選框。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[(ngModel)]` | 綁定選中的值，支持雙向綁定 | `any` | `-` |
| `[nzName]` | 單選框組的 `name` 屬性 | `string` | `-` |
| `[nzDisabled]` | 禁用整個單選框組 | `boolean` | `false` |
| `[nzSize]` | 單選框組大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `(ngModelChange)` | 選中值改變時觸發 | `EventEmitter<any>` | `-` |

### nz-radio-button 組件

按鈕樣式的單選框組件。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAutoFocus]` | 自動聚焦單選框 | `boolean` | `false` |
| `[nzDisabled]` | 禁用單選框 | `boolean` | `false` |
| `[(ngModel)]` | 綁定單選框的選中狀態，支持雙向綁定 | `boolean` | `false` |
| `[nzValue]` | 與此單選框關聯的值，與 `nz-radio-group` 一起使用 | `any` | `-` |
| `(ngModelChange)` | 選中狀態改變時觸發 | `EventEmitter<boolean>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/radio/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

