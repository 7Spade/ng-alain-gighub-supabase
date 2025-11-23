# Tag - 標籤

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTagModule` |
| **官方文檔** | [Tag](https://ng.ant.design/components/tag/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTagModule],
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

請參考 [官方文檔](https://ng.ant.design/components/tag/en) 查看詳細用法和示例。

## API

### nz-tag 組件

標籤組件，用於標記和選擇。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzMode]` | 標籤的模式 | `'closeable' \| 'default' \| 'checkable'` | `'default'` |
| `[nzChecked]` | 標籤的選中狀態，支持雙向綁定。僅在 `nzMode="checkable"` 時有效 | `boolean` | `false` |
| `[nzColor]` | 標籤的顏色 | `string` | `-` |
| `[nzBordered]` | 是否有邊框樣式 | `boolean` | `true` |
| `(nzOnClose)` | 標籤關閉時觸發的回調。僅在 `nzMode="closable"` 時有效 | `EventEmitter<MouseEvent>` | `-` |
| `(nzCheckedChange)` | 選中狀態改變時觸發的回調。僅在 `nzMode="checkable"` 時有效 | `EventEmitter<boolean>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/tag/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

