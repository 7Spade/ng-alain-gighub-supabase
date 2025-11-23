# Badge - 徽標數

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBadgeModule` |
| **官方文檔** | [Badge](https://ng.ant.design/components/badge/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzBadgeModule],
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

請參考 [官方文檔](https://ng.ant.design/components/badge/en) 查看詳細用法和示例。

## API

### nz-badge 組件

徽標數組件，用於顯示徽標，通常是數字或點。

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzStandalone]` | 是否獨立使用徽標 | `boolean` | `false` | - |
| `[nzColor]` | 自定義小點的顏色 | `string` | `-` | ✅ |
| `[nzCount]` | 顯示的數字，如果大於 `nzOverflowCount`，將顯示為 `${nzOverflowCount}+`。如果為 0，則隱藏徽標 | `number \| TemplateRef<void>` | `-` | - |
| `[nzDot]` | 僅顯示小紅點，不顯示數字 | `boolean` | `false` | - |
| `[nzShowDot]` | 是否顯示小紅點 | `boolean` | `true` | - |
| `[nzOverflowCount]` | 當計數超過此值時顯示的數字 | `number` | `99` | ✅ |
| `[nzShowZero]` | 當數值為 0 時是否顯示徽標 | `boolean` | `false` | - |
| `[nzSize]` | 當設置 `nzCount` 時，設置點的大小 | `'default' \| 'small'` | `'default'` | - |
| `[nzStatus]` | 將 `nz-badge` 設置為狀態點 | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | `-` | - |
| `[nzText]` | 當設置 `nzStatus` 時，設置狀態點的文本 | `string \| TemplateRef<void>` | `-` | - |
| `[nzTitle]` | 懸停在狀態點上時顯示的文字（非獨立使用時）。如果值為 `null`，則隱藏。默認為 `nzCount` | `string \| null` | `nzCount` | - |
| `[nzOffset]` | 設置狀態點的偏移位置，格式為 `[x, y]`（非獨立使用時） | `[number, number]` | `-` | - |

### nz-ribbon 組件

緞帶組件，用於添加裝飾性緞帶元素，通常與徽標相關聯。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzColor]` | 自定義緞帶的顏色 | `string` | `-` |
| `[nzPlacement]` | 設置緞帶的位置 | `'start' \| 'end'` | `'end'` |
| `[nzText]` | 緞帶內顯示的內容 | `string \| TemplateRef<void>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/badge/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

