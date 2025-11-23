# Tree - 樹形控件

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeModule` |
| **官方文檔** | [Tree](https://ng.ant.design/components/tree/en) |
| **Schematics 命令** | 詳見下方命令列表 |

## Schematics 命令

```bash
# 基本樹形控件
ng g ng-zorro-antd:tree-basic <name>

# 受控樹形控件
ng g ng-zorro-antd:tree-basic-controlled <name>

# 可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable <name>

# 帶確認的可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable-confirm <name>

# 動態加載數據的樹形控件
ng g ng-zorro-antd:tree-dynamic <name>

# 可搜索的樹形控件
ng g ng-zorro-antd:tree-search <name>

# 自定義圖標的樹形控件
ng g ng-zorro-antd:tree-customized-icon <name>

# 帶連接線的樹形控件
ng g ng-zorro-antd:tree-line <name>

# 目錄樹形控件
ng g ng-zorro-antd:tree-directory <name>

# 虛擬滾動樹形控件
ng g ng-zorro-antd:tree-virtual-scroll <name>
```

## 使用方式

### 導入模組

```typescript
import { NzTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTreeModule],
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
<nz-tree
  [nzData]="nodes"
  nzCheckable
  [nzCheckedKeys]="defaultCheckedKeys"
  [nzExpandedKeys]="defaultExpandedKeys"
  [nzSelectedKeys]="defaultSelectedKeys"
  (nzClick)="nzEvent($event)"
  (nzCheckBoxChange)="nzEvent($event)">
</nz-tree>
```

## API

### nz-tree 組件

提供層次結構數據顯示，支持展開、折疊和選擇等功能。適合表示組織結構、文件系統等。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzData]` | 樹形數據源 | `NzTreeNodeOptions[]` | `-` |
| `[nzAsyncData]` | 是否異步加載數據 | `boolean` | `false` |
| `[nzCheckable]` | 節點前添加 Checkbox 複選框 | `boolean` | `false` |
| `[nzCheckedKeys]` | 指定默認選中的樹節點 | `string[]` | `[]` |
| `[nzSelectedKeys]` | 指定默認選中的樹節點 | `string[]` | `[]` |
| `[nzDefaultExpandAll]` | 默認展開所有樹節點 | `boolean` | `false` |
| `[nzDefaultExpandedKeys]` | 默認展開指定的樹節點 | `string[]` | `[]` |
| `[nzShowExpand]` | 是否顯示展開/收起圖標 | `boolean` | `true` |
| `[nzExpandAll]` | 是否展開所有節點 | `boolean` | `false` |
| `[nzTreeTemplate]` | 自定義樹節點模板 | `TemplateRef<void>` | `-` |
| `[nzSearchValue]` | 過濾（高亮）樹節點 | `string` | `null` |
| `[nzSearchFunc]` | 自定義匹配方法，與 `nzSearchValue` 一起使用 | `(node: NzTreeNodeOptions) => boolean` | `null` |
| `[nzBeforeDrop]` | 拖拽前二次確認，允許用戶決定是否允許放置 | `(confirm: NzFormatBeforeDropEvent) => Observable<boolean>` | `-` |
| `[nzVirtualHeight]` | 虛擬滾動的高度 | `string` | `-` |
| `[nzVirtualItemSize]` | 列表中項目的尺寸，與 [cdk itemSize](https://material.angular.io/cdk/scrolling/api) 相同 | `number` | `28` |
| `[nzVirtualMaxBufferPx]` | 渲染新項目時要渲染的緩衝區像素數，與 [cdk maxBufferPx](https://material.angular.io/cdk/scrolling/api) 相同 | `number` | `500` |
| `[nzVirtualMinBufferPx]` | 視口外渲染的最小緩衝區（以像素為單位），與 [cdk minBufferPx](https://material.angular.io/cdk/scrolling/api) 相同 | `number` | `28` |
| `[nzBackdrop]` | 是否為覆蓋層附加背景 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊樹節點觸發 | `EventEmitter<NzFormatEmitEvent>` |
| `(nzCheckBoxChange)` | 點擊複選框觸發 | `EventEmitter<NzFormatEmitEvent>` |
| `(nzExpandChange)` | 展開/收起節點時觸發 | `EventEmitter<NzFormatEmitEvent>` |
| `(nzSearchValueChange)` | 搜索值改變時觸發 | `EventEmitter<string>` |

#### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 | 返回值 |
|------|------|--------|
| `getTreeNodes()` | 獲取所有節點 | `NzTreeNode[]` |
| `getTreeNodeByKey(key: string)` | 根據 key 獲取指定節點 | `NzTreeNode` |
| `getCheckedNodeList()` | 獲取選中的節點列表（合併） | `NzTreeNode[]` |
| `getSelectedNodeList()` | 獲取選中的節點列表 | `NzTreeNode[]` |
| `getHalfCheckedNodeList()` | 獲取半選中的節點列表 | `NzTreeNode[]` |
| `getExpandedNodeList()` | 獲取展開的節點列表 | `NzTreeNode[]` |
| `getMatchedNodeList()` | 獲取匹配的節點列表（如果 `nzSearchValue` 不為 null） | `NzTreeNode[]` |

### 數據結構示例

```json
[
  {
    "title": "parent 1",
    "key": "1",
    "children": [
      {
        "title": "child 1.1",
        "key": "1-1"
      },
      {
        "title": "child 1.2",
        "key": "1-2"
      }
    ]
  }
]
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/tree/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

