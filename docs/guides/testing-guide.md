# 測試指南


> **📚 目的**: 定義完整的測試策略，涵蓋單元測試、整合測試與 E2E 測試

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 測試工程師

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [測試概述](#測試概述)
  - [測試類型](#測試類型)
  - [測試工具](#測試工具)
  - [測試覆蓋率要求](#測試覆蓋率要求)
- [Git-like 與暫存測試場景](#git-like-與暫存測試場景)
- [單元測試](#單元測試)
  - [基本結構](#基本結構)
  - [測試純函數](#測試純函數)
- [組件測試](#組件測試)
  - [基本組件測試](#基本組件測試)
  - [測試組件互動](#測試組件互動)
  - [測試表單](#測試表單)
- [服務測試](#服務測試)
  - [基本服務測試](#基本服務測試)
  - [測試服務依賴](#測試服務依賴)
  - [測試 Repository](#測試-repository)
- [E2E 測試](#e2e-測試)
  - [Playwright 基本測試](#playwright-基本測試)
  - [測試用戶流程](#測試用戶流程)
  - [Git-like / 暫存 E2E 場景](#git-like--暫存-e2e-場景)
- [Mock 資料使用](#mock-資料使用)
  - [Mock Service](#mock-service)
  - [Mock HTTP 回應](#mock-http-回應)
  - [Mock Supabase](#mock-supabase)
- [測試覆蓋率](#測試覆蓋率)
  - [執行測試覆蓋率](#執行測試覆蓋率)
  - [覆蓋率要求](#覆蓋率要求)
  - [檢查覆蓋率](#檢查覆蓋率)
- [測試最佳實踐](#測試最佳實踐)
  - [1. 測試命名](#1-測試命名)
  - [2. 測試結構（AAA 模式）](#2-測試結構aaa-模式)
  - [3. 測試隔離](#3-測試隔離)
  - [4. Mock 外部依賴](#4-mock-外部依賴)
  - [5. 測試邊界條件](#5-測試邊界條件)
  - [6. 測試錯誤處理](#6-測試錯誤處理)
  - [7. 使用測試工具](#7-使用測試工具)
- [測試範例](#測試範例)
  - [完整服務測試範例](#完整服務測試範例)
  - [完整組件測試範例](#完整組件測試範例)
- [執行測試](#執行測試)
  - [開發模式（監聽模式）](#開發模式監聽模式)
  - [單次執行](#單次執行)
  - [執行特定測試](#執行特定測試)
  - [生成覆蓋率報告](#生成覆蓋率報告)
- [測試遷移：從 NgModule 到 Standalone](#測試遷移從-ngmodule-到-standalone)
  - [測試配置對比](#測試配置對比)
  - [測試遷移步驟](#測試遷移步驟)
  - [測試遷移完整範例](#測試遷移完整範例)
    - [NgModule 測試（舊）](#ngmodule-測試舊)
    - [Standalone 測試（新）](#standalone-測試新)
  - [測試遷移常見問題](#測試遷移常見問題)
    - [Q1: 測試中如何 Mock Standalone 組件的依賴？](#q1-測試中如何-mock-standalone-組件的依賴)
    - [Q2: 如何測試使用 Signals 的組件？](#q2-如何測試使用-signals-的組件)
    - [Q3: 如何測試使用 inject() 的組件？](#q3-如何測試使用-inject-的組件)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：提供完整的測試寫法指南，確保程式碼品質和減少 Bug

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [測試概述](#測試概述)
- [單元測試](#單元測試)
- [組件測試](#組件測試)
- [服務測試](#服務測試)
- [E2E 測試](#e2e-測試)
- [Mock 資料使用](#mock-資料使用)
- [測試覆蓋率](#測試覆蓋率)
- [測試最佳實踐](#測試最佳實踐)

**參考文檔**：
- [開發作業指引](./specs/00-development-guidelines.md) - 測試規範
- [開發工作流程](./35-開發工作流程.md) - 測試階段流程

- --

## 測試概述

### 測試類型

專案使用以下測試類型：

1. **單元測試** - 測試單一函數、方法或類別
2. **組件測試** - 測試 Angular 組件的行為
3. **服務測試** - 測試服務的業務邏輯
4. **E2E 測試** - 測試完整的用戶流程

### 測試工具

- **Jest/Karma** - 單元測試框架
- **Angular Testing Utilities** - Angular 測試工具
- **Playwright** - E2E 測試框架

### 測試覆蓋率要求

- **服務類別**：≥ 80% 覆蓋率
- **關鍵業務邏輯**：100% 覆蓋率
- **組件**：≥ 80% 覆蓋率（關鍵組件）
- **Git-like/暫存流程**：PR Merge、staging 決策、Edge Functions 需 100% 覆蓋率（屬風險控管流程）

- --

## Git-like 與暫存測試場景

1. **Fork / 分支建立**：模擬 `branch_forks` + `blueprint_branches` REST 呼叫，驗證 RLS + branch_roles 行為。
2. **Pull Request 審查**：使用服務測試 + Edge Function 單元測試檢查 `branch-merge` 回傳錯誤碼（`branch.merge.conflict`）。
3. **暫存區 (staging_submissions)**：
   - 驗證 48h 到期機制（使用 fake timers）。
   - 測試撤回 (`recalled=true`) 與確認 (`finalized=true`) 行為。
4. **待辦中心/暫存 UI**：組件測試應涵蓋「撤回」按鈕與錯誤提示。
5. **Supabase MCP**：在 `scripts/test-data.seed.ts` 或測試前置步驟中使用 MCP 指令重置測試資料，確保資料一致。

- --

## 單元測試

### 基本結構

```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform action correctly', () => {
    const result = service.performAction();
    expect(result).toBe(expectedValue);
  });
});
```

### 測試純函數

```typescript
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 3 }
    ];
    const total = calculateTotal(items);
    expect(total).toBe(80);
  });

  it('should return 0 for empty array', () => {
    const total = calculateTotal([]);
    expect(total).toBe(0);
  });
});
```

- --

## 組件測試

### 基本組件測試

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';
import { SHARED_IMPORTS } from '@shared/shared-imports';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent, SHARED_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data correctly', () => {
    component.data.set([{ id: '1', name: 'Test' }]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.data-item')).toBeTruthy();
    expect(compiled.textContent).toContain('Test');
  });
});
```

### 測試組件互動

```typescript
it('should handle button click', () => {
  const button = fixture.nativeElement.querySelector('button');
  spyOn(component, 'onButtonClick');

  button.click();
  fixture.detectChanges();

  expect(component.onButtonClick).toHaveBeenCalled();
});

it('should update signal on input change', () => {
  const input = fixture.nativeElement.querySelector('input');
  input.value = 'new value';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();

  expect(component.inputValue()).toBe('new value');
});
```

### 測試表單

```typescript
import { FormBuilder } from '@angular/forms';

it('should validate form correctly', () => {
  const form = component.form;

  expect(form.valid).toBeFalsy();

  form.patchValue({
    email: 'test@example.com',
    password: 'password123'
  });

  expect(form.valid).toBeTruthy();
});

it('should show validation errors', () => {
  const emailControl = component.form.get('email');
  emailControl?.markAsTouched();
  emailControl?.setValue('');
  fixture.detectChanges();

  const errorElement = fixture.nativeElement.querySelector('.error-message');
  expect(errorElement).toBeTruthy();
});
```

- --

## 服務測試

### 基本服務測試

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = { id: '1', name: 'Test' };

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

### 測試服務依賴

```typescript
import { inject } from '@angular/core';
import { ErrorStateService } from '@core/net';

describe('MyService', () => {
  let service: MyService;
  let errorService: jasmine.SpyObj<ErrorStateService>;

  beforeEach(() => {
    const errorServiceSpy = jasmine.createSpyObj('ErrorStateService', ['addError']);

    TestBed.configureTestingModule({
      providers: [
        MyService,
        { provide: ErrorStateService, useValue: errorServiceSpy }
      ]
    });
    service = TestBed.inject(MyService);
    errorService = TestBed.inject(ErrorStateService) as jasmine.SpyObj<ErrorStateService>;
  });

  it('should handle error correctly', () => {
    service.performAction().catch(() => {
      expect(errorService.addError).toHaveBeenCalled();
    });
  });
});
```

### 測試 Repository

```typescript
import { TestBed } from '@angular/core/testing';
import { BlueprintRepository } from './blueprint.repository';
import { SupabaseService } from '@core/supabase';

describe('BlueprintRepository', () => {
  let repository: BlueprintRepository;
  let supabaseService: jasmine.SpyObj<SupabaseService>;

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['from', 'select']);

    TestBed.configureTestingModule({
      providers: [
        BlueprintRepository,
        { provide: SupabaseService, useValue: supabaseSpy }
      ]
    });
    repository = TestBed.inject(BlueprintRepository);
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  it('should fetch blueprints', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    supabaseService.from.and.returnValue({
      select: jasmine.createSpy('select').and.returnValue({
        eq: jasmine.createSpy('eq').and.returnValue(Promise.resolve({ data: mockData, error: null }))
      })
    } as any);

    const result = await repository.getBlueprints('org-1');
    expect(result.data).toEqual(mockData);
  });
});
```

- --

## E2E 測試

### Playwright 基本測試

```typescript
import { test, expect } from '@playwright/test';

test('should load blueprint list', async ({ page }) => {
  await page.goto('/blueprints');

  // 等待頁面載入
  await page.waitForSelector('.blueprint-list');

  // 驗證內容
  const title = await page.textContent('h1');
  expect(title).toContain('藍圖列表');
});

test('should create new blueprint', async ({ page }) => {
  await page.goto('/blueprints');

  // 點擊建立按鈕
  await page.click('button:has-text("建立藍圖")');

  // 填寫表單
  await page.fill('input[name="name"]', '新專案');
  await page.fill('input[name="slug"]', 'new-project');

  // 提交表單
  await page.click('button[type="submit"]');

  // 驗證結果
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 測試用戶流程

```typescript
test('complete user flow: login -> create blueprint -> add task', async ({ page }) => {
  // 1. 登入
  await page.goto('/passport/login');
  await page.fill('input[type="email"]', 'user@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // 2. 建立藍圖
  await page.goto('/blueprints/create');
  await page.fill('input[name="name"]', '測試專案');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/blueprints\/.*/);

  // 3. 新增任務
  await page.click('button:has-text("新增任務")');
  await page.fill('input[name="title"]', '測試任務');
  await page.click('button[type="submit"]');

  // 4. 驗證任務已建立
  await expect(page.locator('.task-item')).toContainText('測試任務');
});
```

### Git-like / 暫存 E2E 場景

```typescript
test('branch workflow: fork -> PR -> merge', async ({ page, request }) => {
  // Fork
  const forkRes = await request.post('/rest/v1/branch_forks', {
    data: { blueprint_id: BP_ID, contractor_org_id: ORG_ID, scope: '結構體驗收' },
    headers: authHeaders
  });
  expect(forkRes.ok()).toBeTruthy();
  const { id: forkId } = await forkRes.json();

  // 建立分支
  await request.post('/rest/v1/blueprint_branches', {
    data: { fork_id: forkId, organization_id: ORG_ID, branch_type: 'org' },
    headers: authHeaders
  });

  // PR
  const prRes = await request.post('/rest/v1/pull_requests', {
    data: { branch_id: BRANCH_ID, blueprint_id: BP_ID, payload: { daily_reports: [...], quality_checks: [...] } },
    headers: authHeaders
  });
  expect(prRes.ok()).toBeTruthy();

  // 審查 + 合併
  await request.post('/rest/v1/pull_request_reviews', { data: { pull_request_id: PR_ID, decision: 'approved' }, headers: ownerHeaders });
  const merge = await request.post('/functions/v1/branch-merge', { data: { pull_request_id: PR_ID }, headers: ownerHeaders });
  expect(merge.ok()).toBeTruthy();
});

test('staging submission recall within 48h', async ({ request }) => {
  const staging = await request.post('/rest/v1/staging_submissions', {
    data: { task_id: TASK_ID, submission_type: 'daily_report', payload: { work_hours: 8 } },
    headers: authHeaders
  });
  const { id } = await staging.json();

  // 撤回
  const recall = await request.patch(`/rest/v1/staging_submissions?id=eq.${id}`, {
    data: { recalled: true },
    headers: authHeaders
  });
  expect(recall.ok()).toBeTruthy();
});
```

- --

## Mock 資料使用

### Mock Service

```typescript
class MockUserService {
  getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(
    Promise.resolve({ id: '1', name: 'Test User' })
  );
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: UserService, useClass: MockUserService }
    ]
  });
});
```

### Mock HTTP 回應

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

it('should handle HTTP error', () => {
  service.getData().subscribe({
    next: () => fail('should have failed'),
    error: (error) => {
      expect(error.status).toBe(404);
    }
  });

  const req = httpMock.expectOne('/api/data');
  req.flush('Not Found', { status: 404, statusText: 'Not Found' });
});
```

### Mock Supabase

```typescript
const mockSupabase = {
  from: jasmine.createSpy('from').and.returnValue({
    select: jasmine.createSpy('select').and.returnValue({
      eq: jasmine.createSpy('eq').and.returnValue({
        single: jasmine.createSpy('single').and.returnValue(
          Promise.resolve({ data: mockData, error: null })
        )
      })
    })
  })
};
```

- --

## 測試覆蓋率

### 執行測試覆蓋率

```bash
# 執行測試並生成覆蓋率報告
yarn test-coverage

# 查看覆蓋率報告
# 報告會生成在 coverage/ 目錄
```

### 覆蓋率要求

- **服務類別**：≥ 80%
- **關鍵業務邏輯**：100%
- **組件**：≥ 80%（關鍵組件）
- **工具函數**：100%

### 檢查覆蓋率

```bash
# 查看覆蓋率摘要
yarn test-coverage --code-coverage

# 在瀏覽器中查看詳細報告
open coverage/index.html
```

- --

## 測試最佳實踐

### 1. 測試命名

```typescript
// ✅ 好的測試命名
describe('UserService', () => {
  it('should return user when user exists', () => {});
  it('should throw error when user not found', () => {});
});

// ❌ 不好的測試命名
describe('UserService', () => {
  it('test 1', () => {});
  it('should work', () => {});
});
```

### 2. 測試結構（AAA 模式）

```typescript
it('should calculate total correctly', () => {
  // Arrange（準備）
  const items = [{ price: 10, quantity: 2 }];

  // Act（執行）
  const total = calculateTotal(items);

  // Assert（斷言）
  expect(total).toBe(20);
});
```

### 3. 測試隔離

每個測試應該獨立，不依賴其他測試的狀態：

```typescript
// ✅ 好的做法
beforeEach(() => {
  service = new MyService();
  service.reset(); // 重置狀態
});

// ❌ 不好的做法
let sharedState = {}; // 共享狀態
```

### 4. Mock 外部依賴

```typescript
// ✅ 好的做法
const mockHttp = jasmine.createSpyObj('HttpClient', ['get']);
const service = new MyService(mockHttp);

// ❌ 不好的做法
const service = new MyService(new HttpClient()); // 真實 HTTP 請求
```

### 5. 測試邊界條件

```typescript
describe('calculateTotal', () => {
  it('should handle empty array', () => {});
  it('should handle null values', () => {});
  it('should handle negative numbers', () => {});
  it('should handle very large numbers', () => {});
});
```

### 6. 測試錯誤處理

```typescript
it('should handle error gracefully', () => {
  spyOn(service, 'fetchData').and.returnValue(
    throwError(() => new Error('Network error'))
  );

  service.loadData().subscribe({
    error: (error) => {
      expect(error.message).toBe('Network error');
    }
  });
});
```

### 7. 使用測試工具

```typescript
// 使用 fakeAsync 測試異步操作
import { fakeAsync, tick } from '@angular/core/testing';

it('should update after delay', fakeAsync(() => {
  component.delayedUpdate();
  tick(1000);
  expect(component.updated).toBe(true);
}));
```

- --

## 測試範例

### 完整服務測試範例

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorStateService } from '@core/net';
import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  let service: BlueprintService;
  let httpMock: HttpTestingController;
  let errorService: jasmine.SpyObj<ErrorStateService>;

  beforeEach(() => {
    const errorServiceSpy = jasmine.createSpyObj('ErrorStateService', ['addError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BlueprintService,
        { provide: ErrorStateService, useValue: errorServiceSpy }
      ]
    });
    service = TestBed.inject(BlueprintService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorStateService) as jasmine.SpyObj<ErrorStateService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch blueprints', () => {
    const mockBlueprints = [
      { id: '1', name: 'Blueprint 1' },
      { id: '2', name: 'Blueprint 2' }
    ];

    service.getBlueprints().subscribe(blueprints => {
      expect(blueprints.length).toBe(2);
      expect(blueprints[0].name).toBe('Blueprint 1');
    });

    const req = httpMock.expectOne('/rest/v1/blueprints');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlueprints);
  });

  it('should handle error', () => {
    service.getBlueprints().subscribe({
      next: () => fail('should have failed'),
      error: () => {
        expect(errorService.addError).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/rest/v1/blueprints');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

### 完整組件測試範例

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlueprintListComponent } from './blueprint-list.component';
import { BlueprintService } from './blueprint.service';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { of, throwError } from 'rxjs';

describe('BlueprintListComponent', () => {
  let component: BlueprintListComponent;
  let fixture: ComponentFixture<BlueprintListComponent>;
  let blueprintService: jasmine.SpyObj<BlueprintService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BlueprintService', ['getBlueprints']);

    await TestBed.configureTestingModule({
      imports: [BlueprintListComponent, SHARED_IMPORTS],
      providers: [
        { provide: BlueprintService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlueprintListComponent);
    component = fixture.componentInstance;
    blueprintService = TestBed.inject(BlueprintService) as jasmine.SpyObj<BlueprintService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blueprints on init', () => {
    const mockBlueprints = [{ id: '1', name: 'Test' }];
    blueprintService.getBlueprints.and.returnValue(of(mockBlueprints));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.blueprints().length).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('should display error on load failure', () => {
    blueprintService.getBlueprints.and.returnValue(
      throwError(() => new Error('Load failed'))
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
  });
});
```

- --

## 執行測試

### 開發模式（監聽模式）

```bash
# 執行測試並監聽檔案變更
yarn test

# 或使用 Angular CLI
yarn ng test
```

### 單次執行

```bash
# 執行測試一次（不監聽）
yarn ng test --watch=false
```

### 執行特定測試

```bash
# 執行特定檔案
yarn ng test --include='**/my.service.spec.ts'

# 執行特定測試套件
yarn ng test --grep="MyService"
```

### 生成覆蓋率報告

```bash
# 生成覆蓋率報告
yarn test-coverage

# 查看報告
open coverage/index.html
```

- --

## 測試遷移：從 NgModule 到 Standalone

### 測試配置對比

| 項目 | NgModule 測試 | Standalone 測試 |
|------|--------------|----------------|
| **導入方式** | `imports: [MyModule]` | `imports: [MyComponent, SHARED_IMPORTS]` |
| **組件聲明** | `declarations: [MyComponent]` | 不需要（組件已 Standalone） |
| **Provider 配置** | `providers: [...]` | `providers: [...]`（相同） |
| **測試工具** | `TestBed.configureTestingModule` | `TestBed.configureTestingModule`（相同） |

### 測試遷移步驟

1. **移除 NgModule 導入**
   ```typescript
   // ❌ 移除
   imports: [MyModule]

   // ✅ 改為
   imports: [MyComponent, SHARED_IMPORTS]
   ```

2. **移除 declarations**
   ```typescript
   // ❌ 移除（Standalone 組件不需要）
   declarations: [MyComponent]
   ```

3. **更新 Provider 配置**（如適用）
   ```typescript
   // ✅ 保持不變或使用 provide* 函數
   providers: [MyService]
   ```

4. **更新測試斷言**（如適用）
   ```typescript
   // ✅ 使用 Signals 的測試方式
   expect(component.data()).toEqual(expectedData);
   ```

### 測試遷移完整範例

#### NgModule 測試（舊）

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleModule } from './example.module';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleModule], // ❌ 使用 NgModule
      declarations: [ExampleComponent] // ❌ 需要聲明
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### Standalone 測試（新）

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleComponent } from './example.component';
import { SHARED_IMPORTS } from '@shared/shared-imports';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent, SHARED_IMPORTS] // ✅ 直接導入組件
      // ✅ 不需要 declarations
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 測試遷移常見問題

#### Q1: 測試中如何 Mock Standalone 組件的依賴？

**解決方案**：
```typescript
beforeEach(async () => {
  const mockService = jasmine.createSpyObj('MyService', ['getData']);

  await TestBed.configureTestingModule({
    imports: [MyComponent, SHARED_IMPORTS],
    providers: [
      { provide: MyService, useValue: mockService }
    ]
  }).compileComponents();
});
```

#### Q2: 如何測試使用 Signals 的組件？

**解決方案**：
```typescript
it('should update signal', () => {
  component.data.set([{ id: '1', name: 'Test' }]);
  fixture.detectChanges();

  expect(component.data()).toEqual([{ id: '1', name: 'Test' }]);
});
```

#### Q3: 如何測試使用 inject() 的組件？

**解決方案**：
```typescript
// inject() 在測試中正常工作，無需特殊處理
it('should inject service', () => {
  const service = TestBed.inject(MyService);
  expect(service).toBeTruthy();
});
```

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [重構遷移指南](./46-重構遷移指南.md) - 包含測試遷移詳細說明
- [開發工作流程](./35-開發工作流程.md)
- [常見問題 FAQ](./36-常見問題-FAQ.md)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊


