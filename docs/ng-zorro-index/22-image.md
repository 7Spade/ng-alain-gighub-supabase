# Image - 圖片

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzImageModule` |
| **官方文檔** | [Image](https://ng.ant.design/components/image/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzImageModule],
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

請參考 [官方文檔](https://ng.ant.design/components/image/en) 查看詳細用法和示例。

## API

### nz-image 組件

圖片組件，用於展示圖片並支持預覽功能。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSrc]` | 圖片地址 | `string` | `-` |
| `[nzFallback]` | 加載失敗時的佔位圖 | `string` | `-` |
| `[nzPlaceholder]` | 加載中時的佔位圖 | `string` | `-` |
| `[nzDisablePreview]` | 是否禁用預覽 | `boolean` | `false` |
| `[nzCloseOnNavigation]` | 導航歷史變化時是否關閉預覽 | `boolean` | `false` |
| `[nzDirection]` | 組件的文本方向 | `Direction` | `'ltr'` |
| `[nzScaleStep]` | 縮放時的步長倍數 | `number` | `0.5` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/image/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

