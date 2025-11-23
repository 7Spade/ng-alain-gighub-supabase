# Routes 模組開發規範（GitHub Copilot Agent 優化版）

## 📑 目錄

- [🎯 Routes 模組職責](#-routes-模組職責)
- [⚡ 快速參考](#-快速參考)
  - [依賴關係](#依賴關係)
  - [關鍵原則](#關鍵原則)
- [📋 核心規範檢查清單](#-核心規範檢查清單)
  - [路由配置](#路由配置)
  - [組件開發（UI 層）](#組件開發ui-層)
  - [業務邏輯層（Service/Facade）](#業務邏輯層servicefacade)
  - [API 設計](#api-設計)
  - [UX 規範](#ux-規範)
- [🧪 測試要求](#-測試要求)
  - [覆蓋率標準](#覆蓋率標準)
  - [測試重點](#測試重點)
- [📚 相關 Cursor 規則](#-相關-cursor-規則)
  - [模組特定規則](#模組特定規則)
  - [通用規則（自動應用）](#通用規則自動應用)
- [🔗 相關文檔](#-相關文檔)
  - [必讀文檔](#必讀文檔)
  - [參考文檔](#參考文檔)
- [💡 AI 助手使用建議](#-ai-助手使用建議)
  - [適合使用的 AI 助手](#適合使用的-ai-助手)
  - [常見 Prompt 範例](#常見-prompt-範例)

---


> 📖 **目的**：為 Routes 模組開發提供 AI 助手友善的規範指引。本模組規範已整合到 Cursor 規則系統（`.cursor/rules/routes-specific.mdc`），規則會自動應用到 `src/app/routes/` 目錄。

## 🎯 Routes 模組職責

Routes 模組是應用程式的**路由層**，包含所有功能頁面：
- 📊 **Dashboard**：儀表板頁面
- 💼 **Pro**：業務功能頁面（用戶、組織、分支、待辦等）
- 🔐 **Passport**：認證頁面（登入、註冊、忘記密碼）
- ⚠️ **Exception**：異常頁面（404, 403, 500）
- 📦 **其他功能模組**：依業務需求擴展

## ⚡ 快速參考

### 依賴關係
```mermaid
❌ 禁止依賴：routes 子模組之間不可互相依賴
```

### 關鍵原則
- **職責分離**：組件只負責展示，業務邏輯放在 Service/Facade
- **懶加載**：所有路由使用懶加載（`loadComponent`）
- **路由守衛**：需要認證的頁面添加 `canActivate` 守衛
- **RESTful 命名**：路由命名遵循 RESTful 風格

## 📋 核心規範檢查清單

### 路由配置
- [ ] 使用懶加載（`loadComponent`）
- [ ] 路由命名遵循 RESTful 風格（複數名詞）
- [ ] 需要認證的路由添加 `canActivate` 守衛
- [ ] 權限控制路由添加 `data: { permission: '...' }`
- [ ] 設定頁面標題（`title` 屬性）
- [ ] 麵包屑配置（`data: { breadcrumb: '...' }`）

```typescript
// ✅ 正確範例：路由配置
export const routes: Routes = [
  {
    path: 'users',
    title: '用戶管理',
    canActivate: [authGuard],
    data: {
      breadcrumb: '用戶管理',
      permission: 'user:read'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./list/user-list.component')
          .then(m => m.UserListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./detail/user-detail.component')
          .then(m => m.UserDetailComponent),
        data: { permission: 'user:read' }
      }
    ]
  }
];
```

### 組件開發（UI 層）
- [ ] 使用 Standalone Components
- [ ] 優先使用 `SHARED_IMPORTS`
- [ ] 使用 `OnPush` 變更檢測策略
- [ ] 從 Facade 注入依賴（不直接注入 Service）
- [ ] 使用 Signals 接收狀態（ReadonlySignal）
- [ ] 組件只處理 UI 展示與用戶交互
- [ ] 實現響應式設計和無障礙功能

```typescript
// ✅ 正確範例：List 頁面組件
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-card nzTitle="用戶列表">
      @if (loading()) {
        <nz-spin />
      } @else if (error()) {
        <nz-alert nzType="error" [nzMessage]="error()!" />
      } @else {
        <nz-table [nzData]="users()">
          @for (user of users(); track user.id) {
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <a [routerLink]="['/users', user.id]">查看</a>
              </td>
            </tr>
          }
        </nz-table>
      }
    </nz-card>
  `
})
export class UserListComponent implements OnInit {
  private facade = inject(UserFacade);

  users = this.facade.users;
  loading = this.facade.loading;
  error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadUsers();
  }
}
```

### 業務邏輯層（Service/Facade）
- [ ] 業務邏輯放在 Service 層（`src/app/shared/services/`）
- [ ] 使用 Facade 模式統一對外接口（`src/app/core/facades/`）
- [ ] 使用 Repository 模式存取資料（`src/app/core/infra/repositories/`）
- [ ] 使用 Signals 管理狀態
- [ ] 完整的錯誤處理與重試邏輯
- [ ] 單元測試覆蓋率 ≥80%

```typescript
// ✅ 正確範例：Facade 層
@Injectable({ providedIn: 'root' })
export class UserFacade {
  private userService = inject(UserService);

  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly users = this.usersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async loadUsers(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const users = await this.userService.getAll();
      this.usersSignal.set(users);
    } catch (error) {
      this.errorSignal.set('載入用戶失敗，請稍後再試');
      console.error('Load users error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
```

### API 設計
- [ ] 使用 Repository 模式（繼承 `BaseRepository`）
- [ ] 統一錯誤處理（`try-catch`）
- [ ] 權限驗證（Supabase RLS 策略）
- [ ] 資料驗證（輸入參數驗證）
- [ ] 回傳型別定義完整

```typescript
// ✅ 正確範例：Repository 層
export class UserRepository extends BaseRepository<
  Database['public']['Tables']['blueprint_users']['Row'],
  Database['public']['Tables']['blueprint_users']['Insert'],
  Database['public']['Tables']['blueprint_users']['Update']
> {
  constructor() {
    super('blueprint_users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }
}
```

### UX 規範
- [ ] **列表頁**：只能查看，不可編輯或刪除
- [ ] **詳情頁**：可編輯和刪除
- [ ] Loading 狀態提示
- [ ] 錯誤訊息友善且可操作
- [ ] 成功操作給予即時反饋
- [ ] 確認對話框（刪除等危險操作）

```typescript
// ✅ 正確範例：刪除確認
async deleteUser(id: string): Promise<void> {
  const modal = this.modal.confirm({
    nzTitle: '確認刪除',
    nzContent: '刪除後無法恢復，確定要刪除這個用戶嗎？',
    nzOnOk: async () => {
      try {
        await this.userFacade.deleteUser(id);
        this.message.success('刪除成功');
        this.router.navigate(['/users']);
      } catch (error) {
        this.message.error('刪除失敗，請稍後再試');
      }
    }
  });
}
```

## 🧪 測試要求

### 覆蓋率標準
- **組件層**：≥80% 覆蓋率（推薦）
- **Service 層**：≥80% 覆蓋率（必須）
- **Facade 層**：≥80% 覆蓋率（必須）
- **關鍵業務邏輯**：100% 覆蓋率（必須）
- **E2E 測試**：覆蓋關鍵流程（推薦）

### 測試重點
- [ ] 組件：狀態顯示、用戶交互、路由導航
- [ ] Service：業務邏輯、錯誤處理、數據轉換
- [ ] Facade：狀態管理、Service 協調、錯誤處理
- [ ] E2E：登入、CRUD 操作、權限控制

## 📚 相關 Cursor 規則

### 模組特定規則
- [Routes 模組特定規範](../../../.cursor/rules/routes-specific.mdc) ⭐ 自動應用

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc)
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc)
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc)
- [API 設計](../../../.cursor/rules/api-design.mdc) ⭐ 重要
- [錯誤處理](../../../.cursor/rules/error-handling.mdc)
- [測試規範](../../../.cursor/rules/testing.mdc)

## 🔗 相關文檔

### 必讀文檔
- [完整開發規範](../../../AGENTS.md) - AI 助手總覽
- [SHARED_IMPORTS 使用指南](../../../docs/37-SHARED_IMPORTS-使用指南.md) ⭐
- [開發最佳實踐指南](../../../docs/42-開發最佳實踐指南.md) ⭐
- [錯誤處理指南](../../../docs/37-錯誤處理指南.md)

### 參考文檔
- [開發工作流程](../../../docs/35-開發工作流程.md)
- [架構說明](../../../docs/fyi-architecture.md) - 分層架構設計
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型
- [上下文脈絡](../../../docs/fyi-context.md) - Git-like 分支模型

## 💡 AI 助手使用建議

### 適合使用的 AI 助手
- **GitHub Copilot**：頁面組件開發、代碼補全
- **Cursor IDE**：即時規則檢查、CRUD 模板生成
- **Claude AI**：複雜業務邏輯設計、Service/Facade 架構
- **Gemini**：UI 設計圖轉頁面代碼、流程圖轉業務邏輯

### 常見 Prompt 範例
請創建一個用戶管理功能，要求：
```text
2. 詳情頁：顯示用戶詳情，可編輯和刪除
3. 使用 UserFacade 管理狀態
4. 實現完整的錯誤處理
5. 遵循五層架構開發順序
6. 遵循 .cursor/rules/routes-specific.mdc 規範
```

- --

**最後更新**：2025-11-20
**架構版本**：v2.0
**維護者**：開發團隊
**適用**：GitHub Copilot Agent Mode
