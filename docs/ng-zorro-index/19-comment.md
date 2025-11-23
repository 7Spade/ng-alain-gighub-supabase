# Comment - 評論

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCommentModule` |
| **官方文檔** | [Comment](https://ng.ant.design/components/comment/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCommentModule } from 'ng-zorro-antd/comment';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCommentModule],
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

請參考 [官方文檔](https://ng.ant.design/components/comment/en) 查看詳細用法和示例。

## API

### nz-comment 組件

評論組件，用於展示評論列表。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAuthor]` | 要顯示為評論作者的內容 | `string \| TemplateRef<void>` | `-` |
| `[nzDatetime]` | 要顯示為評論時間的內容 | `string \| TemplateRef<void>` | `-` |

### nz-comment-avatar 指令

用於顯示評論頭像的元素。

### nz-comment-content 指令

評論的主要內容。

### nz-comment-action 指令

顯示在評論內容下方的操作項。

## 相關資源

- [官方文檔](https://ng.ant.design/components/comment/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

