# Spin - 加載中

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSpinModule` |
| **官方文檔** | [Spin](https://ng.ant.design/components/spin/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSpinModule],
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

請參考 [官方文檔](https://ng.ant.design/components/spin/en) 查看詳細用法和示例。

## API

### nz-spin 組件

加載中組件，用於頁面和區塊的加載中狀態。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDelay]` | 延遲顯示加載狀態的時間（毫秒） | `number` | `0` |
| `[nzIndicator]` | 自定義加載指示器 | `TemplateRef<void>` | `-` |
| `[nzSize]` | 設置 Spin 組件的大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzSpinning]` | 是否顯示加載狀態 | `boolean` | `true` |
| `[nzSimple]` | 是否不渲染子元素 | `boolean` | `false` |
| `[nzTip]` | 當 Spin 組件有子元素時顯示的自定義描述文字 | `string` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/spin/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

