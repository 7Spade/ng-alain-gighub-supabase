# BackTop - 返回頂部

> **組件分類**：其他類組件 (Other)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBackTopModule` |
| **官方文檔** | [BackTop](https://ng.ant.design/components/back-top/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzBackTopModule } from 'ng-zorro-antd/back-top';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzBackTopModule],
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

請參考 [官方文檔](https://ng.ant.design/components/back-top/en) 查看詳細用法和示例。

## API

### nz-back-top 組件

返回頂部組件，用於快速返回頁面頂部。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzVisibilityHeight]` | 滾動高度達到此值時才顯示 `nz-back-top` | `number` | `400` | ✅ |
| `[nzTarget]` | 設置需要監聽其滾動事件的元素，值為一個返回對應 DOM 元素的函數 | `string \| Element` | `window` | `-` |
| `[nzDuration]` | 回到頂部所需時間（毫秒） | `number` | `450` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊按鈕時觸發 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/back-top/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

