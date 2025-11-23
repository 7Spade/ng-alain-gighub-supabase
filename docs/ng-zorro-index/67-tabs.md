# Tabs - 標籤頁

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTabsModule` |
| **官方文檔** | [Tabs](https://ng.ant.design/components/tabs/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTabsModule],
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

請參考 [官方文檔](https://ng.ant.design/components/tabs/en) 查看詳細用法和示例。

## API

### nz-tabs 組件

標籤頁組件，用於在不同內容區域之間進行切換。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSelectedIndex]` | 當前激活 tab 面板的序號 | `number` | `-` |
| `[nzAnimated]` | 是否使用動畫切換 Tabs，在 `nzTabPosition="top" \| "bottom"` 時有效 | `boolean \| {inkBar:boolean, tabPane:boolean}` | `true`（當 `type="card"` 時為 `false`） |
| `[nzSize]` | 大小，提供 `large` `default` 和 `small` 三種大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzTabBarExtraContent]` | tab bar 上額外的元素 | `TemplateRef<void>` | `-` |
| `[nzTabBarStyle]` | tab bar 的樣式對象 | `object` | `-` |
| `[nzTabPosition]` | 頁籤位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` |
| `[nzType]` | 頁籤的基本樣式，可選 `line`、`card`、`editable-card` 類型 | `'line' \| 'card' \| 'editable-card'` | `'line'` |
| `[nzTabBarGutter]` | tabs 之間的間距 | `number` | `-` |
| `[nzHideAll]` | 是否隱藏所有標籤頁 | `boolean` | `false` |
| `[nzLinkRouter]` | 是否與 Angular router 聯動，支持子路由模式和查詢參數模式 | `boolean` | `false` |
| `[nzLinkExact]` | 是否使用精確路由匹配 | `boolean` | `true` |
| `[nzCanDeactivate]` | 決定標籤頁是否可以取消激活 | `NzTabsCanDeactivateFn` | `-` |
| `[nzCentered]` | 標籤居中顯示 | `boolean` | `false` |
| `[nzDestroyInactiveTabPane]` | 切換標籤頁時是否銷毀不活躍的 TabPane | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzSelectedIndexChange)` | 當前激活 tab 面板的序號改變時觸發 | `EventEmitter<number>` |
| `(nzSelectChange)` | 當前激活 tab 面板改變時觸發 | `EventEmitter<{index: number,tab: NzTabComponent}>` |

### nz-tab 組件

標籤頁中的單個標籤。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTitle]` | 標籤頭顯示文字 | `string \| TemplateRef<void>` | `-` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzForceRender]` | 被隱藏時是否渲染 DOM 結構 | `boolean` | `false` |
| `[nzCloseable]` | 是否可以關閉 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊標籤時觸發 | `EventEmitter<void>` |
| `(nzSelect)` | 標籤被選中時觸發 | `EventEmitter<void>` |
| `(nzDeselect)` | 標籤被取消選中時觸發 | `EventEmitter<void>` |
| `(nzClose)` | 標籤被關閉時觸發 | `EventEmitter<void>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/tabs/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

