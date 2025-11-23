# FloatButton - 懸浮按鈕

> **組件分類**：通用類組件 (General)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFloatButtonModule` |
| **官方文檔** | [FloatButton](https://ng.ant.design/components/float-button/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzFloatButtonModule],
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

請參考 [官方文檔](https://ng.ant.design/components/float-button/en) 查看詳細用法和示例。

## API

### 共同的 API

`nz-float-button` 組件共有的 API：

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzIcon]` | 自定義圖標 | `string \| TemplateRef<void> \| null` | `-` | - |
| `[nzDescription]` | 文字及其它內容 | `string \| TemplateRef<void> \| null` | `-` | - |
| `[nzType]` | 按鈕類型 | `'default' \| 'primary'` | `'default'` | - |
| `[nzShape]` | 按鈕形狀 | `'circle' \| 'square'` | `'circle'` | - |
| `[nzHref]` | 點擊跳轉的地址，指定此參數 button 的行為和 a 鏈接一致 | `string` | `-` | - |
| `[nzTarget]` | 相當於 a 標籤的 target 屬性，nzHref 存在時生效 | `string` | `-` | - |
| `[nzBadge]` | 徽標數 | `NzFloatButtonBadge` | `-` | 20.4.0 |
| `(nzOnClick)` | 點擊按鈕時的回調 | `EventEmitter<boolean>` | `-` | - |

### nz-float-button-group 組件

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzTrigger]` | 觸發方式（有觸發方式為菜單模式） | `'click' \| 'hover'` | `-` |
| `[nzPlacement]` | 自定義菜單彈出位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` |
| `[nzOpen]` | 受控展開 | `boolean` | `-` |
| `(nzOnOpenChange)` | 展開收起時的回調 | `EventEmitter<boolean>` | `-` |

### nz-float-button-top 組件

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzVisibilityHeight]` | 滾動高度達到此值時才出現 nz-float-button-top | `number` | `400` | ✅ |
| `[nzTarget]` | 設置需要監聽其滾動事件的元素，值為一個返回對應 DOM 元素的函數 | `string \| Element` | `window` | `-` |
| `[nzDuration]` | 回到頂部所需時間（毫秒） | `number` | `450` | `-` |

### Interfaces

#### NzFloatButtonBadge

```typescript
export interface NzFloatButtonBadge {
  nzDot?: boolean;
  nzCount?: number | TemplateRef<void>;
  nzShowZero?: boolean;
  nzOverflowCount?: number;
  nzColor?: string;
  nzOffset?: [number, number];
  nzSize?: 'default' | 'small';
}
```

> **注意**：`NzBadge` 組件屬性中移除 `nzShowDot`, `nzTitle`, `nzStatus`, `nzText`

## 相關資源

- [官方文檔](https://ng.ant.design/components/float-button/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

