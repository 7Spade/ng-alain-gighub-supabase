# Space - 間距

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSpaceModule` |
| **官方文檔** | [Space](https://ng.ant.design/components/space/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSpaceModule],
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

請參考 [官方文檔](https://ng.ant.design/components/space/en) 查看詳細用法和示例。

## API

### nz-space 組件

間距組件，設置元素之間的間距。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSize]` | 間距大小 | `NzSpaceSize \| NzSpaceSize[]` | `'small'` |
| `[nzDirection]` | 間距方向 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| `[nzAlign]` | 對齊方式 | `'start' \| 'end' \| 'baseline' \| 'center'` | `-` |
| `[nzWrap]` | 是否自動換行，當 `horizontal` 時有效 | `boolean` | `false` |
| `[nzSplit]` | 設置分隔符 | `TemplateRef \| string` | `-` |

#### 類型定義

```typescript
type NzSpaceSize = 'small' | 'middle' | 'large' | number;
```

### nz-space-compact 組件

緊湊間距組件，用於緊密連接子表單組件。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzBlock]` | 將寬度調整為父元素的寬度 | `boolean` | `false` |
| `[nzDirection]` | 設置佈局方向 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| `[nzSize]` | 設置子組件大小 | `'large' \| 'small' \| 'default'` | `'default'` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/space/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

