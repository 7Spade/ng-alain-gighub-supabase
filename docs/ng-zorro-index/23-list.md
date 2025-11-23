# List - 列表

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzListModule` |
| **官方文檔** | [List](https://ng.ant.design/components/list/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzListModule } from 'ng-zorro-antd/list';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzListModule],
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

請參考 [官方文檔](https://ng.ant.design/components/list/en) 查看詳細用法和示例。

## API

### nz-list 組件

列表組件，用於顯示列表數據。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzBordered]` | 是否顯示邊框 | `boolean` | `false` |
| `[nzFooter]` | 列表底部內容 | `string \| TemplateRef<void>` | `-` |
| `[nzHeader]` | 列表頭部內容 | `string \| TemplateRef<void>` | `-` |
| `[nzItemLayout]` | 列表的佈局方式，默認為 `horizontal`。如果需要垂直列表，將 `itemLayout` 屬性設置為 `vertical` | `'vertical' \| 'horizontal'` | `'horizontal'` |
| `[nzLoading]` | 當列表內容正在加載時顯示加載指示器 | `boolean` | `false` |
| `[nzSize]` | 列表大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzSplit]` | 是否顯示列表項下的分割線 | `boolean` | `true` |
| `[nzGrid]` | 使用網格佈局 | `NzListGrid` | `-` |

### nz-list-item 組件

列表項組件，表示列表中的單個項目。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzNoFlex]` | 是否不使用 `flex` 佈局渲染 | `boolean` | `false` |

### nz-list-item-meta 組件

列表項元信息組件，用於結構化列表項的元信息（頭像、標題、描述）。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAvatar]` | 列表項的頭像 | `string \| TemplateRef<void>` | `-` |
| `[nzDescription]` | 列表項的描述 | `string \| TemplateRef<void>` | `-` |
| `[nzTitle]` | 列表項的標題 | `string \| TemplateRef<void>` | `-` |

### nz-list-item-meta-avatar 組件

列表項元信息頭像組件。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSrc]` | 圖片類型頭像的圖片地址 | `string` | `-` |

### nz-list-empty 組件

列表空內容組件，當列表為空時顯示。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzNoResult]` | 無結果時顯示的內容 | `string \| TemplateRef<void>` | `-` |

### 其他子組件

- **`nz-list-header`**：列表頭部組件
- **`nz-list-footer`**：列表底部組件
- **`nz-list-pagination`**：列表分頁組件
- **`nz-list-load-more`**：列表加載更多組件
- **`ul[nz-list-item-actions]`**：列表項操作容器組件
- **`nz-list-item-action`**：列表項操作組件
- **`nz-list-item-extra`**：列表項額外內容組件
- **`nz-list-item-meta-title`**：列表項元信息標題組件
- **`nz-list-item-meta-description`**：列表項元信息描述組件

## 相關資源

- [官方文檔](https://ng.ant.design/components/list/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

