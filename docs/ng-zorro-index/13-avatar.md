# Avatar - 頭像

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAvatarModule` |
| **官方文檔** | [Avatar](https://ng.ant.design/components/avatar/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzAvatarModule],
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

請參考 [官方文檔](https://ng.ant.design/components/avatar/en) 查看詳細用法和示例。

## API

### nz-avatar 組件

頭像組件，用於表示用戶或事物，支持圖片、圖標或字符顯示。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzIcon]` | 圖標類型頭像的圖標類型，參考 `Icon` | `string` | `-` |
| `[nzShape]` | 頭像的形狀 | `'circle' \| 'square'` | `'circle'` |
| `[nzSize]` | 頭像的大小 | `'large' \| 'small' \| 'default' \| number` | `'default'` |
| `[nzGap]` | 字符類型頭像左右兩邊的單位距離 | `number` | `4` |
| `[nzSrc]` | 圖片類型頭像的圖片地址 | `string` | `-` |
| `[nzSrcSet]` | 圖片類型頭像的響應式圖片地址列表 | `string` | `-` |
| `[nzAlt]` | 圖片的替代文字 | `string` | `-` |
| `[nzText]` | 字符類型頭像 | `string` | `-` |
| `[nzLoading]` | 設置頭像圖片元素的原生 `loading` 屬性 | `'eager' \| 'lazy'` | `'eager'` |
| `[nzFetchPriority]` | 設置頭像圖片元素的原生 `fetchpriority` 屬性 | `'high' \| 'low' \| 'auto'` | `'auto'` |
| `(nzError)` | 圖片加載失敗時觸發的事件，調用 `preventDefault` 方法可以阻止默認的降級行為 | `EventEmitter<Event>` | `-` |

### nz-avatar-group 組件

頭像組組件，用於將多個頭像組合在一起顯示。

## 相關資源

- [官方文檔](https://ng.ant.design/components/avatar/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

