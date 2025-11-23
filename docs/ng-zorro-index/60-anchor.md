# Anchor - 錨點

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAnchorModule` |
| **官方文檔** | [Anchor](https://ng.ant.design/components/anchor/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzAnchorModule } from 'ng-zorro-antd/anchor';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzAnchorModule],
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

請參考 [官方文檔](https://ng.ant.design/components/anchor/en) 查看詳細用法和示例。

## API

### nz-anchor 組件

錨點組件，用於在頁面內提供錨點導航。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAffix]` | 固定模式 | `boolean` | `true` |
| `[nzBounds]` | 錨點區域邊界，單位：px | `number` | `5` |
| `[nzOffsetTop]` | 距離窗口頂部達到指定偏移量後觸發 | `number` | `0` |
| `[nzShowInkInFixed]` | 固定模式是否顯示小圓點 | `boolean` | `false` |
| `[nzTargetOffset]` | 錨點滾動偏移量，默認與 `offsetTop` 相同 | `number` | `-` |
| `[nzContainer]` | 指定滾動容器 | `string \| HTMLElement` | `window` |
| `[nzCurrentAnchor]` | 自定義高亮的錨點 | `string` | `-` |
| `[nzDirection]` | 設置導航方向 | `'vertical' \| 'horizontal'` | `'vertical'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzClick)` | 點擊錨點項時觸發 | `EventEmitter<string>` |
| `(nzChange)` | 監聽錨點鏈接改變 | `EventEmitter<string>` |
| `(nzScroll)` | 滾動到錨點時觸發的滾動函數 | `EventEmitter<NzAnchorLinkComponent>` |

### nz-link 組件

錨點鏈接組件，表示錨點中的單個鏈接。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzHref]` | 錨點鏈接 | `string` | `-` |
| `[nzTarget]` | 指定在何處顯示鏈接的資源 | `string` | `-` |
| `[nzTitle]` | 鏈接內容 | `string \| TemplateRef<void>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/anchor/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

