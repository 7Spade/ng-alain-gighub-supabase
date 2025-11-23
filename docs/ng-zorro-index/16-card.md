# Card - 卡片

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCardModule` |
| **官方文檔** | [Card](https://ng.ant.design/components/card/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCardModule],
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

請參考 [官方文檔](https://ng.ant.design/components/card/en) 查看詳細用法和示例。

## API

### nz-card 組件

卡片組件，用於顯示與單個主題相關的內容的簡單矩形容器。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzActions]` | 操作列表，顯示在卡片底部 | `Array<TemplateRef<void>>` | `-` |
| `[nzBodyStyle]` | 應用於卡片內容的內聯樣式 | `{ [key: string]: string }` | `-` |
| `[nzBordered]` | 是否顯示卡片邊框 | `boolean` | `true` |
| `[nzCover]` | 卡片封面 | `TemplateRef<void>` | `-` |
| `[nzExtra]` | 卡片右上角的內容 | `string \| TemplateRef<void>` | `-` |
| `[nzHoverable]` | 鼠標懸停時是否可浮起 | `boolean` | `false` |
| `[nzLoading]` | 當卡片內容正在加載時顯示加載指示器 | `boolean` | `false` |
| `[nzTitle]` | 卡片標題 | `string \| TemplateRef<void>` | `-` |
| `[nzType]` | 卡片樣式類型，可以設置為 `inner` 或不設置 | `'inner'` | `-` |
| `[nzSize]` | 卡片大小 | `'default' \| 'small'` | `'default'` |

### nz-card-meta 組件

卡片元信息組件，用於在卡片內結構化元信息。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAvatar]` | 頭像或圖標 | `TemplateRef<void>` | `-` |
| `[nzDescription]` | 描述內容 | `string \| TemplateRef<void>` | `-` |
| `[nzTitle]` | 標題內容 | `string \| TemplateRef<void>` | `-` |

### nz-card-grid 組件

卡片網格組件，用於創建網格樣式的卡片。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzHoverable]` | 鼠標懸停時是否可浮起 | `boolean` | `true` |

### nz-card-tab 組件

卡片標籤組件，用於創建帶標籤的卡片界面。

## 相關資源

- [官方文檔](https://ng.ant.design/components/card/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

