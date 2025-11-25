# Workspace Context 重構遷移指南

## 📊 重構對比

### 原架構問題

```
❌ 三層架構過度抽象
WorkspaceContextFacade (Core)
    ↓ [純轉發,無業務邏輯]
    ├─→ WorkspaceContextService (Shared)
    └─→ WorkspaceDataService (Shared)

❌ 職責分散
- 上下文狀態在 WorkspaceContextService
- 資料載入在 WorkspaceDataService  
- Facade 只做 proxy 轉發

❌ 重複的 Computed Signals
- allOrganizations 在兩處定義
- teamsByOrganization 在兩處定義

❌ MenuManagementService 過重
- 配置載入
- 緩存管理 (記憶體洩漏風險)
- 參數處理
- 菜單生成
```

### 重構後架構

```
✅ 單一服務整合所有職責
WorkspaceContextService (Core)
    ├─→ 上下文狀態管理
    ├─→ 資料載入
    ├─→ 持久化
    └─→ 自動恢復

✅ MenuManagementService 精簡
    ├─→ 配置載入
    ├─→ 菜單生成
    └─→ 參數處理 (移除緩存)
```

## 🔄 遷移步驟

### 1. 更新注入方式

**Before:**
```typescript
import { WorkspaceContextFacade } from '@core';

export class MyComponent {
  readonly workspace = inject(WorkspaceContextFacade);
}
```

**After:**
```typescript
import { WorkspaceContextService } from '@core';

export class MyComponent {
  readonly workspace = inject(WorkspaceContextService);
}
```

### 2. API 保持相同

所有公開 API 保持不變,無需修改使用代碼:

```typescript
// ✅ 所有這些都繼續工作
workspace.contextType()
workspace.contextId()
workspace.contextLabel()
workspace.contextIcon()
workspace.currentUser()
workspace.organizations()
workspace.teams()
workspace.switchToUser(userId)
workspace.switchToOrganization(orgId)
// ...
```

### 3. 移除舊檔案

```bash
# 刪除不再需要的檔案
rm src/app/shared/services/account/workspace-data.service.ts
rm src/app/core/facades/account/workspace-context.facade.ts
```

### 4. 更新 BaseContextAwareComponent

**Before:**
```typescript
import { WorkspaceContextFacade } from '@core';

protected readonly workspaceContext = inject(WorkspaceContextFacade);
```

**After:**
```typescript
import { WorkspaceContextService } from '@core';

protected readonly workspaceContext = inject(WorkspaceContextService);
```

## 📈 改進效益

### 代碼量減少

| 檔案 | 原始行數 | 重構行數 | 減少 |
|------|---------|---------|------|
| WorkspaceContext | 180 + 130 + 130 | 230 | -210 (-48%) |
| MenuManagement | 280 | 120 | -160 (-57%) |
| **總計** | **720** | **350** | **-370 (-51%)** |

### 效能改進

- ✅ 移除不必要的 proxy 層
- ✅ 減少 Signal 追蹤次數
- ✅ 移除 Menu 緩存 (潛在記憶體洩漏源)
- ✅ 使用 `Promise.allSettled` 並行載入資料

### 可維護性提升

- ✅ 單一真實來源 (Single Source of Truth)
- ✅ 更少的檔案和抽象
- ✅ 更清晰的職責劃分
- ✅ 更容易測試

## 🧪 測試建議

### 單元測試

```typescript
describe('WorkspaceContextService', () => {
  let service: WorkspaceContextService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkspaceContextService,
        { provide: DA_SERVICE_TOKEN, useValue: mockTokenService },
        { provide: AccountService, useValue: mockAccountService },
        // ...
      ]
    });
    service = TestBed.inject(WorkspaceContextService);
  });

  it('should load workspace data', async () => {
    await service.loadWorkspaceData('auth-user-id');
    expect(service.currentUser()).toBeTruthy();
  });

  it('should switch context', () => {
    service.switchToUser('user-123');
    expect(service.contextType()).toBe(ContextType.USER);
    expect(service.contextId()).toBe('user-123');
  });
});
```

## ⚠️ 注意事項

### 破壞性變更

1. **Import 路徑變更**
   - `WorkspaceContextFacade` → `WorkspaceContextService`
   - 從 `@core/facades` → `@core/services`

2. **API 移除**
   - `loadWorkspaceData()` 現在是私有方法 (自動觸發)

### 向後兼容

如果需要暫時保持向後兼容,可以建立一個 deprecated facade:

```typescript
/**
 * @deprecated Use WorkspaceContextService directly
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceContextFacade {
  private readonly service = inject(WorkspaceContextService);
  
  // Proxy all methods
  readonly contextType = this.service.contextType;
  readonly contextId = this.service.contextId;
  // ...
}
```

## 🎯 檢查清單

在完成遷移後,確認:

- [ ] 所有組件都使用新的 `WorkspaceContextService`
- [ ] 移除了舊的 facade 和 data service 檔案
- [ ] 更新了所有 import 路徑
- [ ] 單元測試通過
- [ ] E2E 測試通過
- [ ] 上下文切換功能正常
- [ ] 菜單顯示正確
- [ ] localStorage 持久化工作正常

## 📚 相關資源

- [Angular Signals 最佳實踐](https://angular.dev/guide/signals)
- [奧卡姆剃刀原則](https://en.wikipedia.org/wiki/Occam%27s_razor)
- [SOLID 原則](https://en.wikipedia.org/wiki/SOLID)
