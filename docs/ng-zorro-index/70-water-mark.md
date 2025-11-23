# WaterMark - 水印

> **組件分類**：其他類組件 (Other)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzWaterMarkModule` |
| **官方文檔** | [WaterMark](https://ng.ant.design/components/water-mark/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzWaterMarkModule],
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

請參考 [官方文檔](https://ng.ant.design/components/water-mark/en) 查看詳細用法和示例。

## API

### nz-water-mark 組件

水印組件，用於在內容上添加水印。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzContent]` | 水印文字內容 | `string \| string[]` | `-` |
| `[nzWidth]` | 水印的寬度，`nzContent` 的默認值為其自身寬度 | `number` | `120` |
| `[nzHeight]` | 水印的高度，`nzContent` 的默認值為其自身高度 | `number` | `64` |
| `[nzRotate]` | 水印繪製時的旋轉角度，單位 `°` | `number` | `-22` |
| `[nzZIndex]` | 追加的水印元素的 z-index | `number` | `9` |
| `[nzImage]` | 圖片源，建議導出 2x 或 3x 圖片，高優先級（支持 base64 格式） | `string` | `-` |
| `[nzFont]` | 文字樣式 | `FontType` | `FontType` |
| `[nzGap]` | 水印之間的間距 | `[number, number]` | `[100, 100]` |
| `[nzOffset]` | 水印相對於容器左上角的偏移量，默認為 `nzGap/2` | `[number, number]` | `[nzGap[0]/2, nzGap[1]/2]` |

#### FontType 接口

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `color` | 字體顏色 | `string` | `'rgba(0,0,0,.15)'` |
| `fontSize` | 字體大小 | `number` | `16` |
| `fontWeight` | 字體粗細 | `string` | `'normal'` |
| `fontFamily` | 字體族 | `string` | `'sans-serif'` |
| `fontStyle` | 字體樣式 | `string` | `'normal'` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/water-mark/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

