# CheckList - 任務清單

> **組件分類**：特色組件 (Special)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCheckListModule` |
| **官方文檔** | [CheckList](https://ng.ant.design/components/check-list/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCheckListModule } from 'ng-zorro-antd/check-list';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCheckListModule],
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

請參考 [官方文檔](https://ng.ant.design/components/check-list/en) 查看詳細用法和示例。

## API

### nz-check-list 組件

任務清單組件，用於顯示任務清單。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzItems]` | 清單元素 | `NzItemProps[]` | `[]` |
| `[nzVisible]` | 是否顯示清單 | `boolean` | `false` |
| `[nzIndex]` | 當前索引 | `number` | `1` |
| `[nzProgress]` | 是否顯示進度 | `boolean` | `true` |
| `[nzTriggerRender]` | 浮動按鈕的渲染模板 | `TemplateRef<void> \| string` | `-` |
| `[nzTitle]` | 清單面板標題的渲染模板 | `TemplateRef<void> \| string` | `-` |
| `[nzFooter]` | 清單面板底部的渲染模板 | `TemplateRef<void> \| string` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzHide)` | 隱藏清單時觸發的回調 | `EventEmitter<boolean>` |

> **注意**：`(nzHide)` 的值表示是否不再顯示清單。如果值為 `true`，可以將數據存儲在 `LocalStorage` 中，以避免再次顯示清單。

## 相關資源

- [官方文檔](https://ng.ant.design/components/check-list/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

