# @delon/mock 使用指南

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
  - [創建 Mock 數據](#創建-mock-數據)
  - [導出 Mock 數據](#導出-mock-數據)
  - [MockRequest 接口](#mockrequest-接口)
  - [模擬錯誤](#模擬錯誤)
  - [模擬延遲](#模擬延遲)
- [實際使用示例](#實際使用示例)
  - [示例 1：基本 Mock](#示例-1基本-mock)
  - [示例 2：帶參數的 Mock](#示例-2帶參數的-mock)
  - [示例 3：查詢參數](#示例-3查詢參數)
  - [示例 4：POST 請求](#示例-4post-請求)
  - [示例 5：條件響應](#示例-5條件響應)
- [最佳實踐](#最佳實踐)
  - [1. 僅在開發環境使用](#1-僅在開發環境使用)
  - [2. 數據結構一致性](#2-數據結構一致性)
  - [3. 使用類型定義](#3-使用類型定義)
  - [4. 模擬錯誤情況](#4-模擬錯誤情況)
  - [5. 模擬網絡延遲](#5-模擬網絡延遲)
- [常見問題](#常見問題)
  - [Q1: 如何在生產環境禁用 Mock？](#q1-如何在生產環境禁用-mock)
  - [Q2: 如何模擬分頁數據？](#q2-如何模擬分頁數據)
  - [Q3: 如何模擬文件上傳？](#q3-如何模擬文件上傳)
  - [Q4: 如何模擬 Token 驗證？](#q4-如何模擬-token-驗證)
  - [Q5: 如何模擬長時間請求？](#q5-如何模擬長時間請求)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/mock` Mock 數據服務的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/mock ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [創建 Mock 數據](#創建-mock-數據)
  - [MockRequest 接口](#mockrequest-接口)
  - [模擬錯誤](#模擬錯誤)
  - [模擬延遲](#模擬延遲)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/mock` 是 ng-alain 框架提供的 Mock 數據服務，用於開發環境模擬 API 響應。可以快速創建 Mock 數據，無需依賴後端 API。

### 核心特點

- **開發環境專用**：僅在開發環境使用，生產環境自動禁用
- **簡單易用**：通過配置對象快速創建 Mock 數據
- **支持多種 HTTP 方法**：支持 GET、POST、PUT、DELETE 等
- **模擬錯誤**：支持模擬各種錯誤情況
- **模擬延遲**：支持模擬網絡延遲

- --

## 安裝與導入

### 安裝

`@delon/mock` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/mock": "^20.1.0"
  }
}
```

### 配置

在 `environment.ts` 中配置 Mock 服務（僅開發環境）：

**實際使用案例**：

```1:26:src/environments/environment.ts
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as MOCKDATA from '@_mock';
import { mockInterceptor, provideMockConfig } from '@delon/mock';
import { Environment } from '@delon/theme';

export const environment = {
  production: false,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  supabase: {
    url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
    storage: {
      documentBucket: 'blueprint-documents'
    }
  },
  providers: [provideMockConfig({ data: MOCKDATA })],
  interceptorFns: [mockInterceptor]
} as Environment;
```

在 `app.config.ts` 中使用：

```typescript
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    ...(environment.providers || []), // 包含 Mock 配置
    // ...
  ],
};
```

- --

## 配置

### 配置選項

| 選項 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `data` | Mock 數據對象 | `any` | `{}` |
| `delay` | 模擬延遲（毫秒） | `number` | `0` |
| `log` | 是否打印日誌 | `boolean` | `true` |
| `executeOtherInterceptors` | 是否執行其他攔截器 | `boolean` | `true` |

- --

## 主要功能

### 創建 Mock 數據

在 `_mock` 目錄下創建 Mock 數據文件：

```typescript
// _mock/_user.ts
import { MockRequest } from '@delon/mock';

export const USERS = {
  'GET /api/users': (req: MockRequest) => {
    return {
      code: 200,
      data: [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ],
      msg: 'success',
    };
  },
  'GET /api/users/:id': (req: MockRequest) => {
    const id = req.params.id;
    return {
      code: 200,
      data: { id: +id, name: `User ${id}`, email: `user${id}@example.com` },
      msg: 'success',
    };
  },
  'POST /api/users': (req: MockRequest) => {
    return {
      code: 200,
      data: { id: Date.now(), ...req.body },
      msg: 'success',
    };
  },
  'PUT /api/users/:id': (req: MockRequest) => {
    return {
      code: 200,
      data: { id: req.params.id, ...req.body },
      msg: 'success',
    };
  },
  'DELETE /api/users/:id': (req: MockRequest) => {
    return {
      code: 200,
      data: { id: req.params.id },
      msg: 'success',
    };
  },
};
```

### 導出 Mock 數據

在 `_mock/index.ts` 中導出所有 Mock 數據：

**實際使用案例**：

```1:7:_mock/index.ts
export * from './_profile';
export * from './_rule';
export * from './_api';
export * from './_chart';
export * from './_pois';
export * from './_user';
export * from './_geo';
```

- --

### MockRequest 接口

```typescript
interface MockRequest {
  method: string; // HTTP 方法
  url: string; // 請求 URL
  headers: any; // 請求頭
  body: any; // 請求體
  query: any; // 查詢參數
  params: any; // 路徑參數
  original: any; // 原始請求對象
}
```

- --

### 模擬錯誤

使用 `MockStatusError` 模擬各種錯誤情況：

```typescript
import { MockStatusError } from '@delon/mock';

export const ERRORS = {
  'GET /api/error': () => {
    throw new MockStatusError(500, '服務器錯誤');
  },
  'GET /api/not-found': () => {
    throw new MockStatusError(404, '資源不存在');
  },
  'GET /api/unauthorized': () => {
    throw new MockStatusError(401, '未授權');
  },
};
```

- --

### 模擬延遲

在配置中設置延遲：

```typescript
provideMockConfig({
  data: MOCKDATA,
  delay: 300, // 模擬 300ms 延遲
})
```

- --

## 實際使用示例

### 示例 1：基本 Mock

```typescript
// _mock/_api.ts
import { MockRequest } from '@delon/mock';

export const API = {
  'GET /api/data': (req: MockRequest) => {
    return {
      code: 200,
      data: { message: 'Hello World' },
      msg: 'success',
    };
  },
};
```

### 示例 2：帶參數的 Mock

```typescript
// _mock/_user.ts
import { MockRequest } from '@delon/mock';

export const USERS = {
  'GET /api/users/:id': (req: MockRequest) => {
    const id = req.params.id;
    return {
      code: 200,
      data: { id: +id, name: `User ${id}` },
      msg: 'success',
    };
  },
};
```

### 示例 3：查詢參數

```typescript
// _mock/_list.ts
import { MockRequest } from '@delon/mock';

export const LIST = {
  'GET /api/users': (req: MockRequest) => {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const total = 100;

    const start = (page - 1) * size;
    const end = start + size;

    return {
      code: 200,
      data: {
        list: Array.from({ length: size }, (_, i) => ({
          id: start + i + 1,
          name: `User ${start + i + 1}`,
        })),
        total,
        page,
        size,
      },
      msg: 'success',
    };
  },
};
```

### 示例 4：POST 請求

```typescript
// _mock/_create.ts
import { MockRequest } from '@delon/mock';

export const CREATE = {
  'POST /api/users': (req: MockRequest) => {
    return {
      code: 200,
      data: {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
      },
      msg: 'success',
    };
  },
};
```

### 示例 5：條件響應

```typescript
// _mock/_conditional.ts
import { MockRequest, MockStatusError } from '@delon/mock';

export const CONDITIONAL = {
  'GET /api/data': (req: MockRequest) => {
    const type = req.query.type;

    if (type === 'error') {
      throw new MockStatusError(400, '請求錯誤');
    }

    if (type === 'empty') {
      return {
        code: 200,
        data: [],
        msg: 'success',
      };
    }

    return {
      code: 200,
      data: { type },
      msg: 'success',
    };
  },
};
```

- --

## 最佳實踐

### 1. 僅在開發環境使用

```typescript
// ✅ 推薦：僅在開發環境啟用
export const environment = {
  production: false,
  providers: [
    provideMockConfig({ data: MOCKDATA })
  ]
};

// ❌ 錯誤：生產環境不應啟用 Mock
export const environment = {
  production: true,
  providers: [
    provideMockConfig({ data: MOCKDATA }) // 不應該在生產環境使用
  ]
};
```

### 2. 數據結構一致性

Mock 數據應與實際 API 響應結構保持一致：

```typescript
// ✅ 推薦：與實際 API 結構一致
{
  code: 200,
  data: { id: 1, name: 'User 1' },
  msg: 'success'
}

// ❌ 錯誤：結構不一致
{
  id: 1,
  name: 'User 1'
}
```

### 3. 使用類型定義

```typescript
// ✅ 推薦：使用類型定義
interface User {
  id: number;
  name: string;
  email: string;
}

export const USERS = {
  'GET /api/users': (req: MockRequest): { code: number; data: User[]; msg: string } => {
    return {
      code: 200,
      data: [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
      ],
      msg: 'success',
    };
  },
};
```

### 4. 模擬錯誤情況

```typescript
// ✅ 推薦：模擬各種錯誤情況
import { MockStatusError } from '@delon/mock';

export const ERRORS = {
  'GET /api/error': () => {
    throw new MockStatusError(500, '服務器錯誤');
  },
  'GET /api/not-found': () => {
    throw new MockStatusError(404, '資源不存在');
  },
};
```

### 5. 模擬網絡延遲

```typescript
// ✅ 推薦：模擬真實的網絡延遲
provideMockConfig({
  data: MOCKDATA,
  delay: 300, // 300ms 延遲
})
```

- --

## 常見問題

### Q1: 如何在生產環境禁用 Mock？

```typescript
// 在 environment.prod.ts 中不提供 Mock 配置
export const environment = {
  production: true,
  providers: [], // 不包含 Mock 配置
};
```

### Q2: 如何模擬分頁數據？

```typescript
'GET /api/users': (req: MockRequest) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const total = 100;

  const start = (page - 1) * size;
  const end = start + size;

  return {
    code: 200,
    data: {
      list: Array.from({ length: size }, (_, i) => ({
        id: start + i + 1,
        name: `User ${start + i + 1}`,
      })),
      total,
      page,
      size,
    },
    msg: 'success',
  };
}
```

### Q3: 如何模擬文件上傳？

```typescript
'POST /api/upload': (req: MockRequest) => {
  return {
    code: 200,
    data: {
      url: 'https://example.com/file.jpg',
      filename: req.body.filename,
    },
    msg: 'success',
  };
}
```

### Q4: 如何模擬 Token 驗證？

```typescript
'GET /api/protected': (req: MockRequest) => {
  const token = req.headers['Authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    throw new MockStatusError(401, '未授權');
  }

  return {
    code: 200,
    data: { message: 'Protected data' },
    msg: 'success',
  };
}
```

### Q5: 如何模擬長時間請求？

```typescript
// 在配置中設置較長的延遲
provideMockConfig({
  data: MOCKDATA,
  delay: 2000, // 2 秒延遲
})
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/mock 官方文檔](https://ng-alain.com/mock)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/auth](https://ng-alain.com/auth) - 認證服務
- [@delon/util](https://ng-alain.com/util) - 工具函數庫

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
