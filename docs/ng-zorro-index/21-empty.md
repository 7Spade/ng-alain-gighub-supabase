# Empty - 空狀態

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzEmptyModule` |
| **官方文檔** | [Empty](https://ng.ant.design/components/empty/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzEmptyModule],
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

請參考 [官方文檔](https://ng.ant.design/components/empty/en) 查看詳細用法和示例。

## API

### nz-empty 組件

空狀態組件，用於顯示空數據時的友好提示。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzNotFoundImage]` | 設置顯示圖片，字符串值表示自定義圖片 URL | `string \| TemplateRef<void>` | `-` |
| `[nzNotFoundContent]` | 自定義描述內容 | `string \| TemplateRef<void> \| null` | `-` |
| `[nzNotFoundFooter]` | 自定義底部內容 | `string \| TemplateRef<void>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/empty/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

