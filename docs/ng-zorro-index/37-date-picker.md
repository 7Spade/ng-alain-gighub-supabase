# DatePicker - 日期選擇框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDatePickerModule` |
| **官方文檔** | [DatePicker](https://ng.ant.design/components/date-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzDatePickerModule],
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

請參考 [官方文檔](https://ng.ant.design/components/date-picker/en) 查看詳細用法和示例。

## API

### nz-date-picker 組件

日期選擇框組件，用於選擇或輸入日期。

> **注意**：DatePicker 組件有多個變體（`nz-date-picker`、`nz-range-picker`、`nz-week-picker`、`nz-month-picker` 等），它們共享大部分 API，但某些屬性可能僅適用於特定變體。以下列出的是通用 API。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[(ngModel)]` | 選中的日期 | `Date` | `-` |
| `[nzPlaceHolder]` | 輸入框佔位符 | `string \| string[]` | `-` |
| `[nzPopupStyle]` | 彈出層的自定義樣式 | `object` | `-` |
| `[nzRenderExtraFooter]` | 在面板底部渲染額外的頁腳 | `TemplateRef \| string \| (() => TemplateRef \| string)` | `-` |
| `[nzSize]` | 輸入框大小 | `'large' \| 'small'` | `-` |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` |
| `[nzPlacement]` | 彈出層位置 | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` |
| `[nzSuffixIcon]` | 自定義後綴圖標 | `string \| TemplateRef` | `-` |
| `[nzVariant]` | DatePicker 的變體 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` |
| `[nzInline]` | 內聯模式 | `boolean` | `false` |
| `[nzFormat]` | 展示的日期格式 | `string` | `'yyyy-MM-dd'` |
| `[nzDisabled]` | 禁用 | `boolean` | `false` |
| `[nzDisabledDate]` | 不可選擇的日期 | `(current: Date) => boolean` | `-` |
| `[nzShowToday]` | 是否顯示"今天"按鈕 | `boolean` | `true` |
| `[nzShowTime]` | 增加時間選擇功能 | `boolean \| object` | `false` |
| `[nzAllowClear]` | 是否允許清除 | `boolean` | `true` |
| `[nzAutoFocus]` | 自動獲得焦點 | `boolean` | `false` |
| `[nzOpen]` | 控制彈出層顯示 | `boolean` | `false` |
| `[nzDefaultPickerValue]` | 默認面板日期 | `Date` | `-` |
| `[nzLocale]` | 本地化配置 | `object` | `-` |
| `[nzMode]` | 日期面板的模式 | `'date' \| 'week' \| 'month' \| 'year'` | `'date'` |
| `[nzRanges]` | 預設時間範圍快捷鍵 | `{ [key: string]: Date[] }` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnOpenChange)` | 彈出層打開/關閉時觸發 | `EventEmitter<boolean>` |
| `(nzOnPanelChange)` | 日期面板狀態變化時觸發 | `EventEmitter<NzPanelChangeType>` |
| `(ngModelChange)` | 日期值變化時觸發 | `EventEmitter<Date>` |

### nz-range-picker 組件

日期範圍選擇框組件，用於選擇日期範圍。

> **注意**：`nz-range-picker` 繼承了 `nz-date-picker` 的大部分屬性，但 `[(ngModel)]` 的類型為 `[Date, Date]`。

## 相關資源

- [官方文檔](https://ng.ant.design/components/date-picker/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

