# SHARED_IMPORTS 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [什麼是 SHARED_IMPORTS](#什麼是-shared_imports)
  - [核心原則](#核心原則)
- [為什麼使用 SHARED_IMPORTS](#為什麼使用-shared_imports)
  - [優點](#優點)
  - [禁止事項](#禁止事項)
- [SHARED_IMPORTS 包含的內容](#shared_imports-包含的內容)
  - [1. Angular 表單模組](#1-angular-表單模組)
  - [2. Angular 路由](#2-angular-路由)
  - [3. Angular Common 標準管道](#3-angular-common-標準管道)
  - [4. @delon/theme 管道](#4-delontheme-管道)
  - [5. @delon 組件/指令集合](#5-delon-組件指令集合)
  - [6. ng-zorro-antd 組件集合](#6-ng-zorro-antd-組件集合)
- [使用方法](#使用方法)
  - [基本用法](#基本用法)
  - [與其他導入組合使用](#與其他導入組合使用)
  - [使用現代控制流程](#使用現代控制流程)
- [最佳實踐](#最佳實踐)
  - [1. 優先使用 SHARED_IMPORTS](#1-優先使用-shared_imports)
  - [2. 僅在必要時添加額外導入](#2-僅在必要時添加額外導入)
  - [3. 避免重複導入](#3-避免重複導入)
  - [4. 使用 ChangeDetectionStrategy.OnPush](#4-使用-changedetectionstrategyonpush)
- [常見使用場景](#常見使用場景)
  - [場景 1：表單組件](#場景-1表單組件)
  - [場景 2：列表組件](#場景-2列表組件)
  - [場景 3：路由組件](#場景-3路由組件)
  - [場景 4：使用管道](#場景-4使用管道)
- [何時需要額外導入](#何時需要額外導入)
  - [情況 1：使用 SHARED_IMPORTS 中沒有的組件](#情況-1使用-shared_imports-中沒有的組件)
  - [情況 2：使用第三方庫組件](#情況-2使用第三方庫組件)
  - [情況 3：使用自訂指令或管道](#情況-3使用自訂指令或管道)
  - [情況 4：使用共享組件](#情況-4使用共享組件)
- [常見錯誤和解決方案](#常見錯誤和解決方案)
  - [錯誤 1：忘記導入 SHARED_IMPORTS](#錯誤-1忘記導入-shared_imports)
  - [錯誤 2：重複導入已在 SHARED_IMPORTS 中的模組](#錯誤-2重複導入已在-shared_imports-中的模組)
  - [錯誤 3：使用未導入的管道](#錯誤-3使用未導入的管道)
  - [錯誤 4：在非 Standalone 組件中使用](#錯誤-4在非-standalone-組件中使用)
- [檢查清單](#檢查清單)
  - [創建組件時](#創建組件時)
  - [提交代碼前](#提交代碼前)
- [🔍 如何檢查 SHARED_IMPORTS 的內容](#-如何檢查-shared_imports-的內容)
  - [方法 1：查看源文件](#方法-1查看源文件)
  - [方法 2：使用 IDE 自動完成](#方法-2使用-ide-自動完成)
  - [方法 3：查看文檔](#方法-3查看文檔)
- [📝 更新 SHARED_IMPORTS](#-更新-shared_imports)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [Angular 官方文檔](#angular-官方文檔)
  - [ng-zorro-antd 文檔](#ng-zorro-antd-文檔)
  - [ng-alain 文檔](#ng-alain-文檔)

---


> 📋 **目的**：詳細說明 `SHARED_IMPORTS` 的使用方法、最佳實踐和常見問題

**最後更新**：2025-11-15
**維護者**：開發團隊
**適用範圍**：所有 UI 層組件（`routes/` 和 `shared/` 目錄下的組件）

- --

## 📋 目錄

- [什麼是 SHARED_IMPORTS](#什麼是-shared_imports)
- [為什麼使用 SHARED_IMPORTS](#為什麼使用-shared_imports)
- [SHARED_IMPORTS 包含的內容](#shared_imports-包含的內容)
- [使用方法](#使用方法)
- [最佳實踐](#最佳實踐)
- [常見使用場景](#常見使用場景)
- [何時需要額外導入](#何時需要額外導入)
- [常見錯誤和解決方案](#常見錯誤和解決方案)
- [檢查清單](#檢查清單)

- --

## 什麼是 SHARED_IMPORTS

`SHARED_IMPORTS` 是專案中統一導入配置的常數，定義在 `src/app/shared/shared-imports.ts`。

它是一個**陣列**，包含所有常用的 Angular、ng-zorro-antd 和 @delon 模組、組件、指令和管道。

### 核心原則

> ⚠️ **強制要求**：所有 UI 層組件**必須**優先使用 `SHARED_IMPORTS`，避免零碎引入模組。

- --

## 為什麼使用 SHARED_IMPORTS

### 優點

1. **一致性**：確保所有組件使用相同的模組配置
2. **可維護性**：統一管理導入，易於更新和維護
3. **減少錯誤**：避免遺漏必要的模組導入
4. **代碼簡潔**：一行導入替代多行導入
5. **性能優化**：Tree-shaking 優化，只打包使用的模組

### 禁止事項

❌ **禁止零碎引入**：
```typescript
// ❌ 錯誤做法
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
```

✅ **正確做法**：
```typescript
// ✅ 正確做法
import { SHARED_IMPORTS } from '@shared/shared-imports';
```

- --

## SHARED_IMPORTS 包含的內容

### 1. Angular 表單模組

- `FormsModule` - 模板式表單
- `ReactiveFormsModule` - 響應式表單

### 2. Angular 路由

- `RouterLink` - 路由連結指令
- `RouterOutlet` - 路由插座
- `NgTemplateOutlet` - 動態嵌入模板

### 3. Angular Common 標準管道

- `DatePipe` - 日期格式化（`{{ value | date }}`）
- `CurrencyPipe` - 貨幣格式化（`{{ value | currency }}`）
- `DecimalPipe` - 數字格式化（`{{ value | number }}`）
- `PercentPipe` - 百分比格式化（`{{ value | percent }}`）
- `LowerCasePipe` - 轉小寫（`{{ value | lowercase }}`）
- `UpperCasePipe` - 轉大寫（`{{ value | uppercase }}`）
- `TitleCasePipe` - 標題大小寫（`{{ value | titlecase }}`）
- `SlicePipe` - 陣列/字串切片（`{{ value | slice:start:end }}`）
- `KeyValuePipe` - 鍵值對遍歷（`@for (item of obj | keyvalue)`）
- `JsonPipe` - 物件轉 JSON 字串（`{{ value | json }}`）
- `AsyncPipe` - 觀察值/Promise 非同步解包（`{{ value$ | async }}`）
- `I18nPluralPipe` - 複數形式映射
- `I18nSelectPipe` - 鍵值映射選擇
- `NgClass` - 動態樣式

### 4. @delon/theme 管道

- `I18nPipe` - 國際化翻譯管道（`{{ key | i18n }}`）
- `DelonDatePipe` - @delon/theme 日期管道（`{{ value | _date }}`）

### 5. @delon 組件/指令集合

包含所有 `SHARED_DELON_MODULES`，例如：
- `STModule` - 智能表格
- `SVModule` - 鍵值描述視圖
- `SEModule` - 表單佈局
- `DelonFormModule` - 動態表單
- `PageHeaderModule` - 頁面標題/操作
- `ReuseTabModule` - 標籤頁（路由快取）
- `G2BarModule`, `G2PieModule`, `ChartEChartsModule` 等圖表組件
- 更多...（參考 `src/app/shared/shared-delon.module.ts`）

### 6. ng-zorro-antd 組件集合

包含所有 `SHARED_ZORRO_MODULES`，例如：
- **反饋類**：`NzAlertModule`, `NzModalModule`, `NzDrawerModule`, `NzSpinModule` 等
- **數據展示類**：`NzTableModule`, `NzCardModule`, `NzListModule`, `NzTagModule` 等
- **數據錄入類**：`NzFormModule`, `NzInputModule`, `NzSelectModule`, `NzDatePickerModule` 等
- **佈局類**：`NzLayoutModule`, `NzGridModule`, `NzFlexModule` 等
- **導航類**：`NzMenuModule`, `NzTabsModule`, `NzBreadCrumbModule` 等
- 更多...（參考 `src/app/shared/shared-zorro.module.ts`）

- --

## 使用方法

### 基本用法

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [SHARED_IMPORTS], // ✅ 一次導入所有常用模組
  template: `
    <nz-card>
      <nz-form>
        <input nz-input [(ngModel)]="value" />
        <button nz-button nzType="primary">提交</button>
      </nz-form>
    </nz-card>
  `
})
export class ExampleComponent {
  value = '';
}
```

### 與其他導入組合使用

```typescript
import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { CustomComponent } from './custom.component';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [
    SHARED_IMPORTS, // ✅ 優先使用
    CustomComponent // ✅ 額外的自訂組件
  ],
  template: `
    <app-custom></app-custom>
    <nz-button>按鈕</nz-button>
  `
})
export class ExampleComponent {}
```

### 使用現代控制流程

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [SHARED_IMPORTS],
  template: `
    @if (isVisible()) {
      <nz-card>
        <h3>可見內容</h3>
      </nz-card>
    }

    @for (item of items(); track item.id) {
      <nz-tag>{{ item.name }}</nz-tag>
    }

    @switch (status()) {
      @case ('active') {
        <nz-badge [nzStatus]="'success'">活躍</nz-badge>
      }
      @case ('inactive') {
        <nz-badge [nzStatus]="'default'">非活躍</nz-badge>
      }
    }
  `
})
export class ExampleComponent {
  isVisible = signal(true);
  items = signal([{ id: 1, name: '項目 1' }]);
  status = signal<'active' | 'inactive'>('active');
}
```

- --

## 最佳實踐

### 1. 優先使用 SHARED_IMPORTS

```typescript
// ✅ 正確：優先使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS]
})
export class MyComponent {}
```

### 2. 僅在必要時添加額外導入

```typescript
// ✅ 正確：SHARED_IMPORTS 無法滿足需求時才添加
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { CustomDirective } from './custom.directive'; // 僅在需要時

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, CustomDirective]
})
export class MyComponent {}
```

### 3. 避免重複導入

```typescript
// ❌ 錯誤：不要重複導入已在 SHARED_IMPORTS 中的模組
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { NzButtonModule } from 'ng-zorro-antd/button'; // ❌ 已在 SHARED_IMPORTS 中

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, NzButtonModule] // ❌ 重複導入
})
export class MyComponent {}
```

### 4. 使用 ChangeDetectionStrategy.OnPush

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ 推薦使用
})
export class MyComponent {}
```

- --

## 常見使用場景

### 場景 1：表單組件

```typescript
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-form',
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6">名稱</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input formControlName="name" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzOffset]="6" [nzSpan]="18">
          <button nz-button nzType="primary" [disabled]="!form.valid">
            提交
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class FormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

### 場景 2：列表組件

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

interface Item {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

@Component({
  standalone: true,
  selector: 'app-list',
  imports: [SHARED_IMPORTS],
  template: `
    <nz-table [nzData]="items()">
      <thead>
        <tr>
          <th>ID</th>
          <th>名稱</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items(); track item.id) {
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <nz-tag [nzColor]="item.status === 'active' ? 'green' : 'default'">
                {{ item.status }}
              </nz-tag>
            </td>
            <td>
              <button nz-button nzType="link" (click)="edit(item)">
                編輯
              </button>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class ListComponent {
  items = signal<Item[]>([
    { id: 1, name: '項目 1', status: 'active' },
    { id: 2, name: '項目 2', status: 'inactive' }
  ]);

  edit(item: Item) {
    console.log('編輯', item);
  }
}
```

### 場景 3：路由組件

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [SHARED_IMPORTS],
  template: `
    <nz-layout>
      <nz-header>
        <ul nz-menu nzMode="horizontal">
          <li nz-menu-item>
            <a routerLink="/dashboard">儀表板</a>
          </li>
          <li nz-menu-item>
            <a routerLink="/blueprints">藍圖</a>
          </li>
        </ul>
      </nz-header>
      <nz-content>
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>
  `
})
export class LayoutComponent {}
```

### 場景 4：使用管道

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-pipes',
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>管道示例</h3>
      <p>日期：{{ date() | date:'yyyy-MM-dd' }}</p>
      <p>貨幣：{{ price() | currency:'TWD':'symbol':'1.0-0' }}</p>
      <p>百分比：{{ percentage() | percent:'1.0-2' }}</p>
      <p>國際化：{{ 'common.save' | i18n }}</p>
      <p>JSON：{{ data() | json }}</p>
    </nz-card>
  `
})
export class PipesComponent {
  date = signal(new Date());
  price = signal(1234.56);
  percentage = signal(0.85);
  data = signal({ name: '測試', value: 100 });
}
```

- --

## 何時需要額外導入

### 情況 1：使用 SHARED_IMPORTS 中沒有的組件

```typescript
// ✅ 正確：添加 SHARED_IMPORTS 中沒有的組件
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { CustomChartComponent } from './custom-chart.component';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, CustomChartComponent]
})
export class ChartComponent {}
```

### 情況 2：使用第三方庫組件

```typescript
// ✅ 正確：添加第三方庫組件
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { MonacoEditorComponent } from 'ngx-monaco-editor';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, MonacoEditorComponent]
})
export class EditorComponent {}
```

### 情況 3：使用自訂指令或管道

```typescript
// ✅ 正確：添加自訂指令或管道
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { HighlightDirective } from './highlight.directive';
import { FormatPhonePipe } from './format-phone.pipe';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, HighlightDirective, FormatPhonePipe]
})
export class ExampleComponent {}
```

### 情況 4：使用共享組件

```typescript
// ✅ 正確：添加共享組件
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { ErrorBannerComponent } from '@shared/components/error-display';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, ErrorBannerComponent]
})
export class ExampleComponent {}
```

- --

## 常見錯誤和解決方案

### 錯誤 1：忘記導入 SHARED_IMPORTS

**錯誤訊息**：
```text
Error: NG0304: Can't bind to 'nzButton' since it isn't a known property of 'button'.
```

**解決方案**：
```typescript
// ❌ 錯誤
@Component({
  standalone: true,
  imports: [] // 缺少 SHARED_IMPORTS
})

// ✅ 正確
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS]
})
```

### 錯誤 2：重複導入已在 SHARED_IMPORTS 中的模組

**問題**：雖然不會報錯，但會增加代碼複雜度

**解決方案**：
```typescript
// ❌ 錯誤：重複導入
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS, NzButtonModule] // 重複
})

// ✅ 正確：移除重複導入
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS] // 已包含 NzButtonModule
})
```

### 錯誤 3：使用未導入的管道

**錯誤訊息**：
```text
Error: NG0304: The pipe 'i18n' could not be found.
```

**解決方案**：
```typescript
// ❌ 錯誤：未導入 SHARED_IMPORTS
@Component({
  standalone: true,
  imports: [CommonModule], // 缺少 I18nPipe
  template: `{{ 'key' | i18n }}`
})

// ✅ 正確：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含 I18nPipe
  template: `{{ 'key' | i18n }}`
})
```

### 錯誤 4：在非 Standalone 組件中使用

**問題**：`SHARED_IMPORTS` 只能在 Standalone Components 中使用

**解決方案**：
```typescript
// ❌ 錯誤：非 Standalone 組件
@Component({
  selector: 'app-example',
  // 缺少 standalone: true
})

// ✅ 正確：使用 Standalone Components
@Component({
  standalone: true, // ✅ 必須設置
  selector: 'app-example',
  imports: [SHARED_IMPORTS]
})
```

- --

## 檢查清單

### 創建組件時

- [ ] 使用 `standalone: true`
- [ ] 導入 `SHARED_IMPORTS`
- [ ] 僅在必要時添加額外導入
- [ ] 避免重複導入已在 `SHARED_IMPORTS` 中的模組
- [ ] 使用 `ChangeDetectionStrategy.OnPush`

### 提交代碼前

- [ ] 檢查是否使用了 `SHARED_IMPORTS`
- [ ] 移除未使用的導入
- [ ] 確認沒有重複導入
- [ ] 執行 `yarn lint` 檢查
- [ ] 執行 `yarn type-check` 檢查

- --

## 🔍 如何檢查 SHARED_IMPORTS 的內容

### 方法 1：查看源文件

```bash
# 查看 SHARED_IMPORTS 定義
cat src/app/shared/shared-imports.ts

# 查看包含的 DELON 模組
cat src/app/shared/shared-delon.module.ts

# 查看包含的 ZORRO 模組
cat src/app/shared/shared-zorro.module.ts
```

### 方法 2：使用 IDE 自動完成

在 TypeScript 文件中輸入 `SHARED_IMPORTS`，IDE 會顯示其定義和包含的內容。

### 方法 3：查看文檔

參考本文檔的「SHARED_IMPORTS 包含的內容」章節。

- --

## 📝 更新 SHARED_IMPORTS

如果需要添加新的模組到 `SHARED_IMPORTS`：

1. **評估必要性**：確認該模組是否被多個組件使用
2. **更新源文件**：編輯 `src/app/shared/shared-imports.ts`
3. **更新文檔**：更新本文檔的「SHARED_IMPORTS 包含的內容」章節
4. **通知團隊**：在團隊會議或文檔中通知變更

- --

## 🔗 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md) - 開發規範
- [專案結構說明](./architecture/02-project-structure-flowchart.mermaid.md) - 專案結構
- [重構後結構樹](./04-重構後結構樹.md) - 結構樹說明
- [元件模組視圖](./19-元件模組視圖.mermaid.md) - 元件架構
- [重構遷移指南](./46-重構遷移指南.md) - 遷移指南
- [常見錯誤預防指南](./50-常見錯誤預防指南.md) - 錯誤預防

- --

## 📚 參考資源

### Angular 官方文檔

- [Standalone Components](https://angular.dev/guide/components/importing)
- [Forms](https://angular.dev/guide/forms)
- [Routing](https://angular.dev/guide/routing)
- [Pipes](https://angular.dev/guide/pipes)

### ng-zorro-antd 文檔

- [組件總覽](https://ng.ant.design/components/overview/zh)
- [快速開始](https://ng.ant.design/docs/getting-started/zh)

### ng-alain 文檔

- [組件總覽](https://ng-alain.com/components)
- [主題](https://ng-alain.com/theme)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊
**下次審查**：2025-12-13

