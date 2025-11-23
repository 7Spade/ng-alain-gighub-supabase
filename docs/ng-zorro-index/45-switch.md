# Switch - 開關

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSwitchModule` |
| **官方文檔** | [Switch](https://ng.ant.design/components/switch/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSwitchModule],
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

請參考 [官方文檔](https://ng.ant.design/components/switch/en) 查看詳細用法和示例。

## API

### nz-switch 組件

開關組件，用於在兩種狀態之間切換，例如開/關或真/假。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzId]` | 組件內部按鈕的 id 屬性 | `string` | `-` |
| `[(ngModel)]` | 確定 `nz-switch` 是否選中，支持雙向綁定 | `boolean` | `false` |
| `[nzCheckedChildren]` | 選中時顯示的內容 | `string \| TemplateRef<void>` | `-` |
| `[nzUnCheckedChildren]` | 未選中時顯示的內容 | `string \| TemplateRef<void>` | `-` |
| `[nzDisabled]` | 禁用開關 | `boolean` | `false` |
| `[nzSize]` | `nz-switch` 的大小 | `'small' \| 'default'` | `'default'` |
| `[nzLoading]` | 開關的加載狀態 | `boolean` | `false` |
| `[nzControl]` | 是否完全由用戶控制狀態 | `boolean` | `false` |
| `(ngModelChange)` | 選中狀態改變時觸發的回調函數 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `focus()` | 獲取焦點 |
| `blur()` | 移除焦點 |

## 相關資源

- [官方文檔](https://ng.ant.design/components/switch/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

