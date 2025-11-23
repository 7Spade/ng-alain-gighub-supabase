# @delon/form 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [導入方式](#導入方式)
    - [方式 1：導入 DelonFormModule（已棄用，推薦使用 Standalone）](#方式-1導入-delonformmodule已棄用推薦使用-standalone)
    - [方式 2：使用 SHARED_IMPORTS（推薦）](#方式-2使用-shared_imports推薦)
- [配置](#配置)
- [主要功能](#主要功能)
  - [SFComponent - 表單組件](#sfcomponent---表單組件)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [主要方法](#主要方法)
  - [SFSchema - 表單 Schema](#sfschema---表單-schema)
    - [基本結構](#基本結構)
    - [使用示例](#使用示例)
  - [表單控件類型](#表單控件類型)
    - [字符串類型](#字符串類型)
    - [數字類型](#數字類型)
    - [布爾類型](#布爾類型)
    - [數組類型](#數組類型)
    - [對象類型](#對象類型)
  - [表單驗證](#表單驗證)
    - [基本驗證](#基本驗證)
    - [自定義驗證](#自定義驗證)
  - [表單佈局](#表單佈局)
    - [基本佈局](#基本佈局)
    - [響應式佈局](#響應式佈局)
- [實際使用示例](#實際使用示例)
  - [示例 1：基本表單](#示例-1基本表單)
  - [示例 2：編輯表單](#示例-2編輯表單)
  - [示例 3：搜索表單](#示例-3搜索表單)
  - [示例 4：複雜表單](#示例-4複雜表單)
- [自定義控件](#自定義控件)
  - [創建自定義控件](#創建自定義控件)
  - [註冊自定義控件](#註冊自定義控件)
  - [使用自定義控件](#使用自定義控件)
- [最佳實踐](#最佳實踐)
  - [1. 使用 SHARED_IMPORTS](#1-使用-shared_imports)
  - [2. 使用 Signals 管理 Schema](#2-使用-signals-管理-schema)
  - [3. 表單驗證](#3-表單驗證)
  - [4. 表單佈局](#4-表單佈局)
  - [5. 表單事件處理](#5-表單事件處理)
- [常見問題](#常見問題)
  - [Q1: 如何動態更新 Schema？](#q1-如何動態更新-schema)
  - [Q2: 如何獲取表單值？](#q2-如何獲取表單值)
  - [Q3: 如何設置表單值？](#q3-如何設置表單值)
  - [Q4: 如何重置表單？](#q4-如何重置表單)
  - [Q5: 如何提交表單？](#q5-如何提交表單)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/form` 動態表單的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/form ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [SFComponent - 表單組件](#sfcomponent---表單組件)
  - [SFSchema - 表單 Schema](#sfschema---表單-schema)
  - [表單控件類型](#表單控件類型)
  - [表單驗證](#表單驗證)
  - [表單佈局](#表單佈局)
- [實際使用示例](#實際使用示例)
- [自定義控件](#自定義控件)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/form` 是 ng-alain 框架提供的動態表單功能，基於 JSON Schema 的表單生成與驗證。可以通過配置 JSON Schema 快速生成表單，無需手動編寫表單 HTML。

### 核心特點

- **JSON Schema 驅動**：通過 JSON Schema 配置表單
- **自動驗證**：基於 JSON Schema 自動生成驗證規則
- **豐富控件**：支持多種表單控件類型
- **自定義控件**：支持自定義表單控件
- **響應式佈局**：支持響應式表單佈局

- --

## 安裝與導入

### 安裝

`@delon/form` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/form": "^20.1.0"
  }
}
```

### 導入方式

#### 方式 1：導入 DelonFormModule（已棄用，推薦使用 Standalone）

```typescript
import { DelonFormModule } from '@delon/form';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DelonFormModule],
  // ...
})
export class ExampleComponent {}
```

#### 方式 2：使用 SHARED_IMPORTS（推薦）

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含 DelonFormModule
  // ...
})
export class ExampleComponent {}
```

- --

## 配置

在 `app.config.ts` 中配置表單服務：

```typescript
import { provideSFConfig } from '@delon/form';
import { SF_WIDGETS } from '@shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSFConfig({
      widgets: SF_WIDGETS, // 自定義控件
      // 其他配置...
    }),
    // ...
  ],
};
```

- --

## 主要功能

### SFComponent - 表單組件

**導入**：`import { SFComponent } from '@delon/form';`

#### 基本用法

```html
<sf
  #sf
  [schema]="schema"
  [formData]="formData"
  (formSubmit)="submit($event)"
  (formChange)="change($event)"
  (formError)="error($event)"
  (formReset)="reset($event)">
</sf>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[schema]` | 表單 Schema | `SFSchema` | `-` |
| `[formData]` | 表單初始數據 | `any` | `{}` |
| `[button]` | 按鈕配置 | `SFButton` | `-` |
| `[layout]` | 表單佈局 | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` |
| `(formSubmit)` | 表單提交事件 | `EventEmitter<any>` | `-` |
| `(formChange)` | 表單變化事件 | `EventEmitter<any>` | `-` |
| `(formError)` | 表單錯誤事件 | `EventEmitter<any>` | `-` |
| `(formReset)` | 表單重置事件 | `EventEmitter<void>` | `-` |

#### 主要方法

```typescript
// 提交表單
submit(): Observable<any>;

// 重置表單
reset(value?: any): void;

// 獲取表單值
get value(): any;

// 設置表單值
setValue(value: any): void;

// 獲取表單控件
getProperty(path: string): FormProperty | null;

// 刷新表單
refreshSchema(schema: SFSchema): void;
```

- --

### SFSchema - 表單 Schema

`SFSchema` 是表單的配置對象，定義表單的結構、驗證規則和 UI 配置。

#### 基本結構

```typescript
interface SFSchema {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  required?: string[];
  properties?: { [key: string]: SFSchema };
  items?: SFSchema;
  ui?: SFUISchemaItem;
  // ... 其他屬性
}
```

#### 使用示例

```typescript
import { SFSchema } from '@delon/form';

const schema: SFSchema = {
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      minLength: 2,
      maxLength: 20,
      ui: {
        placeholder: '請輸入姓名',
        widget: 'input'
      }
    },
    age: {
      type: 'number',
      title: '年齡',
      minimum: 0,
      maximum: 150,
      ui: {
        widget: 'number'
      }
    },
    email: {
      type: 'string',
      title: '郵箱',
      format: 'email',
      ui: {
        placeholder: '請輸入郵箱'
      }
    }
  },
  required: ['name', 'email'],
  ui: {
    spanLabelFixed: 100,
    grid: { span: 24 }
  }
};
```

- --

### 表單控件類型

#### 字符串類型

```typescript
{
  type: 'string',
  title: '字符串',
  ui: {
    widget: 'input', // input | textarea | autocomplete | date | string
    placeholder: '請輸入',
    size: 'default', // 'large' | 'default' | 'small'
  },
}
```

#### 數字類型

```typescript
{
  type: 'number',
  title: '數字',
  minimum: 0,
  maximum: 100,
  ui: {
    widget: 'number', // number | range | rate
    step: 1,
  },
}
```

#### 布爾類型

```typescript
{
  type: 'boolean',
  title: '布爾值',
  ui: {
    widget: 'checkbox', // checkbox | switch | radio
  },
}
```

#### 數組類型

```typescript
{
  type: 'array',
  title: '數組',
  items: {
    type: 'string',
  },
  ui: {
    widget: 'list', // list | checkbox | select | transfer
  },
}
```

#### 對象類型

```typescript
{
  type: 'object',
  title: '對象',
  properties: {
    // 子屬性
  },
}
```

- --

### 表單驗證

#### 基本驗證

```typescript
{
  type: 'string',
  title: '郵箱',
  format: 'email', // email | uri | regex
  minLength: 5,
  maxLength: 50,
  pattern: '^[a-z]+$',
}
```

#### 自定義驗證

```typescript
{
  type: 'string',
  title: '自定義驗證',
  ui: {
    validator: (value: any) => {
      if (!value) {
        return [{ keyword: 'required', message: '必填項' }];
      }
      return [];
    }
  }
}
```

- --

### 表單佈局

#### 基本佈局

```typescript
{
  ui: {
    spanLabel: 6, // 標籤寬度
    spanControl: 18, // 控件寬度
    grid: { span: 12 }, // 網格佈局
  },
}
```

#### 響應式佈局

```typescript
{
  ui: {
    grid: {
      span: 24,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
    }
  }
}
```

- --

## 實際使用示例

### 示例 1：基本表單

```typescript
import { Component, signal } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-basic-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <sf
      [schema]="schema()"
      [formData]="formData()"
      (formSubmit)="onSubmit($event)">
    </sf>
  `
})
export class BasicFormComponent {
  schema = signal<SFSchema>({
    properties: {
      name: {
        type: 'string',
        title: '姓名',
        minLength: 2,
        maxLength: 20,
        ui: {
          placeholder: '請輸入姓名'
        }
      },
      age: {
        type: 'number',
        title: '年齡',
        minimum: 0,
        maximum: 150
      },
      email: {
        type: 'string',
        title: '郵箱',
        format: 'email'
      }
    },
    required: ['name', 'email']
  });

  formData = signal({});

  onSubmit(value: any): void {
    console.log('表單值:', value);
  }
}
```

### 示例 2：編輯表單

**實際使用案例**：

```12:54:src/app/routes/pro/list/basic-list/edit/edit.component.ts
export class ProBasicListEditComponent {
  private readonly modal = inject(NzModalRef);
  private readonly msgSrv = inject(NzMessageService);

  record: any = {};
  schema: SFSchema = {
    properties: {
      title: { type: 'string', title: '任务名称', maxLength: 50 },
      createdAt: { type: 'string', title: '开始时间', format: 'date' },
      owner: {
        type: 'string',
        title: '任务负责人',
        enum: [
          { value: 'asdf', label: 'asdf' },
          { value: '卡色', label: '卡色' },
          { value: 'cipchk', label: 'cipchk' }
        ]
      },
      subDescription: {
        type: 'string',
        title: '产品描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 6 }
        }
      }
    },
    required: ['title', 'createdAt', 'owner'],
    ui: {
      spanLabelFixed: 150,
      grid: { span: 24 }
    }
  };

  save(value: any): void {
    this.msgSrv.success('保存成功');
    this.modal.close(value);
  }

  close(): void {
    this.modal.destroy();
  }
}
```

### 示例 3：搜索表單

**實際使用案例**：

```11:28:src/app/routes/delon/form/form.component.ts
export class DelonFormComponent {
  params: any = {};
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' }
  ];
}
```

### 示例 4：複雜表單

```typescript
import { Component, signal } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-complex-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <sf
      #sf
      [schema]="schema()"
      [formData]="formData()"
      (formSubmit)="onSubmit($event)"
      (formChange)="onChange($event)">
    </sf>
  `
})
export class ComplexFormComponent {
  schema = signal<SFSchema>({
    properties: {
      name: {
        type: 'string',
        title: '姓名',
        ui: { placeholder: '請輸入姓名' }
      },
      age: {
        type: 'number',
        title: '年齡',
        minimum: 0,
        maximum: 150
      },
      email: {
        type: 'string',
        title: '郵箱',
        format: 'email'
      },
      address: {
        type: 'object',
        title: '地址',
        properties: {
          city: {
            type: 'string',
            title: '城市'
          },
          street: {
            type: 'string',
            title: '街道'
          }
        }
      },
      hobbies: {
        type: 'array',
        title: '愛好',
        items: {
          type: 'string'
        },
        ui: {
          widget: 'list'
        }
      }
    },
    required: ['name', 'email']
  });

  formData = signal({});

  onSubmit(value: any): void {
    console.log('表單值:', value);
  }

  onChange(value: any): void {
    console.log('表單變化:', value);
  }
}
```

- --

## 自定義控件

### 創建自定義控件

```typescript
import { ControlWidget, SFWidgetProvideConfig } from '@delon/form';

export class CustomInputWidget extends ControlWidget {
  static readonly KEY = 'custom-input';

  get value(): any {
    return this.formProperty.value;
  }

  set value(val: any) {
    this.formProperty.setValue(val, false);
  }

  reset(value: any): void {
    this.value = value;
  }
}
```

### 註冊自定義控件

```typescript
import { provideSFConfig } from '@delon/form';
import { CustomInputWidget } from './custom-input.widget';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSFConfig({
      widgets: [
        { KEY: CustomInputWidget.KEY, type: CustomInputWidget }
      ]
    }),
    // ...
  ],
};
```

### 使用自定義控件

```typescript
{
  type: 'string',
  title: '自定義控件',
  ui: {
    widget: 'custom-input'
  }
}
```

**實際使用案例**：

```1:10:src/app/shared/json-schema/index.ts
import type { SFWidgetProvideConfig } from '@delon/form';
// import { withCascaderWidget } from '@delon/form/widgets/cascader';

import { TestWidget } from './test/test.widget';

export const SF_WIDGETS: SFWidgetProvideConfig[] = [
  { KEY: TestWidget.KEY, type: TestWidget }
  // Non-built-in widget registration method
  // withCascaderWidget()
];
```

- --

## 最佳實踐

### 1. 使用 SHARED_IMPORTS

```typescript
// ✅ 推薦：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 已包含 DelonFormModule
  template: `<sf [schema]="schema"></sf>`
})
export class ExampleComponent {}
```

### 2. 使用 Signals 管理 Schema

```typescript
import { Component, signal } from '@angular/core';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  schema = signal<SFSchema>({
    properties: {
      // ...
    }
  });
}
```

### 3. 表單驗證

```typescript
// ✅ 推薦：使用 JSON Schema 驗證
{
  type: 'string',
  title: '郵箱',
  format: 'email',
  minLength: 5,
  maxLength: 50
}

// ✅ 推薦：自定義驗證器
{
  type: 'string',
  title: '自定義驗證',
  ui: {
    validator: (value: any) => {
      if (!value) {
        return [{ keyword: 'required', message: '必填項' }];
      }
      return [];
    }
  }
}
```

### 4. 表單佈局

```typescript
// ✅ 推薦：使用響應式佈局
{
  ui: {
    grid: {
      span: 24,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6
    }
  }
}
```

### 5. 表單事件處理

```typescript
// ✅ 推薦：處理表單事件
<sf
  [schema]="schema"
  (formSubmit)="onSubmit($event)"
  (formChange)="onChange($event)"
  (formError)="onError($event)">
</sf>
```

- --

## 常見問題

### Q1: 如何動態更新 Schema？

```typescript
import { viewChild } from '@angular/core';
import { SFComponent } from '@delon/form';

export class ExampleComponent {
  sf = viewChild.required<SFComponent>('sf');

  updateSchema(): void {
    const newSchema: SFSchema = {
      // 新的 Schema
    };
    this.sf().refreshSchema(newSchema);
  }
}
```

### Q2: 如何獲取表單值？

```typescript
import { viewChild } from '@angular/core';
import { SFComponent } from '@delon/form';

export class ExampleComponent {
  sf = viewChild.required<SFComponent>('sf');

  getValue(): void {
    const value = this.sf().value;
    console.log('表單值:', value);
  }
}
```

### Q3: 如何設置表單值？

```typescript
import { viewChild } from '@angular/core';
import { SFComponent } from '@delon/form';

export class ExampleComponent {
  sf = viewChild.required<SFComponent>('sf');

  setValue(): void {
    const data = { name: 'John', age: 30 };
    this.sf().setValue(data);
  }
}
```

### Q4: 如何重置表單？

```typescript
import { viewChild } from '@angular/core';
import { SFComponent } from '@delon/form';

export class ExampleComponent {
  sf = viewChild.required<SFComponent>('sf');

  reset(): void {
    this.sf().reset();
  }
}
```

### Q5: 如何提交表單？

```typescript
import { viewChild } from '@angular/core';
import { SFComponent } from '@delon/form';

export class ExampleComponent {
  sf = viewChild.required<SFComponent>('sf');

  submit(): void {
    this.sf().submit().subscribe({
      next: (value) => {
        console.log('表單值:', value);
      },
      error: (err) => {
        console.error('驗證失敗:', err);
      }
    });
  }
}
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/form 官方文檔](https://ng-alain.com/form)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/abc](https://ng-alain.com/components) - 業務組件
- [@delon/util](https://ng-alain.com/util) - 工具函數庫

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
