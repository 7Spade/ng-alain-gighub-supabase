# HashCode - 哈希碼

> **組件分類**：特色組件 (Special)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzHashCodeModule` |
| **官方文檔** | [HashCode](https://ng.ant.design/components/hash-code/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzHashCodeModule } from 'ng-zorro-antd/hash-code';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzHashCodeModule],
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

請參考 [官方文檔](https://ng.ant.design/components/hash-code/en) 查看詳細用法和示例。

## API

### nz-hash-code 組件

哈希碼組件，用於顯示區塊鏈數據的哈希值。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzValue]` | 哈希碼的值 | `string` | `-` |
| `[nzTitle]` | 左上角內容的描述 | `string` | `'HashCode'` |
| `[nzLogo]` | 右上角顯示的內容 | `TemplateRef<void> \| string` | `-` |
| `[nzMode]` | 演示模式 | `'single' \| 'double' \| 'strip' \| 'rect'` | `'double'` |
| `[nzType]` | 組件的樣式 | `'default' \| 'primary'` | `'primary'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnCopy)` | 點擊複製按鈕時觸發，發出複製的哈希字符串 | `EventEmitter<string>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/hash-code/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

