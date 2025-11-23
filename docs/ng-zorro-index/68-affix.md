# Affix - 固釘

> **組件分類**：其他類組件 (Other)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAffixModule` |
| **官方文檔** | [Affix](https://ng.ant.design/components/affix/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzAffixModule } from 'ng-zorro-antd/affix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzAffixModule],
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

請參考 [官方文檔](https://ng.ant.design/components/affix/en) 查看詳細用法和示例。

## API

### nz-affix 組件

固釘組件，用於將元素固定在可滾動區域的特定位置。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzOffsetBottom]` | 距離窗口底部達到指定偏移量後觸發 | `number` | `-` |
| `[nzOffsetTop]` | 距離窗口頂部達到指定偏移量後觸發 | `number` | `0` |
| `[nzTarget]` | 設置 `nz-affix` 需要監聽其滾動事件的元素，值為一個返回對應 DOM 元素的函數 | `string \| HTMLElement` | `window` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzChange)` | 固定狀態改變時的回調 | `EventEmitter<boolean>` |

> **注意**：`nz-affix` 的子元素不能是 `position: absolute`，但 `nz-affix` 本身可以設置 `position: absolute`。

## 相關資源

- [官方文檔](https://ng.ant.design/components/affix/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

