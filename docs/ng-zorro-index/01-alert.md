# Alert - 警告提示

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAlertModule` |
| **官方文檔** | [Alert](https://ng.ant.design/components/alert/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzAlertModule],
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

```html
<nz-alert
  nzType="success"
  nzMessage="成功提示"
  nzDescription="這是一條成功提示信息"
  nzShowIcon
  nzCloseable>
</nz-alert>
```

## API

### nz-alert 組件

警告提示組件，用於顯示重要的警告信息。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzType]` | 指定警告的樣式類型 | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` |
| `[nzMessage]` | 警告提示內容 | `string \| TemplateRef<void>` | `-` |
| `[nzDescription]` | 警告提示的輔助性文字介紹 | `string \| TemplateRef<void>` | `-` |
| `[nzShowIcon]` | 是否顯示輔助圖標 | `boolean` | `false` |
| `[nzCloseable]` | 是否顯示關閉按鈕 | `boolean` | `false` |
| `[nzCloseText]` | 自定義關閉按鈕文字 | `string \| TemplateRef<void>` | `-` |
| `[nzIconType]` | 自定義圖標類型 | `string` | `-` |
| `[nzBanner]` | 是否用作頂部公告 | `boolean` | `false` |
| `(nzOnClose)` | 關閉時觸發的回調 | `EventEmitter<boolean>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/alert/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

