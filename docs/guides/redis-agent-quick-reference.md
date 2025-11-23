# Redis for GitHub Copilot Agent - Quick Reference

> **快速參考**：GitHub Copilot Agent 使用 Redis 的精簡指南

**版本**：v1.0.0  
**最後更新**：2025-11-21  
**完整文檔**：[Redis Agent Database Schema](../architecture/redis-agent-database-schema.md)

---

## 🎯 核心概念

### Redis 的角色

**Redis = Agent 的動態學習大腦**
- 📝 記錄用戶偏好與習慣
- 🧠 儲存專案特定知識
- 📊 追蹤決策與統計
- ⚡ 快取臨時數據

**與 memory.jsonl 的關係**：
- `memory.jsonl`：穩定的長期知識（149實體+170關係）
- `Redis`：動態的學習數據（用戶偏好、歷史、快取）

---

## 🔑 鍵命名速查

### 格式
\`\`\`
ngalain:{category}:{subcategory}:{identifier}
\`\`\`

### 常用鍵名

| 用途 | 鍵名 | TTL |
|------|------|-----|
| 專案元資料 | `ngalain:project:metadata` | 30天 |
| 代碼風格偏好 | `ngalain:user:preferences:code_style` | 30天 |
| UI 偏好 | `ngalain:user:preferences:ui` | 30天 |
| 工作流程偏好 | `ngalain:user:preferences:workflow` | 30天 |
| 架構知識 | `ngalain:knowledge:architecture` | 7天 |
| API 慣例 | `ngalain:knowledge:api_conventions` | 7天 |
| 命名規範 | `ngalain:knowledge:naming` | 7天 |
| 歷史決策 | `ngalain:history:decisions:{timestamp}` | 3天 |
| Repository 模式 | `ngalain:patterns:repository` | 7天 |
| Service 模式 | `ngalain:patterns:service` | 7天 |
| Component 模式 | `ngalain:patterns:component` | 7天 |
| 常見錯誤 | `ngalain:errors:common` | 7天 |
| 修正策略 | `ngalain:errors:fix_strategies` | 7天 |
| 任務統計 | `ngalain:stats:tasks` | 永久 |
| 工具使用統計 | `ngalain:stats:tool_usage` | 7天 |
| 會話狀態 | `ngalain:session:{session_id}` | 4小時 |
| 天氣快取 | `ngalain:cache:weather:{location}:{date}` | 6小時 |
| API 快取 | `ngalain:cache:api:{endpoint}:{params_hash}` | 1小時 |

---

## ⏰ TTL 速查表

| 級別 | 時長 | 秒數 | 適用 |
|------|------|------|------|
| 永久 | - | - | 統計數據 |
| 長期 | 30天 | 2592000 | 專案元資料、用戶偏好 |
| 中期 | 7天 | 604800 | 專案知識、模式 |
| 短期 | 3天 | 259200 | 歷史記錄 |
| 會話 | 4小時 | 14400 | 會話狀態 |
| 快取（長） | 6小時 | 21600 | 天氣數據 |
| 快取（短） | 1小時 | 3600 | API 回應 |

---

## 💻 常用操作

### 1. 讀取數據

\`\`\`typescript
// 讀取單一鍵值
const data = await redis.get('ngalain:project:metadata');
const parsed = JSON.parse(data);

// 讀取多個鍵值
const keys = [
  'ngalain:user:preferences:code_style',
  'ngalain:user:preferences:ui'
];
const values = await redis.mget(keys);
const parsed = values.map(v => v ? JSON.parse(v) : null);
\`\`\`

### 2. 寫入數據

\`\`\`typescript
// 寫入數據（帶 TTL）
const data = { /* your data */ };
await redis.set(
  'ngalain:user:preferences:code_style',
  JSON.stringify(data),
  { EX: 2592000 } // 30 天
);

// 更新現有數據
const existing = await redis.get('ngalain:user:preferences:code_style');
const parsed = JSON.parse(existing);
parsed.updated_at = new Date().toISO String();
parsed.usage_count += 1;
await redis.set(
  'ngalain:user:preferences:code_style',
  JSON.stringify(parsed),
  { EX: 2592000 }
);
\`\`\`

### 3. 查詢多個鍵（使用 SCAN）

\`\`\`typescript
// ✅ 正確：使用 SCAN（非阻塞）
let cursor = 0;
const keys: string[] = [];

do {
  const result = await redis.scan(cursor, {
    MATCH: 'ngalain:history:*',
    COUNT: 100
  });
  cursor = result.cursor;
  keys.push(...result.keys);
} while (cursor !== 0);

// ❌ 錯誤：使用 KEYS（會阻塞生產環境）
const keys = await redis.keys('ngalain:history:*'); // 不要這樣做！
\`\`\`

### 4. 刪除數據

\`\`\`typescript
// 刪除單一鍵
await redis.del('ngalain:session:abc123');

// 刪除多個鍵
await redis.del([
  'ngalain:cache:weather:taipei:20251121',
  'ngalain:cache:weather:taipei:20251120'
]);
\`\`\`

---

## 🔄 Agent 工作流程整合

### Stage 1: 啟動時載入（Agent Initialization）

\`\`\`typescript
async function initializeAgent() {
  // 1. 載入專案元資料
  const metadata = await redis.get('ngalain:project:metadata');
  
  // 2. 載入用戶偏好
  const preferences = await redis.mget([
    'ngalain:user:preferences:code_style',
    'ngalain:user:preferences:ui',
    'ngalain:user:preferences:workflow'
  ]);
  
  // 3. 載入專案知識
  const knowledge = await redis.mget([
    'ngalain:knowledge:architecture',
    'ngalain:knowledge:api_conventions',
    'ngalain:knowledge:naming'
  ]);
  
  // 4. 初始化 Agent 上下文
  agent.context = {
    metadata: JSON.parse(metadata),
    preferences: preferences.map(p => p ? JSON.parse(p) : null),
    knowledge: knowledge.map(k => k ? JSON.parse(k) : null)
  };
  
  console.log('✅ Agent initialized with Redis data');
}
\`\`\`

### Stage 2: 任務執行前載入相關知識

\`\`\`typescript
async function loadTaskContext(task: Task) {
  // 1. 載入相關模式
  const patterns = await redis.mget([
    'ngalain:patterns:repository',
    'ngalain:patterns:service',
    'ngalain:patterns:component'
  ]);
  
  // 2. 載入常見錯誤
  const errors = await redis.get('ngalain:errors:common');
  
  // 3. 載入修正策略
  const fixStrategies = await redis.get('ngalain:errors:fix_strategies');
  
  // 4. 載入相關歷史決策
  const historyKeys = await scanKeys('ngalain:history:decisions:*');
  const history = await redis.mget(historyKeys.slice(0, 10)); // 最近 10 個
  
  return {
    patterns: patterns.map(p => p ? JSON.parse(p) : null),
    errors: errors ? JSON.parse(errors) : {},
    fixStrategies: fixStrategies ? JSON.parse(fixStrategies) : {},
    history: history.map(h => h ? JSON.parse(h) : null).filter(Boolean)
  };
}
\`\`\`

### Stage 3: 任務完成後儲存知識

\`\`\`typescript
async function saveTaskResults(task: Task, result: TaskResult) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
  
  // 1. 儲存決策記錄
  await redis.set(
    `ngalain:history:decisions:${timestamp}`,
    JSON.stringify({
      task: task.description,
      task_type: task.type,
      decision: result.decision,
      reasoning: result.reasoning,
      outcome: result.success ? 'successful' : 'failed',
      timestamp: new Date().toISOString()
    }),
    { EX: 259200 } // 3 天
  );
  
  // 2. 更新統計數據
  const stats = await redis.get('ngalain:stats:tasks');
  const parsedStats = stats ? JSON.parse(stats) : initializeStats();
  parsedStats.total_completed += 1;
  parsedStats.by_type[task.type] = (parsedStats.by_type[task.type] || 0) + 1;
  parsedStats.updated_at = new Date().toISOString();
  await redis.set('ngalain:stats:tasks', JSON.stringify(parsedStats));
  
  // 3. 如果發現新模式，儲存
  if (result.newPattern) {
    await redis.set(
      `ngalain:patterns:${result.newPattern.category}`,
      JSON.stringify(result.newPattern),
      { EX: 604800 } // 7 天
    );
  }
  
  console.log('✅ Task results saved to Redis');
}
\`\`\`

### Stage 4: 錯誤處理與學習

\`\`\`typescript
async function handleError(error: Error, context: ErrorContext) {
  // 1. 載入常見錯誤
  const commonErrors = await redis.get('ngalain:errors:common');
  const errors = commonErrors ? JSON.parse(commonErrors) : {};
  
  // 2. 更新錯誤記錄
  const errorKey = generateErrorKey(error);
  if (errors[errorKey]) {
    errors[errorKey].occurrences += 1;
    errors[errorKey].last_seen = new Date().toISOString();
  } else {
    errors[errorKey] = {
      description: error.message,
      fix: context.suggestedFix || 'Unknown',
      occurrences: 1,
      last_seen: new Date().toISOString(),
      severity: context.severity || 'medium',
      category: context.category || 'general'
    };
  }
  
  // 3. 儲存更新的錯誤記錄
  await redis.set('ngalain:errors:common', JSON.stringify(errors), { EX: 604800 });
  
  // 4. 如果有修正策略，儲存
  if (context.fixStrategy) {
    const strategies = await redis.get('ngalain:errors:fix_strategies');
    const parsed = strategies ? JSON.parse(strategies) : {};
    parsed[errorKey] = context.fixStrategy;
    await redis.set('ngalain:errors:fix_strategies', JSON.stringify(parsed), { EX: 604800 });
  }
  
  console.log('✅ Error pattern learned');
}
\`\`\`

---

## 📊 資料結構範例

### 1. 專案元資料

\`\`\`json
{
  "name": "ng-alain-gighub",
  "version": "1.0.0",
  "tech_stack": {
    "frontend": ["Angular 20.3.x", "NG-ZORRO 20.3.x"],
    "backend": ["Supabase", "PostgreSQL 15+"]
  },
  "architecture": {
    "model": "Git-like Branch Model",
    "layers": 6,
    "database_tables": 51
  },
  "updated_at": "2025-11-21T13:00:00Z"
}
\`\`\`

### 2. 代碼風格偏好

\`\`\`json
{
  "indentation": "2 spaces",
  "quotes": "single",
  "semicolons": true,
  "component_structure": "standalone",
  "change_detection": "OnPush",
  "updated_at": "2025-11-21T13:00:00Z",
  "usage_count": 47
}
\`\`\`

### 3. 歷史決策

\`\`\`json
{
  "task": "實作用戶登入功能",
  "task_type": "feature",
  "decision": "使用 Supabase Auth + @delon/auth",
  "reasoning": "符合專案標準，RLS 策略完整",
  "outcome": "successful",
  "lessons_learned": "session 刷新需額外處理",
  "timestamp": "2025-11-21T13:00:00Z"
}
\`\`\`

### 4. 常見錯誤

\`\`\`json
{
  "forgot_onpush": {
    "description": "Component 未設定 OnPush 策略",
    "fix": "changeDetection: ChangeDetectionStrategy.OnPush",
    "occurrences": 3,
    "last_seen": "2025-11-20T15:30:00Z",
    "severity": "medium",
    "category": "performance"
  }
}
\`\`\`

---

## ✅ 最佳實踐

### DO（應該做的）

1. **✅ 總是設定 TTL**
   \`\`\`typescript
   await redis.set(key, value, { EX: 3600 }); // 總是設定過期時間
   \`\`\`

2. **✅ 使用 JSON 序列化**
   \`\`\`typescript
   await redis.set(key, JSON.stringify(data));
   const parsed = JSON.parse(await redis.get(key));
   \`\`\`

3. **✅ 處理錯誤並降級**
   \`\`\`typescript
   try {
     return await redis.get(key);
   } catch (error) {
     console.error('Redis error:', error);
     return await fallbackMethod(); // 降級到其他方法
   }
   \`\`\`

4. **✅ 使用 SCAN 而非 KEYS**
   \`\`\`typescript
   // 使用 SCAN 迭代，不阻塞
   const keys = await scanKeys('ngalain:*');
   \`\`\`

5. **✅ 更新時間戳**
   \`\`\`typescript
   data.updated_at = new Date().toISOString();
   data.usage_count = (data.usage_count || 0) + 1;
   \`\`\`

### DON'T（不應該做的）

1. **❌ 不要缺少 TTL**
   \`\`\`typescript
   // ❌ 錯誤：沒有 TTL，可能導致內存泄漏
   await redis.set(key, value);
   
   // ✅ 正確：設定 TTL
   await redis.set(key, value, { EX: 3600 });
   \`\`\`

2. **❌ 不要使用 KEYS 命令**
   \`\`\`typescript
   // ❌ 錯誤：KEYS 會阻塞 Redis
   const keys = await redis.keys('ngalain:*');
   
   // ✅ 正確：使用 SCAN
   const keys = await scanKeys('ngalain:*');
   \`\`\`

3. **❌ 不要存儲過大的值**
   \`\`\`typescript
   // ❌ 錯誤：10MB 的數據不應存在 Redis
   await redis.set(key, JSON.stringify(hugeDat));
   
   // ✅ 正確：存儲引用
   const url = await uploadToStorage(hugeData);
   await redis.set(key, url, { EX: 3600 });
   \`\`\`

4. **❌ 不要缺少錯誤處理**
   \`\`\`typescript
   // ❌ 錯誤：沒有錯誤處理
   const data = await redis.get(key);
   
   // ✅ 正確：處理錯誤
   try {
     const data = await redis.get(key);
     return data ? JSON.parse(data) : null;
   } catch (error) {
     console.error('Redis error:', error);
     return null;
   }
   \`\`\`

---

## 🔧 實用工具函數

### 掃描鍵（非阻塞）

\`\`\`typescript
async function scanKeys(pattern: string): Promise<string[]> {
  let cursor = 0;
  const keys: string[] = [];
  
  do {
    const result = await redis.scan(cursor, {
      MATCH: pattern,
      COUNT: 100
    });
    cursor = result.cursor;
    keys.push(...result.keys);
  } while (cursor !== 0);
  
  return keys;
}
\`\`\`

### 批次讀取並解析

\`\`\`typescript
async function batchGetAndParse(keys: string[]): Promise<any[]> {
  const values = await redis.mget(keys);
  return values.map(v => {
    try {
      return v ? JSON.parse(v) : null;
    } catch (error) {
      console.error(`Failed to parse value for key:`, error);
      return null;
    }
  });
}
\`\`\`

### 更新並保留元資料

\`\`\`typescript
async function updateWithMetadata(
  key: string,
  updates: Partial<any>,
  ttl: number
): Promise<void> {
  const existing = await redis.get(key);
  const parsed = existing ? JSON.parse(existing) : {};
  
  const updated = {
    ...parsed,
    ...updates,
    updated_at: new Date().toISOString(),
    usage_count: (parsed.usage_count || 0) + 1
  };
  
  await redis.set(key, JSON.stringify(updated), { EX: ttl });
}
\`\`\`

### 安全刪除（帶日誌）

\`\`\`typescript
async function safeDelete(key: string): Promise<boolean> {
  try {
    const existing = await redis.get(key);
    if (existing) {
      console.log(`Deleting key: ${key}`, JSON.parse(existing));
      await redis.del(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to delete key ${key}:`, error);
    return false;
  }
}
\`\`\`

---

## 📚 相關資源

### 完整文檔
- [Redis Agent Database Schema](../architecture/redis-agent-database-schema.md) - 完整的 Schema 定義
- [Redis External Brain Guide](../../.github/agents/redis-external-brain-guide.md) - Redis 外掛大腦指南
- [Redis Usage Guide](./redis-usage-guide.md) - Redis 使用指南（含反模式）

### Agent 配置
- [Agent Startup Checklist](../../.github/agents/agent-startup-checklist.md) - Agent 啟動檢查清單
- [Memory Usage Guide](../../.github/agents/memory-usage-guide.md) - memory.jsonl 使用指南
- [Main Agent Configuration](../../.github/agents/ng-alain-github-agent.md) - 主 Agent 配置

### 架構文檔
- [System Architecture Mindmap](../architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構
- [Complete Architecture Flowchart](../20-完整架構流程圖.mermaid.md) - Git-like 分支模型
- [SQL Table Structure](../22-完整SQL表結構定義.md) - 51 張表結構

---

**最後更新**：2025-11-21  
**維護者**：開發團隊  
**版本**：v1.0.0
