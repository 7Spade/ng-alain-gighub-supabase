# Menu - 導航菜單

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzMenuModule` |
| **官方文檔** | [Menu](https://ng.ant.design/components/menu/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzMenuModule],
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

請參考 [官方文檔](https://ng.ant.design/components/menu/en) 查看詳細用法和示例。

## API

### nz-menu 指令

菜單容器指令，用於包含菜單項和子菜單。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzInlineCollapsed]` | 內聯模式時，是否收起 | `boolean` | `-` |
| `[nzInlineIndent]` | 內聯模式的菜單縮進寬度 | `number` | `24` |
| `[nzMode]` | 菜單類型 | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` |
| `[nzSelectable]` | 是否允許選中 | `boolean` | `true` |
| `[nzTheme]` | 菜單主題顏色 | `'light' \| 'dark'` | `'light'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊 `nz-menu-item` 時觸發 | `EventEmitter<NzMenuItemComponent>` |

### nz-menu-item 指令

菜單項指令，表示菜單中的單個可點擊項。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzSelected]` | 是否選中 | `boolean` | `false` |
| `[nzMatchRouter]` | 是否根據 [routerLink](https://www.angular.io/api/router/RouterLink) 自動設置 `nzSelected` | `boolean` | `false` |
| `[nzMatchRouterExact]` | 是否使用精確 URL 匹配，類似於 [routerLinkActiveOptions](https://angular.dev/api/router/RouterLinkActive#routerLinkActiveOptions) | `boolean` | `false` |
| `[nzDanger]` | 是否顯示為危險狀態 | `boolean` | `false` |

### nz-submenu 指令

子菜單指令，用於創建嵌套菜單。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTitle]` | 子菜單標題 | `string \| TemplateRef<void>` | `-` |
| `[nzIcon]` | 子菜單標題中的圖標類型 | `string` | `-` |
| `[nzPlacement]` | 彈出菜單的位置 | `'bottomLeft' \| 'bottomCenter' \| 'bottomRight' \| 'topLeft' \| 'topCenter' \| 'topRight'` | `'bottomLeft'` |
| `[nzOpen]` | 子菜單是否打開，支持雙向綁定 | `boolean` | `-` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzMenuClassName]` | 子菜單容器的自定義 CSS 類名 | `string` | `-` |
| `[nzTriggerSubMenuAction]` | 觸發子菜單打開/關閉的行為 | `'hover' \| 'click'` | `'hover'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOpenChange)` | 子菜單打開狀態改變時觸發 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/menu/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

