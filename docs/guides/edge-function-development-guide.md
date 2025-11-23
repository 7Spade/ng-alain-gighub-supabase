# Edge Function 開發指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [Edge Function 基礎](#edge-function-基礎)
  - [什麼是 Edge Function？](#什麼是-edge-function)
  - [使用場景](#使用場景)
  - [基本結構](#基本結構)
- [開發流程](#開發流程)
  - [1. 建立新函數](#1-建立新函數)
  - [2. 函數模板](#2-函數模板)
  - [3. CORS 配置](#3-cors-配置)
  - [4. 共用 Supabase 客戶端](#4-共用-supabase-客戶端)
- [本地測試](#本地測試)
  - [1. 啟動本地開發](#1-啟動本地開發)
  - [2. 測試請求](#2-測試請求)
  - [3. 查看日誌](#3-查看日誌)
  - [4. 單元測試](#4-單元測試)
- [部署與監控](#部署與監控)
  - [1. 部署函數](#1-部署函數)
  - [2. 環境變數管理](#2-環境變數管理)
  - [3. 函數配置](#3-函數配置)
  - [4. 監控與日誌](#4-監控與日誌)
  - [5. 效能監控](#5-效能監控)
- [最佳實踐](#最佳實踐)
  - [1. 錯誤處理](#1-錯誤處理)
  - [2. 輸入驗證](#2-輸入驗證)
  - [3. 超時處理](#3-超時處理)
  - [4. 快取策略](#4-快取策略)
  - [5. 分批處理](#5-分批處理)
- [安全性](#安全性)
  - [1. JWT 驗證](#1-jwt-驗證)
  - [2. 權限檢查](#2-權限檢查)
  - [3. 速率限制](#3-速率限制)
- [相關文檔](#相關文檔)

---


> **目的**：定義 Supabase Edge Functions 的開發規範、測試流程和部署方法

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊
**技術棧**：Deno + Supabase Edge Functions

- --

## 📋 目錄

1. [Edge Function 基礎](#edge-function-基礎)
2. [開發流程](#開發流程)
3. [本地測試](#本地測試)
4. [部署與監控](#部署與監控)

- --

## Edge Function 基礎

### 什麼是 Edge Function？

Edge Functions 是在 Supabase 邊緣網路上執行的無伺服器函數，使用 Deno 執行環境。

### 使用場景

| 場景 | 說明 | 範例 |
|------|------|------|
| **API 端點** | 自訂 API 邏輯 | Webhook 處理、第三方 API 整合 |
| **資料轉換** | 複雜的資料處理 | 報表生成、資料匯出 |
| **認證處理** | 自訂認證邏輯 | OAuth 流程、Token 驗證 |
| **定時任務** | 排程執行 | 資料同步、通知發送 |
| **事件處理** | 資料庫觸發器 | 新增資料後處理、快取更新 |

### 基本結構

```typescript
// supabase/functions/hello-world/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const { name } = await req.json();

  const data = {
    message: `Hello ${name}!`,
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Connection": "keep-alive"
    },
  });
});
```

- --

## 開發流程

### 1. 建立新函數

```bash
# 使用 Supabase CLI 建立
supabase functions new my-function

# 目錄結構
supabase/functions/
├── my-function/
│   └── index.ts
└── _shared/          # 共用程式碼
    ├── cors.ts
    └── supabase.ts
```

### 2. 函數模板

```typescript
// supabase/functions/my-function/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// 環境變數
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  // CORS 處理
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 建立 Supabase 客戶端
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 獲取請求資料
    const { action, data } = await req.json();

    // 驗證 JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid token");
    }

    // 業務邏輯
    let result;
    switch (action) {
      case "create":
        result = await handleCreate(supabase, user, data);
        break;
      case "update":
        result = await handleUpdate(supabase, user, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // 返回結果
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// 業務處理函數
async function handleCreate(supabase: any, user: any, data: any) {
  const { data: result, error } = await supabase
    .from("my_table")
    .insert({ ...data, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return result;
}

async function handleUpdate(supabase: any, user: any, data: any) {
  const { id, ...updates } = data;

  const { data: result, error } = await supabase
    .from("my_table")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return result;
}
```

### 3. CORS 配置

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
```

### 4. 共用 Supabase 客戶端

```typescript
// supabase/functions/_shared/supabase.ts
import { createClient } from "jsr:@supabase/supabase-js@2";

export function createSupabaseClient(authToken?: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = authToken || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  return createClient(supabaseUrl, supabaseKey);
}
```

- --

## 本地測試

### 1. 啟動本地開發

```bash
# 啟動 Supabase 本地環境
supabase start

# 啟動 Edge Function（開發模式）
supabase functions serve my-function --env-file .env.local

# 指定埠號
supabase functions serve my-function --port 54321
```

### 2. 測試請求

```bash
# 使用 curl 測試
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "create", "data": {"name": "Test"}}'

# 使用 HTTPie
http POST http://localhost:54321/functions/v1/my-function \
  Authorization:"Bearer YOUR_TOKEN" \
  action=create data:='{"name":"Test"}'
```

### 3. 查看日誌

```bash
# 即時查看日誌
supabase functions serve my-function --debug

# 查看遠端日誌
supabase functions logs my-function --tail 50
```

### 4. 單元測試

```typescript
// supabase/functions/my-function/index.test.ts
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { handler } from "./index.ts";

Deno.test("should return hello message", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    body: JSON.stringify({ name: "World" }),
  });

  const response = await handler(req);
  const data = await response.json();

  assertEquals(data.message, "Hello World!");
});
```

```bash
# 執行測試
deno test supabase/functions/my-function/index.test.ts
```

- --

## 部署與監控

### 1. 部署函數

```bash
# 部署單一函數
supabase functions deploy my-function

# 部署所有函數
supabase functions deploy

# 部署並設定環境變數
supabase secrets set MY_SECRET=value
supabase functions deploy my-function
```

### 2. 環境變數管理

```bash
# 設定 secret
supabase secrets set \
  API_KEY=xxx \
  DATABASE_URL=xxx

# 查看 secrets
supabase secrets list

# 刪除 secret
supabase secrets unset API_KEY
```

### 3. 函數配置

```typescript
// supabase/functions/my-function/config.json
{
  "verify_jwt": true,
  "import_map": "./import_map.json"
}
```

### 4. 監控與日誌

```bash
# 查看函數列表
supabase functions list

# 查看函數詳情
supabase functions describe my-function

# 即時日誌
supabase functions logs my-function --tail

# 錯誤日誌
supabase functions logs my-function --level error
```

### 5. 效能監控

```typescript
// 在函數中加入計時
Deno.serve(async (req: Request) => {
  const startTime = Date.now();

  try {
    // 處理邏輯
    const result = await processRequest(req);

    const duration = Date.now() - startTime;
    console.log(`Request processed in ${duration}ms`);

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": `${duration}ms`
      }
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
});
```

- --

## 最佳實踐

### 1. 錯誤處理

```typescript
// ✅ 好的錯誤處理
try {
  const result = await riskyOperation();
  return successResponse(result);
} catch (error) {
  console.error("Operation failed:", error);

  if (error.code === "PGRST116") {
    return errorResponse("Resource not found", 404);
  }

  return errorResponse(error.message, 500);
}

// 錯誤回應輔助函數
function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}
```

### 2. 輸入驗證

```typescript
import { z } from "https://deno.land/x/zod/mod.ts";

// 定義 schema
const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  assignee_id: z.string().uuid(),
});

// 驗證輸入
try {
  const validatedData = createTaskSchema.parse(inputData);
  // 使用 validatedData
} catch (error) {
  return errorResponse("Invalid input: " + error.message, 400);
}
```

### 3. 超時處理

```typescript
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// 使用
try {
  const result = await withTimeout(
    fetchExternalAPI(),
    5000  // 5 秒超時
  );
} catch (error) {
  if (error.message === "Operation timed out") {
    return errorResponse("Request timeout", 504);
  }
  throw error;
}
```

### 4. 快取策略

```typescript
const cache = new Map<string, { data: any; expires: number }>();

async function getCachedData(key: string, fetchFn: () => Promise<any>) {
  const cached = cache.get(key);

  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, {
    data,
    expires: Date.now() + 5 * 60 * 1000  // 5 分鐘
  });

  return data;
}
```

### 5. 分批處理

```typescript
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
  }
}

// 使用
await processBatch(tasks, 100, async (batch) => {
  await supabase.from("tasks").insert(batch);
});
```

- --

## 安全性

### 1. JWT 驗證

```typescript
async function verifyUser(req: Request, supabase: any) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired token");
  }

  return user;
}
```

### 2. 權限檢查

```typescript
async function checkPermission(
  supabase: any,
  userId: string,
  resource: string,
  action: string
) {
  const { data, error } = await supabase.rpc("check_permission", {
    p_user_id: userId,
    p_resource: resource,
    p_action: action
  });

  if (error) throw error;

  if (!data) {
    throw new Error("Permission denied");
  }
}
```

### 3. 速率限制

```typescript
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(userId: string, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];

  // 移除過期的請求記錄
  const validRequests = userRequests.filter(time => now - time < windowMs);

  if (validRequests.length >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }

  validRequests.push(now);
  rateLimiter.set(userId, validRequests);
}
```

- --

## 相關文檔

- [部署指南](./39-部署指南.md)
- [監控與告警配置指南](./56-監控與告警配置指南.md)
- [安全檢查清單](./41-安全檢查清單.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
