# Dropdown - 下拉菜單

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDropDownModule` |
| **官方文檔** | [Dropdown](https://ng.ant.design/components/dropdown/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDropDownModule],
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

請參考 [官方文檔](https://ng.ant.design/components/dropdown/en) 查看詳細用法和示例。

## API

### nz-dropdown 指令

下拉菜單指令，用於創建下拉菜單組件，觸發時顯示菜單。

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzDropdownMenu]` | 要顯示的下拉菜單組件（必填） | `NzDropdownMenuComponent` | `-` | - |
| `[nzDisabled]` | 是否禁用下拉菜單 | `boolean` | `false` | - |
| `[nzPlacement]` | 彈出菜單的位置 | `'bottomLeft' \| 'bottomCenter' \| 'bottomRight' \| 'topLeft' \| 'topCenter' \| 'topRight'` | `'bottomLeft'` | - |
| `[nzTrigger]` | 下拉菜單的觸發方式 | `'click' \| 'hover'` | `'hover'` | - |
| `[nzClickHide]` | 點擊菜單項時是否隱藏菜單 | `boolean` | `true` | - |
| `[nzVisible]` | 下拉菜單的顯示/隱藏狀態，支持雙向綁定 | `boolean` | `false` | - |
| `[nzOverlayClassName]` | 下拉菜單根元素的 CSS 類名 | `string` | `-` | - |
| `[nzOverlayStyle]` | 下拉菜單根元素的 CSS 樣式 | `object` | `-` | - |
| `[nzArrow]` | 是否顯示下拉箭頭 | `boolean` | `false` | 20.2.0 |
| `(nzVisibleChange)` | 下拉菜單顯示/隱藏狀態改變時觸發 | `EventEmitter<boolean>` | `-` | - |

### nz-dropdown-menu 組件

下拉菜單組件，用於定義下拉菜單的內容。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `#menu="nzDropdownMenu"` | 模板變量，導出 `NzDropdownMenuComponent` 實例 | `NzDropdownMenuComponent` | `-` |

### NzContextMenuService 服務

用於以編程方式創建和管理上下文菜單下拉菜單的服務。

#### 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `create()` | 在指定位置創建下拉菜單 | `$event: MouseEvent \| {x:number, y:number}`, `menu: NzDropdownMenuComponent` | `EmbeddedViewRef<any>` |
| `close()` | 關閉當前打開的上下文菜單下拉菜單 | `-` | `void` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/dropdown/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

