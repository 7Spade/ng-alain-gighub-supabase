# TimePicker - 時間選擇框

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTimePickerModule` |
| **官方文檔** | [TimePicker](https://ng.ant.design/components/time-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTimePickerModule],
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

請參考 [官方文檔](https://ng.ant.design/components/time-picker/en) 查看詳細用法和示例。

## API

### nz-time-picker 組件

時間選擇框組件，用於選擇或輸入時間。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzId]` | 輸入框的 ID | `string` | `-` |
| `[ngModel]` | 設置時間 | `Date` | `-` |
| `[nzAddOn]` | 選擇框底部顯示的內容 | `TemplateRef<void>` | `-` |
| `[nzAllowEmpty]` | 是否允許清除文本框 | `boolean` | `true` |
| `[nzAutoFocus]` | 自動獲得焦點 | `boolean` | `false` |
| `[nzBackdrop]` | 是否為覆蓋層附加背景 | `boolean` | `false` |
| `[nzClearText]` | 清除圖標的提示 | `string` | `'clear'` |
| `[nzNowText]` | 此刻按鈕文本 | `string` | `'Now'` |
| `[nzOkText]` | 確認按鈕文本 | `string` | `'Ok'` |
| `[nzDefaultOpenValue]` | 當 `[ngModel]` 為 `null` 時，打開面板的默認值 | `Date` | `new Date()` |
| `[nzDisabled]` | 禁用全部操作 | `boolean` | `false` |
| `[nzDisabledHours]` | 禁止選擇部分小時選項 | `() => number[]` | `-` |
| `[nzDisabledMinutes]` | 禁止選擇部分分鐘選項 | `(hour: number) => number[]` | `-` |
| `[nzDisabledSeconds]` | 禁止選擇部分秒選項 | `(hour: number, minute: number) => number[]` | `-` |
| `[nzFormat]` | 展示的時間格式 | `DatePipe` | `'HH:mm:ss'` |
| `[nzHideDisabledOptions]` | 隱藏禁止選擇的選項 | `boolean` | `false` |
| `[nzHourStep]` | 小時選項間隔 | `number` | `1` |
| `[nzMinuteStep]` | 分鐘選項間隔 | `number` | `1` |
| `[nzSecondStep]` | 秒選項間隔 | `number` | `1` |
| `[nzSize]` | 輸入框大小 | `'large' \| 'small' \| 'default'` | `'default'` |
| `[nzStatus]` | 設置校驗狀態 | `'error' \| 'warning'` | `-` |
| `[nzPlaceHolder]` | 輸入框佔位符 | `string` | `-` |
| `[nzPopupClassName]` | 彈出層的類名 | `string` | `-` |
| `[nzUse12Hours]` | 使用 12 小時制，為 `true` 時 `format` 默認為 `h:mm:ss a` | `boolean` | `false` |
| `[nzSuffixIcon]` | 自定義的後綴圖標 | `string \| TemplateRef<void>` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(ngModelChange)` | 時間發生變化的回調 | `EventEmitter<Date>` |
| `(nzOpenChange)` | 面板打開/關閉時的回調 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/time-picker/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

