# Rate - 評分

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzRateModule` |
| **官方文檔** | [Rate](https://ng.ant.design/components/rate/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzRateModule],
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

請參考 [官方文檔](https://ng.ant.design/components/rate/en) 查看詳細用法和示例。

## API

### nz-rate 組件

評分組件，用於對事物進行評級操作。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzAllowClear]` | 是否允許再次點擊後清除 | `boolean` | `true` |
| `[nzAllowHalf]` | 是否允許半選 | `boolean` | `false` |
| `[nzAutoFocus]` | 自動獲得焦點 | `boolean` | `false` |
| `[nzCharacter]` | 自定義字符 | `TemplateRef<void>` | `<nz-icon nzType="star" />` |
| `[nzCount]` | star 總數 | `number` | `5` |
| `[nzDisabled]` | 只讀，無法進行交互 | `boolean` | `false` |
| `[nzTooltips]` | 自定義每項的提示信息 | `string[]` | `[]` |
| `[ngModel]` | 當前數值，支持雙向綁定 | `number` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(ngModelChange)` | 選擇時的觸發的回調函數 | `EventEmitter<number>` |
| `(nzOnBlur)` | 失去焦點時的觸發的回調函數 | `EventEmitter<FocusEvent>` |
| `(nzOnFocus)` | 獲得焦點時的觸發的回調函數 | `EventEmitter<FocusEvent>` |
| `(nzOnHoverChange)` | 鼠標經過時數值變化時的觸發的回調函數 | `EventEmitter<number>` |
| `(nzOnKeyDown)` | 鍵盤按下時的觸發的回調函數 | `EventEmitter<KeyboardEvent>` |

#### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 |
|------|------|
| `blur()` | 移除焦點 |
| `focus()` | 獲得焦點 |

## 相關資源

- [官方文檔](https://ng.ant.design/components/rate/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

