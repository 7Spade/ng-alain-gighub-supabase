# @delon/cache 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [配置](#配置)
- [配置](#配置)
  - [配置選項](#配置選項)
- [主要功能](#主要功能)
  - [CacheService - 緩存服務](#cacheservice---緩存服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
  - [存儲類型](#存儲類型)
    - ['m' - 內存緩存（默認）](#m---內存緩存默認)
    - ['s' - sessionStorage](#s---sessionstorage)
    - ['l' - localStorage](#l---localstorage)
  - [過期時間](#過期時間)
    - [1. 秒數（推薦）](#1-秒數推薦)
    - [2. Date 對象](#2-date-對象)
- [實際使用示例](#實際使用示例)
  - [示例 1：基本用法](#示例-1基本用法)
  - [示例 2：用戶數據緩存](#示例-2用戶數據緩存)
  - [示例 3：列表數據緩存](#示例-3列表數據緩存)
  - [示例 4：Promise 模式](#示例-4promise-模式)
  - [示例 5：緩存管理](#示例-5緩存管理)
- [最佳實踐](#最佳實踐)
  - [1. 根據數據特性選擇存儲類型](#1-根據數據特性選擇存儲類型)
  - [2. 設置合理的過期時間](#2-設置合理的過期時間)
  - [3. 檢查緩存是否存在](#3-檢查緩存是否存在)
  - [4. 使用 Signals 管理緩存狀態](#4-使用-signals-管理緩存狀態)
  - [5. 處理緩存過期](#5-處理緩存過期)
- [常見問題](#常見問題)
  - [Q1: 如何清除所有緩存？](#q1-如何清除所有緩存)
  - [Q2: 如何檢查緩存是否過期？](#q2-如何檢查緩存是否過期)
  - [Q3: 如何獲取所有緩存鍵？](#q3-如何獲取所有緩存鍵)
  - [Q4: 如何設置不同的過期時間？](#q4-如何設置不同的過期時間)
  - [Q5: Promise 模式和同步模式有什麼區別？](#q5-promise-模式和同步模式有什麼區別)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/cache` 緩存服務的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/cache ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [CacheService - 緩存服務](#cacheservice---緩存服務)
  - [存儲類型](#存儲類型)
  - [過期時間](#過期時間)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/cache` 是 ng-alain 框架提供的緩存服務，用於實現數據緩存功能。支持多種存儲方式（內存、sessionStorage、localStorage）和過期時間設置。

### 核心特點

- **多種存儲方式**：支持內存、sessionStorage、localStorage
- **過期時間**：支持設置緩存過期時間
- **Promise 模式**：支持 Promise 模式的異步獲取
- **類型安全**：完整的 TypeScript 類型定義

- --

## 安裝與導入

### 安裝

`@delon/cache` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/cache": "^20.1.0"
  }
}
```

### 配置

在 `app.config.ts` 中配置緩存服務：

```typescript
import { provideDelonCache } from '@delon/cache';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDelonCache({
      mode: 'promise', // 'promise' | 'none'
      reName: '', // 重命名前綴
      type: 'm', // 'm' 內存 | 's' sessionStorage | 'l' localStorage
    }),
    // ...
  ],
};
```

- --

## 配置

### 配置選項

| 選項 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `mode` | 獲取模式 | `'promise' \| 'none'` | `'none'` |
| `reName` | 重命名前綴 | `string` | `''` |
| `type` | 默認存儲類型 | `'m' \| 's' \| 'l'` | `'m'` |

- --

## 主要功能

### CacheService - 緩存服務

**導入**：`import { CacheService } from '@delon/cache';`

#### 主要方法

##### 1. set() - 設置緩存

```typescript
set(key: string, value: any, options?: CacheOptions): boolean;
```

##### 2. get() - 獲取緩存

```typescript
get(key: string, options?: CacheOptions): any;
```

##### 3. remove() - 移除緩存

```typescript
remove(key: string): boolean;
```

##### 4. clear() - 清空緩存

```typescript
clear(options?: CacheOptions): void;
```

##### 5. has() - 檢查緩存是否存在

```typescript
has(key: string): boolean;
```

##### 6. keys() - 獲取所有緩存鍵

```typescript
keys(): string[];
```

#### 使用示例

```typescript
import { Component, inject } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <button nz-button (click)="saveData()">保存數據</button>
      <button nz-button (click)="loadData()">加載數據</button>
      <button nz-button (click)="clearData()">清空數據</button>
    </nz-card>
  `
})
export class ExampleComponent {
  private readonly cache = inject(CacheService);

  saveData(): void {
    const data = { name: 'John', age: 30 };
    // 保存到 localStorage，過期時間 1 小時
    this.cache.set('userData', data, {
      type: 'l',
      expire: 3600
    });
  }

  loadData(): void {
    const data = this.cache.get('userData');
    console.log('加載的數據:', data);
  }

  clearData(): void {
    this.cache.remove('userData');
  }
}
```

- --

### 存儲類型

#### 'm' - 內存緩存（默認）

頁面刷新後失效，適合臨時數據。

```typescript
// 使用內存緩存
this.cache.set('key', 'value', { type: 'm' });
```

#### 's' - sessionStorage

標籤頁關閉後失效，適合會話數據。

```typescript
// 使用 sessionStorage
this.cache.set('key', 'value', { type: 's' });
```

#### 'l' - localStorage

持久化存儲，適合長期數據。

```typescript
// 使用 localStorage
this.cache.set('key', 'value', { type: 'l' });
```

- --

### 過期時間

支持兩種方式設置過期時間：

#### 1. 秒數（推薦）

```typescript
// 過期時間 1 小時（3600 秒）
this.cache.set('key', 'value', { expire: 3600 });
```

#### 2. Date 對象

```typescript
// 過期時間為指定日期
this.cache.set('key', 'value', {
  expire: new Date('2025-12-31')
});
```

- --

## 實際使用示例

### 示例 1：基本用法

**實際使用案例**：

```11:24:src/app/routes/delon/cache/cache.component.ts
export class CacheComponent {
  private readonly cache = inject(CacheService);
  private readonly msg = inject(NzMessageService);

  KEY = 'user';

  set(): void {
    this.cache.set(this.KEY, +new Date());
  }

  get(): void {
    this.msg.success(this.cache.getNone(this.KEY));
  }
}
```

### 示例 2：用戶數據緩存

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>用戶資料</h3>
      <p>姓名：{{ user()?.name }}</p>
      <p>郵箱：{{ user()?.email }}</p>
      <button nz-button (click)="refresh()">刷新</button>
    </nz-card>
  `
})
export class UserProfileComponent implements OnInit {
  private readonly cache = inject(CacheService);

  user = signal<any>(null);

  ngOnInit(): void {
    // 從緩存加載用戶數據
    const cachedUser = this.cache.get('userProfile', { type: 'l' });
    if (cachedUser) {
      this.user.set(cachedUser);
    } else {
      // 從服務器加載
      this.loadUser();
    }
  }

  loadUser(): void {
    // 模擬 API 調用
    const userData = { name: 'John', email: 'john@example.com' };

    // 保存到緩存，過期時間 1 小時
    this.cache.set('userProfile', userData, {
      type: 'l',
      expire: 3600
    });

    this.user.set(userData);
  }

  refresh(): void {
    // 清除緩存並重新加載
    this.cache.remove('userProfile');
    this.loadUser();
  }
}
```

### 示例 3：列表數據緩存

```typescript
import { Component, inject, signal } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>列表數據</h3>
      <ul>
        <li *ngFor="let item of items()">{{ item.name }}</li>
      </ul>
      <button nz-button (click)="loadData()">加載數據</button>
    </nz-card>
  `
})
export class ListComponent {
  private readonly cache = inject(CacheService);

  items = signal<any[]>([]);

  loadData(): void {
    // 檢查緩存
    const cached = this.cache.get('listData', { type: 's' });
    if (cached) {
      this.items.set(cached);
      return;
    }

    // 從服務器加載
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];

    // 保存到緩存，過期時間 30 分鐘
    this.cache.set('listData', data, {
      type: 's',
      expire: 1800
    });

    this.items.set(data);
  }
}
```

### 示例 4：Promise 模式

```typescript
import { Component, inject, signal } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-promise-cache',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>Promise 模式緩存</h3>
      <p>數據：{{ data() | json }}</p>
      <button nz-button (click)="loadData()">加載數據</button>
    </nz-card>
  `
})
export class PromiseCacheComponent {
  private readonly cache = inject(CacheService);

  data = signal<any>(null);

  loadData(): void {
    // 使用 Promise 模式獲取緩存
    this.cache.get('promiseData', { mode: 'promise' }).then(value => {
      if (value) {
        this.data.set(value);
      } else {
        // 從服務器加載
        const newData = { message: 'Hello World' };
        this.cache.set('promiseData', newData, { type: 'l' });
        this.data.set(newData);
      }
    });
  }
}
```

### 示例 5：緩存管理

```typescript
import { Component, inject } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-cache-manager',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>緩存管理</h3>
      <p>緩存鍵數量：{{ keys().length }}</p>
      <ul>
        <li *ngFor="let key of keys()">{{ key }}</li>
      </ul>
      <button nz-button (click)="clearAll()">清空所有緩存</button>
      <button nz-button (click)="clearSession()">清空 Session 緩存</button>
      <button nz-button (click)="clearLocal()">清空 Local 緩存</button>
    </nz-card>
  `
})
export class CacheManagerComponent {
  private readonly cache = inject(CacheService);

  keys = signal<string[]>([]);

  ngOnInit(): void {
    this.updateKeys();
  }

  updateKeys(): void {
    this.keys.set(this.cache.keys());
  }

  clearAll(): void {
    this.cache.clear();
    this.updateKeys();
  }

  clearSession(): void {
    this.cache.clear({ type: 's' });
    this.updateKeys();
  }

  clearLocal(): void {
    this.cache.clear({ type: 'l' });
    this.updateKeys();
  }
}
```

- --

## 最佳實踐

### 1. 根據數據特性選擇存儲類型

```typescript
// ✅ 臨時數據使用內存緩存
this.cache.set('tempData', data, { type: 'm' });

// ✅ 會話數據使用 sessionStorage
this.cache.set('sessionData', data, { type: 's' });

// ✅ 長期數據使用 localStorage
this.cache.set('userData', data, { type: 'l' });
```

### 2. 設置合理的過期時間

```typescript
// ✅ 用戶數據：1 小時
this.cache.set('userProfile', data, {
  type: 'l',
  expire: 3600
});

// ✅ 列表數據：30 分鐘
this.cache.set('listData', data, {
  type: 's',
  expire: 1800
});

// ✅ 臨時數據：5 分鐘
this.cache.set('tempData', data, {
  type: 'm',
  expire: 300
});
```

### 3. 檢查緩存是否存在

```typescript
// ✅ 推薦：先檢查緩存
if (this.cache.has('key')) {
  const data = this.cache.get('key');
  // 使用緩存數據
} else {
  // 從服務器加載
}
```

### 4. 使用 Signals 管理緩存狀態

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private readonly cache = inject(CacheService);

  // 使用 signal 管理數據
  data = signal<any>(null);

  ngOnInit(): void {
    // 從緩存加載
    const cached = this.cache.get('data');
    if (cached) {
      this.data.set(cached);
    }
  }

  saveData(newData: any): void {
    // 保存到緩存
    this.cache.set('data', newData, { type: 'l' });
    // 更新 signal
    this.data.set(newData);
  }
}
```

### 5. 處理緩存過期

```typescript
// ✅ 推薦：設置過期時間並檢查
this.cache.set('data', value, {
  type: 'l',
  expire: 3600
});

// 獲取時會自動檢查過期
const data = this.cache.get('data');
if (!data) {
  // 緩存已過期或不存在，重新加載
}
```

- --

## 常見問題

### Q1: 如何清除所有緩存？

```typescript
import { CacheService } from '@delon/cache';

// 清除所有類型的緩存
this.cache.clear();

// 清除指定類型的緩存
this.cache.clear({ type: 'l' }); // localStorage
this.cache.clear({ type: 's' }); // sessionStorage
this.cache.clear({ type: 'm' }); // 內存
```

### Q2: 如何檢查緩存是否過期？

```typescript
import { CacheService } from '@delon/cache';

// 獲取緩存，如果過期會返回 null
const data = this.cache.get('key');
if (!data) {
  // 緩存不存在或已過期
}
```

### Q3: 如何獲取所有緩存鍵？

```typescript
import { CacheService } from '@delon/cache';

const keys = this.cache.keys();
console.log('所有緩存鍵:', keys);
```

### Q4: 如何設置不同的過期時間？

```typescript
import { CacheService } from '@delon/cache';

// 使用秒數
this.cache.set('key', 'value', { expire: 3600 }); // 1 小時

// 使用 Date 對象
this.cache.set('key', 'value', {
  expire: new Date('2025-12-31')
});
```

### Q5: Promise 模式和同步模式有什麼區別？

```typescript
import { CacheService } from '@delon/cache';

// 同步模式（默認）
const data = this.cache.get('key');

// Promise 模式
this.cache.get('key', { mode: 'promise' }).then(data => {
  console.log(data);
});
```

Promise 模式適用於需要異步處理的場景，但大多數情況下同步模式已經足夠。

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/cache 官方文檔](https://ng-alain.com/cache)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/auth](https://ng-alain.com/auth) - 認證服務
- [@delon/util](https://ng-alain.com/util) - 工具函數庫

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
