# TreeSelect - 樹選擇

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeSelectModule` |
| **官方文檔** | [TreeSelect](https://ng.ant.design/components/tree-select/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTreeSelectModule],
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

請參考 [官方文檔](https://ng.ant.design/components/tree-select/en) 查看詳細用法和示例。

## API

### nz-tree-select 組件

樹選擇組件，用於在樹形結構中選擇數據。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzCheckable]` | 是否在樹節點前添加 Checkbox 複選框 | `boolean` | `false` |
| `[nzCheckStrictly]` | checkable 狀態下節點選擇完全受控（父子節點選中狀態不再關聯） | `boolean` | `false` |
| `[nzShowExpand]` | 是否在樹節點前顯示展開圖標 | `boolean` | `true` |
| `[nzShowLine]` | 是否顯示連接線 | `boolean` | `false` |
| `[nzPrefix]` | 自定義前綴 | `TemplateRef<any> \| string` | `-` |
| `[nzSuffixIcon]` | 自定義後綴圖標 | `TemplateRef<any> \| string` | `-` |
| `[nzAsyncData]` | 是否異步加載數據（需要配合 `NzTreeNode.addChildren(...)` 使用） | `boolean` | `false` |
| `[nzNodes]` | 樹節點數據 | `NzTreeNodeOptions[]` | `[]` |
| `[nzDefaultExpandAll]` | 是否默認展開所有樹節點 | `boolean` | `false` |
| `[nzExpandedKeys]` | 默認展開指定的樹節點 | `string[]` | `-` |
| `[nzDisplayWith]` | 如何在觸發器中顯示選中的節點值 | `(node: NzTreeNode) => string` | `(node: NzTreeNode) => node.title` |
| `[nzMaxTagCount]` | 最多顯示多少個標籤 | `number` | `-` |
| `[nzMaxTagPlaceholder]` | 隱藏標籤時顯示的內容 | `TemplateRef<{ $implicit: NzTreeNode[] }>` | `-` |
| `[nzTreeTemplate]` | 自定義節點 | `TemplateRef<{ $implicit: NzTreeNode }>` | `-` |
| `[nzVariant]` | TreeSelect 的變體 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` |
| `[nzVirtualHeight]` | 虛擬滾動的高度 | `string` | `-` |
| `[nzVirtualItemSize]` | 列表中項目的尺寸，與 [cdk itemSize](https://material.angular.io/cdk/scrolling/api) 相同 | `number` | `28` |
| `[nzPlaceHolder]` | 輸入框佔位符 | `string` | `-` |
| `[nzSize]` | 輸入框大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzAllowClear]` | 是否允許清除 | `boolean` | `true` |
| `[nzShowSearch]` | 是否支持搜索 | `boolean` | `false` |
| `[nzDropdownMatchSelectWidth]` | 下拉菜單和選擇器同寬 | `boolean` | `true` |
| `[nzDropdownStyle]` | 下拉菜單的樣式 | `object` | `-` |
| `[nzDropdownClassName]` | 下拉菜單的類名 | `string` | `-` |
| `[ngModel]` | 當前選中的值，支持雙向綁定 | `string \| string[]` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(ngModelChange)` | 選中值變化時觸發 | `EventEmitter<string \| string[]>` |
| `(nzOpenChange)` | 下拉框打開/關閉時觸發 | `EventEmitter<boolean>` |
| `(nzExpandChange)` | 展開/收起節點時觸發 | `EventEmitter<NzFormatEmitEvent>` |
| `(nzTreeCheckBoxChange)` | 點擊複選框觸發 | `EventEmitter<NzFormatEmitEvent>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/tree-select/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

