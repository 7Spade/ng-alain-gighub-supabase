# Popconfirm - 氣泡確認框

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPopconfirmModule` |
| **官方文檔** | [Popconfirm](https://ng.ant.design/components/popconfirm/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzPopconfirmModule],
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

請參考 [官方文檔](https://ng.ant.design/components/popconfirm/en) 查看詳細用法和示例。

## API

### NzPopconfirm 組件

氣泡確認框組件，點擊元素彈出氣泡式的確認框。

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzCancelText]` | 取消按鈕文字（已棄用，請使用 `nzCancelButtonProps`） | `string` | `'Cancel'` | - |
| `[nzOkText]` | 確定按鈕文字（已棄用，請使用 `nzOkButtonProps`） | `string` | `'Confirm'` | - |
| `[nzOkType]` | 確定按鈕類型（已棄用，請使用 `nzOkButtonProps`） | `'primary' \| 'ghost' \| 'dashed' \| 'danger' \| 'default'` | `'primary'` | - |
| `[nzOkDanger]` | 確定按鈕危險狀態（已棄用，請使用 `nzOkButtonProps`） | `boolean` | `false` | - |
| `[nzOkDisabled]` | 確定按鈕禁用狀態（已棄用，請使用 `nzOkButtonProps`） | `boolean` | `false` | - |
| `[nzOkButtonProps]` | 確定按鈕配置對象 | `NzPopConfirmButtonProps` | `null` | 20.0.0 |
| `[nzCancelButtonProps]` | 取消按鈕配置對象 | `NzPopConfirmButtonProps` | `null` | 20.0.0 |
| `[nzCondition]` | 是否直接觸發 `onConfirm` 而不顯示 Popconfirm | `boolean` | `false` | - |
| `[nzIcon]` | 自定義確認框圖標 | `string \| TemplateRef<void> \| null` | `null` | - |
| `[nzAutoFocus]` | 自動聚焦按鈕 | `null \| 'ok' \| 'cancel'` | `null` | - |
| `[nzBeforeConfirm]` | 確認前的鉤子函數，決定是否繼續響應 `nzOnConfirm` 回調，支持異步驗證 | `(Observable<boolean> \| Promise<boolean> \| boolean) => void` | `null` | - |
| `(nzOnCancel)` | 點擊取消按鈕時觸發 | `EventEmitter<void>` | `-` | - |
| `(nzOnConfirm)` | 點擊確定按鈕時觸發 | `EventEmitter<void>` | `-` | - |

### nz-popconfirm 指令

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzPopconfirmArrowPointAtCenter]` | 箭頭是否指向錨點中心 | `boolean` | `false` |
| `[nzPopconfirmTitle]` | 確認框標題 | `string \| TemplateRef<void>` | `-` |
| `[nzPopconfirmTitleContext]` | 確認框標題的上下文 | `object` | `-` |
| `[nzPopconfirmTrigger]` | 觸發行為 | `'click' \| 'focus' \| 'hover' \| null` | `'click'` |
| `[nzPopconfirmPlacement]` | 氣泡框位置 | `'top' \| 'left' \| 'right' \| 'bottom' \| 'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight' \| 'leftTop' \| 'leftBottom' \| 'rightTop' \| 'rightBottom' \| Array<string>` | `'top'` |
| `[nzPopconfirmOrigin]` | 用於定位氣泡框的元素 | `ElementRef` | `-` |
| `[nzPopconfirmVisible]` | 控制氣泡框的顯示/隱藏 | `boolean` | `false` |
| `[nzPopconfirmShowArrow]` | 是否顯示箭頭 | `boolean` | `true` |
| `[nzPopconfirmMouseEnterDelay]` | 鼠標移入後延遲多少秒顯示 | `number` | `0.15` |
| `[nzPopconfirmMouseLeaveDelay]` | 鼠標移出後延遲多少秒隱藏 | `number` | `0.1` |
| `[nzPopconfirmOverlayClassName]` | 氣泡框的 CSS 類名 | `string` | `-` |
| `[nzPopconfirmOverlayStyle]` | 氣泡框的樣式 | `object` | `-` |
| `[nzPopconfirmBackdrop]` | 是否為覆蓋層附加背景 | `boolean` | `false` |
| `(nzPopconfirmVisibleChange)` | 顯示/隱藏時觸發 | `EventEmitter<boolean>` | `-` |

### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `show()` | 顯示確認框 |
| `hide()` | 隱藏確認框 |
| `updatePosition()` | 更新確認框位置 |

> **注意**：確保 `[nz-popconfirm]` 節點可以接收 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

## 相關資源

- [官方文檔](https://ng.ant.design/components/popconfirm/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

