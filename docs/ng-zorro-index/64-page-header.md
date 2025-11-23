# PageHeader - 頁頭

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPageHeaderModule` |
| **官方文檔** | [PageHeader](https://ng.ant.design/components/page-header/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzPageHeaderModule],
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

請參考 [官方文檔](https://ng.ant.design/components/page-header/en) 查看詳細用法和示例。

## API

### nz-page-header 組件

頁頭組件，用於展示頁面的標題、麵包屑導航和操作區域。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTitle]` | 標題 | `string \| TemplateRef<void>` | `-` |
| `[nzSubtitle]` | 副標題 | `string \| TemplateRef<void>` | `-` |
| `[nzBack]` | 返回按鈕的點擊事件 | `EventEmitter<void>` | `-` |
| `[nzGhost]` | 頁頭是否透明背景 | `boolean` | `true` |
| `[nzExtra]` | 操作區，位於標題行的最右端 | `string \| TemplateRef<void>` | `-` |
| `[nzBreadcrumb]` | 麵包屑的配置 | `NzBreadCrumbComponent` | `-` |
| `[nzTags]` | 標籤列表 | `TemplateRef<void>` | `-` |
| `[nzFooter]` | 頁腳 | `string \| TemplateRef<void>` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzBack)` | 點擊返回按鈕時觸發 | `EventEmitter<void>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/page-header/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

