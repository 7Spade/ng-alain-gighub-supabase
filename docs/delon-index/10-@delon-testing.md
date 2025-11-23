# @delon/testing 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
- [主要功能](#主要功能)
  - [DelonTestingModule - 測試模組](#delontestingmodule---測試模組)
    - [基本用法](#基本用法)
  - [Mock 服務](#mock-服務)
    - [MockAuthService](#mockauthservice)
    - [MockCacheService](#mockcacheservice)
    - [MockACLService](#mockaclservice)
  - [測試工具函數](#測試工具函數)
- [實際使用示例](#實際使用示例)
  - [示例 1：組件測試](#示例-1組件測試)
  - [示例 2：服務測試](#示例-2服務測試)
  - [示例 3：使用測試工具函數](#示例-3使用測試工具函數)
- [最佳實踐](#最佳實踐)
  - [1. 使用 NoopAnimationsModule](#1-使用-noopanimationsmodule)
  - [2. 使用 SHARED_IMPORTS](#2-使用-shared_imports)
  - [3. 使用 Mock 服務](#3-使用-mock-服務)
  - [4. Mock HTTP 請求](#4-mock-http-請求)
- [常見問題](#常見問題)
  - [Q1: 如何測試使用 @delon 組件的組件？](#q1-如何測試使用-delon-組件的組件)
  - [Q2: 如何 Mock AuthService？](#q2-如何-mock-authservice)
  - [Q3: 如何測試國際化功能？](#q3-如何測試國際化功能)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)

---


> 📋 **目的**：詳細說明 `@delon/testing` 測試工具的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/testing ^20.1.0
**相關文檔**：[測試規範](../../.cursor/rules/testing.mdc)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [主要功能](#主要功能)
  - [DelonTestingModule - 測試模組](#delontestingmodule---測試模組)
  - [Mock 服務](#mock-服務)
  - [測試工具函數](#測試工具函數)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/testing` 是 ng-alain 框架提供的測試工具，用於單元測試和集成測試。提供測試模組、Mock 服務和測試工具函數。

### 核心特點

- **測試模組**：提供所有 @delon 組件的測試支持
- **Mock 服務**：提供常用服務的 Mock 實現
- **測試工具**：提供測試輔助函數
- **類型安全**：完整的 TypeScript 類型定義

- --

## 安裝與導入

### 安裝

`@delon/testing` 已包含在專案開發依賴中（`package.json`）：

```json
{
  "devDependencies": {
    "@delon/testing": "^20.1.0"
  }
}
```

**注意**：這是開發依賴，僅在測試環境使用。

- --

## 主要功能

### DelonTestingModule - 測試模組

**導入**：`import { DelonTestingModule } from '@delon/testing';`

提供所有 @delon 組件的測試支持。

#### 基本用法

```typescript
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DelonTestingModule } from '@delon/testing';

describe('ExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DelonTestingModule,
        // 其他需要的模組
      ],
    });
  });
});
```

- --

### Mock 服務

#### MockAuthService

```typescript
import { MockAuthService } from '@delon/testing';
import { AuthService } from '@delon/auth';

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: MockAuthService },
  ],
});

// 在測試中使用
const authService = TestBed.inject(AuthService) as MockAuthService;
authService.setToken('mock-token');
authService.setUser({ id: 1, name: 'Test User' });
```

#### MockCacheService

```typescript
import { MockCacheService } from '@delon/testing';
import { CacheService } from '@delon/cache';

TestBed.configureTestingModule({
  providers: [
    { provide: CacheService, useClass: MockCacheService },
  ],
});
```

#### MockACLService

```typescript
import { MockACLService } from '@delon/testing';
import { ACLService } from '@delon/acl';

TestBed.configureTestingModule({
  providers: [
    { provide: ACLService, useClass: MockACLService },
  ],
});
```

- --

### 測試工具函數

```typescript
import {
  createTestContext,
  TestContext,
  TestComponentContext,
} from '@delon/testing';
```

- --

## 實際使用示例

### 示例 1：組件測試

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DelonTestingModule } from '@delon/testing';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DelonTestingModule,
        SHARED_IMPORTS,
        ExampleComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 示例 2：服務測試

```typescript
import { TestBed } from '@angular/core/testing';
import { DelonTestingModule } from '@delon/testing';
import { AuthService } from '@delon/auth';
import { MockAuthService } from '@delon/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DelonTestingModule],
      providers: [
        MyService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(MyService);
    authService = TestBed.inject(AuthService) as MockAuthService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use mock auth service', () => {
    authService.setToken('mock-token');
    expect(authService.getToken()).toBe('mock-token');
  });
});
```

### 示例 3：使用測試工具函數

```typescript
import { createTestContext } from '@delon/testing';
import { DelonTestingModule } from '@delon/testing';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { ExampleComponent } from './example.component';

describe('Component with @delon components', () => {
  let context: TestContext;

  beforeEach(() => {
    context = createTestContext(ExampleComponent, {
      imports: [DelonTestingModule, SHARED_IMPORTS],
    });
  });

  it('should render', () => {
    expect(context.fixture).toBeTruthy();
  });
});
```

- --

## 最佳實踐

### 1. 使用 NoopAnimationsModule

```typescript
// ✅ 推薦：使用 NoopAnimationsModule
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

TestBed.configureTestingModule({
  imports: [NoopAnimationsModule, DelonTestingModule],
});
```

### 2. 使用 SHARED_IMPORTS

```typescript
// ✅ 推薦：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

TestBed.configureTestingModule({
  imports: [DelonTestingModule, SHARED_IMPORTS],
});
```

### 3. 使用 Mock 服務

```typescript
// ✅ 推薦：使用 Mock 服務
import { MockAuthService } from '@delon/testing';

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: MockAuthService },
  ],
});
```

### 4. Mock HTTP 請求

```typescript
// ✅ 推薦：使用 HttpClientTestingModule
import { HttpClientTestingModule } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  imports: [
    HttpClientTestingModule,
    DelonTestingModule,
  ],
});
```

- --

## 常見問題

### Q1: 如何測試使用 @delon 組件的組件？

```typescript
import { DelonTestingModule } from '@delon/testing';
import { SHARED_IMPORTS } from '@shared/shared-imports';

TestBed.configureTestingModule({
  imports: [DelonTestingModule, SHARED_IMPORTS],
});
```

### Q2: 如何 Mock AuthService？

```typescript
import { MockAuthService } from '@delon/testing';

TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useClass: MockAuthService },
  ],
});

const authService = TestBed.inject(AuthService) as MockAuthService;
authService.setToken('mock-token');
```

### Q3: 如何測試國際化功能？

```typescript
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { MockI18nService } from '@delon/testing';

TestBed.configureTestingModule({
  providers: [
    { provide: ALAIN_I18N_TOKEN, useClass: MockI18nService },
  ],
});
```

- --

## 🔗 相關文檔

- [測試規範](../../.cursor/rules/testing.mdc) - 測試規範與覆蓋率要求
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/testing 官方文檔](https://ng-alain.com/testing)
- [ng-alain 官方文檔](https://ng-alain.com)
- [Angular 測試指南](https://angular.dev/guide/testing)

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
