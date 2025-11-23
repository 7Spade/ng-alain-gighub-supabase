# Skeleton - 骨架屏

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSkeletonModule` |
| **官方文檔** | [Skeleton](https://ng.ant.design/components/skeleton/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSkeletonModule],
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

請參考 [官方文檔](https://ng.ant.design/components/skeleton/en) 查看詳細用法和示例。

## API

### nz-skeleton 組件

骨架屏組件，在內容加載時提供佔位符。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActive]` | 是否顯示動畫效果 | `boolean` | `false` |
| `[nzAvatar]` | 是否顯示頭像佔位符 | `boolean \| NzSkeletonAvatar` | `false` |
| `[nzLoading]` | 當為 `true` 時顯示骨架屏 | `boolean` | `-` |
| `[nzParagraph]` | 是否顯示段落佔位符 | `boolean \| NzSkeletonParagraph` | `true` |
| `[nzTitle]` | 是否顯示標題佔位符 | `boolean \| NzSkeletonTitle` | `true` |
| `[nzRound]` | 是否顯示段落和標題的圓角 | `boolean` | `false` |

### NzSkeletonAvatar 配置

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `size` | 設置頭像大小 | `number \| 'large' \| 'small' \| 'default'` | `-` |
| `shape` | 設置頭像形狀 | `'circle' \| 'square'` | `-` |

### NzSkeletonTitle 配置

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `width` | 設置標題寬度 | `number \| string` | `-` |

### NzSkeletonParagraph 配置

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `rows` | 設置段落行數 | `number` | `-` |
| `width` | 設置段落寬度。當 width 為數組時，可以設置每一行的寬度。否則只設置最後一行的寬度 | `number \| string \| Array<number \| string>` | `-` |

### nz-skeleton-element 組件

骨架屏元素組件，用於創建自定義骨架屏元素。

#### Button 元素

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActive]` | 顯示動畫效果 | `boolean` | `false` |
| `[nzSize]` | 設置大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzShape]` | 設置形狀 | `'square' \| 'circle' \| 'round' \| 'default'` | `'default'` |

#### Avatar 元素

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActive]` | 顯示動畫效果 | `boolean` | `false` |
| `[nzSize]` | 設置大小 | `number \| 'large' \| 'small' \| 'default'` | `'default'` |
| `[nzShape]` | 設置形狀 | `'circle' \| 'square'` | `'square'` |

#### Input 元素

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActive]` | 顯示動畫效果 | `boolean` | `false` |
| `[nzSize]` | 設置大小 | `'large' \| 'small' \| 'default'` | `'default'` |

#### Image 元素

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActive]` | 顯示動畫效果 | `boolean` | `false` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/skeleton/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

