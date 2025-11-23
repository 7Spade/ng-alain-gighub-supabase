# Descriptions - 描述列表

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDescriptionsModule` |
| **官方文檔** | [Descriptions](https://ng.ant.design/components/descriptions/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDescriptionsModule],
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

請參考 [官方文檔](https://ng.ant.design/components/descriptions/en) 查看詳細用法和示例。

## API

### nz-descriptions 組件

描述列表組件，用於展示多個只讀字段的組合，常用於詳情頁的信息展示。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzTitle]` | 描述列表的標題，顯示在最上方 | `string \| TemplateRef<void>` | `-` | `-` |
| `[nzExtra]` | 描述列表的操作區域，顯示在右上角 | `string \| TemplateRef<void>` | `-` | `-` |
| `[nzBordered]` | 是否顯示邊框 | `boolean` | `false` | ✅ |
| `[nzColumn]` | 一行的 `nz-descriptions-item` 數量，可以是數字或響應式對象，如 `{ xs: 8, sm: 16, md: 24}` | `number \| object` | `{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }` | ✅ |
| `[nzSize]` | 設置列表的大小，只在 `nzBordered` 設置時有效 | `'default' \| 'middle' \| 'small'` | `'default'` | ✅ |
| `[nzColon]` | 是否顯示冒號 | `boolean` | `true` | ✅ |
| `[nzLayout]` | 設置列表的佈局方式 | `'horizontal' \| 'vertical'` | `'horizontal'` | `-` |

### nz-descriptions-item 組件

描述列表中的單個項目。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTitle]` | 內容的描述 | `string \| TemplateRef<void>` | `-` |
| `[nzSpan]` | 包含列數 | `number` | `1` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/descriptions/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

