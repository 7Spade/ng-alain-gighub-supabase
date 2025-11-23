# Cascader - 級聯選擇

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCascaderModule` |
| **官方文檔** | [Cascader](https://ng.ant.design/components/cascader/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCascaderModule } from 'ng-zorro-antd/cascader';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCascaderModule],
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

請參考 [官方文檔](https://ng.ant.design/components/cascader/en) 查看詳細用法和示例。

## API

### nz-cascader 組件

級聯選擇組件，用於選擇級聯數據。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[ngModel]` | 選中的值 | `any[]` | `-` |
| `[nzAllowClear]` | 是否允許清除 | `boolean` | `true` |
| `[nzAutoFocus]` | 自動獲得焦點 | `boolean` | `false` |
| `[nzBackdrop]` | 是否為覆蓋層附加背景 | `boolean` | `false` |
| `[nzChangeOn]` | 點擊父級菜單項時，通過函數判斷是否允許值變化 | `(option: any, index: number) => boolean` | `-` |
| `[nzChangeOnSelect]` | 當此項為 true 時，點擊每一項都會觸發值變化 | `boolean` | `false` |
| `[nzColumnClassName]` | 自定義浮層列類名 | `string` | `-` |
| `[nzDisabled]` | 禁用 | `boolean` | `false` |
| `[nzExpandIcon]` | 自定義當前項展開圖標 | `string \| TemplateRef<void>` | `-` |
| `[nzExpandTrigger]` | 觸發子菜單展開的方式 | `'click' \| 'hover'` | `'click'` |
| `[nzLabelProperty]` | 選項的 label 屬性名 | `string` | `'label'` |
| `[nzLabelRender]` | 自定義選中項的模板 | `TemplateRef<any>` | `-` |
| `[nzLoadData]` | 用於動態加載選項，無法與 `nzShowSearch` 一起使用 | `(option: any, index?: number) => PromiseLike<any> \| Observable<any>` | `-` |
| `[nzMenuClassName]` | 自定義浮層類名 | `string` | `-` |
| `[nzMenuStyle]` | 自定義浮層樣式 | `object` | `-` |
| `[nzMouseEnterDelay]` | 鼠標移入後延遲多少秒顯示 | `number` | `150` |
| `[nzMouseLeaveDelay]` | 鼠標移出後延遲多少秒隱藏 | `number` | `150` |
| `[nzMultiple]` | 支持多選 | `boolean` | `false` |
| `[nzNotFoundContent]` | 當搜索無結果時顯示的內容 | `string \| TemplateRef<void>` | `-` |
| `[nzOptionRender]` | 自定義渲染級聯選項 | `TemplateRef<{ $implicit: NzCascaderOption, index: number }>` | `-` |
| `[nzOptions]` | 級聯數據 | `object[]` | `-` |
| `[nzOpen]` | 控制浮層顯示 | `boolean` | `false` |
| `[nzPlaceHolder]` | 輸入框佔位符 | `string` | `'Please select'` |
| `[nzPlacement]` | 浮層位置 | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` |
| `[nzShowArrow]` | 是否顯示箭頭 | `boolean` | `true` |
| `[nzShowInput]` | 是否顯示輸入框 | `boolean` | `true` |
| `[nzShowSearch]` | 是否支持搜索，無法與 `nzLoadData` 一起使用 | `boolean \| NzShowSearchOptions` | `false` |
| `[nzSize]` | 輸入框大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` |
| `[nzPrefix]` | 自定義前綴 | `string \| TemplateRef<void>` | `-` |
| `[nzSuffixIcon]` | 自定義後綴圖標 | `string \| TemplateRef<void>` | `-` |
| `[nzValueProperty]` | 選項的 value 屬性名 | `string` | `'value'` |
| `[nzVariant]` | 級聯選擇器的變體 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(ngModelChange)` | 值變化時觸發 | `EventEmitter<any[]>` |
| `(nzClear)` | 清除時觸發 | `EventEmitter<void>` |
| `(nzVisibleChange)` | 浮層顯示/隱藏時觸發 | `EventEmitter<boolean>` |
| `(nzRemoved)` | 多選模式下，移除選項時觸發 | `EventEmitter<NzCascaderOption>` |
| `(nzSelectionChange)` | 選項變化時觸發 | `EventEmitter<NzCascaderOption[]>` |

#### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `blur()` | 移除焦點 |
| `focus()` | 獲得焦點 |
| `closeMenu()` | 關閉下拉菜單 |

### NzCascaderOption 接口

定義級聯選項的結構。

```typescript
export interface NzCascaderOption {
  value?: any;
  label?: string;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  isLeaf?: boolean;
  children?: NzCascaderOption[];
  disableCheckbox?: boolean;
  [key: string]: any;
}
```

### NzShowSearchOptions 接口

當 `nzShowSearch` 配置為對象時，應遵循此接口來定義自定義過濾和排序邏輯。

```typescript
export interface NzShowSearchOptions {
  filter?: (inputValue: string, path: NzCascaderOption[]) => boolean;
  sorter?: (a: NzCascaderOption[], b: NzCascaderOption[], inputValue: string) => number;
}
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/cascader/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

