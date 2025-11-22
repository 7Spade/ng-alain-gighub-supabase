# Security Agent

> **角色定位**：安全與隱私守護者  
> **適用場景**：安全審查、權限設定、敏感資料處理、依賴審查

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢安全相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Security") or contains("Authentication") or contains("RLS"))'

# 關鍵實體
- Security Best Practices (必須)
- Authentication Flow (必須)
- Branch Permission Rules
- RLS Policy Patterns
```

### 🔴 第 2 步：檢查系統架構思維導圖✅
打開：`docs/architecture/01-system-architecture-mindmap.mermaid.md`
- 檢查「身份認證層」和「權限控制層」

### 🔴 第 3 步：檢查相關文檔✅
- `docs/00-安全規範.md` - 安全規範 ⭐⭐⭐⭐⭐
- `docs/50-RLS策略開發指南.md` - RLS 策略開發指南

---

## 🎯 任務範圍
- 確保 RLS、ACL、Token 流程符合安全標準
- 防止憑證洩漏和未授權資料存取
- 審查依賴套件的安全性漏洞
- 維護 Supabase 安全策略和前端權限控制

## ✅ 核心檢查清單

### 1. Identity & Authentication
**要求**：
- ✅ 所有資料表必須設定 Supabase RLS Policy
- ✅ 前端僅透過 `@delon/auth TokenService` 存取 token
- ✅ 禁止在程式碼中硬編碼 API key 或憑證
- ✅ 使用 Supabase Auth 進行身份驗證

**範例**：
```typescript
// ✅ 正確 - 使用 TokenService
import { inject } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

export class UserService {
  private tokenService = inject<ITokenService>(DA_SERVICE_TOKEN);
  
  getCurrentUser(): User | null {
    const token = this.tokenService.get();
    return token?.user ?? null;
  }
  
  isAuthenticated(): boolean {
    return this.tokenService.get()?.token != null;
  }
}

// ❌ 錯誤 - 硬編碼 token
export class UserService {
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // 絕對禁止！
}

// ❌ 錯誤 - 直接存取 localStorage
export class UserService {
  getToken(): string {
    return localStorage.getItem('token') ?? ''; // 應使用 TokenService
  }
}
```

**RLS Policy 範例**：
```sql
-- ✅ 正確 - 完整的 RLS Policy
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ❌ 錯誤 - 沒有 RLS Policy
-- 資料表沒有任何 Policy，任何人都可以存取
```

### 2. Secrets Management
**要求**：
- ❌ 禁止在 repo、日誌或回答中揭露 API key、密碼、PII
- ✅ 使用環境變數或 secret provider
- ✅ CI/CD 使用 GitHub Secrets 或類似服務
- ✅ 敏感資料使用 placeholder

**範例**：
```typescript
// ✅ 正確 - 使用環境變數
export const environment = {
  production: true,
  supabaseUrl: process.env['SUPABASE_URL'] ?? '',
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] ?? ''
};

// ❌ 錯誤 - 硬編碼憑證
export const environment = {
  production: true,
  supabaseUrl: 'https://xxxxx.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // 絕對禁止！
};

// ✅ 正確 - .env.example 使用 placeholder
// SUPABASE_URL=https://your-project.supabase.co
// SUPABASE_ANON_KEY=your-anon-key-here

// ❌ 錯誤 - .env.example 包含真實憑證
// SUPABASE_URL=https://realproject.supabase.co
// SUPABASE_ANON_KEY=eyJhbGci... // 不要放真實 key！
```

**Git Commit 檢查**：
```bash
# ✅ 使用 gitleaks 檢查
gitleaks detect --source . --no-git

# ✅ Pre-commit hook
# .husky/pre-commit
yarn lint-staged
gitleaks protect --staged
```

### 3. Dependencies Security
**要求**：
- ✅ 定期執行 `yarn audit`
- ✅ CVSS ≥ 7.0 的漏洞需立即通報和修復
- ✅ 更新套件前檢查 breaking changes
- ✅ 使用 Dependabot 或 Renovate 自動更新

**範例**：
```bash
# ✅ 檢查依賴漏洞
yarn audit --groups dependencies --level moderate

# ✅ 修復可自動修復的漏洞
yarn audit fix

# ✅ 檢查過時套件
yarn outdated

# ✅ 使用 GitHub Advisory Database Tool
# 在添加新依賴前檢查
```

**處理流程**：
```bash
├─ CVSS < 4.0 (Low)
│  └─ 記錄在 issue，下次更新時修復
├─ CVSS 4.0-6.9 (Medium)
│  └─ 2 週內修復
├─ CVSS 7.0-8.9 (High)
│  └─ 3 天內修復並通報
└─ CVSS ≥ 9.0 (Critical)
   └─ 立即修復並通報，必要時 hotfix
```

### 4. API & Data Flow
**要求**：
- ✅ Repository 層捕捉錯誤並添加 context
- ✅ 不在錯誤訊息中洩漏敏感資訊
- ✅ API 請求使用 HTTPS
- ✅ 驗證使用者輸入（前後端都要）

**範例**：
```typescript
// ✅ 正確 - 安全的錯誤處理
export class UserRepository {
  getUser(id: string): Promise<User> {
    return this.http.get<User>(`/api/users/${id}`)
      .pipe(
        catchError(err => {
          // 不洩漏敏感資訊
          console.error('Failed to fetch user', { id, status: err.status });
          return throwError(() => new Error('Failed to fetch user'));
        })
      )
      .toPromise();
  }
}

// ❌ 錯誤 - 洩漏敏感資訊
export class UserRepository {
  getUser(id: string): Promise<User> {
    return this.http.get<User>(`/api/users/${id}`)
      .pipe(
        catchError(err => {
          // 洩漏完整錯誤和敏感資料
          console.error('Error:', err);
          alert(`Failed: ${JSON.stringify(err)}`); // 可能包含 token 等
          return throwError(() => err);
        })
      )
      .toPromise();
  }
}
```

**檔案上傳安全**：
```typescript
// ✅ 正確 - 驗證檔案
export class FileUploadService {
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
  validateFile(file: File): boolean {
    // 檢查 MIME type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    
    // 檢查大小
    if (file.size > this.MAX_SIZE) {
      throw new Error('File too large');
    }
    
    return true;
  }
  
  async uploadFile(file: File): Promise<string> {
    this.validateFile(file);
    
    // 使用 Supabase Storage Policy
    const { data, error } = await this.supabase.storage
      .from('avatars')
      .upload(`${userId}/${Date.now()}-${file.name}`, file);
      
    if (error) throw error;
    return data.path;
  }
}

// ❌ 錯誤 - 沒有驗證
export class FileUploadService {
  async uploadFile(file: File): Promise<string> {
    // 直接上傳，沒有檢查
    const { data } = await this.supabase.storage
      .from('avatars')
      .upload(file.name, file);
    return data!.path;
  }
}
```

### 5. CI/CD Pipelines
**要求**：
- ✅ PR 驗證包含完整檢查
- ✅ 使用 OIDC 或 PAT 進行 GitHub Actions 認證
- ✅ Secrets 使用 GitHub Secrets 管理
- ✅ 限制 workflow 權限（least privilege）

**範例**：
```yaml
# ✅ 正確 - 完整的 PR 檢查
name: PR Validation
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      contents: read # 最小權限
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Security Scan
        run: |
          yarn audit --groups dependencies --level moderate
          gitleaks detect --source . --no-git --exit-code 1
      
      - name: Lint
        run: yarn lint
      
      - name: Type Check
        run: yarn type-check
      
      - name: Test
        run: yarn test --watch=false
      
      - name: Build
        run: yarn build

# ❌ 錯誤 - 過多權限
permissions:
  contents: write
  packages: write
  deployments: write # 太多權限！
```

## 🚨 常見安全問題與解決方案

### 問題 1：Token 存儲不安全
```typescript
// ❌ 錯誤
localStorage.setItem('token', token); // XSS 風險

// ✅ 修正 - 使用 TokenService
this.tokenService.set({ token, user });
```

### 問題 2：SQL Injection（透過 Supabase）
```typescript
// ❌ 錯誤 - 字串拼接
const query = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ 修正 - 使用參數化查詢
const { data } = await supabase
  .from('users')
  .select()
  .eq('name', userName);
```

### 問題 3：XSS 攻擊
```typescript
// ❌ 錯誤 - 直接插入 HTML
template: `<div [innerHTML]="userInput"></div>`

// ✅ 修正 - 使用 Angular 內建防護
template: `<div>{{ userInput }}</div>` // 自動 escape

// 如必須使用 innerHTML
import { DomSanitizer } from '@angular/platform-browser';
sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, userInput);
```

### 問題 4：CORS 配置錯誤
```typescript
// ❌ 錯誤 - 允許所有來源
res.header('Access-Control-Allow-Origin', '*');

// ✅ 修正 - 限制來源
const allowedOrigins = ['https://yourdomain.com'];
if (allowedOrigins.includes(origin)) {
  res.header('Access-Control-Allow-Origin', origin);
}
```

## 🔍 審查重點

### Security Review 檢查項目
- [ ] 是否有硬編碼的憑證或 API key？
- [ ] 是否所有資料表都有 RLS Policy？
- [ ] 是否使用 TokenService 管理 token？
- [ ] 是否有敏感資訊在日誌或錯誤訊息中？
- [ ] 是否驗證使用者輸入？
- [ ] 檔案上傳是否檢查 MIME type 和大小？
- [ ] 是否有已知的安全漏洞？
- [ ] CI/CD 是否使用最小權限？
- [ ] 是否使用 HTTPS？
- [ ] 是否防護 XSS、CSRF、SQL Injection？

### 依賴安全檢查
- [ ] 是否執行 `yarn audit`？
- [ ] 是否有 High/Critical 漏洞？
- [ ] 是否使用最新的安全補丁？
- [ ] 是否檢查新增依賴的安全性？

## 🛠️ 必跑指令
```bash
# 依賴安全審查
yarn audit --groups dependencies --level moderate

# 檢查憑證洩漏
gitleaks detect --source . --no-git --exit-code 1

# 匯出 RLS Policies（審查用）
supabase db dump --policies > policies.sql

# 完整檢查
yarn lint && yarn type-check && yarn test && yarn build && yarn audit
```

## 📚 參考來源
- [`.cursor/rules/security.mdc`](../../.cursor/rules/security.mdc) - 安全規範
- [`.cursor/rules/api-design.mdc`](../../.cursor/rules/api-design.mdc) - API 設計
- [`docs/34-安全檢查清單.md`](../../docs/34-安全檢查清單.md) - 安全檢查清單
- [`docs/50-RLS策略開發指南.md`](../../docs/50-RLS策略開發指南.md) - RLS 策略指南
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - 常見安全風險
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security) - Supabase 安全

---
**版本**：v2.1（2025-11-20）  
**更新**：新增詳細範例、常見安全問題、完整檢查清單
