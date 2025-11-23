# Calendar - 日曆

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCalendarModule` |
| **官方文檔** | [Calendar](https://ng.ant.design/components/calendar/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCalendarModule],
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

請參考 [官方文檔](https://ng.ant.design/components/calendar/en) 查看詳細用法和示例。

## API

### nz-calendar 組件

日曆組件，用於顯示和選擇日期。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDateCell]` | 自定義日期單元格的渲染，追加內容 | `TemplateRef<Date>` | `-` |
| `[nzDateFullCell]` | 自定義日期單元格的渲染，覆蓋內容 | `TemplateRef<Date>` | `-` |
| `[nzMonthCell]` | 自定義月份單元格的渲染，追加內容 | `TemplateRef<Date>` | `-` |
| `[nzMonthFullCell]` | 自定義月份單元格的渲染，覆蓋內容 | `TemplateRef<Date>` | `-` |
| `[nzCustomHeader]` | 自定義頭部內容 | `string \| TemplateRef<void>` | `-` |
| `[nzDisabledDate]` | 不可選擇的日期 | `(current: Date) => boolean` | `-` |
| `[nzFullscreen]` | 是否全屏顯示 | `boolean` | `true` |
| `[(ngModel)]` | 當前顯示的日期，雙向綁定 | `Date` | 當前日期 |
| `[(nzMode)]` | 顯示模式，雙向綁定 | `'month' \| 'year'` | `'month'` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzPanelChange)` | 面板狀態變化時觸發 | `EventEmitter<{ date: Date, mode: 'month' \| 'year' }>` |
| `(nzSelectChange)` | 選擇日期時觸發 | `EventEmitter<Date>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/calendar/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

