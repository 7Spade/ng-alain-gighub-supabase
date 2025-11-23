# Divider - 分割線

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDividerModule` |
| **官方文檔** | [Divider](https://ng.ant.design/components/divider/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDividerModule],
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

請參考 [官方文檔](https://ng.ant.design/components/divider/en) 查看詳細用法和示例。

## API

### nz-divider 組件

分割線組件，用於分隔內容。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzDashed]` | 是否虛線 | `boolean` | `false` | - |
| `[nzType]` | 分割線方向類型 | `'horizontal' \| 'vertical'` | `'horizontal'` | - |
| `[nzText]` | 分割線中間的文字 | `string \| TemplateRef<void>` | `-` | - |
| `[nzPlain]` | 文字是否顯示為普通文字樣式 | `boolean` | `false` | - |
| `[nzOrientation]` | 分割線中間文字的位置 | `'center' \| 'left' \| 'right'` | `'center'` | - |
| `[nzVariant]` | 分割線的樣式 | `'dashed' \| 'dotted' \| 'solid'` | `'solid'` | - |
| `[nzSize]` | 分割線的大小 | `'small' \| 'middle' \| 'large'` | `'-'` | 20.2.0 |

## 相關資源

- [官方文檔](https://ng.ant.design/components/divider/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

