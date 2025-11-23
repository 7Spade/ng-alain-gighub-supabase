# Timeline - 時間軸

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTimelineModule` |
| **官方文檔** | [Timeline](https://ng.ant.design/components/timeline/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTimelineModule],
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

請參考 [官方文檔](https://ng.ant.design/components/timeline/en) 查看詳細用法和示例。

## API

### nz-timeline 組件

時間軸組件，用於展示時間軸信息。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzPending]` | 指定最後一個"幽靈"節點是否存在及其內容 | `string \| boolean \| TemplateRef<void>` | `-` |
| `[nzPendingDot]` | 當最後一個"幽靈"節點存在時，指定其時間圖標 | `string \| TemplateRef<void>` | `-` |
| `[nzReverse]` | 節點的排序 | `boolean` | `false` |
| `[nzMode]` | 通過設置 `mode` 可以改變時間軸和內容的相對位置 | `'left' \| 'alternate' \| 'right' \| 'custom'` | `-` |

### nz-timeline-item 組件

時間軸中的單個節點。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzColor]` | 指定圓圈標記的顏色，可選值為 'blue'、'red'、'green'、'gray' 或自定義顏色值 | `string` | `-` |
| `[nzDot]` | 自定義時間軸節點標記 | `string \| TemplateRef<void>` | `-` |
| `[nzPosition]` | 自定義節點的位置，僅在 `nzMode` 為 'custom' 時有效 | `'left' \| 'right'` | `-` |
| `[nzLabel]` | 設置時間軸節點的標籤 | `string \| TemplateRef<void>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/timeline/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

