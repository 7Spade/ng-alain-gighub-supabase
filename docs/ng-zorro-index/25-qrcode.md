# QRCode - 二維碼

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzQRCodeModule` |
| **官方文檔** | [QRCode](https://ng.ant.design/components/qr-code/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzQRCodeModule],
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

請參考 [官方文檔](https://ng.ant.design/components/qr-code/en) 查看詳細用法和示例。

## API

### nz-qrcode 組件

二維碼組件，用於生成和顯示 QR 碼。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzValue]` | 二維碼的值 | `string` | `-` |
| `[nzBgColor]` | 背景顏色 | `string` | `'#ffffff'` |
| `[nzColor]` | 前景顏色 | `string` | `'#000000'` |
| `[nzLevel]` | 錯誤校正級別 | `'L' \| 'M' \| 'Q' \| 'H'` | `'L'` |
| `[nzSize]` | 二維碼大小（像素） | `number` | `160` |
| `[nzPadding]` | 內邊距（像素） | `number` | `0` |

> **注意**：錯誤校正級別說明：
> - `L` - 約 7% 的錯誤可以被校正
> - `M` - 約 15% 的錯誤可以被校正
> - `Q` - 約 25% 的錯誤可以被校正
> - `H` - 約 30% 的錯誤可以被校正

## 相關資源

- [官方文檔](https://ng.ant.design/components/qr-code/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

