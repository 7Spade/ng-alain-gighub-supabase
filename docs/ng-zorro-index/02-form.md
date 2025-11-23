# Form - 表單

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFormModule` |
| **官方文檔** | [Form](https://ng.ant.design/components/form/en) |
| **Schematics 命令** | 詳見下方命令列表 |

## Schematics 命令

```bash
# 標準登入表單
ng g ng-zorro-antd:form-normal-login <name>

# 標準註冊表單
ng g ng-zorro-antd:form-normal-register <name>

# 標準表單驗證
ng g ng-zorro-antd:form-normal-validation <name>

# 高級搜索表單
ng g ng-zorro-antd:form-advanced-search <name>

# 動態表單
ng g ng-zorro-antd:form-dynamic-form <name>

# 動態表單項目
ng g ng-zorro-antd:form-dynamic-form-item <name>

# 動態表單規則
ng g ng-zorro-antd:form-dynamic-form-rule <name>
```

## 使用方式

### 導入模組

```typescript
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzFormModule],
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

```html
<form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
  <nz-form-item>
    <nz-form-label [nzSpan]="6" nzRequired>用戶名</nz-form-label>
    <nz-form-control [nzSpan]="14" nzErrorTip="請輸入用戶名">
      <input nz-input formControlName="userName" placeholder="用戶名" />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-control [nzOffset]="6" [nzSpan]="14">
      <button nz-button nzType="primary" [disabled]="!validateForm.valid">提交</button>
    </nz-form-control>
  </nz-form-item>
</form>
```

## API

### nz-form 組件

表單容器組件，支持 Angular Reactive Forms 和 Template-driven Forms。

### nz-form-item 組件

表單項容器，用於包裹表單標籤和表單控件。

### nz-form-label 組件

表單項標籤，可選。所有 `nz-col` 的 API 都可以在 `nz-form-label` 中使用。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzRequired]` | 為當前項添加必填樣式 | `boolean` | `false` |
| `[nzNoColon]` | 是否不顯示標籤文本後的 `:` | `boolean` | `false` |
| `[nzFor]` | `label` 的 `for` 屬性 | `string` | `-` |
| `[nzTooltipTitle]` | 設置提示信息 | `string \| TemplateRef<void>` | `-` |
| `[nzTooltipIcon]` | 設置提示信息的圖標 | `string \| NzFormTooltipIcon` | `-` |
| `[nzLabelAlign]` | 標籤文本對齊方式 | `'left' \| 'right'` | `'right'` |
| `[nzLabelWrap]` | 標籤是否可以換行 | `boolean` | `false` |

### nz-form-control 組件

表單控件容器，用於結構化和驗證表單元素。

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzValidateStatus]` | 根據輸入的 `FormControl`、`NgModel` 或字符串值生成狀態。默認為 `nz-form-control` 內找到的第一個 `FormControl` 或 `NgModel` | `string \| FormControl \| NgModel` | 第一個 `FormControl` 或 `NgModel` |
| `[nzHasFeedback]` | 與 `nzValidateStatus` 一起使用以顯示驗證狀態圖標。建議僅與 `Input` 元素一起使用 | `boolean` | `false` |
| `[nzExtra]` | 為表單控件提供額外的提示消息 | `string \| TemplateRef<void>` | `-` |
| `[nzSuccessTip]` | 驗證成功時顯示的自定義提示消息 | `string \| TemplateRef<{ $implicit: FormControl \| NgModel }>` | `-` |
| `[nzWarningTip]` | 驗證結果為警告時顯示的自定義提示消息 | `string \| TemplateRef<{ $implicit: FormControl \| NgModel }>` | `-` |
| `[nzErrorTip]` | 驗證結果為錯誤時顯示的自定義提示消息 | `string \| TemplateRef<{ $implicit: FormControl \| NgModel }>` | `-` |
| `[nzValidatingTip]` | 表單控件正在驗證時顯示的自定義提示消息 | `string \| TemplateRef<{ $implicit: FormControl \| NgModel }>` | `-` |
| `[nzAutoTips]` | 配置自動提示消息的對象 | `Record<string, string \| Record<string, string>>` | `-` |
| `[nzDisableAutoTips]` | 禁用自動提示消息的顯示 | `boolean` | `false` |

> **注意**：由於 Angular Forms 在部分 Observable 支持方面的限制，在更新表單控件的狀態（例如使用 `markAsDirty`）時，必須手動調用 `updateValueAndValidity` 以確保 `nz-form-control` 反映這些更改。

### 相關組件

- **`nz-form-split`**：顯示分隔符圖標（'-'）
- **`nz-form-text`**：用於在 `nz-form-control` 內顯示純文本

## 相關資源

- [官方文檔](https://ng.ant.design/components/form/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

