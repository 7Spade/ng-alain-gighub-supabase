# 環境設定指南 | Environment Setup Guide

> **文件版本 | Document Version**: 1.0.0  
> **最後更新 | Last Updated**: 2025-11-22  
> **預估時間 | Estimated Time**: 30-60 分鐘

---

## 📋 目錄 | Table of Contents

- [1. 前置需求](#1-前置需求--prerequisites)
- [2. Supabase 專案設定](#2-supabase-專案設定--supabase-project-setup)
- [3. 本地開發環境](#3-本地開發環境--local-development-environment)
- [4. Angular 專案整合](#4-angular-專案整合--angular-project-integration)
- [5. 驗證設定](#5-驗證設定--verify-setup)
- [6. 疑難排解](#6-疑難排解--troubleshooting)

---

## 1. 前置需求 | Prerequisites

### 1.1 系統需求 | System Requirements

| 項目 | Item | 版本要求 | Required Version | 驗證指令 | Verify Command |
|------|------|----------|------------------|----------|----------------|
| **Node.js** | LTS 版本 | >= 20.x | `node --version` |
| **npm** | 套件管理工具 | >= 10.x | `npm --version` |
| **yarn** | 推薦使用 | >= 4.9.2 | `yarn --version` |
| **Git** | 版本控制 | >= 2.x | `git --version` |

### 1.2 安裝 Node.js | Install Node.js

```bash
# 使用 nvm (Node Version Manager) 安裝
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安裝 Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 驗證安裝
node --version  # 應顯示 v20.x.x
npm --version   # 應顯示 10.x.x
```

### 1.3 安裝 Yarn | Install Yarn

```bash
# 啟用 Corepack (Node.js 內建)
corepack enable

# 設定 Yarn 版本
corepack prepare yarn@4.9.2 --activate

# 驗證安裝
yarn --version  # 應顯示 4.9.2
```

### 1.4 安裝 Supabase CLI (可選) | Install Supabase CLI (Optional)

```bash
# 使用 npm 安裝
npm install -g supabase

# 或使用 Homebrew (macOS)
brew install supabase/tap/supabase

# 驗證安裝
supabase --version

# 登入 Supabase
supabase login
```

---

## 2. Supabase 專案設定 | Supabase Project Setup

### 2.1 建立 Supabase 專案 | Create Supabase Project

#### Step 1: 註冊 Supabase 帳號

1. 前往 [https://supabase.com](https://supabase.com)
2. 點擊 **Start your project**
3. 使用 GitHub / Google 帳號登入

#### Step 2: 建立新專案

```bash
# 在 Supabase Dashboard
1. 點擊 "New Project"
2. 選擇 Organization (或建立新的)
3. 填寫專案資訊：
   - Name: ng-alain-gighub (範例名稱)
   - Database Password: 設定強密碼 (至少 12 字元)
   - Region: 選擇最近的區域 (e.g., Northeast Asia - Tokyo)
   - Pricing Plan: 選擇 Free (開發用) 或 Pro (生產用)
4. 點擊 "Create new project"
```

#### Step 3: 等待專案初始化

專案建立需要 2-3 分鐘。完成後會顯示專案儀表板。

### 2.2 取得 API 金鑰 | Get API Keys

#### 在 Supabase Dashboard 中：

1. 進入專案 → **Settings** → **API**
2. 複製以下資訊：

```plaintext
Project URL:           https://xxxxxxxxxxxx.supabase.co
anon / public key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT Secret:            your-super-secret-jwt-token
```

⚠️ **安全警告 | Security Warning**:
- `anon key`: 可用於客戶端（受 RLS 保護）
- `service_role key`: **僅用於伺服器端**，擁有完整資料庫權限
- `JWT Secret`: 用於驗證 JWT 令牌

### 2.3 資料庫連線資訊 | Database Connection Info

1. 進入專案 → **Settings** → **Database**
2. 複製 **Connection string**:

```plaintext
# Connection pooling (推薦用於應用程式)
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Direct connection (用於資料庫遷移)
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

## 3. 本地開發環境 | Local Development Environment

### 3.1 Clone 專案 | Clone Repository

```bash
# Clone 專案
git clone https://github.com/7Spade/ng-alain-gighub-supabase.git
cd ng-alain-gighub-supabase

# 安裝依賴
yarn install
```

### 3.2 環境變數設定 | Environment Variables Setup

#### Step 1: 複製環境變數範本

```bash
cp .env.example .env
```

#### Step 2: 編輯 .env 檔案

```bash
# 開啟編輯器
code .env  # VS Code
# 或
nano .env  # 終端機編輯器
```

#### Step 3: 填入 Supabase 資訊

```env
# ================================
# Supabase Configuration
# ================================

# Public Supabase URL (Client-side safe)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_URL=https://your-project-ref.supabase.co

# Public anonymous key (Client-side safe with RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key

# Service role key (KEEP SECRET - Server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# JWT Secret (KEEP SECRET)
SUPABASE_JWT_SECRET=your-super-secret-jwt-token

# ================================
# PostgreSQL Database Configuration
# ================================

# Connection pooling (for application)
POSTGRES_URL=postgresql://postgres.your-ref:password@aws-0-region.pooler.supabase.com:6543/postgres

# Direct connection (for migrations)
POSTGRES_URL_NON_POOLING=postgresql://postgres.your-ref:password@db.your-ref.supabase.co:5432/postgres

# Prisma-specific (if using Prisma ORM)
POSTGRES_PRISMA_URL=postgresql://postgres.your-ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true

# Individual connection parameters
POSTGRES_HOST=db.your-ref.supabase.co
POSTGRES_DATABASE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-database-password
```

#### Step 4: 驗證環境變數

```bash
# 確認 .env 檔案已被 Git 忽略
cat .gitignore | grep .env

# 應該包含：
# .env
# .env.local
# .env.*.local
```

### 3.3 建立 Angular Environment 檔案 | Create Angular Environment Files

Angular 需要將環境變數注入到 `src/environments/` 中。

#### Step 1: 建立環境設定檔

```bash
# 確保 environments 目錄存在
mkdir -p src/environments
```

#### Step 2: 建立 `src/environments/environment.ts` (開發環境)

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project-ref.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key',
    // ⚠️ 不要在客戶端環境中暴露 serviceRoleKey
  },
  api: {
    baseUrl: '/api'
  }
};
```

#### Step 3: 建立 `src/environments/environment.prod.ts` (生產環境)

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  supabase: {
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
    anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || ''
  },
  api: {
    baseUrl: '/api'
  }
};
```

#### Step 4: 配置 Angular.json

確保 `angular.json` 包含環境變數替換配置：

```json
{
  "projects": {
    "ng-alain": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

---

## 4. Angular 專案整合 | Angular Project Integration

### 4.1 安裝 Supabase 依賴 | Install Supabase Dependencies

```bash
# 安裝 Supabase JS Client
yarn add @supabase/supabase-js

# 安裝型別定義 (如需要)
yarn add -D @types/node
```

### 4.2 建立 Supabase Service | Create Supabase Service

#### Step 1: 建立服務檔案

```bash
# 使用 Angular CLI 生成服務
ng generate service core/services/supabase --skip-tests=false
```

#### Step 2: 實作 SupabaseService

```typescript
// src/app/core/services/supabase.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // SSR 相容：根據執行環境選擇不同的 API Key
    const key = isPlatformBrowser(this.platformId)
      ? environment.supabase.anonKey
      : process.env['SUPABASE_SERVICE_ROLE_KEY'] || environment.supabase.anonKey;

    this.supabase = createClient(
      environment.supabase.url,
      key,
      {
        auth: {
          persistSession: isPlatformBrowser(this.platformId), // SSR 時不持久化
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  /**
   * 取得 Supabase Client 實例
   */
  get client(): SupabaseClient {
    return this.supabase;
  }

  /**
   * 檢查使用者是否已登入
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session !== null;
  }

  /**
   * 取得目前使用者
   */
  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
}
```

### 4.3 整合 @delon/auth | Integrate @delon/auth

#### Step 1: 建立 SupabaseAuthService

```typescript
// src/app/core/services/supabase-auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SupabaseService } from './supabase.service';
import { Inject } from '@angular/core';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  constructor(
    private supabaseService: SupabaseService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router
  ) {
    // 監聽 Auth 狀態變化
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.setTokenFromSession(session);
      } else if (event === 'SIGNED_OUT') {
        this.tokenService.clear();
      }
    });
  }

  /**
   * 登入
   */
  async signIn(credentials: LoginCredentials) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      throw error;
    }

    if (data.session) {
      this.setTokenFromSession(data.session);
    }

    return data;
  }

  /**
   * 註冊
   */
  async signUp(credentials: LoginCredentials) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 登出
   */
  async signOut() {
    await this.supabaseService.client.auth.signOut();
    this.tokenService.clear();
    this.router.navigateByUrl('/passport/login');
  }

  /**
   * 將 Supabase Session 轉換為 @delon/auth Token
   */
  private setTokenFromSession(session: any) {
    this.tokenService.set({
      token: session.access_token,
      refresh_token: session.refresh_token,
      expired: session.expires_at ? session.expires_at * 1000 : 0,
      user: session.user
    });
  }
}
```

### 4.4 配置 Route Guard | Configure Route Guard

```typescript
// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.router.navigate(['/passport/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return true;
  }
}
```

---

## 5. 驗證設定 | Verify Setup

### 5.1 啟動開發伺服器 | Start Development Server

```bash
# 啟動 Angular 開發伺服器
yarn start

# 或使用 ng serve
ng serve --open
```

應用程式將在 `http://localhost:4200` 啟動。

### 5.2 測試 Supabase 連線 | Test Supabase Connection

#### 建立測試元件

```typescript
// src/app/test-supabase.component.ts
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-test-supabase',
  template: `
    <div>
      <h2>Supabase Connection Test</h2>
      <div *ngIf="connectionStatus">
        <p>✅ Connection Status: {{ connectionStatus }}</p>
        <p>📊 Database Version: {{ dbVersion }}</p>
      </div>
      <div *ngIf="error">
        <p>❌ Error: {{ error }}</p>
      </div>
    </div>
  `
})
export class TestSupabaseComponent implements OnInit {
  connectionStatus: string = '';
  dbVersion: string = '';
  error: string = '';

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      // 測試查詢 PostgreSQL 版本
      const { data, error } = await this.supabase.client
        .rpc('version');

      if (error) {
        this.error = error.message;
      } else {
        this.connectionStatus = 'Connected';
        this.dbVersion = data;
      }
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
```

### 5.3 執行測試 | Run Tests

```bash
# 執行單元測試
yarn test

# 執行 E2E 測試
yarn e2e
```

### 5.4 建置生產版本 | Build for Production

```bash
# 建置生產版本
yarn build

# 檢查建置輸出
ls -lh dist/
```

---

## 6. 疑難排解 | Troubleshooting

### 6.1 常見問題 | Common Issues

#### 問題 1: `@supabase/supabase-js` 模組找不到

**錯誤訊息**:
```
Error: Cannot find module '@supabase/supabase-js'
```

**解決方法**:
```bash
# 清除快取並重新安裝
rm -rf node_modules yarn.lock
yarn install
```

#### 問題 2: SSR 時出現 `window is not defined`

**錯誤訊息**:
```
ReferenceError: window is not defined
```

**解決方法**:
確保在 Service 中使用 `isPlatformBrowser` 檢查：

```typescript
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  if (isPlatformBrowser(this.platformId)) {
    // 僅在瀏覽器環境執行
    window.localStorage.setItem('key', 'value');
  }
}
```

#### 問題 3: RLS 策略導致查詢失敗

**錯誤訊息**:
```
new row violates row-level security policy
```

**解決方法**:
1. 檢查 Supabase Dashboard → **Authentication** → **Policies**
2. 確保表格有適當的 RLS 策略
3. 暫時停用 RLS 進行測試：

```sql
-- ⚠️ 僅用於開發測試
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

#### 問題 4: CORS 錯誤

**錯誤訊息**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**解決方法**:
1. 確認 Supabase Dashboard → **Settings** → **API** → **CORS**
2. 新增允許的來源：

```
http://localhost:4200
https://your-production-domain.com
```

### 6.2 除錯技巧 | Debugging Tips

#### 啟用 Supabase Debug 模式

```typescript
const supabase = createClient(url, key, {
  auth: {
    debug: true  // 啟用認證除錯
  }
});
```

#### 檢查環境變數

```bash
# 在開發環境中列印環境變數
ng serve --configuration=development --verbose
```

#### 查看 Supabase Logs

```bash
# 使用 Supabase CLI 查看即時日誌
supabase logs --project-ref your-project-ref
```

---

## 7. 下一步 | Next Steps

### 7.1 延伸閱讀 | Further Reading

- [資料庫開發規範](./database-dev.md) - 學習資料表設計與遷移
- [API 開發規範](./api-dev.md) - 建立自訂 API 端點
- [測試策略](./testing.md) - 撰寫單元測試與整合測試

### 7.2 實作檢查清單 | Implementation Checklist

- [x] 安裝 Node.js 與 Yarn
- [x] 建立 Supabase 專案
- [x] 配置環境變數
- [x] 安裝 Supabase 依賴
- [x] 建立 SupabaseService
- [x] 整合 @delon/auth
- [ ] 設定第一個資料表
- [ ] 實作 CRUD 功能
- [ ] 撰寫測試
- [ ] 配置 CI/CD

---

**需要協助？ | Need Help?**
- [GitHub Issues](https://github.com/7Spade/ng-alain-gighub-supabase/issues)
- [Supabase Discord](https://discord.supabase.com)
- [ng-alain 官方文件](https://ng-alain.com)

---

**文件維護者 | Maintained by**: 7Spade Development Team  
**最後審核 | Last Reviewed**: 2025-11-22
