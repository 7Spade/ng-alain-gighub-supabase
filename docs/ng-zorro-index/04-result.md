# Result - 結果頁面

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzResultModule` |
| **官方文檔** | [Result](https://ng.ant.design/components/result/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzResultModule],
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

請參考 [官方文檔](https://ng.ant.design/components/result/en) 查看詳細用法和示例。

## API

### nz-result 組件

結果頁面組件，用於反饋一系列操作任務的處理結果。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTitle]` | 標題 | `string \| TemplateRef<void>` | `-` |
| `[nzSubTitle]` | 副標題 | `string \| TemplateRef<void>` | `-` |
| `[nzStatus]` | 結果狀態，決定圖標和顏色 | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` |
| `[nzIcon]` | 自定義圖標 | `string \| TemplateRef<void>` | `-` |
| `[nzExtra]` | 操作區 | `string \| TemplateRef<void>` | `-` |

### 指令

可以在 `nz-result` 內部使用以下指令：

| 指令 | 說明 |
|------|------|
| `i[nz-result-icon]` 或 `div[nz-result-icon]` | 自定義圖標 |
| `div[nz-result-title]` | 標題 |
| `div[nz-result-subtitle]` | 副標題 |
| `div[nz-result-content]` | 內容，用於詳細說明 |
| `div[nz-result-extra]` | 額外內容，通常是操作區 |

## 相關資源

- [官方文檔](https://ng.ant.design/components/result/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

