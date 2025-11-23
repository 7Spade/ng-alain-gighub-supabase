# Steps - 步驟條

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzStepsModule` |
| **官方文檔** | [Steps](https://ng.ant.design/components/steps/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzStepsModule],
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

請參考 [官方文檔](https://ng.ant.design/components/steps/en) 查看詳細用法和示例。

## API

### nz-steps 組件

步驟條組件，用於引導用戶按照流程完成任務。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzType]` | 步驟條類型，可以設置為 `default` 或 `navigation` | `'default' \| 'navigation'` | `'default'` |
| `[nzCurrent]` | 指定當前步驟，從 0 開始記數。在子 `nz-step` 元素中，可以通過 `nzStatus` 屬性覆蓋狀態 | `number` | `0` |
| `[nzDirection]` | 指定步驟條方向，目前支持水平（`horizontal`）和豎直（`vertical`）兩種方向 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| `[nzLabelPlacement]` | 支持垂直標題和描述 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| `[nzProgressDot]` | 點狀步驟條，可以設置為一個 `TemplateRef` | `boolean \| TemplateRef<{ $implicit: TemplateRef<void>, status: string, index: number }>` | `false` |
| `[nzSize]` | 指定步驟條的大小，目前支持普通（`default`）和迷你（`small`） | `'small' \| 'default'` | `'default'` |
| `[nzStatus]` | 指定當前步驟的狀態，可選：`wait` `process` `finish` `error` | `'wait' \| 'process' \| 'finish' \| 'error'` | `'process'` |
| `[nzStartIndex]` | 起始序號，從 0 開始記數 | `number` | `0` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzIndexChange)` | 點擊步驟時觸發 | `EventEmitter<number>` |

### nz-step 組件

步驟條中的單個步驟。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDescription]` | 步驟的詳細描述，可選 | `string \| TemplateRef<void>` | `-` |
| `[nzIcon]` | 步驟圖標，可以是字符串、字符串數組、字符串集合、CSS 類對象或 `TemplateRef` | `string \| string[] \| Set<string> \| { [klass: string]: any; } \| TemplateRef<void>` | `-` |
| `[nzStatus]` | 指定狀態。當不配置該屬性時，會使用 `nz-steps` 的 `nzCurrent` 來自動指定狀態。可選：`wait` `process` `finish` `error` | `'wait' \| 'process' \| 'finish' \| 'error'` | `'wait'` |
| `[nzTitle]` | 步驟的標題 | `string \| TemplateRef<void>` | `-` |
| `[nzSubtitle]` | 步驟的子標題 | `string \| TemplateRef<void>` | `-` |
| `[nzDisabled]` | 禁用點擊 | `boolean` | `false` |
| `[nzPercentage]` | 當前步驟的進度百分比，當其狀態為 `process` 時有效。僅對基本步驟類型有效 | `number` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/steps/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

