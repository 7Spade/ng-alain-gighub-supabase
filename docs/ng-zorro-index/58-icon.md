# Icon - 圖標

> **組件分類**：通用類組件 (General)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzIconModule` |
| **官方文檔** | [Icon](https://ng.ant.design/components/icon/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzIconModule],
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

請參考 [官方文檔](https://ng.ant.design/components/icon/en) 查看詳細用法和示例。

## API

### nz-icon 組件

圖標組件，用於顯示語義化的矢量圖形。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzType]` | 圖標類型，遵循圖標庫的命名規範 | `string` | `-` | `-` |
| `[nzTheme]` | 圖標主題樣式 | `'fill' \| 'outline' \| 'twotone'` | `'outline'` | ✅ |
| `[nzSpin]` | 是否有旋轉動畫 | `boolean` | `false` | `-` |
| `[nzTwotoneColor]` | 雙色圖標的主要顏色 | `string` (hex 顏色) | `-` | ✅ |
| `[nzIconfont]` | 指定來自 IconFont 的圖標類型 | `string` | `-` | `-` |
| `[nzRotate]` | 圖標旋轉角度 | `number` | `-` | `-` |

### NzIconService

圖標服務，用於管理和加載圖標資源。

#### 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `addIcon(icon: IconDefinition)` | 靜態導入圖標 | `icon: IconDefinition` | `void` |
| `addIconLiteral(name: string, svg: string)` | 靜態導入用戶自定義圖標 | `name: string`, `svg: string` | `void` |
| `fetchFromIconfont(options: NzIconfontOption)` | 從 IconFont 獲取圖標資源 | `options: NzIconfontOption` | `void` |
| `changeAssetsSource(prefix: string)` | 修改動態加載圖標資源文件的地址前綴，用於 CDN 部署 | `prefix: string` | `void` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/icon/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

