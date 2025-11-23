# Carousel - 走馬燈

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCarouselModule` |
| **官方文檔** | [Carousel](https://ng.ant.design/components/carousel/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCarouselModule],
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

請參考 [官方文檔](https://ng.ant.design/components/carousel/en) 查看詳細用法和示例。

## API

### nz-carousel 組件

走馬燈組件，用於輪播展示內容。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAutoPlay]` | 是否自動切換 | `boolean` | `false` |
| `[nzAutoPlaySpeed]` | 自動切換的間隔時間（毫秒），設置為 0 時不自動切換 | `number` | `3000` |
| `[nzDotRender]` | 自定義指示點的渲染模板 | `TemplateRef<{ $implicit: number }>` | `-` |
| `[nzDotPosition]` | 指示點位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `[nzDots]` | 是否顯示指示點 | `boolean` | `true` |
| `[nzEffect]` | 切換效果 | `'scrollx' \| 'fade'` | `'scrollx'` |
| `[nzEnableSwipe]` | 是否支持手勢劃動 | `boolean` | `true` |
| `[nzLoop]` | 是否循環播放 | `boolean` | `true` |
| `[nzArrows]` | 是否顯示箭頭按鈕 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzAfterChange)` | 切換面板後的回調 | `EventEmitter<number>` |
| `(nzBeforeChange)` | 切換面板前的回調 | `EventEmitter<{ from: number; to: number }>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/carousel/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

