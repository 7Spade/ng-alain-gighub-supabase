# Table - 表格

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTableModule` |
| **官方文檔** | [Table](https://ng.ant.design/components/table/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTableModule],
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

請參考 [官方文檔](https://ng.ant.design/components/table/en) 查看詳細用法和示例。

## API

### nz-table 組件

`nz-table` 組件是一個功能強大且靈活的表格解決方案，支持客戶端和服務器端分頁、自定義列渲染、排序、過濾等功能。

#### 數據綁定

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzData]` | 要渲染的數據記錄數組 | `T[]` | `-` |

#### 分頁

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzFrontPagination]` | 是否在客戶端分頁數據 | `boolean` | `true` |
| `[nzTotal]` | 數據總數。當 `nzFrontPagination` 為 `false` 時應設置 | `number` | `-` |
| `[nzPageIndex]` | 當前頁索引，支持雙向綁定 | `number` | `-` |
| `[nzPageSize]` | 每頁大小，支持雙向綁定 | `number` | `-` |
| `[nzShowPagination]` | 是否顯示分頁組件 | `boolean` | `true` |
| `[nzPaginationPosition]` | 指定分頁位置 | `'top' \| 'bottom' \| 'both'` | `'bottom'` |
| `[nzPaginationType]` | 指定分頁大小 | `'default' \| 'small'` | `'default'` |

#### 列自定義

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzCustomColumn]` | 控制表格列的顯示和排序。注意：啟用時，`nzWidthConfig` 和 `th` 的 `[nzWidth]` 將不起作用 | `NzCustomColumn[]` | `-` |
| `[nzWidthConfig]` | 設置列寬。不能與 `th` 的 `[nzWidth]` 一起使用 | `string[]` | `[]` |

#### 樣式和外觀

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzBordered]` | 是否顯示所有表格邊框 | `boolean` | `false` |
| `[nzOuterBordered]` | 是否顯示表格外邊框 | `boolean` | `false` |
| `[nzSize]` | 表格大小 | `'middle' \| 'small' \| 'default'` | `'default'` |

### 使用示例

```html
<nz-table
  [nzData]="dataSet"
  [nzFrontPagination]="false"
  [nzTotal]="total"
  [(nzPageIndex)]="pageIndex"
  [(nzPageSize)]="pageSize"
  [nzShowPagination]="true"
  [nzPaginationPosition]="'both'"
  [nzBordered]="true"
  [nzSize]="'middle'">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let data of dataSet">
      <td>{{data.name}}</td>
      <td>{{data.age}}</td>
    </tr>
  </tbody>
</nz-table>
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/table/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

