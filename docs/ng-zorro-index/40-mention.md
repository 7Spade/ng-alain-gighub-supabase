# Mention - 提及

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzMentionModule` |
| **官方文檔** | [Mention](https://ng.ant.design/components/mention/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzMentionModule],
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

請參考 [官方文檔](https://ng.ant.design/components/mention/en) 查看詳細用法和示例。

## API

### nz-mention 組件

提及組件，用於在輸入框中提及他人或特定項目。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 版本 |
|------|------|------|--------|------|
| `[nzMentionTrigger]` | 觸發提及功能的 DOM 元素 | `HTMLTextAreaElement \| HTMLInputElement` | `-` | - |
| `[nzMentionSuggestion]` | 自定義建議下拉框模板 | `TemplateRef<any>` | `-` | - |
| `[nzLoading]` | 建議的加載狀態 | `boolean` | `false` | - |
| `[nzNotFoundContent]` | 未找到匹配結果時顯示的內容 | `string` | `'无匹配结果，轻敲空格完成输入'` | - |
| `[nzPlacement]` | 建議下拉框相對於觸發元素的位置 | `'bottom' \| 'top'` | `'bottom'` | - |
| `[nzPrefix]` | 觸發提及列表的字符 | `string \| string[]` | `'@'` | - |
| `[nzSuggestions]` | 建議下拉框中顯示的數據項數組 | `any[]` | `[]` | - |
| `[nzStatus]` | 設置輸入元素的校驗狀態 | `'error' \| 'warning'` | `-` | - |
| `[nzAllowClear]` | 如果為 true，顯示清除圖標以移除提及內容 | `boolean` | `false` | 20.3.0 |
| `[nzClearIcon]` | 清除圖標的自定義模板 | `TemplateRef<void>` | `-` | 20.3.0 |
| `[nzVariant]` | 指定輸入的視覺變體 | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` | 20.3.0 |
| `[nzValueWith]` | 用於映射建議值以進行顯示或處理的函數 | `(any) => string \| (value: string) => string` | `-` | - |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzOnSelect)` | 從建議中選擇項目時觸發 | `EventEmitter<any>` |
| `(nzOnSearchChange)` | 輸入中的搜索查詢改變時觸發 | `EventEmitter<MentionOnSearchTypes>` |
| `(nzOnClear)` | 點擊清除按鈕時觸發 | `EventEmitter<void>` |

#### 方法

通過 `ViewChild` 獲取組件實例後可調用以下方法：

| 方法 | 說明 | 返回值 |
|------|------|--------|
| `getMentions()` | 從 `input[nzMentionTrigger]` 元素獲取提及數組 | `any[]` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/mention/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

