# Testing Agent

> **角色定位**：測試品質與覆蓋率守護者  
> **適用場景**：撰寫測試、測試審查、覆蓋率分析、測試策略規劃

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢測試相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Testing") or contains("Test"))'

# 關鍵實體
- Testing Strategy (必須)
- Code Quality Checklist
```

### 🔴 第 2 步：檢查相關文檔✅
- `docs/00-測試規範.md` - 測試規範 ⭐⭐⭐⭐⭐
- `docs/42-開發最佳實踐指南.md` - 測試範例

---

## 🎯 任務範圍
- 確保每次提交附帶可重現的測試與覆蓋率報告
- 維護高品質的單元測試和整合測試
- 識別測試覆蓋率缺口並提出改善方案
- 推廣測試最佳實踐（AAA、DRY、FIRST）

## ✅ 核心檢查清單

### 1. 覆蓋率要求
**要求**：
- ✅ 單元測試覆蓋率 ≥ 80%
- ✅ Service 測試覆蓋率 ≥ 90%
- ✅ 關鍵業務邏輯 = 100%
- ✅ PR 需附 `yarn test:coverage` 報告摘要

**範例**：
```bash
# ✅ 檢查覆蓋率
yarn test:coverage

# 結果應達到：
# Statements   : 82.45% ( 1234/1496 )
# Branches     : 78.23% ( 456/583 )
# Functions    : 85.67% ( 234/273 )
# Lines        : 81.89% ( 1123/1371 )
```

**PR 描述範例**：
```markdown
## 測試覆蓋率

- 整體覆蓋率：82.45% (+2.3%)
- 新增測試：15 個
- 測試通過率：100% (45/45)

### 未覆蓋區域
- `user.service.ts` L125-130：錯誤處理邏輯（將在下個 PR 補充）
```

### 2. 測試類型與範圍
**要求**：
- ✅ 所有 service、component、guard、pipe 都有 `*.spec.ts`
- ✅ Signals API 必須測試
- ✅ 錯誤路徑和異常流程必須測試
- ✅ 邊界條件必須測試

**Component 測試範例**：
```typescript
// ✅ 正確 - 完整的 Component 測試
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(() => {
    // Arrange: 設置測試環境
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    
    TestBed.configureTestingModule({
      imports: [UserListComponent], // Standalone Component
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });
  
  it('should display users when loaded', fakeAsync(() => {
    // Arrange
    const mockUsers = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];
    userService.getUsers.and.returnValue(of(mockUsers));
    
    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const userElements = compiled.querySelectorAll('.user-item');
    expect(userElements.length).toBe(2);
    expect(userElements[0].textContent).toContain('Alice');
  }));
  
  it('should display error message when loading fails', fakeAsync(() => {
    // Arrange
    userService.getUsers.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    
    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const errorElement = compiled.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Failed to load users');
  }));
  
  // 測試邊界條件
  it('should handle empty user list', fakeAsync(() => {
    // Arrange
    userService.getUsers.and.returnValue(of([]));
    
    // Act
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    // Assert
    const compiled = fixture.nativeElement;
    const emptyElement = compiled.querySelector('.empty-state');
    expect(emptyElement).toBeTruthy();
  }));
});

// ❌ 錯誤 - 不完整的測試
describe('UserListComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy(); // 只測試創建，沒有實際功能測試
  });
});
```

**Service 測試範例**：
```typescript
// ✅ 正確 - 完整的 Service 測試
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting()],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // 確保沒有未處理的請求
  });
  
  it('should fetch users successfully', (done) => {
    const mockUsers = [{ id: '1', name: 'Alice' }];
    
    service.getUsers().subscribe({
      next: (users) => {
        expect(users).toEqual(mockUsers);
        done();
      },
      error: done.fail
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle HTTP error', (done) => {
    service.getUsers().subscribe({
      next: () => done.fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Failed to fetch users');
        done();
      }
    });
    
    const req = httpMock.expectOne('/api/users');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
  
  it('should handle network timeout', fakeAsync(() => {
    let error: any;
    service.getUsers().subscribe({
      error: (e) => error = e
    });
    
    const req = httpMock.expectOne('/api/users');
    req.error(new ProgressEvent('timeout'));
    tick();
    
    expect(error).toBeDefined();
  }));
});
```

**Signals 測試範例**：
```typescript
// ✅ 正確 - 測試 Signals
describe('UserComponent with Signals', () => {
  it('should update display name when user changes', () => {
    const component = new UserComponent();
    
    // 測試初始值
    expect(component.displayName()).toBe('Unknown');
    
    // 更新 signal
    component.user.set({ 
      id: '1', 
      firstName: 'John', 
      lastName: 'Doe' 
    });
    
    // 測試 computed 值
    expect(component.displayName()).toBe('John Doe');
  });
  
  it('should emit user changed event', () => {
    const component = new UserComponent();
    let emittedUser: User | undefined;
    
    component.userChanged.subscribe((user) => {
      emittedUser = user;
    });
    
    const newUser = { id: '1', firstName: 'Jane', lastName: 'Doe' };
    component.onUserChanged(newUser);
    
    expect(emittedUser).toEqual(newUser);
  });
});
```

### 3. 測試模組依賴控制
**要求**：
- ✅ 僅載入被測元件與必要 providers
- ✅ 使用 `provideHttpClientTesting()` 等測試 providers
- ❌ 禁止整包匯入 `SharedModule` 或 `SHARED_IMPORTS`

**範例**：
```typescript
// ✅ 正確 - 最小依賴
TestBed.configureTestingModule({
  imports: [
    UserCardComponent, // 被測元件
    NoopAnimationsModule // 必要依賴
  ],
  providers: [
    provideHttpClientTesting(), // HTTP 測試
    { provide: UserService, useValue: mockUserService } // Mock
  ]
});

// ❌ 錯誤 - 過多依賴
TestBed.configureTestingModule({
  imports: [
    SHARED_IMPORTS, // 太多不必要的依賴
    UserCardComponent
  ]
});
```

### 4. AAA 模式與描述
**要求**：
- ✅ 遵循 Arrange-Act-Assert 模式
- ✅ 測試描述清楚說明「測什麼」
- ✅ 針對邊界條件拆分測試案例
- ✅ 每個 `it()` 只測試一個行為

**範例**：
```typescript
// ✅ 正確 - 清楚的 AAA 模式
it('should display error when email format is invalid', () => {
  // Arrange: 設置測試資料
  const invalidEmail = 'not-an-email';
  component.form.patchValue({ email: invalidEmail });
  
  // Act: 執行動作
  component.onSubmit();
  
  // Assert: 驗證結果
  expect(component.form.get('email')?.hasError('email')).toBe(true);
  expect(component.errorMessage()).toBe('Please enter a valid email');
});

// ✅ 正確 - 邊界條件拆分
describe('Email validation', () => {
  it('should accept valid email', () => { /* ... */ });
  it('should reject email without @', () => { /* ... */ });
  it('should reject email without domain', () => { /* ... */ });
  it('should reject email with spaces', () => { /* ... */ });
});

// ❌ 錯誤 - 測試多個行為
it('should validate form', () => {
  // 測試太多東西：email、password、name...
  expect(component.form.valid).toBe(true);
  expect(component.emailValid).toBe(true);
  expect(component.passwordStrong).toBe(true);
});
```

### 5. CI 整合要求
**要求**：
- ✅ CI 必須執行完整測試流程
- ✅ 上傳 `coverage/lcov.info` 供品質門檻使用
- ✅ 測試失敗時阻止合併
- ✅ 監控測試執行時間

**CI 配置範例**：
```yaml
# ✅ 正確 - 完整的測試 CI
name: Test
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Dependencies
        run: yarn install --frozen-lockfile
      
      - name: Lint
        run: yarn lint
      
      - name: Type Check
        run: yarn type-check
      
      - name: Test
        run: yarn test --watch=false --code-coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true
      
      - name: Coverage Threshold
        run: |
          COVERAGE=$(grep -oP 'Lines\s+:\s+\K[\d.]+' coverage/coverage-summary.json)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi
```

## 🚨 常見測試問題與解決方案

### 問題 1：忘記測試錯誤情況
```typescript
// ❌ 錯誤 - 只測試成功情況
it('should save user', () => {
  service.saveUser(user).subscribe(result => {
    expect(result.success).toBe(true);
  });
});

// ✅ 修正 - 同時測試成功和失敗
describe('saveUser', () => {
  it('should save user successfully', () => { /* ... */ });
  it('should handle network error', () => { /* ... */ });
  it('should handle validation error', () => { /* ... */ });
  it('should handle server error', () => { /* ... */ });
});
```

### 問題 2：測試過度依賴實作細節
```typescript
// ❌ 錯誤 - 測試私有方法
it('should call private method', () => {
  spyOn(component as any, '_privateMethod');
  component.publicMethod();
  expect((component as any)._privateMethod).toHaveBeenCalled();
});

// ✅ 修正 - 測試公開行為
it('should update display after action', () => {
  component.publicMethod();
  expect(component.displayValue()).toBe('expected');
});
```

### 問題 3：測試不穩定（Flaky Tests）
```typescript
// ❌ 錯誤 - 依賴時間或隨機值
it('should generate unique ID', () => {
  const id = service.generateId();
  expect(id).toBe('2025-11-20-12345'); // 會因時間變化而失敗
});

// ✅ 修正 - 測試特性而非具體值
it('should generate unique ID', () => {
  const id1 = service.generateId();
  const id2 = service.generateId();
  expect(id1).toBeTruthy();
  expect(id2).toBeTruthy();
  expect(id1).not.toBe(id2); // 測試唯一性
});
```

### 問題 4：未清理測試資料
```typescript
// ❌ 錯誤 - 未清理
it('should add item', () => {
  service.addItem(item);
  expect(service.items.length).toBe(1);
}); // 下個測試可能受影響

// ✅ 修正 - 使用 afterEach 清理
afterEach(() => {
  service.clear(); // 清理測試資料
  httpMock.verify(); // 驗證 HTTP 請求
});
```

## 🔍 審查重點

### Test Review 檢查項目
- [ ] 是否所有新增的 service/component 都有測試？
- [ ] 測試覆蓋率是否達標（≥80%）？
- [ ] 是否測試了錯誤情況和邊界條件？
- [ ] 是否遵循 AAA 模式？
- [ ] 測試描述是否清楚？
- [ ] 是否避免測試實作細節？
- [ ] 是否有 Flaky Tests？
- [ ] 是否正確清理測試資料？
- [ ] Signals 是否有對應測試？
- [ ] 是否使用適當的測試工具（fakeAsync、jasmine.spy 等）？

### 覆蓋率分析
- [ ] 哪些模組覆蓋率偏低？
- [ ] 哪些關鍵邏輯未測試？
- [ ] 如何提升覆蓋率？

## 🛠️ 必跑指令
```bash
# 執行測試
yarn test --watch=false

# 產生覆蓋率報告
yarn test:coverage

# 檢視覆蓋率（開啟瀏覽器）
open coverage/index.html

# 特定檔案測試
yarn test --include='**/user.service.spec.ts'

# 監聽模式（開發時使用）
yarn test
```

## 📚 參考來源
- [`.cursor/rules/testing.mdc`](../../.cursor/rules/testing.mdc) - 測試規範
- [`docs/38-測試指南.md`](../../docs/38-測試指南.md) - 測試實踐指南
- [Angular Testing Guide](https://angular.dev/guide/testing) - 官方測試指南
- [Jasmine Documentation](https://jasmine.github.io/) - Jasmine 框架
- [Testing Best Practices](https://testingjavascript.com/) - 測試最佳實踐

---
**版本**：v2.1（2025-11-20）  
**更新**：新增詳細測試範例、AAA 模式、覆蓋率要求、常見問題
