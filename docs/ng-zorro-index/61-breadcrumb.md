# Breadcrumb - 麵包屑

> **組件分類**：導航類組件 (Navigation)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBreadCrumbModule` |
| **官方文檔** | [Breadcrumb](https://ng.ant.design/components/breadcrumb/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzBreadCrumbModule],
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

請參考 [官方文檔](https://ng.ant.design/components/breadcrumb/en) 查看詳細用法和示例。

## API

### nz-breadcrumb 組件

麵包屑組件，用於顯示當前頁面在系統層級結構中的位置。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSeparator]` | 自定義分隔符 | `string \| TemplateRef<void> \| null` | `'/'` |
| `[nzAutoGenerate]` | 是否根據路由配置自動生成麵包屑 | `boolean` | `false` |
| `[nzRouteLabel]` | 指定路由 `data` 對象中包含麵包屑標籤文本的屬性名，當 `nzAutoGenerate` 為 `true` 時使用 | `string` | `'breadcrumb'` |
| `[nzRouteLabelFn]` | 格式化麵包屑項標籤文本的函數，用於國際化，當 `nzAutoGenerate` 為 `true` 時使用 | `(label: string) => string` | `label => label` |
| `[nzRouteFn]` | 格式化麵包屑項路由的函數，用於綁定當前參數或查詢字符串，當 `nzAutoGenerate` 為 `true` 時使用 | `(route: string) => string` | `route => route` |

### nz-breadcrumb-item 組件

麵包屑中的單個項目。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzOverlay]` | 下拉菜單的內容 | `NzDropdownMenuComponent` | `-` |
| `[nzBreadcrumbIcon]` | 自定義圖標 | `string \| TemplateRef<void>` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/breadcrumb/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

