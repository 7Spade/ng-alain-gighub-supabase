# Typography - 排版

> **組件分類**：通用類組件 (General)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTypographyModule` |
| **官方文檔** | [Typography](https://ng.ant.design/components/typography/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTypographyModule],
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

請參考 [官方文檔](https://ng.ant.design/components/typography/en) 查看詳細用法和示例。

## API

### nz-typography 組件

排版組件，用於展示排版內容，支持多種自定義選項。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzContent]` | 組件內容 | `string` | `-` |
| `[nzCopyable]` | 是否啟用複製功能，需要 `nzContent` | `boolean` | `-` |
| `[nzEditable]` | 是否啟用編輯功能，需要 `nzContent` | `boolean` | `-` |
| `[nzCopyIcons]` | 自定義複製圖標 | `[string \| TemplateRef<void>, string \| TemplateRef<void>]` | `['copy', 'check']` |
| `[nzCopyTooltips]` | 自定義複製功能的提示文字 | `null \| [string \| TemplateRef<void>, string \| TemplateRef<void>]` | `-` |
| `[nzEditIcon]` | 自定義編輯圖標 | `string \| TemplateRef<void>` | `'edit'` |
| `[nzEditTooltip]` | 自定義編輯功能的提示文字 | `null \| string \| TemplateRef<void>` | `-` |
| `[nzEllipsis]` | 是否啟用省略號，當文本溢出時 | `boolean` | `-` |
| `[nzSuffix]` | 當 `nzEllipsis` 啟用時，顯示的後綴文字 | `string` | `-` |
| `[nzCopyText]` | 自定義要複製的文字 | `string` | `-` |
| `[nzDisabled]` | 禁用排版內容 | `boolean` | `-` |
| `[nzExpandable]` | 當省略號啟用時，使文字可展開 | `boolean` | `-` |
| `[nzEllipsisRows]` | 定義在應用省略號之前顯示的行數 | `number` | `1` |
| `[nzType]` | 定義文字內容的類型 | `'secondary' \| 'warning' \| 'danger' \| 'success'` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzContentChange)` | 用戶編輯內容時觸發 | `EventEmitter<string>` |
| `(nzExpandChange)` | 用戶展開省略號內容時觸發 | `EventEmitter<void>` |
| `(nzOnEllipsis)` | 省略號狀態變化時觸發 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/typography/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

