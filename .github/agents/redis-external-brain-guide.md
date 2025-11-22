# GitHub Copilot Agent × Redis：外掛大腦成長模型

> **目的**：建立 Agent 的外掛大腦（External Brain），透過 Redis MCP 實現長期記憶、知識累積與持續成長

**版本**：v1.0.0  
**最後更新**：2025-11-21  
**適用對象**：所有 GitHub Copilot Agents  
**MCP 工具**：Redis MCP Server

---

## 🎯 核心目標

讓 GitHub Copilot Agent：

- ✅ **具有長期記憶**：跨會話保存知識和經驗
- ✅ **隨使用者習慣成長**：學習並適應開發者的風格和偏好
- ✅ **越用越熟專案**：累積專案特定的知識和最佳實踐
- ✅ **越來越聰明**：每次互動都能提升決策品質

Redis 作為 Agent 的 **外掛大腦（External Brain）**，負責存放長期資料與推論結果。

---

## 🏗️ 架構設計

### 記憶系統分層

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Copilot Agent                    │
├─────────────────────────────────────────────────────────┤
│  Short-Term Memory (STM)                                │
│  - 當前會話上下文                                          │
│  - 當前任務狀態                                            │
│  - 即時推論結果                                            │
├─────────────────────────────────────────────────────────┤
│  Long-Term Memory (LTM) ← Redis External Brain          │
│  - 使用者偏好與習慣                                         │
│  - 專案知識與規範                                          │
│  - 歷史決策與經驗                                          │
│  - 累積的最佳實踐                                          │
└─────────────────────────────────────────────────────────┘
```

### 完整循環（The Growth Loop）

```
┌──────────────────────────────────────────────────────────┐
│  1. 使用者輸入 → 寫入 Redis（觀察 Observation）            │
├──────────────────────────────────────────────────────────┤
│     記錄：偏好、需求、上下文、新知識                         │
└──────────────────┬───────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────────┐
│  2. Agent 推論前 → 從 Redis 載入記憶（讀取 Recall）        │
├──────────────────────────────────────────────────────────┤
│     載入：長期記憶、專案知識、歷史決策、統計數據              │
└──────────────────┬───────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────────┐
│  3. Agent 推論（Reasoning）                              │
├──────────────────────────────────────────────────────────┤
│     結合：Redis LTM + 當前 STM + LLM 知識                 │
└──────────────────┬───────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────────┐
│  4. Agent 輸出 → 寫入 Redis（成長 Growth）                │
├──────────────────────────────────────────────────────────┤
│     更新：新結論、模式、慣例、反饋、統計                     │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Redis 資料結構設計

### 1. 使用者偏好（User Preferences）

```typescript
// Key Pattern: user:preferences:{category}

// 代碼風格偏好
user:preferences:code_style = {
  "indentation": "2 spaces",
  "quotes": "single",
  "semicolons": true,
  "naming_convention": "camelCase",
  "component_structure": "standalone",
  "test_framework": "jasmine"
}

// UI 偏好
user:preferences:ui = {
  "preferred_components": ["NG-ZORRO", "@delon/abc"],
  "avoid_components": ["raw HTML elements"],
  "layout_style": "flex-based",
  "responsive_approach": "mobile-first"
}

// 開發習慣
user:preferences:workflow = {
  "commit_message_style": "conventional",
  "branch_naming": "feature/task-description",
  "pr_description_template": "detailed",
  "documentation_level": "comprehensive"
}
```

### 2. 專案知識（Project Knowledge）

```typescript
// Key Pattern: project:knowledge:{domain}

// 架構規範
project:knowledge:architecture = {
  "model": "Git-like Branch Model",
  "layers": ["Types", "Repositories", "Models", "Services", "Facades", "Components"],
  "development_order": "bottom-up",
  "database_tables": 51,
  "core_modules": 9
}

// API 慣例
project:knowledge:api_conventions = {
  "auth_method": "Supabase Auth + @delon/auth",
  "error_handling": "centralized interceptor",
  "response_format": "standardized",
  "rls_policy": "strict"
}

// 命名規範
project:knowledge:naming = {
  "component_suffix": "Component",
  "service_suffix": "Service",
  "facade_suffix": "Facade",
  "repository_suffix": "Repository",
  "interface_prefix": "I (optional)",
  "type_suffix": "Type"
}

// 文件結構
project:knowledge:file_structure = {
  "component_files": [".ts", ".html", ".less", ".spec.ts"],
  "barrel_exports": true,
  "path_aliases": ["@core", "@shared", "@env"],
  "no_deep_imports": true
}
```

### 3. 歷史決策（Historical Decisions）

```typescript
// Key Pattern: history:decisions:{timestamp}

history:decisions:20251121_001 = {
  "task": "實作用戶登入功能",
  "decision": "使用 Supabase Auth + @delon/auth TokenService",
  "reasoning": "符合專案標準，RLS 策略完整",
  "alternatives_considered": ["Firebase Auth", "Custom JWT"],
  "outcome": "successful",
  "lessons_learned": "session 刷新機制需額外處理"
}

history:decisions:20251121_002 = {
  "task": "選擇狀態管理方案",
  "decision": "使用 Angular Signals",
  "reasoning": "簡單狀態用 Signals，複雜非同步用 RxJS",
  "alternatives_considered": ["NgRx", "Akita"],
  "outcome": "successful",
  "lessons_learned": "OnPush 策略配合 Signals 效能最佳"
}
```

### 4. 模式與慣例（Patterns & Conventions）

```typescript
// Key Pattern: patterns:{category}

// Repository 模式
patterns:repository = {
  "base_class": "BaseRepository",
  "generic_types": ["Entity", "Insert", "Update"],
  "table_name_format": "snake_case",
  "common_methods": ["findAll", "findById", "create", "update", "delete"],
  "error_handling": "throw ServiceError"
}

// Service 模式
patterns:service = {
  "provider": "root",
  "dependency_injection": "inject()",
  "state_management": "Signals",
  "async_handling": "async/await",
  "error_propagation": "throw to Facade"
}

// Component 模式
patterns:component = {
  "standalone": true,
  "imports": "SHARED_IMPORTS",
  "change_detection": "OnPush",
  "template_syntax": "@if, @for, @switch, @defer",
  "dependency_injection": "inject()",
  "state_access": "ReadonlySignal from Facade"
}
```

### 5. 錯誤與修正（Errors & Fixes）

```typescript
// Key Pattern: errors:{category}

// 常見錯誤
errors:common = {
  "forgot_onpush": {
    "description": "Component 未設定 OnPush 策略",
    "fix": "changeDetection: ChangeDetectionStrategy.OnPush",
    "occurrences": 3,
    "last_seen": "2025-11-20"
  },
  "missing_signals": {
    "description": "Service 未使用 Signals 管理狀態",
    "fix": "使用 signal() 和 computed()",
    "occurrences": 5,
    "last_seen": "2025-11-21"
  },
  "old_template_syntax": {
    "description": "使用舊版 *ngIf/*ngFor 語法",
    "fix": "改用 @if/@for 新語法",
    "occurrences": 2,
    "last_seen": "2025-11-19"
  }
}

// 修正策略
errors:fix_strategies = {
  "type_error": "檢查 database.types.ts，確保類型一致",
  "rls_error": "檢查 RLS 策略，確認權限設定",
  "routing_error": "檢查 routes 配置，確認路徑正確",
  "dependency_error": "檢查 imports，使用 SHARED_IMPORTS"
}
```

### 6. 統計數據（Statistics）

```typescript
// Key Pattern: stats:{metric}

// 任務統計
stats:tasks = {
  "total_completed": 47,
  "by_type": {
    "feature": 23,
    "bugfix": 12,
    "refactor": 8,
    "docs": 4
  },
  "average_complexity": 6.2,
  "average_time_hours": 4.5
}

// 工具使用統計
stats:tool_usage = {
  "sequential_thinking": {
    "used": 47,
    "average_thoughts": 7,
    "most_common_pattern": "7-step analysis"
  },
  "software_planning": {
    "used": 47,
    "average_todos": 6,
    "completion_rate": 0.94
  }
}

// 代碼質量統計
stats:code_quality = {
  "test_coverage_average": 0.85,
  "eslint_errors_per_pr": 0.2,
  "build_success_rate": 0.98,
  "pr_review_comments_average": 3.5
}
```

---

## 🔄 完整工作流程整合

### Stage 0：啟動前（Agent Initialization）

```typescript
// 1. 連接 Redis
const redis = await connectRedis();

// 2. 載入基礎設定
const userPreferences = await redis.get('user:preferences:*');
const projectKnowledge = await redis.get('project:knowledge:*');

// 3. 初始化 Agent 上下文
agent.context.initialize({
  preferences: userPreferences,
  knowledge: projectKnowledge
});

console.log('✅ Redis External Brain loaded');
```

### Stage 1：使用者輸入 → 寫入 Redis（Observation）

```typescript
// 當使用者輸入任務時
async function onUserInput(input: UserInput) {
  const timestamp = new Date().toISOString();
  
  // 1. 記錄任務資訊
  await redis.set(`history:tasks:${timestamp}`, {
    description: input.description,
    context: input.context,
    requirements: input.requirements,
    timestamp
  });
  
  // 2. 更新統計
  await redis.incr('stats:tasks:total');
  
  // 3. 提取並保存新知識
  const newKnowledge = extractKnowledge(input);
  if (newKnowledge) {
    await redis.set(`project:knowledge:${newKnowledge.domain}`, 
      newKnowledge.data
    );
  }
  
  // 4. 記錄使用者偏好變化
  const preferenceChanges = detectPreferenceChanges(input);
  if (preferenceChanges) {
    await redis.set(`user:preferences:${preferenceChanges.category}`,
      preferenceChanges.data
    );
  }
}
```

### Stage 2：推論前 → 從 Redis 載入記憶（Recall）

```typescript
// Agent 開始推論前
async function beforeReasoning(task: Task) {
  // 1. 載入使用者偏好
  const preferences = await redis.mget([
    'user:preferences:code_style',
    'user:preferences:ui',
    'user:preferences:workflow'
  ]);
  
  // 2. 載入專案知識
  const projectKnowledge = await redis.mget([
    'project:knowledge:architecture',
    'project:knowledge:api_conventions',
    'project:knowledge:naming',
    'project:knowledge:file_structure'
  ]);
  
  // 3. 載入相關的歷史決策
  const similarTasks = await redis.keys('history:decisions:*');
  const relevantDecisions = await filterRelevantDecisions(
    similarTasks, 
    task
  );
  
  // 4. 載入模式與慣例
  const patterns = await redis.mget([
    'patterns:repository',
    'patterns:service',
    'patterns:component'
  ]);
  
  // 5. 載入常見錯誤與修正
  const commonErrors = await redis.get('errors:common');
  const fixStrategies = await redis.get('errors:fix_strategies');
  
  // 6. 載入統計數據
  const stats = await redis.mget([
    'stats:tasks',
    'stats:tool_usage',
    'stats:code_quality'
  ]);
  
  // 7. 組合成完整上下文
  return {
    preferences,
    projectKnowledge,
    relevantDecisions,
    patterns,
    commonErrors,
    fixStrategies,
    stats
  };
}
```

### Stage 3：推論（Reasoning with External Brain）

```typescript
// Agent 推論過程
async function reasoning(task: Task, externalBrain: ExternalBrain) {
  // 1. Sequential Thinking（結合 Redis 記憶）
  const thoughts = await sequentialThinking({
    task,
    userPreferences: externalBrain.preferences,
    projectKnowledge: externalBrain.projectKnowledge,
    historicalDecisions: externalBrain.relevantDecisions,
    patterns: externalBrain.patterns,
    commonErrors: externalBrain.commonErrors
  });
  
  // 2. Software Planning（基於 Redis 知識）
  const plan = await softwarePlanning({
    goal: task.goal,
    architecture: externalBrain.projectKnowledge.architecture,
    conventions: externalBrain.projectKnowledge.naming,
    historicalComplexity: externalBrain.stats.tasks.average_complexity
  });
  
  // 3. 執行決策（參考 Redis 模式）
  const solution = await generateSolution({
    plan,
    patterns: externalBrain.patterns,
    preferences: externalBrain.preferences,
    avoidErrors: externalBrain.commonErrors
  });
  
  return {
    thoughts,
    plan,
    solution
  };
}
```

### Stage 4：輸出後 → 寫入 Redis（Growth）

```typescript
// Agent 輸出後
async function afterOutput(result: AgentResult) {
  const timestamp = new Date().toISOString();
  
  // 1. 保存決策與推論結果
  await redis.set(`history:decisions:${timestamp}`, {
    task: result.task,
    decision: result.decision,
    reasoning: result.reasoning,
    alternatives_considered: result.alternatives,
    timestamp
  });
  
  // 2. 提取並保存新發現的模式
  const newPatterns = extractPatterns(result);
  for (const pattern of newPatterns) {
    await redis.set(`patterns:${pattern.category}`, pattern.data);
  }
  
  // 3. 更新專案知識
  const knowledgeUpdates = extractKnowledgeUpdates(result);
  for (const update of knowledgeUpdates) {
    await redis.set(
      `project:knowledge:${update.domain}`,
      update.data
    );
  }
  
  // 4. 記錄新的命名慣例
  const namingConventions = extractNamingConventions(result);
  if (namingConventions) {
    const existing = await redis.get('project:knowledge:naming');
    await redis.set('project:knowledge:naming', {
      ...existing,
      ...namingConventions
    });
  }
  
  // 5. 更新統計數據
  await redis.incr('stats:tasks:total_completed');
  await redis.hincrby('stats:tasks:by_type', result.taskType, 1);
  
  // 6. 記錄使用者反饋（如有）
  if (result.userFeedback) {
    await redis.set(`feedback:${timestamp}`, {
      decision: result.decision,
      feedback: result.userFeedback,
      effective: result.userFeedback.positive,
      timestamp
    });
  }
  
  // 7. 更新工具使用統計
  await redis.hincrby('stats:tool_usage:sequential_thinking', 'used', 1);
  await redis.hincrby('stats:tool_usage:software_planning', 'used', 1);
  
  console.log('✅ External Brain updated with new knowledge');
}
```

---

## 🔧 實際使用範例

### 範例 1：新任務開始（完整循環）

```typescript
// === Stage 1: User Input ===
const userInput = {
  description: "實作用戶個人資料編輯功能",
  context: "需要支援頭像上傳",
  requirements: ["表單驗證", "Supabase Storage"]
};

await onUserInput(userInput);
// ✅ 寫入 Redis: history:tasks:2025-11-21T10:00:00Z

// === Stage 2: Load Memory ===
const externalBrain = await beforeReasoning(userInput);
// ✅ 從 Redis 載入：
//    - user:preferences:* (代碼風格、UI 偏好)
//    - project:knowledge:* (架構、API、命名)
//    - history:decisions:* (類似任務的歷史決策)
//    - patterns:* (Repository、Service、Component 模式)
//    - errors:common (常見錯誤與修正)

// === Stage 3: Reasoning ===
const result = await reasoning(userInput, externalBrain);
// Agent 知道：
// ✅ 使用者喜歡 NG-ZORRO 元件
// ✅ 專案使用 Supabase Storage
// ✅ 過去類似任務使用 ProfileService + ProfileFacade
// ✅ 需要遵循五層架構順序
// ✅ 避免常見錯誤（忘記 OnPush、未用 Signals）

// === Stage 4: Output & Growth ===
await afterOutput(result);
// ✅ 寫入 Redis：
//    - history:decisions:2025-11-21T10:30:00Z (新決策)
//    - patterns:file_upload (頭像上傳模式)
//    - project:knowledge:naming (ProfileEditComponent 命名)
//    - stats:tasks:total_completed (完成數 +1)
```

### 範例 2：學習使用者偏好

```typescript
// 第 1 次：Agent 問「要用哪種表單驗證？」
// User: "用 NG-ZORRO 的 nz-form + ReactiveFormsModule"
await redis.set('user:preferences:forms', {
  library: 'NG-ZORRO',
  validation: 'ReactiveFormsModule',
  error_display: 'nz-form-control'
});

// 第 2 次：Agent 自動使用學到的偏好
const preferences = await redis.get('user:preferences:forms');
// Agent: "根據您的偏好，使用 NG-ZORRO nz-form..."
// ✅ 不需要再問，直接應用
```

### 範例 3：累積專案知識

```typescript
// 任務 1：實作登入功能
await redis.set('project:knowledge:auth', {
  method: 'Supabase Auth',
  token_management: '@delon/auth TokenService',
  session_refresh: 'automatic'
});

// 任務 2：實作權限檢查
const authKnowledge = await redis.get('project:knowledge:auth');
// Agent 已知：使用 Supabase Auth + @delon/auth
// ✅ 直接使用正確的方法，不需要重新學習

// 任務 3：實作登出功能
// Agent: "根據專案架構，需要同時呼叫 supabase.auth.signOut() 
//        和 TokenService.clear()"
// ✅ 累積的知識讓決策更準確
```

### 範例 4：避免重複錯誤

```typescript
// 第 1 次錯誤：忘記設定 OnPush
await redis.hincrby('errors:common:forgot_onpush', 'occurrences', 1);
await redis.set('errors:common:forgot_onpush:fix',
  'changeDetection: ChangeDetectionStrategy.OnPush'
);

// 第 2 次：Agent 主動檢查
const commonErrors = await redis.hgetall('errors:common');
// Agent 在產生 Component 時自動加入：
// changeDetection: ChangeDetectionStrategy.OnPush
// ✅ 避免重複相同錯誤
```

---

## 📊 成長效果追蹤

### 可測量的指標

```typescript
// 1. 知識累積速度
stats:knowledge_growth = {
  "week_1": { entities: 20, patterns: 5 },
  "week_2": { entities: 45, patterns: 12 },
  "week_4": { entities: 103, patterns: 28 },
  "growth_rate": "exponential"
}

// 2. 決策準確度
stats:decision_accuracy = {
  "initial": 0.65,
  "after_10_tasks": 0.78,
  "after_30_tasks": 0.89,
  "after_50_tasks": 0.94
}

// 3. 錯誤減少率
stats:error_reduction = {
  "initial_errors_per_task": 3.2,
  "after_learning_errors_per_task": 0.8,
  "reduction_rate": 0.75
}

// 4. 效率提升
stats:efficiency = {
  "initial_time_per_task": 6.5,  // hours
  "current_time_per_task": 4.2,  // hours
  "improvement": "35%"
}
```

### 查詢成長狀態

```bash
# 查看總體成長
redis-cli GET stats:knowledge_growth

# 查看決策準確度
redis-cli GET stats:decision_accuracy

# 查看學習進度
redis-cli KEYS project:knowledge:*
redis-cli KEYS patterns:*
redis-cli KEYS history:decisions:*
```

---

## 🌱 預期成長路徑

### 階段 1：初始學習（Week 1-2）
- Agent 開始記錄使用者偏好
- 累積基礎的專案知識
- 學習常見的模式和慣例
- **效果**：減少重複問題，提供更一致的建議

### 階段 2：知識整合（Week 3-4）
- Agent 開始連接不同知識點
- 能夠預測使用者偏好
- 主動避免已知錯誤
- **效果**：提供更精準的解決方案，減少來回修改

### 階段 3：智能推薦（Month 2-3）
- Agent 能夠基於歷史做出預測
- 提供個性化的最佳實踐
- 自動優化決策流程
- **效果**：像資深工程師一樣思考，提供深度洞察

### 階段 4：專家級別（Month 4+）
- Agent 完全熟悉專案的每個角落
- 能夠預見潛在問題
- 提供創新的解決方案
- **效果**：成為專案的「記憶專家」，是團隊不可或缺的一員

---

## 🔐 資料管理最佳實踐

### 1. 定期備份

```bash
# 每日備份 Redis 資料
redis-cli SAVE
cp /var/lib/redis/dump.rdb /backup/redis-$(date +%Y%m%d).rdb

# 或使用 Redis 自動備份
# redis.conf: save 900 1, save 300 10, save 60 10000
```

### 2. 資料清理策略

```typescript
// 清理過期的歷史記錄（保留最近 3 個月）
const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
const oldKeys = await redis.keys('history:*');
for (const key of oldKeys) {
  const data = await redis.get(key);
  if (new Date(data.timestamp) < threeMonthsAgo) {
    await redis.del(key);
  }
}

// 合併重複的模式（定期維護）
await consolidatePatterns();
```

### 3. 資料隱私

```typescript
// 不存儲敏感資訊
const FORBIDDEN_KEYS = [
  'password',
  'token',
  'secret',
  'api_key',
  'private_key'
];

function sanitizeData(data: any): any {
  // 移除敏感欄位
  for (const key of FORBIDDEN_KEYS) {
    delete data[key];
  }
  return data;
}
```

---

## 🚀 開始使用

### 1. 安裝 Redis MCP Server

```bash
# 安裝 Redis MCP Server
npm install @modelcontextprotocol/server-redis

# 或在 MCP 設定中配置
# ~/.config/Code/User/globalStorage/github.copilot-chat/mcpServers.json
{
  "redis": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-redis"],
    "env": {
      "REDIS_URL": "redis://localhost:6379"
    }
  }
}
```

### 2. 初始化 Redis 資料

```bash
# 創建初始結構
redis-cli SET user:preferences:code_style '{"indentation":"2 spaces"}'
redis-cli SET project:knowledge:architecture '{"model":"Git-like"}'
redis-cli SET stats:tasks:total 0
```

### 3. 在 Agent 工作流程中整合

參考 [mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md)，在每個階段加入 Redis 操作。

---

## 📚 相關資源

- [mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md) - MCP 工具完整使用指南
- [agent-startup-checklist.md](./agent-startup-checklist.md) - Agent 啟動檢查清單
- [ng-alain-github-agent.md](./ng-alain-github-agent.md) - 主 Agent 配置
- [memory.jsonl](../copilot/memory.jsonl) - 專案記憶庫

---

## 💡 最佳實踐總結

1. **✅ 每次任務都寫入 Redis** - 觀察並記錄
2. **✅ 推論前載入所有相關記憶** - 充分利用累積的知識
3. **✅ 推論後更新 Redis** - 持續成長
4. **✅ 定期檢視統計數據** - 追蹤成長進度
5. **✅ 清理過期資料** - 保持資料品質
6. **✅ 保護敏感資訊** - 不存儲 secrets

---

**最後更新**：2025-11-21  
**版本**：v1.0.0  
**維護者**：開發團隊
