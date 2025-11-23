# @delon/util 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [導入方式](#導入方式)
  - [或使用 SHARED_IMPORTS](#或使用-shared_imports)
- [模組說明](#模組說明)
  - [@delon/util/array - 數組與樹操作](#delonutilarray---數組與樹操作)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/browser - 瀏覽器相關](#delonutilbrowser---瀏覽器相關)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/date-time - 日期時間轉換](#delonutildate-time---日期時間轉換)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/decorator - 裝飾器](#delonutildecorator---裝飾器)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/form - 響應式表單校驗](#delonutilform---響應式表單校驗)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/format - 字符格式化](#delonutilformat---字符格式化)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/math - 數學運算](#delonutilmath---數學運算)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/token - Token 管理](#delonutiltoken---token-管理)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/other - 其他工具](#delonutilother---其他工具)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
  - [@delon/util/pipes - 管道](#delonutilpipes---管道)
    - [主要功能](#主要功能)
    - [常用 API](#常用-api)
    - [使用示例](#使用示例)
- [實際使用示例](#實際使用示例)
  - [示例 1：複製功能](#示例-1複製功能)
  - [示例 2：日期範圍選擇](#示例-2日期範圍選擇)
  - [示例 3：表單驗證](#示例-3表單驗證)
- [最佳實踐](#最佳實踐)
  - [1. 按需導入](#1-按需導入)
  - [2. 使用 Signals 管理狀態](#2-使用-signals-管理狀態)
  - [3. 錯誤處理](#3-錯誤處理)
  - [4. 類型安全](#4-類型安全)
  - [5. 與 SHARED_IMPORTS 配合使用](#5-與-shared_imports-配合使用)
- [常見問題](#常見問題)
  - [Q1: 如何導入多個工具函數？](#q1-如何導入多個工具函數)
  - [Q2: `copy` 函數在哪些瀏覽器中可用？](#q2-copy-函數在哪些瀏覽器中可用)
  - [Q3: `deepCopy` 和 Angular 的 `structuredClone` 有什麼區別？](#q3-deepcopy-和-angular-的-structuredclone-有什麼區別)
  - [Q4: 如何在服務中使用 @delon/util？](#q4-如何在服務中使用-delonutil)
  - [Q5: 管道如何與 Signals 配合使用？](#q5-管道如何與-signals-配合使用)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/util` 工具庫的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/util ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [模組說明](#模組說明)
  - [@delon/util/array - 數組與樹操作](#delonutilarray---數組與樹操作)
  - [@delon/util/browser - 瀏覽器相關](#delonutilbrowser---瀏覽器相關)
  - [@delon/util/date-time - 日期時間轉換](#delonutildate-time---日期時間轉換)
  - [@delon/util/decorator - 裝飾器](#delonutildecorator---裝飾器)
  - [@delon/util/form - 響應式表單校驗](#delonutilform---響應式表單校驗)
  - [@delon/util/format - 字符格式化](#delonutilformat---字符格式化)
  - [@delon/util/math - 數學運算](#delonutilmath---數學運算)
  - [@delon/util/token - Token 管理](#delonutiltoken---token-管理)
  - [@delon/util/other - 其他工具](#delonutilother---其他工具)
  - [@delon/util/pipes - 管道](#delonutilpipes---管道)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/util` 是 ng-alain 框架提供的工具庫，包含常用的工具函數、管道和裝飾器，涵蓋數組操作、日期處理、表單驗證、格式化等功能。

### 核心特點

- **模組化設計**：按功能分類，按需導入
- **TypeScript 支持**：完整的類型定義
- **Angular 集成**：與 Angular 框架深度集成
- **性能優化**：Tree-shaking 友好

- --

## 安裝與導入

### 安裝

`@delon/util` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/util": "^20.1.0"
  }
}
```

### 導入方式

按需導入特定模組：

```typescript
// 導入特定功能
import { copy } from '@delon/util/browser';
import { format } from '@delon/util/format';
import { getTimeDistance } from '@delon/util/date-time';
import { deepCopy } from '@delon/util/other';
import { MatchControl } from '@delon/util/form';

// 導入管道
import { CurrencyPricePipe } from '@delon/util';
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含 CurrencyPricePipe
  // ...
})
export class ExampleComponent {}
```

- --

## 模組說明

### @delon/util/array - 數組與樹操作

提供數組和樹結構的常用操作方法。

#### 主要功能

- **數組操作**：去重、分組、扁平化
- **樹結構操作**：數組轉樹、樹轉數組、查找樹節點
- **數據轉換**：多種數據結構轉換

#### 常用 API

```typescript
import {
  arrayToTree,      // 數組轉樹
  treeToArray,      // 樹轉數組
  findTree,         // 查找樹節點
  getTree,          // 獲取樹節點
  visitTree,        // 遍歷樹
  flatToTree,       // 扁平數組轉樹
  groupBy,          // 分組
  uniq,             // 去重
  uniqBy,           // 按屬性去重
  deepFlat          // 深度扁平化
} from '@delon/util/array';
```

#### 使用示例

```typescript
import { Component, signal, computed } from '@angular/core';
import { arrayToTree, findTree, groupBy } from '@delon/util/array';
import { SHARED_IMPORTS } from '@shared';

interface TreeNode {
  id: number;
  name: string;
  parentId?: number;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-tree [nzData]="treeData()"></nz-tree>
  `
})
export class TreeExampleComponent {
  // 原始數組數據
  flatData = signal<TreeNode[]>([
    { id: 1, name: '根節點', parentId: undefined },
    { id: 2, name: '子節點1', parentId: 1 },
    { id: 3, name: '子節點2', parentId: 1 },
    { id: 4, name: '孫節點1', parentId: 2 }
  ]);

  // 轉換為樹結構
  treeData = computed(() => {
    return arrayToTree(this.flatData(), {
      idMapName: 'id',
      parentIdMapName: 'parentId',
      childrenMapName: 'children'
    });
  });

  // 查找節點
  findNode(id: number): TreeNode | null {
    return findTree(this.treeData(), item => item.id === id) || null;
  }

  // 按屬性分組
  groupByStatus(items: Array<{ status: string; name: string }>) {
    return groupBy(items, 'status');
  }
}
```

- --

### @delon/util/browser - 瀏覽器相關

提供瀏覽器環境下的常用操作。

#### 主要功能

- **Cookie 管理**：CookieService 服務
- **剪貼板操作**：複製文本到剪貼板
- **滾動控制**：ScrollService 服務

#### 常用 API

```typescript
import {
  copy,              // 複製文本到剪貼板
  CookieService,     // Cookie 服務
  ScrollService      // 滾動服務
} from '@delon/util/browser';
```

#### 使用示例

```typescript
import { Component, inject } from '@angular/core';
import { copy } from '@delon/util/browser';
import { CookieService } from '@delon/util/browser';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-browser-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <button nz-button (click)="onCopy()">複製文本</button>
      <button nz-button (click)="setCookie()">設置 Cookie</button>
      <button nz-button (click)="getCookie()">獲取 Cookie</button>
    </nz-card>
  `
})
export class BrowserExampleComponent {
  private readonly msg = inject(NzMessageService);
  private readonly cookieService = inject(CookieService);

  // 複製到剪貼板
  onCopy(): void {
    const text = `時間戳：${Date.now()}`;
    copy(text).then(() => {
      this.msg.success('複製成功！');
    }).catch(() => {
      this.msg.error('複製失敗');
    });
  }

  // 設置 Cookie
  setCookie(): void {
    this.cookieService.put('username', 'admin', {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
    });
    this.msg.success('Cookie 設置成功');
  }

  // 獲取 Cookie
  getCookie(): void {
    const username = this.cookieService.get('username');
    this.msg.info(`用戶名：${username || '未設置'}`);
  }
}
```

**實際使用案例**：

```12:32:src/app/routes/style/colors/colors.component.ts
  onCopy(str: string): void {
    copy(str).then(() => this.msg.success(`Copied Success!`));
  }
```

- --

### @delon/util/date-time - 日期時間轉換

提供日期時間的格式化、轉換和計算功能。

#### 主要功能

- **日期格式化**：多種日期格式轉換
- **時間距離計算**：獲取時間範圍（今天、本週、本月等）
- **日期計算**：日期加減、比較

#### 常用 API

```typescript
import {
  format,            // 格式化日期
  getTimeDistance,   // 獲取時間範圍
  toDate,            // 轉換為日期對象
  startOfDay,        // 獲取當天開始時間
  endOfDay,          // 獲取當天結束時間
  addDays,           // 添加天數
  addMonths,         // 添加月份
  addYears           // 添加年份
} from '@delon/util/date-time';
```

#### 使用示例

```typescript
import { Component, signal } from '@angular/core';
import { getTimeDistance } from '@delon/util/date-time';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-datetime-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <nz-date-picker
        [(ngModel)]="dateRange"
        nzMode="range"
        nzFormat="yyyy-MM-dd"
      ></nz-date-picker>
      <button nz-button (click)="setDate('today')">今天</button>
      <button nz-button (click)="setDate('week')">本週</button>
      <button nz-button (click)="setDate('month')">本月</button>
      <button nz-button (click)="setDate('year')">本年</button>
    </nz-card>
  `
})
export class DatetimeExampleComponent {
  dateRange = signal<Date[]>([]);

  // 設置日期範圍
  setDate(type: 'today' | 'week' | 'month' | 'year'): void {
    const range = getTimeDistance(type);
    this.dateRange.set(range);
  }
}
```

**實際使用案例**：

```107:111:src/app/routes/dashboard/analysis/analysis.component.ts
  setDate(type: string): void {
    this.dateRange = getTimeDistance(type as NzSafeAny);
    this.dateRangeType = type;
    setTimeout(() => this.cdr.detectChanges());
  }
```

- --

### @delon/util/decorator - 裝飾器

提供常用的類和方法裝飾器。

#### 主要功能

- **防抖裝飾器**：`@Debounce`
- **節流裝飾器**：`@Throttle`
- **鎖定裝飾器**：`@Lock`
- **日誌裝飾器**：`@Log`

#### 常用 API

```typescript
import {
  Debounce,          // 防抖裝飾器
  Throttle,          // 節流裝飾器
  Lock,              // 鎖定裝飾器
  Log                // 日誌裝飾器
} from '@delon/util/decorator';
```

#### 使用示例

```typescript
import { Component } from '@angular/core';
import { Debounce, Throttle } from '@delon/util/decorator';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-decorator-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <input nz-input (input)="onSearch($event)" placeholder="搜索" />
    <button nz-button (click)="onClick()">點擊（節流）</button>
  `
})
export class DecoratorExampleComponent {
  // 防抖：500ms 內只執行最後一次
  @Debounce(500)
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log('搜索：', value);
  }

  // 節流：1秒內只執行一次
  @Throttle(1000)
  onClick(): void {
    console.log('按鈕點擊');
  }
}
```

- --

### @delon/util/form - 響應式表單校驗

提供響應式表單的驗證器。

#### 主要功能

- **字段匹配驗證**：`MatchControl` - 驗證兩個字段是否匹配（如密碼確認）
- **自定義驗證器**：擴展 Angular 表單驗證

#### 常用 API

```typescript
import {
  MatchControl        // 字段匹配驗證器
} from '@delon/util/form';
```

#### 使用示例

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatchControl } from '@delon/util/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-form-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label>密碼</nz-form-label>
        <nz-form-control>
          <input nz-input type="password" formControlName="password" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label>確認密碼</nz-form-label>
        <nz-form-control [nzErrorTip]="'兩次輸入的密碼不一致'">
          <input nz-input type="password" formControlName="confirm" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [disabled]="form.invalid">
            提交
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class FormExampleComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    },
    {
      validators: MatchControl('password', 'confirm') // 驗證兩個字段匹配
    }
  );

  onSubmit(): void {
    if (this.form.valid) {
      console.log('表單提交：', this.form.value);
    }
  }
}
```

**實際使用案例**：

```40:49:src/app/routes/passport/register/register.component.ts
  form = inject(FormBuilder).nonNullable.group(
    {
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: MatchControl('password', 'confirm')
    }
  );
```

- --

### @delon/util/format - 字符格式化

提供字符串格式化、校驗、貨幣、掩碼等功能。

#### 主要功能

- **字符串格式化**：模板字符串替換
- **貨幣格式化**：金額格式化
- **掩碼處理**：手機號、身份證等掩碼
- **校驗工具**：常用格式校驗

#### 常用 API

```typescript
import {
  format,            // 字符串格式化
  formatMask,        // 掩碼格式化
  formatCurrency,    // 貨幣格式化
  formatNumber,      // 數字格式化
  isMobile,          // 手機號校驗
  isEmail,           // 郵箱校驗
  isIdCard           // 身份證校驗
} from '@delon/util/format';
```

#### 使用示例

```typescript
import { Component, signal } from '@angular/core';
import { format } from '@delon/util/format';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-format-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <p>格式化結果：{{ result() }}</p>
      <button nz-button (click)="onFormat()">執行格式化</button>
    </nz-card>
  `
})
export class FormatExampleComponent {
  template = signal('Hello, ${name}! Your age is ${age}.');
  data = signal({ name: 'John', age: 30 });
  result = signal('');

  onFormat(): void {
    // 格式化字符串：使用 ${key} 作為佔位符
    const formatted = format(
      this.template(),
      this.data(),
      true // 是否轉義 HTML
    );
    this.result.set(formatted);
  }
}
```

**實際使用案例**：

```26:35:src/app/routes/delon/util/util.component.ts
  onFormat(): void {
    let obj = null;
    try {
      obj = JSON.parse(this.format_obj);
    } catch {
      this.messageSrv.error(`无法使用 JSON.parse 转换`);
      return;
    }
    this.format_res = format(this.format_str, obj, true);
  }
```

- --

### @delon/util/math - 數學運算

提供數學運算相關的工具函數。

#### 主要功能

- **範圍計算**：獲取範圍值
- **四捨五入**：精確的四捨五入
- **數值處理**：數值轉換和驗證

#### 常用 API

```typescript
import {
  range,             // 範圍計算
  round,             // 四捨五入
  floor,             // 向下取整
  ceil,              // 向上取整
  random,            // 隨機數
  clamp              // 限制範圍
} from '@delon/util/math';
```

#### 使用示例

```typescript
import { Component } from '@angular/core';
import { round, clamp, range } from '@delon/util/math';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-math-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <p>四捨五入：{{ roundResult }}</p>
      <p>範圍限制：{{ clampResult }}</p>
      <p>範圍數組：{{ rangeResult }}</p>
    </nz-card>
  `
})
export class MathExampleComponent {
  // 四捨五入到小數點後 2 位
  roundResult = round(3.14159, 2); // 3.14

  // 限制值在 0-100 之間
  clampResult = clamp(150, 0, 100); // 100

  // 生成範圍數組
  rangeResult = range(1, 10, 2); // [1, 3, 5, 7, 9]
}
```

- --

### @delon/util/token - Token 管理

提供訪問 Window、visibilitychange 等瀏覽器 API 的封裝。

#### 主要功能

- **Token 管理**：存儲和獲取 Token
- **窗口可見性**：監聽頁面可見性變化
- **本地存儲**：封裝 localStorage/sessionStorage

#### 常用 API

```typescript
import {
  WINDOW,            // Window 對象 Token
  DOCUMENT,          // Document 對象 Token
  LOCAL_STORAGE,     // LocalStorage Token
  SESSION_STORAGE    // SessionStorage Token
} from '@delon/util/token';
```

#### 使用示例

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WINDOW } from '@delon/util/token';
import { fromEvent, Subscription } from 'rxjs';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-token-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <p>窗口寬度：{{ windowWidth() }}</p>
    </nz-card>
  `
})
export class TokenExampleComponent implements OnInit, OnDestroy {
  private readonly window = inject(WINDOW);
  private resizeSub?: Subscription;
  windowWidth = signal(0);

  ngOnInit(): void {
    this.windowWidth.set(this.window.innerWidth);

    // 監聽窗口大小變化
    this.resizeSub = fromEvent(this.window, 'resize').subscribe(() => {
      this.windowWidth.set(this.window.innerWidth);
    });
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
  }
}
```

- --

### @delon/util/other - 其他工具

提供深拷貝、合併、延遲、斷言等通用工具函數。

#### 主要功能

- **深拷貝**：`deepCopy` - 深度複製對象
- **深度獲取**：`deepGet` - 安全獲取嵌套屬性
- **深度設置**：`deepSet` - 安全設置嵌套屬性
- **對象合併**：`deepMerge` - 深度合併對象
- **延遲執行**：`delay` - 延遲執行函數
- **斷言**：`assert` - 斷言工具

#### 常用 API

```typescript
import {
  deepCopy,          // 深拷貝
  deepGet,           // 深度獲取
  deepSet,           // 深度設置
  deepMerge,         // 深度合併
  delay,             // 延遲執行
  assert             // 斷言
} from '@delon/util/other';
```

#### 使用示例

```typescript
import { Component } from '@angular/core';
import { deepCopy, deepGet, deepMerge } from '@delon/util/other';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-other-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <p>深拷貝結果：{{ copiedData | json }}</p>
      <p>深度獲取：{{ nestedValue }}</p>
    </nz-card>
  `
})
export class OtherExampleComponent {
  originalData = {
    name: 'John',
    address: {
      city: 'Taipei',
      zip: '100'
    }
  };

  // 深拷貝
  copiedData = deepCopy(this.originalData);

  // 深度獲取嵌套屬性
  nestedValue = deepGet(this.originalData, 'address.city'); // 'Taipei'

  // 深度合併
  mergedData = deepMerge(
    { a: 1, b: { c: 2 } },
    { b: { d: 3 }, e: 4 }
  );
  // 結果：{ a: 1, b: { c: 2, d: 3 }, e: 4 }
}
```

**實際使用案例**：

```98:100:src/app/routes/dashboard/analysis/analysis.component.ts
      res.offlineData.forEach((item: any) => {
        item.chart = deepCopy(res.offlineChartData);
      });
```

- --

### @delon/util/pipes - 管道

提供常用的 Angular 管道。

#### 主要功能

- **價格管道**：`price` - 價格格式化
- **文件大小管道**：`mega` - 文件大小格式化（MB、GB 等）
- **人民幣管道**：`cny` - 人民幣格式化
- **過濾管道**：`filter` - 數組過濾
- **掩碼管道**：`mask` - 數據掩碼（手機號、身份證等）

#### 常用 API

```typescript
import {
  CurrencyPricePipe,  // 價格管道
  MegaPipe,           // 文件大小管道
  CnyPipe,            // 人民幣管道
  FilterPipe,         // 過濾管道
  MaskPipe            // 掩碼管道
} from '@delon/util/pipes';
```

#### 使用示例

```typescript
import { Component, signal } from '@angular/core';
import { CurrencyPricePipe } from '@delon/util';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-pipes-example',
  standalone: true,
  imports: [SHARED_IMPORTS, CurrencyPricePipe],
  template: `
    <nz-card>
      <h3>管道示例</h3>
      <p>價格：{{ price() | currencyPrice }}</p>
      <p>文件大小：{{ fileSize() | mega }}</p>
      <p>手機號：{{ phone() | mask: 'mobile' }}</p>
    </nz-card>
  `
})
export class PipesExampleComponent {
  price = signal(1234.56);
  fileSize = signal(1024 * 1024 * 5); // 5MB
  phone = signal('13800138000');
}
```

**實際使用案例**：

```75:75:src/app/shared/shared-delon.module.ts
import { CurrencyPricePipe } from '@delon/util';
```

`CurrencyPricePipe` 已包含在 `SHARED_DELON_MODULES` 中，可直接使用。

- --

## 實際使用示例

### 示例 1：複製功能

```typescript
import { Component, inject } from '@angular/core';
import { copy } from '@delon/util/browser';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-copy-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <input nz-input [(ngModel)]="text" readonly />
      <button nz-button (click)="onCopy()">複製</button>
    </nz-card>
  `
})
export class CopyExampleComponent {
  private readonly msg = inject(NzMessageService);
  text = '要複製的文本';

  onCopy(): void {
    copy(this.text).then(() => {
      this.msg.success('複製成功');
    }).catch(() => {
      this.msg.error('複製失敗');
    });
  }
}
```

### 示例 2：日期範圍選擇

```typescript
import { Component, signal } from '@angular/core';
import { getTimeDistance } from '@delon/util/date-time';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-date-range-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <nz-date-picker
        [(ngModel)]="dateRange"
        nzMode="range"
        nzFormat="yyyy-MM-dd"
      ></nz-date-picker>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="setDate('today')">今天</button>
        <button *nzSpaceItem nz-button (click)="setDate('week')">本週</button>
        <button *nzSpaceItem nz-button (click)="setDate('month')">本月</button>
        <button *nzSpaceItem nz-button (click)="setDate('year')">本年</button>
      </nz-space>
    </nz-card>
  `
})
export class DateRangeExampleComponent {
  dateRange = signal<Date[]>([]);

  setDate(type: 'today' | 'week' | 'month' | 'year'): void {
    const range = getTimeDistance(type);
    this.dateRange.set(range);
  }
}
```

### 示例 3：表單驗證

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatchControl } from '@delon/util/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-form-validation-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label>新密碼</nz-form-label>
        <nz-form-control>
          <input nz-input type="password" formControlName="password" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label>確認密碼</nz-form-label>
        <nz-form-control [nzErrorTip]="'兩次輸入的密碼不一致'">
          <input nz-input type="password" formControlName="confirm" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [disabled]="form.invalid">
            提交
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class FormValidationExampleComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    },
    {
      validators: MatchControl('password', 'confirm')
    }
  );

  onSubmit(): void {
    if (this.form.valid) {
      console.log('表單提交：', this.form.value);
    }
  }
}
```

- --

## 最佳實踐

### 1. 按需導入

只導入需要的功能，避免導入整個模組：

```typescript
// ✅ 正確：按需導入
import { copy } from '@delon/util/browser';
import { format } from '@delon/util/format';

// ❌ 錯誤：導入整個模組（如果支持）
import * as util from '@delon/util';
```

### 2. 使用 Signals 管理狀態

結合 Angular Signals 使用：

```typescript
import { Component, signal, computed } from '@angular/core';
import { deepCopy } from '@delon/util/other';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  data = signal({ name: 'John', age: 30 });

  // 使用深拷貝創建新狀態
  updateData(): void {
    const newData = deepCopy(this.data());
    newData.age = 31;
    this.data.set(newData);
  }
}
```

### 3. 錯誤處理

對於可能失敗的操作（如 `copy`），要處理錯誤：

```typescript
import { copy } from '@delon/util/browser';

copy(text)
  .then(() => {
    this.msg.success('複製成功');
  })
  .catch(() => {
    this.msg.error('複製失敗，請手動複製');
  });
```

### 4. 類型安全

充分利用 TypeScript 類型定義：

```typescript
import { getTimeDistance } from '@delon/util/date-time';

// TypeScript 會檢查類型
const range = getTimeDistance('today'); // ✅ 正確
const range2 = getTimeDistance('invalid'); // ❌ 類型錯誤
```

### 5. 與 SHARED_IMPORTS 配合使用

`CurrencyPricePipe` 已包含在 `SHARED_IMPORTS` 中，無需額外導入：

```typescript
import { SHARED_IMPORTS } from '@shared';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 已包含 CurrencyPricePipe
  template: `{{ price | currencyPrice }}`
})
export class ExampleComponent {}
```

- --

## 常見問題

### Q1: 如何導入多個工具函數？

```typescript
// 從同一模組導入多個函數
import { copy, CookieService } from '@delon/util/browser';
import { format, formatMask } from '@delon/util/format';

// 從不同模組導入
import { copy } from '@delon/util/browser';
import { format } from '@delon/util/format';
import { deepCopy } from '@delon/util/other';
```

### Q2: `copy` 函數在哪些瀏覽器中可用？

`copy` 函數使用 Clipboard API，支持現代瀏覽器（Chrome 66+、Firefox 63+、Safari 13.1+）。在不支持的瀏覽器中會自動降級到傳統方法。

### Q3: `deepCopy` 和 Angular 的 `structuredClone` 有什麼區別？

- `deepCopy`：@delon/util 提供的深拷貝函數，支持更多數據類型
- `structuredClone`：瀏覽器原生 API，性能更好但支持類型有限

建議根據實際需求選擇。

### Q4: 如何在服務中使用 @delon/util？

```typescript
import { Injectable, inject } from '@angular/core';
import { CookieService } from '@delon/util/browser';
import { deepCopy } from '@delon/util/other';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly cookieService = inject(CookieService);

  saveToken(token: string): void {
    this.cookieService.put('token', token);
  }

  cloneData<T>(data: T): T {
    return deepCopy(data);
  }
}
```

### Q5: 管道如何與 Signals 配合使用？

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <!-- 在模板中調用 Signal 時必須使用括號 -->
    <p>價格：{{ price() | currencyPrice }}</p>
  `
})
export class ExampleComponent {
  price = signal(1234.56);
}
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [Angular 20 最佳實踐](../../.cursor/rules/angular.mdc) - Angular 20 最佳實踐
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/util 官方文檔](https://ng-alain.com/util)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/abc](https://ng-alain.com/components) - 業務組件
- [@delon/form](https://ng-alain.com/form) - 動態表單
- [@delon/theme](https://ng-alain.com/theme) - 主題系統

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
