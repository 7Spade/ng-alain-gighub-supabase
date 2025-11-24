# Supabase 整合指南 | Supabase Integration Guide

本文檔說明如何在 ng-alain-gighub-supabase 專案中使用 Supabase 整合功能。

This document explains how to use Supabase integration features in the ng-alain-gighub-supabase project.

## 📋 目錄 | Table of Contents

1. [環境設定](#環境設定--environment-setup)
2. [基礎架構](#基礎架構--architecture)
3. [使用範例](#使用範例--usage-examples)
4. [最佳實踐](#最佳實踐--best-practices)
5. [常見問題](#常見問題--faq)

---

## 環境設定 | Environment Setup

### 1. 安裝依賴 | Install Dependencies

專案已包含 Supabase 依賴，如需重新安裝：

```bash
npm install @supabase/supabase-js
```

### 2. 配置環境變數 | Configure Environment Variables

#### 開發環境 | Development

編輯 `src/environments/environment.ts`:

```typescript
export const environment = {
  // ... 其他配置
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here',
    serviceRoleKey: 'your-service-role-key-here'
  }
};
```

#### 生產環境 | Production

設定環境變數或編輯 `src/environments/environment.prod.ts`:

```bash
# .env (在伺服器上設定)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 取得 Supabase 金鑰 | Get Supabase Keys

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案
3. 進入 Settings → API
4. 複製 Project URL 和 API Keys

---

## 基礎架構 | Architecture

### 五層架構 | Five-Layer Architecture

```
┌─────────────────────────────────────┐
│   Facades 層（門面層）              │  ← 第 5 層：統一對外接口
├─────────────────────────────────────┤
│   Services 層（業務邏輯層）         │  ← 第 4 層：業務邏輯處理
├─────────────────────────────────────┤
│   Models 層（數據模型層）           │  ← 第 3 層：業務模型定義
├─────────────────────────────────────┤
│   Repositories 層（數據訪問層）     │  ← 第 2 層：資料存取
├─────────────────────────────────────┤
│   Types 層（類型定義層）            │  ← 第 1 層：型別定義
└─────────────────────────────────────┘
```

### 核心服務 | Core Services

| 服務 | 說明 | 位置 |
|------|------|------|
| **SupabaseService** | Supabase Client 單例 | `@core/infra/supabase` |
| **SupabaseAuthService** | 認證服務（整合 @delon/auth） | `@core/infra/supabase` |
| **SupabaseStorageService** | 儲存服務 | `@core/infra/supabase` |
| **BaseRepository** | 基礎 Repository | `@core/infra/repositories` |

---

## 使用範例 | Usage Examples

### 1. 認證 | Authentication

#### 登入 | Sign In

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseAuthService } from '@core';

@Component({
  selector: 'app-login',
  template: `...`
})
export class LoginComponent {
  private readonly authService = inject(SupabaseAuthService);

  async login(email: string, password: string) {
    this.authService.signIn({ email, password }).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error('Login failed:', error);
          return;
        }
        console.log('Login successful:', data);
        // 自動同步到 @delon/auth
      }
    });
  }
}
```

#### 註冊 | Sign Up

```typescript
async register(email: string, password: string) {
  this.authService.signUp({ 
    email, 
    password,
    options: {
      data: {
        // 可選：額外的使用者資料
        display_name: 'John Doe'
      }
    }
  }).subscribe({
    next: ({ data, error }) => {
      if (error) {
        console.error('Registration failed:', error);
        return;
      }
      console.log('Registration successful:', data);
    }
  });
}
```

#### 登出 | Sign Out

```typescript
async logout() {
  this.authService.signOut().subscribe({
    next: ({ error }) => {
      if (error) {
        console.error('Logout failed:', error);
        return;
      }
      console.log('Logout successful');
      // 自動清除 @delon/auth 狀態
    }
  });
}
```

#### OAuth 登入 | OAuth Sign In

```typescript
async loginWithGoogle() {
  this.authService.signInWithProvider('google').subscribe({
    next: ({ error }) => {
      if (error) {
        console.error('OAuth login failed:', error);
      }
      // Supabase 會自動處理 OAuth 流程
    }
  });
}
```

### 2. 資料庫操作 | Database Operations

#### 創建 Repository

```typescript
import { Injectable } from '@angular/core';
import { BaseRepository } from '@core';
import { Database } from '@core';

// 1. 定義型別
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

// 2. 創建 Repository
@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseRepository<User, UserInsert, UserUpdate> {
  protected tableName = 'users';

  // 可選：添加自訂查詢方法
  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
```

#### 使用 Repository

```typescript
import { Component, inject, signal } from '@angular/core';
import { UserRepository } from './user.repository';

@Component({
  selector: 'app-users',
  template: `...`
})
export class UsersComponent {
  private readonly userRepo = inject(UserRepository);
  
  users = signal<User[]>([]);
  loading = signal<boolean>(false);

  async loadUsers() {
    this.loading.set(true);
    try {
      this.userRepo.findAll().subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load users:', error);
          this.loading.set(false);
        }
      });
    } catch (error) {
      console.error(error);
      this.loading.set(false);
    }
  }

  async createUser(data: UserInsert) {
    this.userRepo.create(data).subscribe({
      next: (user) => {
        this.users.update(users => [...users, user]);
      },
      error: (error) => {
        console.error('Failed to create user:', error);
      }
    });
  }

  async updateUser(id: string, data: UserUpdate) {
    this.userRepo.update(id, data).subscribe({
      next: (updated) => {
        this.users.update(users => 
          users.map(u => u.id === id ? updated : u)
        );
      }
    });
  }

  async deleteUser(id: string) {
    this.userRepo.delete(id).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== id));
      }
    });
  }
}
```

### 3. 檔案上傳 | File Upload

#### 使用 Storage Service

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseStorageService } from '@core';

@Component({
  selector: 'app-upload',
  template: `...`
})
export class UploadComponent {
  private readonly storageService = inject(SupabaseStorageService);

  async uploadAvatar(file: File, userId: string) {
    const path = `avatars/${userId}/avatar.png`;
    
    this.storageService.upload('avatars', path, file, {
      upsert: true,
      contentType: file.type
    }).subscribe({
      next: ({ data, error }) => {
        if (error) {
          console.error('Upload failed:', error);
          return;
        }
        
        // 獲取公開 URL
        const publicUrl = this.storageService.getPublicUrl('avatars', data!.path);
        console.log('File uploaded:', publicUrl);
      }
    });
  }

  async downloadFile(path: string) {
    this.storageService.download('avatars', path).subscribe({
      next: (blob) => {
        if (blob) {
          // 創建下載連結
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = path.split('/').pop() || 'download';
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    });
  }
}
```

#### 使用 Upload Directive

```html
<div 
  appSupabaseUpload
  [bucket]="'avatars'"
  [path]="userId + '/avatar.png'"
  [accept]="'image/*'"
  [maxSize]="5 * 1024 * 1024"
  (uploaded)="onUploaded($event)"
  (error)="onError($event)"
  class="upload-zone">
  <nz-icon nzType="cloud-upload" nzTheme="outline"></nz-icon>
  <div>拖放檔案或點擊上傳</div>
</div>
```

```typescript
onUploaded(result: UploadResult) {
  console.log('Upload successful:', result);
  this.avatarUrl = result.publicUrl;
}

onError(error: Error) {
  console.error('Upload failed:', error);
  this.message.error(error.message);
}
```

#### 使用 URL Pipe

```html
<!-- 基本使用 -->
<img [src]="'avatars/user-123/avatar.png' | supabaseUrl:'avatars'" />

<!-- 帶圖片轉換 -->
<img [src]="imagePath | supabaseUrl:'images':{ width: 200, height: 200 }" />
```

### 4. 建立 Service 與 Facade

#### 創建 Service

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserRepository } from './user.repository';
import { UserModel } from '@shared';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userRepo = inject(UserRepository);
  
  // State management with Signals
  private usersState = signal<UserModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  
  // Expose readonly signals
  readonly users = this.usersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  
  // Computed signals
  readonly userCount = computed(() => this.users().length);
  readonly activeUsers = computed(() => 
    this.users().filter(u => u.status === 'active')
  );
  
  async loadUsers(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    try {
      const users = await firstValueFrom(this.userRepo.findAll());
      this.usersState.set(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.errorState.set(message);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
  
  async createUser(data: UserInsert): Promise<UserModel> {
    this.loadingState.set(true);
    
    try {
      const user = await firstValueFrom(this.userRepo.create(data));
      this.usersState.update(users => [...users, user]);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.errorState.set(message);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}
```

#### 創建 Facade

```typescript
import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly userService = inject(UserService);
  
  // Expose service state
  readonly users = this.userService.users;
  readonly loading = this.userService.loading;
  readonly error = this.userService.error;
  readonly userCount = this.userService.userCount;
  readonly activeUsers = this.userService.activeUsers;
  
  async loadUsers(): Promise<void> {
    try {
      await this.userService.loadUsers();
    } catch (error) {
      // 可以在這裡添加額外的錯誤處理邏輯
      console.error('Failed to load users:', error);
      throw error;
    }
  }
  
  async createUser(data: CreateUserRequest): Promise<void> {
    try {
      await this.userService.createUser(data);
      
      // 可以協調其他服務
      // await this.activityService.logActivity({...});
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }
}
```

---

## 最佳實踐 | Best Practices

### 1. 類型安全 | Type Safety

✅ **正確**：使用生成的資料庫類型

```typescript
import { Database } from '@core';

type User = Database['public']['Tables']['users']['Row'];
```

❌ **錯誤**：使用 any 類型

```typescript
let user: any; // 避免使用
```

### 2. 錯誤處理 | Error Handling

✅ **正確**：完整的錯誤處理

```typescript
async loadData() {
  this.loading.set(true);
  try {
    const data = await firstValueFrom(this.repo.findAll());
    this.data.set(data);
  } catch (error) {
    this.error.set(error instanceof Error ? error.message : 'Unknown error');
    console.error('Load failed:', error);
  } finally {
    this.loading.set(false);
  }
}
```

### 3. 狀態管理 | State Management

✅ **正確**：使用 Signals

```typescript
private dataState = signal<Data[]>([]);
readonly data = this.dataState.asReadonly();
```

❌ **錯誤**：直接暴露可變狀態

```typescript
data: Data[] = []; // 避免直接暴露
```

### 4. SSR 相容性 | SSR Compatibility

✅ **正確**：檢查瀏覽器環境

```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  if (isPlatformBrowser(this.platformId)) {
    // 瀏覽器專用代碼
    localStorage.setItem('key', 'value');
  }
}
```

### 5. RLS 安全性 | RLS Security

⚠️ **重要**：確保資料表啟用 RLS

```sql
-- 在 Supabase SQL Editor 中執行
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

---

## 常見問題 | FAQ

### Q1: 如何生成資料庫型別？

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入
supabase login

# 生成型別
supabase gen types typescript --project-id your-project-id > src/app/core/infra/types/database.types.ts
```

### Q2: 如何處理 Session 過期？

SupabaseAuthService 已自動處理 Token 刷新。如需手動處理：

```typescript
this.authService.authState$.subscribe(state => {
  if (state === AuthState.SIGNED_OUT) {
    // 處理登出狀態
    this.router.navigate(['/login']);
  }
});
```

### Q3: 如何在 SSR 環境中使用 Supabase？

專案已內建 SSR 支援。SupabaseService 會自動根據環境選擇正確的 API Key：
- 瀏覽器：使用 `anonKey`
- 伺服器：使用 `serviceRoleKey`（如果可用）

### Q4: 如何測試 Supabase 整合？

```typescript
import { TestBed } from '@angular/core/testing';
import { SupabaseService } from '@core';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide client', () => {
    const client = service.getClient();
    expect(client).toBeDefined();
  });
});
```

### Q5: 如何處理檔案上傳進度？

目前 directive 提供基本進度追蹤。可以擴展：

```typescript
@Output() progress = new EventEmitter<number>();

// 在上傳過程中
this.progress.emit(50); // 50%
```

---

## 相關資源 | Related Resources

- [Supabase 官方文檔](https://supabase.com/docs)
- [Angular 官方文檔](https://angular.dev)
- [ng-alain 官方文檔](https://ng-alain.com)
- [專案架構文檔](../../docs/supabase/architecture/overview.md)

---

**更新日期 | Last Updated**: 2025-11-23  
**維護者 | Maintainer**: 7Spade Development Team
