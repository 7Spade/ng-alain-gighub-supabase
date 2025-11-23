# Button - 按鈕

> **組件分類**：通用類組件 (General)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzButtonModule` |
| **官方文檔** | [Button](https://ng.ant.design/components/button/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzButtonModule],
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

請參考 [官方文檔](https://ng.ant.design/components/button/en) 查看詳細用法和示例。

## API

### nz-button 指令

`nz-button` 是一個指令，用於創建自定義按鈕，支持多種樣式、狀態和行為。

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzBlock]` | 將按鈕寬度調整為其父元素的寬度 | `boolean` | `false` | - |
| `[nzDanger]` | 設置按鈕為危險狀態，通常用於破壞性操作 | `boolean` | `false` | - |
| `[nzDisabled]` | 禁用按鈕交互 | `boolean` | `false` | - |
| `[nzGhost]` | 應用幽靈樣式，適合複雜背景 | `boolean` | `false` | - |
| `[nzLoading]` | 在按鈕內顯示加載動畫 | `boolean` | `false` | - |
| `[nzShape]` | 定義按鈕形狀 | `'circle' \| 'round'` | `-` | - |
| `[nzSize]` | 設置按鈕大小 | `'large' \| 'small' \| 'default'` | `'default'` | - |
| `[nzType]` | 設置按鈕類型樣式 | `'primary' \| 'dashed' \| 'link' \| 'text'` | `-` | - |

### 全局屬性（繼承自原生 button）

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `disabled` | 阻止用戶交互 | `boolean` | `false` |
| `type` | 指定按鈕類型（如 'submit', 'reset', 'button'） | `string` | `'button'` |

### 使用示例

```html
<!-- 主要按鈕 -->
<button nz-button nzType="primary">Primary Button</button>

<!-- 虛線按鈕（加載中） -->
<button nz-button nzType="dashed" [nzLoading]="true">Dashed Button (Loading)</button>

<!-- 圓形按鈕 -->
<button nz-button nzShape="circle" nzType="primary">C</button>

<!-- 危險按鈕 -->
<button nz-button nzDanger>Danger Button</button>

<!-- 塊級按鈕 -->
<button nz-button nzType="primary" [nzBlock]="true">Block Button</button>
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/button/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

