# Layout - 佈局

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzLayoutModule` |
| **官方文檔** | [Layout](https://ng.ant.design/components/layout/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzLayoutModule],
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

請參考 [官方文檔](https://ng.ant.design/components/layout/en) 查看詳細用法和示例。

## API

### nz-sider 組件

側邊欄組件，用於創建響應式佈局。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzBreakpoint]` | 觸發響應式佈局的斷點 | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `-` |
| `[nzCollapsedWidth]` | 收起時的寬度，設置為 `0` 會出現特殊的 trigger | `number` | `64` |
| `[nzCollapsible]` | 是否可收起 | `boolean` | `false` |
| `[nzCollapsed]` | 當前收起狀態，支持雙向綁定 | `boolean` | `-` |
| `[nzReverseArrow]` | 翻轉收起箭頭的方向，當 Sider 在右邊時可以使用 | `boolean` | `false` |
| `[nzTrigger]` | 自定義 trigger，設置為 `null` 時隱藏 trigger | `string \| TemplateRef<void> \| null` | `-` |
| `[nzZeroTrigger]` | 當 `nzCollapsedWidth` 為 `0` 時的自定義 trigger | `TemplateRef<void>` | `-` |
| `[nzWidth]` | 側邊欄寬度 | `number \| string` | `200` |
| `[nzTheme]` | 側邊欄的主題顏色 | `'light' \| 'dark'` | `'dark'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzCollapsedChange)` | 展開/收起狀態變化時觸發 | `EventEmitter<boolean>` |

#### 斷點寬度

- **xs**: `480px`
- **sm**: `768px`
- **md**: `992px`
- **lg**: `1200px`
- **xl**: `1600px`
- **xxl**: `1600px`

### nz-header 組件

頂部佈局組件。

### nz-content 組件

內容佈局組件。

### nz-footer 組件

底部佈局組件。

## 相關資源

- [官方文檔](https://ng.ant.design/components/layout/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

