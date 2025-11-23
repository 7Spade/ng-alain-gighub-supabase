# TreeView - 樹視圖

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeViewModule` |
| **官方文檔** | [TreeView](https://ng.ant.design/components/tree-view/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTreeViewModule],
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

請參考 [官方文檔](https://ng.ant.design/components/tree-view/en) 查看詳細用法和示例。

## API

### nz-tree-view 組件

樹視圖組件，用於展示樹形結構數據。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTreeControl]` | 樹控制器，用於管理樹的展開、選中等狀態 | `NzTreeControl` | `-` |
| `[nzDataSource]` | 數據源 | `any[]` | `[]` |
| `[nzTreeViewNodeOutlet]` | 樹節點出口，用於自定義節點渲染 | `TemplateRef<any>` | `-` |
| `[nzTreeViewNodeDef]` | 樹節點定義，用於定義節點的結構 | `TemplateRef<any>` | `-` |
| `[nzExpandAll]` | 是否默認展開所有節點 | `boolean` | `false` |
| `[nzCheckable]` | 是否顯示複選框 | `boolean` | `false` |
| `[nzMultiple]` | 是否支持多選 | `boolean` | `false` |
| `[nzSelectedKeys]` | 選中的節點 key 數組 | `string[]` | `[]` |
| `[nzCheckedKeys]` | 選中的複選框 key 數組 | `string[]` | `[]` |
| `[nzExpandedKeys]` | 展開的節點 key 數組 | `string[]` | `[]` |
| `[nzSearchValue]` | 搜索值，用於過濾節點 | `string` | `-` |
| `[nzSearchFunc]` | 自定義搜索函數 | `(node: any) => boolean` | `-` |
| `[nzVirtualHeight]` | 虛擬滾動的高度 | `string` | `-` |
| `[nzVirtualItemSize]` | 虛擬滾動的項目大小 | `number` | `28` |
| `[nzVirtualMaxBufferPx]` | 虛擬滾動的最大緩衝像素 | `number` | `500` |
| `[nzVirtualMinBufferPx]` | 虛擬滾動的最小緩衝像素 | `number` | `28` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊節點時觸發 | `EventEmitter<any>` |
| `(nzDblClick)` | 雙擊節點時觸發 | `EventEmitter<any>` |
| `(nzContextMenu)` | 右鍵點擊節點時觸發 | `EventEmitter<any>` |
| `(nzExpandChange)` | 節點展開/折疊時觸發 | `EventEmitter<any>` |
| `(nzSelectChange)` | 節點選中狀態改變時觸發 | `EventEmitter<any>` |
| `(nzCheckChange)` | 複選框狀態改變時觸發 | `EventEmitter<any>` |

### nz-tree-view-node 組件

樹視圖節點組件，表示樹中的單個節點。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTreeNode]` | 樹節點數據 | `any` | `-` |
| `[nzLevel]` | 節點層級 | `number` | `0` |
| `[nzIndent]` | 縮進寬度 | `number` | `24` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/tree-view/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

