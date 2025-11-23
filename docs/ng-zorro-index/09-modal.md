# Modal - 對話框

> **組件分類**：反饋類組件 (Feedback)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzModalModule` |
| **官方文檔** | [Modal](https://ng.ant.design/components/modal/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzModalModule],
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

請參考 [官方文檔](https://ng.ant.design/components/modal/en) 查看詳細用法和示例。

## API

### nz-modal 組件

模態對話框組件，用於顯示重要的對話內容。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzVisible]` | 對話框是否可見，使用 `<nz-modal>` 標籤時務必使用雙向綁定，例如：`[(nzVisible)]="visible"` | `boolean` | `false` |
| `[nzTitle]` | 對話框標題 | `string \| TemplateRef<{}>` | `-` |
| `[nzWidth]` | 對話框寬度，使用數字時默認單位為 `px` | `string \| number` | `520` |
| `[nzOkType]` | 確定按鈕類型，與 `nz-button` 的 `nzType` 一致 | `'primary' \| 'dashed' \| 'link' \| 'text'` | `'primary'` |
| `[nzOkDanger]` | 確定按鈕危險狀態，與 `nz-button` 的 `nzDanger` 一致 | `boolean` | `false` |
| `[nzStyle]` | 覆蓋層的樣式，通常用於至少調整位置 | `object` | `-` |
| `[nzCloseIcon]` | 自定義關閉圖標 | `string \| TemplateRef<void>` | `-` |
| `[nzClosable]` | 是否顯示右上角關閉按鈕 | `boolean` | `true` |
| `[nzMaskClosable]` | 點擊遮罩是否可以關閉 | `boolean` | `true` |
| `[nzMask]` | 是否顯示遮罩 | `boolean` | `true` |
| `[nzKeyboard]` | 是否支持按 ESC 關閉 | `boolean` | `true` |
| `[nzZIndex]` | 對話框的 `z-index` | `number` | `1000` |
| `[nzOkText]` | 確定按鈕文字 | `string` | `'確定'` |
| `[nzCancelText]` | 取消按鈕文字 | `string` | `'取消'` |
| `[nzOkLoading]` | 確定按鈕 loading 狀態 | `boolean` | `false` |
| `[nzOkDisabled]` | 確定按鈕禁用狀態 | `boolean` | `false` |
| `[nzCancelDisabled]` | 取消按鈕禁用狀態 | `boolean` | `false` |
| `[nzNoAnimation]` | 禁用動畫 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnCancel)` | 點擊遮罩、關閉按鈕或取消按鈕時觸發 | `EventEmitter<MouseEvent>` |
| `(nzOnOk)` | 點擊確定按鈕時觸發 | `EventEmitter<MouseEvent>` |
| `(afterOpen)` | 打開後觸發 | `Observable<void>` |
| `(afterClose)` | 關閉後觸發 | `Observable<R>` |

### NzModalService 服務

通過服務方式創建模態對話框。

#### 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `create()` | 創建模態對話框 | `NzModalOptions` | `NzModalRef` |
| `open()` | 打開模態對話框（已棄用，使用 `create`） | `NzModalOptions` | `NzModalRef` |
| `closeAll()` | 關閉所有模態對話框 | `-` | `void` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/modal/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

