# Pagination - 分頁

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPaginationModule` |
| **官方文檔** | [Pagination](https://ng.ant.design/components/pagination/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzPaginationModule],
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

請參考 [官方文檔](https://ng.ant.design/components/pagination/en) 查看詳細用法和示例。

## API

### nz-pagination 組件

分頁組件，用於分頁導航。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTotal]` | 數據總數 | `number` | `0` |
| `[nzPageIndex]` | 當前頁碼，雙向綁定 | `number` | `1` |
| `[nzPageSize]` | 每頁條數，雙向綁定 | `number` | `10` |
| `[nzDisabled]` | 禁用分頁 | `boolean` | `false` |
| `[nzShowQuickJumper]` | 是否可以快速跳轉至某頁 | `boolean` | `false` |
| `[nzShowSizeChanger]` | 是否可以改變 `nzPageSize` | `boolean` | `false` |
| `[nzSimple]` | 是否使用簡單模式 | `boolean` | `-` |
| `[nzSize]` | 指定分頁的大小 | `'small' \| 'default'` | `'default'` |
| `[nzResponsive]` | 當屏幕尺寸小於 576px 時自動調整大小 | `boolean` | `false` |
| `[nzPageSizeOptions]` | 指定每頁可以顯示多少條 | `number[]` | `[10, 20, 30, 40]` |
| `[nzItemRender]` | 用於自定義頁碼的結構 | `TemplateRef<{ $implicit: 'page' \| 'prev' \| 'next'\| 'prev_5'\| 'next_5', page: number }>` | `-` |
| `[nzShowTotal]` | 用於顯示總數和數據範圍 | `TemplateRef<{ $implicit: number, range: [ number, number ] }>` | `-` |
| `[nzHideOnSinglePage]` | 只有一頁時是否隱藏分頁器 | `boolean` | `false` |
| `[nzAlign]` | 對齊方式 | `NzPaginationAlign` | `'start'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzPageIndexChange)` | 當前頁碼改變時觸發 | `EventEmitter<number>` |
| `(nzPageSizeChange)` | 每頁條數改變時觸發 | `EventEmitter<number>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/pagination/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

