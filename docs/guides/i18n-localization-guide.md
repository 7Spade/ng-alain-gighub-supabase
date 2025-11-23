# 國際化與本地化指南


> **📚 目的**: 提供國際化與本地化的完整解決方案，支援多語言應用程式開發

## 目標讀者 (Audience)

- 前端開發者
- 產品經理

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心概念](#核心概念)
    - [國際化 (i18n)](#國際化-i18n)
    - [本地化 (l10n)](#本地化-l10n)
  - [支援語言](#支援語言)
  - [技術棧](#技術棧)
- [i18n 配置](#i18n-配置)
  - [1. Angular i18n 配置](#1-angular-i18n-配置)
    - [angular.json 配置](#angularjson-配置)
  - [2. ALAIN 多語言配置](#2-alain-多語言配置)
    - [app.config.ts](#appconfigts)
  - [3. 語言切換服務](#3-語言切換服務)
    - [i18n.service.ts](#i18nservicets)
- [翻譯管理](#翻譯管理)
  - [1. 翻譯檔案結構](#1-翻譯檔案結構)
  - [2. JSON 翻譯檔案](#2-json-翻譯檔案)
    - [common.json (zh-TW)](#commonjson-zh-tw)
    - [validation.json (zh-TW)](#validationjson-zh-tw)
  - [3. 在模板中使用翻譯](#3-在模板中使用翻譯)
    - [方法 1: i18n 屬性（編譯時）](#方法-1-i18n-屬性編譯時)
    - [方法 2: 管道（執行時）](#方法-2-管道執行時)
    - [方法 3: 程式碼中使用](#方法-3-程式碼中使用)
- [日期時間格式化](#日期時間格式化)
  - [1. 使用 Angular DatePipe](#1-使用-angular-datepipe)
  - [2. 使用 date-fns](#2-使用-date-fns)
- [數字與貨幣格式化](#數字與貨幣格式化)
  - [1. 使用 Angular Pipes](#1-使用-angular-pipes)
  - [2. 使用 Intl API](#2-使用-intl-api)
- [多語言路由](#多語言路由)
  - [1. 路由配置](#1-路由配置)
  - [2. 語言路由守衛](#2-語言路由守衛)
- [RTL 支援](#rtl-支援)
  - [1. RTL 語言檢測](#1-rtl-語言檢測)
  - [2. RTL 樣式](#2-rtl-樣式)
- [最佳實踐](#最佳實踐)
  - [1. 翻譯鍵值命名](#1-翻譯鍵值命名)
  - [2. 翻譯檔案組織](#2-翻譯檔案組織)
  - [3. 變數處理](#3-變數處理)
  - [4. 複數處理](#4-複數處理)
  - [5. 日期格式統一](#5-日期格式統一)
  - [6. 測試翻譯](#6-測試翻譯)
  - [7. 效能優化](#7-效能優化)
- [相關文檔](#相關文檔)

---


> **目的**：提供完整的國際化 (i18n) 和本地化 (l10n) 實作指南，支援多語言應用程式開發

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：Development Team

- --

## 📋 目錄

1. [概述](#概述)
2. [i18n 配置](#i18n-配置)
3. [翻譯管理](#翻譯管理)
4. [日期時間格式化](#日期時間格式化)
5. [數字與貨幣格式化](#數字與貨幣格式化)
6. [多語言路由](#多語言路由)
7. [RTL 支援](#rtl-支援)
8. [最佳實踐](#最佳實踐)

- --

## 概述

### 核心概念

#### 國際化 (i18n)
設計和開發應用程式，使其能夠適應不同的語言和地區，無需進行工程變更。

#### 本地化 (l10n)
為特定地區或語言提供翻譯和本地格式的過程。

### 支援語言

本專案預設支援以下語言：

- 🇹🇼 **繁體中文 (zh-TW)** - 預設語言
- 🇺🇸 **英文 (en-US)**
- 🇯🇵 **日文 (ja-JP)**
- 🇰🇷 **韓文 (ko-KR)**

### 技術棧

- **@angular/localize** - Angular 官方 i18n 解決方案
- **@delon/theme** - NG-ALAIN 多語言支援
- **date-fns** - 日期格式化
- **Intl API** - 瀏覽器內建國際化 API

- --

## i18n 配置

### 1. Angular i18n 配置

#### angular.json 配置

```json
{
  "projects": {
    "ng-alain-github": {
      "i18n": {
        "sourceLocale": "zh-TW",
        "locales": {
          "en-US": {
            "translation": "src/locale/messages.en.xlf",
            "baseHref": "/en/"
          },
          "ja-JP": {
            "translation": "src/locale/messages.ja.xlf",
            "baseHref": "/ja/"
          },
          "ko-KR": {
            "translation": "src/locale/messages.ko.xlf",
            "baseHref": "/ko/"
          }
        }
      },
      "architect": {
        "build": {
          "configurations": {
            "production-en": {
              "localize": ["en-US"],
              "outputPath": "dist/ng-alain-github/en"
            },
            "production-ja": {
              "localize": ["ja-JP"],
              "outputPath": "dist/ng-alain-github/ja"
            },
            "production-ko": {
              "localize": ["ko-KR"],
              "outputPath": "dist/ng-alain-github/ko"
            }
          }
        }
      }
    }
  }
}
```

### 2. ALAIN 多語言配置

#### app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAlain } from '@delon/theme';
import zhTW from '@delon/theme/locale/zh-TW';
import enUS from '@delon/theme/locale/en-US';
import jaJP from '@delon/theme/locale/ja-JP';
import koKR from '@delon/theme/locale/ko-KR';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAlain({
      config: {
        locale: {
          default: 'zh-TW',
          languages: [
            { code: 'zh-TW', text: '繁體中文', data: zhTW },
            { code: 'en-US', text: 'English', data: enUS },
            { code: 'ja-JP', text: '日本語', data: jaJP },
            { code: 'ko-KR', text: '한국어', data: koKR }
          ]
        }
      }
    })
  ]
};
```

### 3. 語言切換服務

#### i18n.service.ts

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { AlainI18NService } from '@delon/theme';
import { DOCUMENT } from '@angular/common';

export interface Language {
  code: string;
  text: string;
  abbr: string;
  flag: string;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private i18n = inject(AlainI18NService);
  private doc = inject(DOCUMENT);

  // 當前語言
  currentLang = signal<Language>({
    code: 'zh-TW',
    text: '繁體中文',
    abbr: '繁',
    flag: '🇹🇼'
  });

  // 可用語言列表
  languages = signal<Language[]>([
    { code: 'zh-TW', text: '繁體中文', abbr: '繁', flag: '🇹🇼' },
    { code: 'en-US', text: 'English', abbr: 'EN', flag: '🇺🇸' },
    { code: 'ja-JP', text: '日本語', abbr: '日', flag: '🇯🇵' },
    { code: 'ko-KR', text: '한국어', abbr: '韓', flag: '🇰🇷' }
  ]);

  constructor() {
    // 從 localStorage 讀取語言設定
    const savedLang = localStorage.getItem('app-language');
    if (savedLang) {
      this.changeLang(savedLang);
    }
  }

  /**
   * 切換語言
   */
  changeLang(langCode: string): void {
    const lang = this.languages().find(l => l.code === langCode);
    if (!lang) return;

    // 更新 ALAIN i18n
    this.i18n.use(langCode);

    // 更新當前語言
    this.currentLang.set(lang);

    // 儲存到 localStorage
    localStorage.setItem('app-language', langCode);

    // 更新 HTML lang 屬性
    this.doc.documentElement.lang = langCode;

    // 更新 HTML dir 屬性（RTL 支援）
    const isRTL = ['ar', 'he', 'fa'].includes(langCode);
    this.doc.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }

  /**
   * 翻譯鍵值
   */
  translate(key: string, params?: Record<string, any>): string {
    return this.i18n.fanyi(key, params);
  }
}
```

- --

## 翻譯管理

### 1. 翻譯檔案結構

```javascript
├── assets/
│   └── i18n/
│       ├── zh-TW/
│       │   ├── common.json
│       │   ├── menu.json
│       │   ├── validation.json
│       │   └── blueprint.json
│       ├── en-US/
│       │   ├── common.json
│       │   ├── menu.json
│       │   ├── validation.json
│       │   └── blueprint.json
│       ├── ja-JP/
│       │   └── ...
│       └── ko-KR/
│           └── ...
└── locale/
    ├── messages.xlf          # 來源檔案
    ├── messages.en.xlf       # 英文翻譯
    ├── messages.ja.xlf       # 日文翻譯
    └── messages.ko.xlf       # 韓文翻譯
```

### 2. JSON 翻譯檔案

#### common.json (zh-TW)

```json
{
  "app": {
    "name": "NG-ALAIN GitHub",
    "description": "企業級 Angular 管理面板框架"
  },
  "action": {
    "save": "儲存",
    "cancel": "取消",
    "delete": "刪除",
    "edit": "編輯",
    "add": "新增",
    "search": "搜尋",
    "reset": "重置",
    "submit": "提交",
    "confirm": "確認",
    "back": "返回"
  },
  "message": {
    "success": "操作成功",
    "error": "操作失敗",
    "loading": "載入中...",
    "noData": "暫無資料",
    "confirmDelete": "確定要刪除嗎？"
  }
}
```

#### validation.json (zh-TW)

```json
{
  "required": "此欄位為必填",
  "email": "請輸入有效的電子郵件",
  "minlength": "最少需要 {{requiredLength}} 個字元",
  "maxlength": "最多只能輸入 {{requiredLength}} 個字元",
  "min": "最小值為 {{min}}",
  "max": "最大值為 {{max}}",
  "pattern": "格式不正確",
  "passwordMismatch": "兩次密碼輸入不一致"
}
```

### 3. 在模板中使用翻譯

#### 方法 1: i18n 屬性（編譯時）

```html
<!-- 簡單翻譯 -->
<h1 i18n="@@app.title">應用程式標題</h1>

<!-- 帶描述 -->
<button i18n="按鈕|儲存按鈕@@action.save">儲存</button>

<!-- 帶變數 -->
<p i18n="@@user.greeting">
  您好，{name, select,
    male {先生}
    female {女士}
    other {}}
</p>
```

#### 方法 2: 管道（執行時）

```html
<!-- 使用 ALAIN i18n 管道 -->
<h1>{{ 'app.name' | i18n }}</h1>

<!-- 帶參數 -->
<p>{{ 'validation.minlength' | i18n: { requiredLength: 5 } }}</p>
```

#### 方法 3: 程式碼中使用

```typescript
import { Component, inject } from '@angular/core';
import { I18nService } from '@shared';

@Component({
  selector: 'app-example',
  template: `<h1>{{ title() }}</h1>`
})
export class ExampleComponent {
  private i18n = inject(I18nService);

  title = computed(() => this.i18n.translate('app.name'));

  showMessage(): void {
    const msg = this.i18n.translate('message.success');
    console.log(msg);
  }
}
```

- --

## 日期時間格式化

### 1. 使用 Angular DatePipe

```typescript
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-example',
  standalone: true,
  imports: [DatePipe],
  template: `
    <!-- 短日期 -->
    <p>{{ today | date: 'short' }}</p>
    <!-- 輸出: 2025/11/16 下午10:30 (zh-TW) -->
    <!-- 輸出: 11/16/25, 10:30 PM (en-US) -->

    <!-- 完整日期 -->
    <p>{{ today | date: 'full' }}</p>
    <!-- 輸出: 2025年11月16日 星期六 下午10:30:00 [GMT+8] (zh-TW) -->

    <!-- 自訂格式 -->
    <p>{{ today | date: 'yyyy-MM-dd HH:mm:ss' }}</p>
    <!-- 輸出: 2025-11-16 22:30:00 -->
  `
})
export class DateExampleComponent {
  today = new Date();
}
```

### 2. 使用 date-fns

```typescript
import { Injectable, inject } from '@angular/core';
import { format, formatDistance, formatRelative } from 'date-fns';
import { zhTW, enUS, ja, ko } from 'date-fns/locale';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class DateFormatterService {
  private i18n = inject(I18nService);

  private locales: Record<string, Locale> = {
    'zh-TW': zhTW,
    'en-US': enUS,
    'ja-JP': ja,
    'ko-KR': ko
  };

  /**
   * 格式化日期
   */
  format(date: Date, formatStr: string): string {
    const locale = this.locales[this.i18n.currentLang().code];
    return format(date, formatStr, { locale });
  }

  /**
   * 相對時間（例如：2 小時前）
   */
  formatDistance(date: Date, baseDate: Date = new Date()): string {
    const locale = this.locales[this.i18n.currentLang().code];
    return formatDistance(date, baseDate, { locale, addSuffix: true });
  }

  /**
   * 相對日期（例如：昨天下午 5:00）
   */
  formatRelative(date: Date, baseDate: Date = new Date()): string {
    const locale = this.locales[this.i18n.currentLang().code];
    return formatRelative(date, baseDate, { locale });
  }
}
```

- --

## 數字與貨幣格式化

### 1. 使用 Angular Pipes

```typescript
import { Component } from '@angular/core';
import { DecimalPipe, CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-number-example',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe, PercentPipe],
  template: `
    <!-- 數字格式化 -->
    <p>{{ 1234567.89 | number: '1.2-2' }}</p>
    <!-- 輸出: 1,234,567.89 (en-US) -->
    <!-- 輸出: 1,234,567.89 (zh-TW) -->

    <!-- 貨幣格式化 -->
    <p>{{ 1234.56 | currency: 'TWD' }}</p>
    <!-- 輸出: NT$1,234.56 (zh-TW) -->
    <p>{{ 1234.56 | currency: 'USD' }}</p>
    <!-- 輸出: $1,234.56 (en-US) -->
    <p>{{ 1234.56 | currency: 'JPY' }}</p>
    <!-- 輸出: ¥1,235 (ja-JP) -->

    <!-- 百分比格式化 -->
    <p>{{ 0.259 | percent: '1.2-2' }}</p>
    <!-- 輸出: 25.90% -->
  `
})
export class NumberExampleComponent {}
```

### 2. 使用 Intl API

```typescript
import { Injectable, inject } from '@angular/core';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class NumberFormatterService {
  private i18n = inject(I18nService);

  /**
   * 格式化數字
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.i18n.currentLang().code;
    return new Intl.NumberFormat(locale, options).format(value);
  }

  /**
   * 格式化貨幣
   */
  formatCurrency(value: number, currency: string): string {
    const locale = this.i18n.currentLang().code;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  }

  /**
   * 格式化百分比
   */
  formatPercent(value: number): string {
    const locale = this.i18n.currentLang().code;
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 2
    }).format(value);
  }
}
```

- --

## 多語言路由

### 1. 路由配置

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':lang',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
      },
      {
        path: 'blueprints',
        loadChildren: () => import('./blueprint/routes')
      }
    ]
  },
  {
    path: '',
    redirectTo: '/zh-TW/dashboard',
    pathMatch: 'full'
  }
];
```

### 2. 語言路由守衛

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { I18nService } from '@shared';

export const langGuard: CanActivateFn = (route, state) => {
  const i18n = inject(I18nService);
  const router = inject(Router);
  const lang = route.params['lang'];

  // 檢查語言是否支援
  const supportedLangs = i18n.languages().map(l => l.code);
  if (!supportedLangs.includes(lang)) {
    // 重定向到預設語言
    const defaultLang = i18n.currentLang().code;
    const newUrl = state.url.replace(`/${lang}`, `/${defaultLang}`);
    return router.parseUrl(newUrl);
  }

  // 更新語言設定
  if (i18n.currentLang().code !== lang) {
    i18n.changeLang(lang);
  }

  return true;
};
```

- --

## RTL 支援

### 1. RTL 語言檢測

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RtlService {
  isRTL = signal(false);

  private rtlLanguages = ['ar', 'he', 'fa', 'ur'];

  setDirection(langCode: string): void {
    const isRtl = this.rtlLanguages.some(rtl => langCode.startsWith(rtl));
    this.isRTL.set(isRtl);

    // 更新 HTML dir 屬性
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }
}
```

### 2. RTL 樣式

```scss
// styles/rtl.scss

[dir="rtl"] {
  // 文字對齊
  .text-left { text-align: right; }
  .text-right { text-align: left; }

  // Margin/Padding
  .ml-3 { margin-left: 0; margin-right: 12px; }
  .mr-3 { margin-right: 0; margin-left: 12px; }

  // Float
  .float-left { float: right; }
  .float-right { float: left; }

  // 邊框
  .border-left { border-left: none; border-right: 1px solid; }
  .border-right { border-right: none; border-left: 1px solid; }

  // Flex
  .flex-row { flex-direction: row-reverse; }
}
```

- --

## 最佳實踐

### 1. 翻譯鍵值命名

✅ **Do**
```typescript
// 使用命名空間
'app.title'
'menu.dashboard'
'validation.required'
'error.network.timeout'

// 使用有意義的名稱
'button.save'
'message.deleteConfirm'
```

❌ **Don't**
```typescript
// 避免模糊的名稱
'text1'
'label'
'msg'

// 避免過長的鍵值
'this.is.a.very.long.key.that.is.hard.to.read'
```

### 2. 翻譯檔案組織

✅ **Do**
- 按功能模組組織翻譯檔案
- 共用翻譯放在 `common.json`
- 模組特定翻譯放在對應檔案

❌ **Don't**
- 所有翻譯都放在一個大檔案
- 翻譯檔案沒有結構

### 3. 變數處理

✅ **Do**
```json
{
  "greeting": "您好，{{name}}！",
  "itemCount": "共 {{count}} 個項目"
}
```

```html
<p>{{ 'greeting' | i18n: { name: userName() } }}</p>
```

### 4. 複數處理

```json
{
  "itemCount": {
    "zero": "沒有項目",
    "one": "1 個項目",
    "other": "{{count}} 個項目"
  }
}
```

```typescript
const count = 5;
const msg = this.i18n.translate('itemCount', { count });
```

### 5. 日期格式統一

✅ **Do**
```typescript
// 使用統一的日期格式化服務
const formatted = this.dateFormatter.format(date, 'yyyy-MM-dd');
```

❌ **Don't**
```typescript
// 避免硬編碼格式
const formatted = date.toLocaleDateString(); // 格式不一致
```

### 6. 測試翻譯

```typescript
describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    service = TestBed.inject(I18nService);
  });

  it('should translate key correctly', () => {
    service.changeLang('zh-TW');
    expect(service.translate('app.name')).toBe('NG-ALAIN GitHub');
  });

  it('should handle missing keys', () => {
    const result = service.translate('nonexistent.key');
    expect(result).toBeTruthy(); // 應該有預設處理
  });
});
```

### 7. 效能優化

✅ **Do**
- 使用懶加載載入翻譯檔案
- 快取已載入的翻譯
- 使用 OnPush 變更檢測

❌ **Don't**
- 一次載入所有語言的翻譯
- 重複載入相同的翻譯檔案

- --

## 相關文檔

- [00-開發作業指引.md](./specs/00-development-guidelines.md) - 開發流程
- [45-SHARED_IMPORTS-使用指南.md](./reference/shared-imports-guide.md) - 共用模組
- [59-前端狀態管理指南.md](./59-前端狀態管理指南.md) - 狀態管理
- [62-前端路由設計指南.md](./62-前端路由設計指南.md) - 路由設計

- --

**版本歷史**

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-11-16 | 初始版本 | Development Team |
