# Transfer - 穿梭框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTransferModule` |
| **官方文檔** | [Transfer](https://ng.ant.design/components/transfer/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTransferModule } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTransferModule],
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

請參考 [官方文檔](https://ng.ant.design/components/transfer/en) 查看詳細用法和示例。

## API

### nz-transfer 組件

穿梭框組件，用於在兩個列表之間移動元素。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzOneWay]` | 顯示為單向樣式 | `boolean` | `false` |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` |
| `[nzDataSource]` | 數據源，其中的數據將會被渲染到左邊一欄中，`targetKeys` 中指定的除外 | `NzTransferItem[]` | `[]` |
| `[nzTitles]` | 標題集合，順序從左至右 | `string[]` | `['', '']` |
| `[nzOperations]` | 操作文案集合，從上至下 | `string[]` | `['', '']` |
| `[nzListStyle]` | 兩個穿梭框的自定義樣式 | `object` | `-` |
| `[nzItemUnit]` | 單項單元 | `string` | `'項'` |
| `[nzItemsUnit]` | 多項單元 | `string` | `'項'` |
| `[nzRender]` | 每行數據渲染函數 | `(item: NzTransferItem) => string \| TemplateRef<void>` | `-` |
| `[nzFooter]` | 底部渲染函數 | `(direction: 'left' \| 'right') => TemplateRef<void>` | `-` |
| `[nzShowSearch]` | 是否顯示搜索框 | `boolean` | `false` |
| `[nzFilterOption]` | 接收 `inputValue` 和 `option` 兩個參數，當 `option` 符合篩選條件時，應返回 `true`，反之則返回 `false` | `(inputValue: string, item: NzTransferItem) => boolean` | `-` |
| `[nzSearchPlaceholder]` | 搜索框的佔位符 | `string` | `'請輸入搜索內容'` |
| `[nzNotFoundContent]` | 當列表為空時顯示的內容 | `string \| TemplateRef<void>` | `'列表為空'` |
| `[nzCanMove]` | 接收 `(arg: TransferCanMove) => Observable<TransferItem[]>` 返回值用於決定移動的選項 | `(arg: TransferCanMove) => Observable<TransferItem[]>` | `-` |
| `[nzSelectAllLabels]` | 自定義全選按鈕的標籤 | `string[]` | `-` |
| `[nzSelectedKeys]` | 設置哪些項應該被選中 | `string[]` | `[]` |
| `[nzTargetKeys]` | 顯示在右側框數據的 key 集合 | `string[]` | `[]` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzChange)` | 選項在兩欄之間移動時觸發的回調函數 | `EventEmitter<TransferChange>` |
| `(nzSearchChange)` | 搜索框內容改變時觸發的回調函數 | `EventEmitter<TransferSearchChange>` |
| `(nzSelectChange)` | 選中項發生改變時觸發的回調函數 | `EventEmitter<TransferSearchChange>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/transfer/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

