# Statistic - 統計數值

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzStatisticModule` |
| **官方文檔** | [Statistic](https://ng.ant.design/components/statistic/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzStatisticModule],
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

請參考 [官方文檔](https://ng.ant.design/components/statistic/en) 查看詳細用法和示例。

## API

### nz-statistic 組件

統計數值組件，用於展示統計數字。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzPrefix]` | 設置數值的前綴 | `string \| TemplateRef<void>` | `-` |
| `[nzSuffix]` | 設置數值的後綴 | `string \| TemplateRef<void>` | `-` |
| `[nzTitle]` | 設置數值的標題 | `string \| TemplateRef<void>` | `-` |
| `[nzValue]` | 數值內容 | `string \| number` | `-` |
| `[nzValueStyle]` | 設置數值的樣式 | `Object` | `-` |
| `[nzValueTemplate]` | 自定義數值的渲染模板 | `TemplateRef<{ $implicit: string \| number }>` | `-` |
| `[nzLoading]` | 數值的加載狀態 | `boolean` | `false` |

### nz-countdown 組件

倒計時組件，用於顯示倒計時。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzFormat]` | 格式化倒計時顯示 | `string` | `'HH:mm:ss'` |
| `[nzPrefix]` | 設置數值的前綴 | `string \| TemplateRef<void>` | `-` |
| `[nzSuffix]` | 設置數值的後綴 | `string \| TemplateRef<void>` | `-` |
| `[nzTitle]` | 設置數值的標題 | `string \| TemplateRef<void>` | `-` |
| `[nzValue]` | 目標時間（時間戳格式） | `string \| number` | `-` |
| `[nzValueTemplate]` | 自定義顯示剩餘時間的模板 | `TemplateRef<{ $implicit: number }>` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzCountdownFinish)` | 倒計時結束時觸發 | `EventEmitter<void>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/statistic/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

