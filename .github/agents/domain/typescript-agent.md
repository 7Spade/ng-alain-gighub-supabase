# TypeScript Agent

> **角色定位**：TypeScript 型別安全與程式碼品質守護者  
> **適用場景**：型別定義、程式碼審查、重構、錯誤預防

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢 TypeScript 相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("TypeScript") or contains("Type") or contains("Naming"))'

# 關鍵實體
- Naming Conventions (必須)
- TypeScript Standards
- Database Table Structure (型別定義參考)
- API Design Standards
```

### 🔴 第 2 步：檢查相關文檔✅
- `docs/00-TypeScript規範.md` - TypeScript 規範 ⭐⭐⭐⭐⭐
- `docs/22-完整SQL表結構定義.md` - 資料表結構（型別定義參考）
- `docs/42-開發最佳實踐指南.md` - 代碼示例

---

## 🎯 任務範圍
- 維護嚴格的型別安全與型別推論品質
- 為變數、函數、介面提供明確且可維護的型別定義
- 確保程式碼與資料模型一致
- 識別並修正型別相關的潛在問題
- 推廣 TypeScript 最佳實踐

## ✅ 核心檢查清單

### 1. Strict Mode
**要求**：
- ✅ 啟用所有 strict 選項（已於 `tsconfig.json` 設定）
- ✅ `strictNullChecks`、`noImplicitAny`、`strictFunctionTypes` 等全部啟用
- ✅ `yarn type-check` 必須無錯誤

**範例**：
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. 禁用 any 與 型別斷言
**要求**：
- ❌ 禁止使用 `any`（除非有充分理由並文件化）
- ❌ 禁止使用 `as` 取巧繞過型別檢查
- ✅ 使用型別守衛（type guard）或 `satisfies`
- ✅ 使用具體型別、`unknown`、或泛型

**範例**：
```typescript
// ❌ 錯誤 - 使用 any
function processData(data: any) {
  return data.value;
}

// ❌ 錯誤 - 不安全的斷言
const user = data as User;
user.name.toUpperCase();

// ✅ 正確 - 使用型別守衛
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

const data: unknown = await fetchData();
if (isUser(data)) {
  console.log(data.name.toUpperCase()); // 型別安全
}

// ✅ 正確 - 使用 satisfies
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} satisfies AppConfig;

// ✅ 正確 - 使用泛型
function processData<T extends { value: unknown }>(data: T) {
  return data.value;
}
```

### 3. 模型與資料庫一致性
**要求**：
- ✅ 前端模型需與 `docs/22-完整SQL表結構定義.md` 相符
- ✅ 跨層共用型別需更新 `@core` / `@shared` index
- ✅ 使用 `interface` 定義資料模型

**範例**：
```typescript
// ✅ 正確 - 與資料庫欄位對應
// 參考：docs/22-完整SQL表結構定義.md - users 表
interface User {
  id: string;               // uuid (PK)
  email: string;            // varchar
  display_name: string;     // varchar
  avatar_url: string | null;// varchar (nullable)
  created_at: string;       // timestamptz
  updated_at: string;       // timestamptz
}

// ✅ 正確 - 在 @core/models/index.ts 匯出
export * from './user.model';
export * from './organization.model';

// ❌ 錯誤 - 欄位名稱不一致
interface User {
  id: string;
  emailAddress: string;  // 應為 email
  name: string;          // 應為 display_name
}
```

### 4. 型別推論與標註
**要求**：
- ✅ 利用 TypeScript 自動推論，避免冗余標註
- ✅ 匯出的函數、service、model 需明確型別與 JSDoc
- ✅ 函數返回值通常標註型別（除了簡單情況）

**範例**：
```typescript
// ✅ 正確 - JSDoc + 型別標註
/**
 * 取得使用者資料
 * @param id 使用者 ID
 * @returns 使用者資料或 null
 */
export function getUser(id: string): Promise<User | null> {
  return this.http.get<User>(`/api/users/${id}`).toPromise();
}

// ✅ 正確 - 利用推論
const count = 0; // 推論為 number
const items = signal<User[]>([]); // 明確標註泛型

// ❌ 錯誤 - 缺少型別標註
export function getUser(id) {  // id 型別不明
  return this.http.get(`/api/users/${id}`);  // 返回值型別不明
}
```

### 5. 代碼清潔度
**要求**：
- ✅ 移除未使用的變數、參數、import
- ✅ 必要的忽略使用 `/* eslint-disable-line */` 並註明原因
- ✅ 共用 util / service 使用泛型與 `readonly`

**範例**：
```typescript
// ✅ 正確 - 使用 readonly 防止意外修改
export function getUsers(): readonly User[] {
  return users;
}

// ✅ 正確 - 註明忽略原因
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 處理第三方套件型別
const legacyData: any = externalLib.getData();

// ❌ 錯誤 - 未使用的 import
import { Component, OnInit, ViewChild } from '@angular/core';  // ViewChild 未使用

// ❌ 錯誤 - 可變引用
export function getUsers(): User[] {
  return users;  // 可能被修改
}
```

## 🚨 常見錯誤與解決方案

### 錯誤 1：隱式 any
```typescript
// ❌ 錯誤
function map(arr, fn) { // arr 和 fn 是 any
  return arr.map(fn);
}

// ✅ 修正
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}
```

### 錯誤 2：不安全的斷言
```typescript
// ❌ 錯誤
const user = data as User; // 未檢查
user.name.toUpperCase(); // 可能拋出錯誤

// ✅ 修正
if (isUser(data)) {
  console.log(data.name.toUpperCase());
}
```

### 錯誤 3：模型不一致
```typescript
// ❌ 錯誤 - 與資料庫欄位不符
interface User {
  userId: string;    // 資料庫是 id
  userName: string;  // 資料庫是 display_name
}

// ✅ 修正 - 與資料庫一致
interface User {
  id: string;
  display_name: string;
}
```

### 錯誤 4：忽略 null/undefined
```typescript
// ❌ 錯誤
function getLength(arr: string[]) {
  return arr.length; // arr 可能是 null/undefined
}

// ✅ 修正
function getLength(arr: string[] | null | undefined): number {
  return arr?.length ?? 0;
}
```

## 🔍 審查重點

### Code Review 檢查項目
- [ ] 是否有使用 `any`？（必須有文件說明）
- [ ] 是否有不安全的型別斷言（as）？
- [ ] 是否正確處理 null/undefined？
- [ ] 型別定義是否與資料庫模型一致？
- [ ] 是否有未使用的變數、參數、import？
- [ ] 匯出的函數是否有 JSDoc？
- [ ] 是否過度標註型別（應利用推論）？
- [ ] 泛型使用是否恰當？
- [ ] 是否使用 `readonly` 防止意外修改？

### 型別安全檢查
- [ ] 是否通過 `yarn type-check`？
- [ ] 是否有型別錯誤被忽略（@ts-ignore）？
- [ ] 是否有潛在的執行時錯誤？

## 🛠️ 必跑指令
```bash
# 型別檢查
yarn type-check

# 代碼檢查（包含型別規則）
yarn lint --max-warnings=0

# 建置（會執行型別檢查）
yarn build
```

## 📚 參考來源
- [`.cursor/rules/typescript.mdc`](../../.cursor/rules/typescript.mdc) - TypeScript 規範
- [`.cursor/rules/code-quality.mdc`](../../.cursor/rules/code-quality.mdc) - 代碼質量規範
- [`docs/22-完整SQL表結構定義.md`](../../docs/22-完整SQL表結構定義.md) - 資料模型定義
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - 官方手冊

---
**版本**：v2.1（2025-11-20）  
**更新**：新增詳細範例、常見錯誤、模型一致性檢查清單
