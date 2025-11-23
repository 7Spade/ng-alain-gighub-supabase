# Select - 選擇器

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSelectModule` |
| **官方文檔** | [Select](https://ng.ant.design/components/select/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSelectModule],
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

請參考 [官方文檔](https://ng.ant.design/components/select/en) 查看詳細用法和示例。

## API

### nz-select 組件

下拉選擇器組件，支持單選、多選、搜索、分組等功能。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzOpen]` | 控制下拉框展開狀態，支持雙向綁定 | `boolean` | `false` |
| `[nzAutoFocus]` | 默認獲取焦點 | `boolean` | `false` |
| `[nzDisabled]` | 禁用選擇器 | `boolean` | `false` |
| `[nzDropdownClassName]` | 下拉菜單的 CSS 類名 | `string \| string[]` | `-` |
| `[nzDropdownMatchSelectWidth]` | 下拉菜單和選擇器同寬 | `boolean` | `true` |
| `[nzDropdownStyle]` | 下拉菜單的樣式 | `object` | `-` |
| `[nzCustomTemplate]` | 自定義下拉菜單模板 | `TemplateRef<{ $implicit: NzOptionComponent }>` | `-` |
| `[nzServerSearch]` | 是否使用服務器搜索，當為 `true` 時，`nz-option` 不會被組件過濾 | `boolean` | `false` |
| `[nzFilterOption]` | 自定義過濾函數 | `(input?: string, option?: NzOptionComponent) => boolean` | `-` |
| `[nzMaxMultipleCount]` | 多選模式下最多可選項數量 | `number` | `Infinity` |
| `[nzClearIcon]` | 自定義清除圖標 | `TemplateRef<any>` | `-` |
| `[nzMenuItemSelectedIcon]` | 自定義菜單項選中圖標 | `TemplateRef<any>` | `-` |
| `[nzTokenSeparators]` | 標籤/多選模式下用於分隔的字符 | `string[]` | `[]` |
| `[nzLoading]` | 顯示加載狀態 | `boolean` | `false` |
| `[nzMaxTagCount]` | 最多顯示標籤數量 | `number` | `-` |
| `[nzOptions]` | 使用 `nz-option` 或 `nzOptions` 傳遞選項 | `Array<{ label: string \| number \| TemplateRef<any>; value: any; key?: string \| number; disabled?: boolean; hide?: boolean; groupLabel?: string \| TemplateRef<any>;}>` | `-` |
| `[nzMaxTagPlaceholder]` | 隱藏標籤時顯示的佔位符 | `TemplateRef<{ $implicit: any[] }>` | `-` |
| `[nzOptionHeightPx]` | 下拉菜單中每個選項的高度 | `number` | `32` |
| `[nzOptionOverflowSize]` | 下拉菜單中最大選項數量，超過時會出現滾動 | `number` | `8` |
| `[nzSelectOnTab]` | 允許使用 TAB 鍵選擇項目 | `boolean` | `false` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(ngModelChange)` | 選中值改變時觸發 | `EventEmitter<any>` |
| `(nzOpenChange)` | 下拉框展開/收起時觸發 | `EventEmitter<boolean>` |
| `(nzScrollToBottom)` | 下拉列表滾動到底部時觸發 | `EventEmitter<void>` |
| `(nzOnSearch)` | 搜索值改變時觸發 | `EventEmitter<string>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/select/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

