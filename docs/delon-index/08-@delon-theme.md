# @delon/theme 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [導入方式](#導入方式)
    - [方式 1：單個組件導入](#方式-1單個組件導入)
    - [方式 2：使用 SHARED_IMPORTS（推薦）](#方式-2使用-shared_imports推薦)
- [配置](#配置)
- [主要功能](#主要功能)
  - [LayoutDefault - 默認佈局](#layoutdefault---默認佈局)
    - [基本用法](#基本用法)
  - [SettingDrawer - 設置抽屜](#settingdrawer---設置抽屜)
    - [基本用法](#基本用法)
  - [ThemeBtnComponent - 主題切換按鈕](#themebtncomponent---主題切換按鈕)
    - [基本用法](#基本用法)
  - [I18nPipe - 國際化管道](#i18npipe---國際化管道)
    - [基本用法](#基本用法)
  - [DatePipe - 日期管道](#datepipe---日期管道)
    - [基本用法](#基本用法)
  - [I18NService - 國際化服務](#i18nservice---國際化服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
  - [_HttpClient - HTTP 客戶端](#_httpclient---http-客戶端)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
  - [SettingsService - 設置服務](#settingsservice---設置服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
- [實際使用示例](#實際使用示例)
  - [示例 1：使用佈局](#示例-1使用佈局)
  - [示例 2：使用國際化](#示例-2使用國際化)
  - [示例 3：使用 HTTP 客戶端](#示例-3使用-http-客戶端)
- [最佳實踐](#最佳實踐)
  - [1. 使用 SHARED_IMPORTS](#1-使用-shared_imports)
  - [2. 使用 I18NService 進行國際化](#2-使用-i18nservice-進行國際化)
  - [3. 使用 _HttpClient 進行 HTTP 請求](#3-使用-_httpclient-進行-http-請求)
  - [4. 配置主題](#4-配置主題)
- [常見問題](#常見問題)
  - [Q1: 如何切換語言？](#q1-如何切換語言)
  - [Q2: 如何在模板中使用國際化？](#q2-如何在模板中使用國際化)
  - [Q3: 如何獲取當前語言？](#q3-如何獲取當前語言)
  - [Q4: 如何自定義 I18NService？](#q4-如何自定義-i18nservice)
  - [Q5: _HttpClient 和 HttpClient 有什麼區別？](#q5-_httpclient-和-httpclient-有什麼區別)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/theme` 主題系統的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/theme ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [LayoutDefault - 默認佈局](#layoutdefault---默認佈局)
  - [SettingDrawer - 設置抽屜](#settingdrawer---設置抽屜)
  - [ThemeBtnComponent - 主題切換按鈕](#themebtncomponent---主題切換按鈕)
  - [I18nPipe - 國際化管道](#i18npipe---國際化管道)
  - [DatePipe - 日期管道](#datepipe---日期管道)
  - [I18NService - 國際化服務](#i18nservice---國際化服務)
  - [_HttpClient - HTTP 客戶端](#_httpclient---http-客戶端)
  - [SettingsService - 設置服務](#settingsservice---設置服務)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/theme` 是 ng-alain 框架提供的主題系統，包含佈局、樣式、國際化等功能。是 ng-alain 框架的核心模組。

### 核心特點

- **默認佈局**：提供完整的後台管理佈局
- **主題定制**：支持主題顏色和樣式定制
- **國際化**：支持多語言切換
- **HTTP 客戶端**：封裝的 HTTP 客戶端服務
- **設置服務**：應用設置管理服務

- --

## 安裝與導入

### 安裝

`@delon/theme` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/theme": "^20.1.0"
  }
}
```

### 導入方式

#### 方式 1：單個組件導入

```typescript
// 默認佈局
import { LayoutDefaultModule } from '@delon/theme/layout-default';
// 設置抽屜
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
// 主題切換按鈕
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
// 管道
import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';
```

#### 方式 2：使用 SHARED_IMPORTS（推薦）

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含 @delon/theme 組件和管道
  // ...
})
export class ExampleComponent {}
```

- --

## 配置

在 `app.config.ts` 中配置主題：

**實際使用案例**：

```18:46:src/app/app.config.ts
import { AlainProvideLang, provideAlain, zh_CN as delonLang } from '@delon/theme';
import { AlainConfig } from '@delon/util/config';
import { environment } from '@env/environment';
import { CELL_WIDGETS, SF_WIDGETS, ST_WIDGETS } from '@shared';
import { zhCN as dateLang } from 'date-fns/locale';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { zh_CN as zorroLang } from 'ng-zorro-antd/i18n';

import { ICONS } from '../style-icons';
import { ICONS_AUTO } from '../style-icons-auto';
import { routes } from './routes/routes';

const defaultLang: AlainProvideLang = {
  abbr: 'zh-CN',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
  },
  auth: { login_url: '/passport/login' }
};
```

```typescript
import { provideAlain, AlainProvideLang } from '@delon/theme';
import { I18NService } from '@core';

const defaultLang: AlainProvideLang = {
  abbr: 'zh-CN',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAlain({
      config: alainConfig,
      defaultLang,
      i18nClass: I18NService,
      icons: [...ICONS_AUTO, ...ICONS]
    }),
    // ...
  ],
};
```

- --

## 主要功能

### LayoutDefault - 默認佈局

**導入**：`import { LayoutDefaultModule } from '@delon/theme/layout-default';`
**文檔**：https://ng-alain.com/theme/layout-default

提供默認的後台管理佈局，包含頂部導航、側邊欄、內容區等。

#### 基本用法

```html
<layout-default [options]="options" [content]="contentTpl">
  <layout-default-header-item direction="left">
    <a layout-default-header-item-trigger>Logo</a>
  </layout-default-header-item>
  <layout-default-header-item direction="right">
    <header-user />
  </layout-default-header-item>
  <ng-template #contentTpl>
    <router-outlet />
  </ng-template>
</layout-default>
```

**實際使用案例**：

```23:100:src/app/layout/basic/basic.component.ts
@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
          <i nz-icon nzType="github"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="mobile">
        <a layout-default-header-item-trigger routerLink="/passport/lock">
          <i nz-icon nzType="lock"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <i nz-icon nzType="search"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus" />
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-notify />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-task />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-icon />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <header-rtl />
            </div>
            <div nz-menu-item>
              <header-fullscreen />
            </div>
            <div nz-menu-item>
              <header-clear-storage />
            </div>
            <div nz-menu-item>
              <header-i18n />
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-user />
      </layout-default-header-item>
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <router-outlet />
      </ng-template>
    </layout-default>
    @if (showSettingDrawer) {
      <setting-drawer />
    }
    <theme-btn />
  `,
  // ...
})
```

- --

### SettingDrawer - 設置抽屜

**導入**：`import { SettingDrawerModule } from '@delon/theme/setting-drawer';`
**文檔**：https://ng-alain.com/theme/setting-drawer

提供設置抽屜組件，用於主題配置。

#### 基本用法

```html
<setting-drawer></setting-drawer>
```

- --

### ThemeBtnComponent - 主題切換按鈕

**導入**：`import { ThemeBtnComponent } from '@delon/theme/theme-btn';`
**文檔**：https://ng-alain.com/theme/theme-btn

主題切換按鈕組件。

#### 基本用法

```html
<theme-btn></theme-btn>
```

- --

### I18nPipe - 國際化管道

**導入**：`import { I18nPipe } from '@delon/theme';`
**文檔**：https://ng-alain.com/theme

國際化翻譯管道。

#### 基本用法

```html
{{ 'app.title' | i18n }}
{{ 'app.greeting' | i18n: { name: 'John' } }}
```

**實際使用案例**：

```88:89:src/app/layout/basic/basic.component.ts
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
```

- --

### DatePipe - 日期管道

**導入**：`import { DatePipe as DelonDatePipe } from '@delon/theme';`
**文檔**：https://ng-alain.com/theme

**注意**：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe。

#### 基本用法

```html
{{ dateValue | _date: 'yyyy-MM-dd' }}
{{ dateValue | _date: 'yyyy-MM-dd HH:mm:ss' }}
```

- --

### I18NService - 國際化服務

**導入**：`import { ALAIN_I18N_TOKEN } from '@delon/theme';`

在組件或服務中使用國際化服務。

#### 主要方法

##### 1. fanyi() - 翻譯

```typescript
fanyi(key: string, params?: any): string;
```

##### 2. use() - 切換語言

```typescript
use(lang: string, data?: Record<string, unknown>): void;
```

##### 3. getLangs() - 獲取語言列表

```typescript
getLangs(): Array<{ code: string; text: string; abbr: string }>;
```

#### 使用示例

**實際使用案例**：

```42:61:src/app/routes/dashboard/analysis/analysis.component.ts
  private readonly i18n = inject(ALAIN_I18N_TOKEN);
  // ...
  rankingListData: Array<{ title: string; total: number }> = Array(7)
    .fill({})
    .map((_, i) => {
      return {
        title: this.i18n.fanyi('app.analysis.test', { no: i }),
        total: 323234
      };
    });
  titleMap = {
    y1: this.i18n.fanyi('app.analysis.traffic'),
    y2: this.i18n.fanyi('app.analysis.payments')
  };
  searchColumn: STColumn[] = [
    { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
    {
      title: { text: '搜索关键词', i18n: 'app.analysis.table.search-keyword' },
      index: 'keyword',
      click: item => this.msg.success(item.keyword)
    },
```

```typescript
import { Component, inject } from '@angular/core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private readonly i18n = inject(ALAIN_I18N_TOKEN);

  getTitle(): string {
    return this.i18n.fanyi('app.title');
  }

  changeLang(lang: string): void {
    this.i18n.use(lang);
  }
}
```

**實際使用案例**：

```59:114:src/app/core/i18n/i18n.service.ts
@Injectable({ providedIn: 'root' })
export class I18NService extends AlainI18nBaseService {
  private readonly http = inject(_HttpClient);
  private readonly settings = inject(SettingsService);
  private readonly nzI18nService = inject(NzI18nService);
  private readonly delonLocaleService = inject(DelonLocaleService);
  private readonly platform = inject(Platform);

  protected override _defaultLang = DEFAULT;
  private _langs = Object.keys(LANGS).map(code => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });

  constructor() {
    super();

    const defaultLang = this.getDefaultLang();
    this._defaultLang = this._langs.findIndex(w => w.code === defaultLang) === -1 ? DEFAULT : defaultLang;
  }

  private getDefaultLang(): string {
    if (!this.platform.isBrowser) {
      return DEFAULT;
    }
    if (this.settings.layout.lang) {
      return this.settings.layout.lang;
    }
    let res = (navigator.languages ? navigator.languages[0] : null) || navigator.language;
    const arr = res.split('-');
    return arr.length <= 1 ? res : `${arr[0]}-${arr[1].toUpperCase()}`;
  }

  loadLangData(lang: string): Observable<NzSafeAny> {
    return this.http.get(`./assets/tmp/i18n/${lang}.json`);
  }

  use(lang: string, data: Record<string, unknown>): void {
    if (this._currentLang === lang) return;

    this._data = this.flatData(data, []);

    const item = LANGS[lang];
    registerLocaleData(item.ng);
    this.nzI18nService.setLocale(item.zorro);
    this.nzI18nService.setDateLocale(item.date);
    this.delonLocaleService.setLocale(item.delon);
    this._currentLang = lang;

    this._change$.next(lang);
  }

  getLangs(): Array<{ code: string; text: string; abbr: string }> {
    return this._langs;
  }
}
```

- --

### _HttpClient - HTTP 客戶端

**導入**：`import { _HttpClient } from '@delon/theme';`

封裝的 HTTP 客戶端服務，提供便捷的 HTTP 請求方法。

#### 主要方法

```typescript
get<T>(url: string, params?: any): Observable<T>;
post<T>(url: string, body?: any, params?: any): Observable<T>;
put<T>(url: string, body?: any, params?: any): Observable<T>;
delete<T>(url: string, params?: any): Observable<T>;
```

#### 使用示例

**實際使用案例**：

```40:69:src/app/routes/dashboard/analysis/analysis.component.ts
  private readonly http = inject(_HttpClient);
  readonly msg = inject(NzMessageService);
  private readonly i18n = inject(ALAIN_I18N_TOKEN);
  private readonly cdr = inject(ChangeDetectorRef);

  data: any = {};
  loading = true;
  dateRange: Date[] = [];
  dateRangeTypes = ['today', 'week', 'month', 'year'];
  dateRangeType = this.dateRangeTypes[0];
  rankingListData: Array<{ title: string; total: number }> = Array(7)
    .fill({})
    .map((_, i) => {
      return {
        title: this.i18n.fanyi('app.analysis.test', { no: i }),
        total: 323234
      };
    });
  titleMap = {
    y1: this.i18n.fanyi('app.analysis.traffic'),
    y2: this.i18n.fanyi('app.analysis.payments')
  };
  searchColumn: STColumn[] = [
    { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
    {
      title: { text: '搜索关键词', i18n: 'app.analysis.table.search-keyword' },
      index: 'keyword',
      click: item => this.msg.success(item.keyword)
    },
```

```typescript
import { Component, inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private readonly http = inject(_HttpClient);

  loadData(): void {
    this.http.get('/api/data').subscribe({
      next: (data) => {
        console.log('數據:', data);
      },
      error: (err) => {
        console.error('錯誤:', err);
      }
    });
  }
}
```

- --

### SettingsService - 設置服務

**導入**：`import { SettingsService } from '@delon/theme';`

應用設置管理服務。

#### 主要方法

```typescript
// 獲取設置
get(key: string): any;

// 設置值
set(key: string, value: any): boolean;

// 獲取布局設置
get layout(): LayoutDefaultOptions;

// 獲取應用設置
get app(): any;

// 獲取用戶設置
get user(): any;
```

#### 使用示例

```typescript
import { Component, inject } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private readonly settings = inject(SettingsService);

  getLayoutSetting(): void {
    const layout = this.settings.layout;
    console.log('佈局設置:', layout);
  }

  setLayoutSetting(key: string, value: any): void {
    this.settings.setLayout(key, value);
  }
}
```

- --

## 實際使用示例

### 示例 1：使用佈局

**實際使用案例**：

```23:100:src/app/layout/basic/basic.component.ts
@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <!-- 頭部項目 -->
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
          <i nz-icon nzType="github"></i>
        </a>
      </layout-default-header-item>
      <!-- 更多頭部項目... -->
      <ng-template #contentTpl>
        <router-outlet />
      </ng-template>
    </layout-default>
    <setting-drawer />
    <theme-btn />
  `,
  // ...
})
```

### 示例 2：使用國際化

```typescript
import { Component, inject } from '@angular/core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-i18n-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h1>{{ 'app.title' | i18n }}</h1>
      <p>{{ 'app.description' | i18n }}</p>
      <p>{{ 'app.greeting' | i18n: { name: userName() } }}</p>
      <button nz-button (click)="changeLang('zh-CN')">中文</button>
      <button nz-button (click)="changeLang('en-US')">English</button>
    </nz-card>
  `
})
export class I18nExampleComponent {
  private readonly i18n = inject(ALAIN_I18N_TOKEN);
  userName = signal('John');

  changeLang(lang: string): void {
    this.i18n.use(lang);
  }
}
```

### 示例 3：使用 HTTP 客戶端

```typescript
import { Component, inject, signal } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-http-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <button nz-button (click)="loadData()">加載數據</button>
      <ul>
        <li *ngFor="let item of data()">{{ item.name }}</li>
      </ul>
    </nz-card>
  `
})
export class HttpExampleComponent {
  private readonly http = inject(_HttpClient);
  data = signal<any[]>([]);

  loadData(): void {
    this.http.get('/api/data').subscribe({
      next: (result) => {
        this.data.set(result.data || []);
      },
      error: (err) => {
        console.error('加載失敗:', err);
      }
    });
  }
}
```

- --

## 最佳實踐

### 1. 使用 SHARED_IMPORTS

```typescript
// ✅ 推薦：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 已包含 @delon/theme 組件和管道
  template: `{{ 'app.title' | i18n }}`
})
export class ExampleComponent {}
```

### 2. 使用 I18NService 進行國際化

```typescript
// ✅ 推薦：在組件中使用 I18NService
import { ALAIN_I18N_TOKEN } from '@delon/theme';

const i18n = inject(ALAIN_I18N_TOKEN);
const title = i18n.fanyi('app.title');
```

### 3. 使用 _HttpClient 進行 HTTP 請求

```typescript
// ✅ 推薦：使用 _HttpClient
import { _HttpClient } from '@delon/theme';

const http = inject(_HttpClient);
http.get('/api/data').subscribe();
```

### 4. 配置主題

```typescript
// ✅ 推薦：在 app.config.ts 中配置主題
provideAlain({
  config: alainConfig,
  defaultLang,
  i18nClass: I18NService,
  icons: [...ICONS_AUTO, ...ICONS]
})
```

- --

## 常見問題

### Q1: 如何切換語言？

```typescript
import { ALAIN_I18N_TOKEN } from '@delon/theme';

const i18n = inject(ALAIN_I18N_TOKEN);
i18n.use('en-US'); // 切換到英文
```

### Q2: 如何在模板中使用國際化？

```html
<!-- 使用管道 -->
{{ 'app.title' | i18n }}

<!-- 帶參數 -->
{{ 'app.greeting' | i18n: { name: 'John' } }}
```

### Q3: 如何獲取當前語言？

```typescript
import { ALAIN_I18N_TOKEN } from '@delon/theme';

const i18n = inject(ALAIN_I18N_TOKEN);
const currentLang = i18n.currentLang;
```

### Q4: 如何自定義 I18NService？

項目中已經實現了自定義的 `I18NService`：

```59:114:src/app/core/i18n/i18n.service.ts
@Injectable({ providedIn: 'root' })
export class I18NService extends AlainI18nBaseService {
  // 自定義實現
}
```

在 `app.config.ts` 中配置：

```typescript
provideAlain({
  i18nClass: I18NService, // 使用自定義的 I18NService
  // ...
})
```

### Q5: _HttpClient 和 HttpClient 有什麼區別？

`_HttpClient` 是 `@delon/theme` 封裝的 HTTP 客戶端，提供了更便捷的 API 和統一的錯誤處理。建議在項目中使用 `_HttpClient`。

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [I18NService 源碼](../../src/app/core/i18n/i18n.service.ts) - 國際化服務實現
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/theme 官方文檔](https://ng-alain.com/theme)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/auth](https://ng-alain.com/auth) - 認證服務
- [@delon/util](https://ng-alain.com/util) - 工具函數庫

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
