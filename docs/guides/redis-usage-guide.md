# Redis 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [Redis 在項目中的定位](#redis-在項目中的定位)
  - [架構限制](#架構限制)
  - [Redis MCP 配置](#redis-mcp-配置)
- [項目中的使用場景](#項目中的使用場景)
  - [1. 天氣數據快取](#1-天氣數據快取)
  - [2. 分析數據預計算快取](#2-分析數據預計算快取)
  - [3. Session 管理（可選）](#3-session-管理可選)
- [最佳實踐](#最佳實踐)
  - [1. 鍵命名規範](#1-鍵命名規範)
  - [2. 設置過期時間（TTL）](#2-設置過期時間ttl)
  - [3. 序列化和反序列化](#3-序列化和反序列化)
  - [4. 錯誤處理](#4-錯誤處理)
  - [5. 使用 Pipeline 批量操作](#5-使用-pipeline-批量操作)
- [反模式（重點）⚠️](#反模式重點)
  - [1. ❌ 使用 KEYS 命令](#1--使用-keys-命令)
  - [2. ❌ 缺少過期時間（TTL）](#2--缺少過期時間ttl)
  - [3. ❌ 在全局對象存儲狀態](#3--在全局對象存儲狀態)
  - [4. ❌ 本地會話存儲](#4--本地會話存儲)
  - [5. ❌ 存儲過大的值](#5--存儲過大的值)
  - [6. ❌ 缺少錯誤處理](#6--缺少錯誤處理)
  - [7. ❌ 使用 LOAD * 投影（Redis Search）](#7--使用-load--投影redis-search)
  - [8. ❌ 缺少 SORTABLE 標誌（Redis Search）](#8--缺少-sortable-標誌redis-search)
  - [9. ❌ 手動構建事務（Node Redis）](#9--手動構建事務node-redis)
  - [10. ❌ 沒有監控和告警](#10--沒有監控和告警)
- [項目特定指南](#項目特定指南)
  - [1. 通過 Edge Function 使用 Redis](#1-通過-edge-function-使用-redis)
  - [2. 鍵命名規範](#2-鍵命名規範)
  - [3. 數據結構規範](#3-數據結構規範)
  - [4. 更新策略](#4-更新策略)
- [快速參考](#快速參考)
  - [✅ 什麼能做](#-什麼能做)
  - [❌ 什麼不能做](#-什麼不能做)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：提供 Redis 在 ng-alain-gighub 项目中的使用指南，重点说明最佳实践和反模式，让开发过程能快速知道什么能做、什么不能做

**最後更新**：2025-01-15
**版本**：v1.0
**維護者**：開發團隊

- --

## 📋 目錄

1. [概述](#概述)
2. [項目中的使用場景](#項目中的使用場景)
3. [最佳實踐](#最佳實踐)
4. [反模式（重點）](#反模式重點) ⚠️
5. [項目特定指南](#項目特定指南)
6. [快速參考](#快速參考)
7. [相關文檔](#相關文檔)

- --

## 概述

### Redis 在項目中的定位

Redis 在 ng-alain-gighub 項目中作為**可選的快取層**，主要用於：

- **天氣數據快取**：Edge Function 中緩存天氣 API 響應（TTL: 6h）
- **分析數據預計算快取**：緩存分析結果，減少數據庫查詢
- **Session 管理**（可選）：存儲用戶會話信息
- **熱點數據緩存**：頻繁訪問的數據緩存

### 架構限制

⚠️ **重要限制**：Angular 前端**無法直接連接 Redis**（瀏覽器安全限制）

**解決方案**：
- 通過 **Supabase Edge Functions** 作為中間層
- 前端通過 HTTP 調用 Edge Function
- Edge Function 內部使用 Redis MCP 工具操作 Redis

### Redis MCP 配置

項目已配置 Redis MCP 工具，連接信息位於 `mcp.json`：

```json
{
  "redis": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-redis",
      "redis://default:...@redis-13923.c299.asia-northeast1-1.gce.cloud.redislabs.com:13923"
    ]
  }
}
```

- --

## 項目中的使用場景

### 1. 天氣數據快取

**場景**：Edge Function `weather-api` 緩存天氣 API 響應

```typescript
// Edge Function 示例（Deno）
const cacheKey = `weather:${location}:${date}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// 調用天氣 API
const weatherData = await fetchWeatherAPI(location, date);

// 緩存 6 小時
await redis.set(cacheKey, JSON.stringify(weatherData), { EX: 21600 });

return weatherData;
```

### 2. 分析數據預計算快取

**場景**：緩存分析結果，減少數據庫查詢壓力

```typescript
// Edge Function 示例
const cacheKey = `analytics:blueprint:${blueprintId}:${dateRange}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// 計算分析數據
const analytics = await calculateAnalytics(blueprintId, dateRange);

// 緩存 1 小時
await redis.set(cacheKey, JSON.stringify(analytics), { EX: 3600 });

return analytics;
```

### 3. Session 管理（可選）

**場景**：存儲用戶會話信息（如果使用 Redis Session Store）

```typescript
// Edge Function 示例
const sessionKey = `session:${sessionId}`;
const sessionData = {
  userId: user.id,
  expiresAt: Date.now() + 3600000, // 1 小時
  // ... 其他會話數據
};

await redis.set(sessionKey, JSON.stringify(sessionData), { EX: 3600 });
```

- --

## 最佳實踐

### 1. 鍵命名規範

✅ **使用語義化、層次化的鍵名**

```typescript
// ✅ 好的做法
const cacheKey = `weather:${location}:${date}`;
const sessionKey = `session:${sessionId}`;
const analyticsKey = `analytics:blueprint:${blueprintId}:${dateRange}`;

// ❌ 避免
const badKey = `key1`; // 沒有語義
const badKey2 = `w:${location}`; // 縮寫不明確
```

**命名規則**：
- 使用 `:` 分隔層次
- 使用 kebab-case 或 camelCase
- 包含足夠的上下文信息
- 避免縮寫（除非是通用縮寫）

### 2. 設置過期時間（TTL）

✅ **總是為緩存數據設置 TTL**

```typescript
// ✅ 好的做法
await redis.set(key, value, { EX: 3600 }); // 1 小時後過期
await redis.set(key, value, { PX: 3600000 }); // 1 小時後過期（毫秒）

// ❌ 避免（除非數據真的需要永久存儲）
await redis.set(key, value); // 沒有過期時間，可能導致內存泄漏
```

**TTL 建議**：
- 天氣數據：6 小時（21600 秒）
- 分析數據：1 小時（3600 秒）
- Session：30 分鐘到 1 小時（1800-3600 秒）
- 熱點數據：根據更新頻率設置

### 3. 序列化和反序列化

✅ **使用 JSON 序列化複雜數據**

```typescript
// ✅ 好的做法
const data = { userId: '123', name: 'John' };
await redis.set(key, JSON.stringify(data), { EX: 3600 });

const cached = await redis.get(key);
if (cached) {
  const parsed = JSON.parse(cached);
}

// ❌ 避免（簡單字符串可以直接存儲）
await redis.set(key, JSON.stringify('simple string')); // 過度序列化
```

### 4. 錯誤處理

✅ **總是處理 Redis 操作錯誤**

```typescript
// ✅ 好的做法
try {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
} catch (error) {
  console.error('Redis get error:', error);
  // 降級到數據庫查詢
  return await fetchFromDatabase();
}

// ❌ 避免
const cached = await redis.get(key); // 沒有錯誤處理
```

### 5. 使用 Pipeline 批量操作

✅ **批量操作時使用 Pipeline**

```typescript
// ✅ 好的做法（如果 Redis MCP 支持）
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();

// ❌ 避免（多次網絡往返）
await redis.set('key1', 'value1');
await redis.set('key2', 'value2');
await redis.set('key3', 'value3');
```

- --

## 反模式（重點）⚠️

> **目的**：讓開發過程能快速知道**什麼不能做**，避免常見錯誤

### 1. ❌ 使用 KEYS 命令

**問題**：`KEYS` 命令會阻塞 Redis 服務器，影響性能

```typescript
// ❌ 絕對不要這樣做（生產環境）
const keys = await redis.keys('user:*'); // 阻塞整個 Redis 服務器！

// ✅ 正確做法：使用 SCAN 命令進行增量迭代
let cursor = 0;
const keys: string[] = [];

do {
  const result = await redis.scan(cursor, { MATCH: 'user:*', COUNT: 100 });
  cursor = result.cursor;
  keys.push(...result.keys);
} while (cursor !== 0);
```

**為什麼不能這樣做**：
- `KEYS` 命令會掃描整個鍵空間，阻塞 Redis 服務器
- 在大型數據集上可能導致服務器無響應
- 影響所有客戶端的性能

**正確做法**：
- 使用 `SCAN` 命令進行增量迭代
- 每次迭代處理少量鍵（COUNT 參數）
- 非阻塞，不影響其他操作

- --

### 2. ❌ 缺少過期時間（TTL）

**問題**：沒有設置 TTL 的鍵會永久存儲，導致內存泄漏

```typescript
// ❌ 絕對不要這樣做
await redis.set('cache:key', value); // 沒有過期時間！

// ✅ 正確做法：總是設置 TTL
await redis.set('cache:key', value, { EX: 3600 }); // 1 小時後過期
```

**為什麼不能這樣做**：
- Redis 是內存數據庫，沒有 TTL 的鍵會永久占用內存
- 隨著時間推移，內存使用會不斷增長
- 最終可能導致 Redis 內存耗盡，服務不可用

**正確做法**：
- **總是為緩存數據設置 TTL**
- 根據數據更新頻率選擇合適的 TTL
- 定期檢查和清理過期鍵

- --

### 3. ❌ 在全局對象存儲狀態

**問題**：將應用狀態存儲在全局對象中，無法擴展，重啟丟失數據

```typescript
// ❌ 絕對不要這樣做（Edge Function 中）
// 全局對象在函數實例間不共享，重啟會丟失
Global.someCache = { data: 'value' };

// ✅ 正確做法：使用 Redis 存儲狀態
await redis.set('cache:key', JSON.stringify({ data: 'value' }), { EX: 3600 });
```

**為什麼不能這樣做**：
- Edge Function 是無狀態的，全局對象在實例間不共享
- 函數重啟會丟失所有數據
- 無法在多個實例間共享狀態
- 無法擴展到多個服務器

**正確做法**：
- 使用 Redis 存儲需要共享的狀態
- 使用數據庫存儲持久化數據
- 保持函數無狀態

- --

### 4. ❌ 本地會話存儲

**問題**：使用本地文件或內存存儲會話，無法擴展，重啟丟失會話

```typescript
// ❌ 絕對不要這樣做
// 使用本地文件存儲會話（Edge Function 不支持文件系統持久化）
const FileStore = require('session-file-store')(session);

// ✅ 正確做法：使用 Redis 存儲會話
const RedisStore = require('connect-redis')(session);
// 或使用 Supabase Database 存儲會話
```

**為什麼不能這樣做**：
- Edge Function 不支持文件系統持久化
- 會話數據在函數重啟後丟失
- 無法在多個實例間共享會話
- 無法擴展到多個服務器

**正確做法**：
- 使用 Redis 存儲會話（如果使用 Redis Session Store）
- 使用 Supabase Database 存儲會話（推薦）
- 使用 JWT Token（無狀態，推薦）

- --

### 5. ❌ 存儲過大的值

**問題**：存儲過大的值會導致性能問題和內存壓力

```typescript
// ❌ 避免存儲過大的值（> 1MB）
const hugeData = await fetchHugeData(); // 假設 10MB
await redis.set('huge:key', JSON.stringify(hugeData)); // 不推薦

// ✅ 正確做法：存儲引用或分塊存儲
// 方案 1：存儲引用（存儲在 Supabase Storage）
const storageUrl = await uploadToStorage(hugeData);
await redis.set('huge:key:ref', storageUrl, { EX: 3600 });

// 方案 2：分塊存儲
const chunks = chunkData(hugeData, 100000); // 每塊 100KB
for (let i = 0; i < chunks.length; i++) {
  await redis.set(`huge:key:chunk:${i}`, JSON.stringify(chunks[i]), { EX: 3600 });
}
```

**為什麼不能這樣做**：
- Redis 是內存數據庫，大值會占用大量內存
- 序列化/反序列化大值會消耗 CPU
- 網絡傳輸大值會增加延遲
- 可能導致 Redis 內存耗盡

**正確做法**：
- 存儲小於 1MB 的值
- 大數據存儲在 Supabase Storage，Redis 只存儲引用
- 使用分塊存儲（如果必須存儲大數據）

- --

### 6. ❌ 缺少錯誤處理

**問題**：Redis 操作可能失敗，缺少錯誤處理會導致應用崩潰

```typescript
// ❌ 絕對不要這樣做
const cached = await redis.get(key); // 沒有錯誤處理
const data = JSON.parse(cached); // 如果 cached 為 null，會報錯

// ✅ 正確做法：總是處理錯誤和 null 值
try {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  // 緩存未命中，從數據庫獲取
  return await fetchFromDatabase();
} catch (error) {
  console.error('Redis error:', error);
  // 降級到數據庫查詢
  return await fetchFromDatabase();
}
```

**為什麼不能這樣做**：
- Redis 可能不可用（網絡問題、服務器故障）
- 操作可能失敗（內存不足、權限問題）
- 缺少錯誤處理會導致應用崩潰
- 用戶體驗差

**正確做法**：
- **總是使用 try-catch 處理 Redis 操作**
- 檢查 null 值（緩存未命中）
- 實現降級策略（Redis 不可用時使用數據庫）
- 記錄錯誤日誌

- --

### 7. ❌ 使用 LOAD * 投影（Redis Search）

**問題**：在 Redis Search 查詢中使用 `LOAD *` 會加載所有字段，浪費資源

```redis
# ❌ 絕對不要這樣做（Redis Search）
FT.AGGREGATE jsonidx:profiles '@t:[1299 1299]' LOAD * LIMIT 0 10

# ✅ 正確做法：只加載需要的字段
FT.AGGREGATE jsonidx:profiles '@t:[1299 1299]' LOAD 6 id t name lastname loc ver LIMIT 0 10
```

**為什麼不能這樣做**：
- 加載所有字段會浪費網絡帶寬
- 增加序列化/反序列化開銷
- 影響查詢性能
- 可能加載不需要的數據

**正確做法**：
- 只加載查詢和結果集需要的字段
- 在索引定義中包含這些字段
- 使用 `SORTABLE` 標誌優化排序字段

- --

### 8. ❌ 缺少 SORTABLE 標誌（Redis Search）

**問題**：在 Redis Search 索引中缺少 `SORTABLE` 標誌，無法高效排序

```redis
# ❌ 絕對不要這樣做（Redis Search）
FT.CREATE jsonidx:profiles ON JSON PREFIX 1 profiles:
          SCHEMA $.firstName as name TEXT

# ✅ 正確做法：為需要排序的字段添加 SORTABLE 標誌
FT.CREATE jsonidx:profiles ON JSON PREFIX 1 profiles:
          SCHEMA $.firstName as name TEXT NOSTEM SORTABLE
```

**為什麼不能這樣做**：
- 缺少 `SORTABLE` 標誌會導致排序性能差
- 可能需要在內存中排序，消耗 CPU
- 影響查詢響應時間

**正確做法**：
- 為需要排序的字段添加 `SORTABLE` 標誌
- 使用 `NOSTEM` 選項優化文本字段
- 使用 `UNF` 選項優化 TAG 和 GEO 字段

- --

### 9. ❌ 手動構建事務（Node Redis）

**問題**：手動發送 MULTI/EXEC 命令可能導致事務失敗

```typescript
// ❌ 絕對不要這樣做
await client.sendCommand(['MULTI']);
await client.sendCommand(['SET', 'key1', 'value1']);
await client.sendCommand(['SET', 'key2', 'value2']);
await client.sendCommand(['EXEC']); // 風險：AUTH 命令可能在 EXEC 前注入

// ✅ 正確做法：使用事務方法
const multi = client.multi();
multi.set('key1', 'value1');
multi.set('key2', 'value2');
await multi.exec();
```

**為什麼不能這樣做**：
- 手動構建事務容易出錯
- 可能導致事務失敗
- 代碼可讀性差

**正確做法**：
- 使用客戶端提供的事務方法
- 確保事務的原子性
- 處理事務失敗的情況

- --

### 10. ❌ 沒有監控和告警

**問題**：沒有監控 Redis 使用情況，無法及時發現問題

```typescript
// ❌ 缺少監控
await redis.set(key, value);

// ✅ 正確做法：添加監控和日誌
try {
  const startTime = Date.now();
  await redis.set(key, value);
  const duration = Date.now() - startTime;

  // 記錄操作日誌
  console.log(`Redis SET: key=${key}, duration=${duration}ms`);

  // 發送到監控系統（如果配置）
  // monitor.recordMetric('redis.set.duration', duration);
} catch (error) {
  // 記錄錯誤
  console.error('Redis SET error:', error);
  // 發送告警
  // alert.send('Redis operation failed', error);
}
```

**為什麼不能這樣做**：
- 無法及時發現性能問題
- 無法追蹤內存使用情況
- 無法發現錯誤和異常
- 無法優化使用模式

**正確做法**：
- 監控 Redis 操作延遲
- 監控內存使用情況
- 設置告警（內存使用率、錯誤率）
- 記錄操作日誌

- --

## 項目特定指南

### 1. 通過 Edge Function 使用 Redis

由於 Angular 前端無法直接連接 Redis，必須通過 Supabase Edge Function：

```typescript
// Edge Function: supabase/functions/redis-cache/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 注意：Edge Function 中需要使用 Redis HTTP 客戶端或通過環境變數配置
// 這裡是概念示例，實際實現需要根據 Redis MCP 工具調整

serve(async (req) => {
  const { key, value, ttl } = await req.json();

  // 通過 Redis MCP 或 HTTP 客戶端操作 Redis
  // 實際實現需要根據項目配置調整

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### 2. 鍵命名規範

項目使用以下鍵命名規範：

```typescript
// 格式：project:ng-alain-gighub:{category}:{identifier}
const keys = {
  metadata: 'project:ng-alain-gighub:metadata',
  architecture: 'project:ng-alain-gighub:architecture',
  redisAntiPatterns: 'project:ng-alain-gighub:redis:anti-patterns',
  weatherCache: `weather:${location}:${date}`,
  analyticsCache: `analytics:blueprint:${blueprintId}:${dateRange}`,
  session: `session:${sessionId}`,
};
```

### 3. 數據結構規範

存儲在 Redis 中的數據應遵循以下結構：

```typescript
interface RedisData {
  // 必需字段
  topics: string[]; // 主題標籤
  created_at: string; // ISO 8601 格式

  // 可選字段
  updated_at?: string; // ISO 8601 格式
  version?: string; // 版本號
  description?: string; // 描述

  // 數據內容
  [key: string]: any; // 實際數據
}
```

### 4. 更新策略

更新 Redis 數據時應遵循：

- **向後兼容**：新增字段應該是可選的
- **保持結構**：保持現有 JSON 結構
- **更新時間戳**：每次更新必須更新 `updated_at`
- **版本追蹤**：重大變更考慮添加 `version` 字段

- --

## 快速參考

### ✅ 什麼能做

- ✅ 使用 `SCAN` 命令迭代鍵
- ✅ 為所有緩存數據設置 TTL
- ✅ 使用語義化、層次化的鍵名
- ✅ 使用 JSON 序列化複雜數據
- ✅ 總是處理錯誤和 null 值
- ✅ 實現降級策略（Redis 不可用時使用數據庫）
- ✅ 監控 Redis 操作和內存使用
- ✅ 通過 Edge Function 使用 Redis（前端無法直接連接）

### ❌ 什麼不能做

- ❌ **絕對不要**使用 `KEYS` 命令（生產環境）
- ❌ **絕對不要**缺少過期時間（TTL）
- ❌ **絕對不要**在全局對象存儲狀態
- ❌ **絕對不要**使用本地會話存儲
- ❌ **避免**存儲過大的值（> 1MB）
- ❌ **絕對不要**缺少錯誤處理
- ❌ **避免**使用 `LOAD *` 投影（Redis Search）
- ❌ **避免**缺少 `SORTABLE` 標誌（Redis Search）
- ❌ **絕對不要**手動構建事務
- ❌ **避免**沒有監控和告警

- --

## 相關文檔

- [容器圖](./10-容器圖.mermaid.md) - Redis 在架構中的位置
- [資料生命週期-ETL-流程圖](./07-資料生命週期-ETL-流程圖.mermaid.md) - 快取策略
- [效能優化指南](./33-效能優化指南.md) - 快取優化
- [第三方服務整合指南](./56-第三方服務整合指南.md) - 服務整合最佳實踐
- [Edge Function 開發指南](./51-Edge-Function開發指南.md) - Edge Function 使用 Redis

- --

**最後更新**：2025-01-15
**維護者**：開發團隊

