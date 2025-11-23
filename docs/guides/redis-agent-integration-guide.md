# Redis 知識庫整合至 Agent 配置

> **目的**：指導如何在 Agent 配置文件中整合 Redis 資料庫架構知識

**版本**：v1.0.0  
**最後更新**：2025-11-21

---

## 📋 整合檢查清單

### 1. Agent 啟動時應查閱的 Redis 知識

在 `.github/agents/agent-startup-checklist.md` 中添加：

\`\`\`markdown
### Step 3: 查閱 Redis 外掛大腦（可選，如已配置）

如專案已配置 Redis MCP，Agent 應：

**檢查項目**：
- [ ] 查閱 Redis 資料庫架構文檔
  - `docs/architecture/redis-agent-database-schema.md`
  - `docs/guides/redis-agent-quick-reference.md`
- [ ] 了解 Redis 鍵命名規範（`ngalain:*`）
- [ ] 了解 TTL 策略（5 級）
- [ ] 了解 9 種核心資料結構
- [ ] 確認 Redis MCP 連接狀態

**快速檢查命令**：
\`\`\`bash
# 查看專案元資料
redis-cli GET "ngalain:project:metadata"

# 查看可用的鍵
redis-cli --scan --pattern "ngalain:*" | head -20
\`\`\`
\`\`\`

### 2. Agent 任務執行時應使用 Redis

在 Agent 工作流程中整合：

#### 任務開始前

\`\`\`typescript
// 1. 載入用戶偏好
const preferences = await loadUserPreferences();

// 2. 載入專案知識
const knowledge = await loadProjectKnowledge();

// 3. 載入相關歷史
const history = await loadRelevantHistory(task.type);

// 4. 載入模式與錯誤
const patterns = await loadPatterns();
const errors = await loadCommonErrors();
\`\`\`

#### 任務完成後

\`\`\`typescript
// 1. 儲存決策記錄
await saveDecision(task, result);

// 2. 更新統計數據
await updateStatistics(task, result);

// 3. 儲存新發現的模式
if (result.newPattern) {
  await savePattern(result.newPattern);
}

// 4. 記錄錯誤（如有）
if (result.errors) {
  await recordErrors(result.errors);
}
\`\`\`

### 3. memory.jsonl 更新

已添加以下實體至 `.github/copilot/memory.jsonl`：

1. **Redis Agent Database** - Redis 外掛大腦概述
2. **Redis Key Naming Convention** - 鍵命名規範
3. **Redis TTL Strategy** - TTL 策略
4. **Redis Data Structures for Agent** - 9 種資料結構
5. **Redis Query Patterns** - 查詢模式
6. **Redis Best Practices for Agent** - 最佳實踐
7. **Redis Agent Workflow Integration** - 工作流程整合

以及 9 個關係連接這些實體。

### 4. 相關文檔連結

在 Agent 配置中添加 Redis 文檔連結：

\`\`\`markdown
### Redis 外掛大腦

- [Redis Agent Database Schema](../../docs/architecture/redis-agent-database-schema.md) - 完整 Schema 定義
- [Redis Agent Quick Reference](../../docs/guides/redis-agent-quick-reference.md) - 快速參考（⭐ 推薦）
- [Redis External Brain Guide](./redis-external-brain-guide.md) - 外掛大腦指南
- [Redis Usage Guide](../../docs/guides/redis-usage-guide.md) - 使用指南（含反模式）
\`\`\`

---

## 🔄 Agent 配置更新建議

### 主 Agent 配置（ng-alain-github-agent.md）

在"知識來源"章節添加：

\`\`\`markdown
### Redis 外掛大腦（動態學習）

**用途**：儲存動態學習數據，與 memory.jsonl 互補

**存儲內容**：
- 用戶偏好與習慣
- 專案特定知識
- 歷史決策與經驗
- 統計數據與成長追蹤

**查詢方式**：
- 透過 Redis MCP 工具
- 使用 `ngalain:*` 命名空間
- 參考快速參考指南

**快速參考**：`docs/guides/redis-agent-quick-reference.md` ⭐
\`\`\`

### 記憶庫使用指南（memory-usage-guide.md）

在"記憶系統分層"章節補充：

\`\`\`markdown
### 三層記憶系統

\`\`\`
┌─────────────────────────────────────────────────┐
│ Layer 1: memory.jsonl（長期知識圖譜）             │
│ - 149 實體 + 170 關係                            │
│ - 經過驗證的架構、標準、模式                       │
│ - 穩定不變的最佳實踐                              │
└─────────────────────────────────────────────────┘
         ↓ 互補
┌─────────────────────────────────────────────────┐
│ Layer 2: Redis（動態學習資料庫）                  │
│ - 用戶偏好、專案知識、歷史決策                     │
│ - 統計數據、會話狀態、臨時快取                     │
│ - 動態更新的學習數據                              │
└─────────────────────────────────────────────────┘
         ↓ 支援
┌─────────────────────────────────────────────────┐
│ Layer 3: 工作記憶（Agent 當前上下文）             │
│ - 當前任務狀態                                   │
│ - 即時推論結果                                   │
│ - 臨時變量                                       │
└─────────────────────────────────────────────────┘
\`\`\`
\`\`\`

---

## 📝 使用範例

### 範例 1：Agent 啟動時載入 Redis 知識

\`\`\`typescript
// 在 Agent 初始化時
async function initializeWithRedis() {
  console.log('📊 Loading Redis external brain...');
  
  try {
    // 1. 載入專案元資料
    const metadata = await redis.get('ngalain:project:metadata');
    if (metadata) {
      console.log('✅ Project metadata loaded');
      agent.metadata = JSON.parse(metadata);
    }
    
    // 2. 載入用戶偏好
    const prefs = await redis.mget([
      'ngalain:user:preferences:code_style',
      'ngalain:user:preferences:ui',
      'ngalain:user:preferences:workflow'
    ]);
    console.log('✅ User preferences loaded');
    agent.preferences = prefs.map(p => p ? JSON.parse(p) : null);
    
    // 3. 載入專案知識
    const knowledge = await redis.mget([
      'ngalain:knowledge:architecture',
      'ngalain:knowledge:api_conventions'
    ]);
    console.log('✅ Project knowledge loaded');
    agent.knowledge = knowledge.map(k => k ? JSON.parse(k) : null);
    
    console.log('✅ Redis external brain ready!');
  } catch (error) {
    console.warn('⚠️  Redis not available, using defaults');
    // 降級到使用 memory.jsonl
  }
}
\`\`\`

### 範例 2：任務執行時使用 Redis 知識

\`\`\`typescript
async function executeTaskWithRedis(task: Task) {
  // 1. 載入相關知識
  const context = await loadTaskContext(task);
  
  // 2. 結合 memory.jsonl + Redis
  const fullContext = {
    // 從 memory.jsonl 載入穩定知識
    principles: await loadFromMemory('Four Core Development Principles'),
    architecture: await loadFromMemory('Five Layer Architecture'),
    
    // 從 Redis 載入動態數據
    userPreferences: context.preferences,
    projectKnowledge: context.knowledge,
    history: context.history,
    patterns: context.patterns
  };
  
  // 3. 執行任務
  const result = await executeTask(task, fullContext);
  
  // 4. 儲存結果至 Redis
  await saveTaskResults(task, result);
  
  return result;
}
\`\`\`

### 範例 3：學習新模式並儲存

\`\`\`typescript
async function learnNewPattern(pattern: Pattern) {
  // 1. 驗證模式
  if (!validatePattern(pattern)) {
    return;
  }
  
  // 2. 檢查是否已存在
  const existing = await redis.get(`ngalain:patterns:${pattern.category}`);
  if (existing) {
    const parsed = JSON.parse(existing);
    // 合併現有模式
    pattern = mergePatterns(parsed, pattern);
  }
  
  // 3. 儲存至 Redis
  await redis.set(
    `ngalain:patterns:${pattern.category}`,
    JSON.stringify(pattern),
    { EX: 604800 } // 7 天
  );
  
  console.log(`✅ Pattern learned: ${pattern.category}`);
}
\`\`\`

---

## 🎯 預期效果

### 短期效果（1-2 週）

- Agent 開始記錄用戶偏好
- 累積基礎的專案知識
- 學習常見模式和錯誤

### 中期效果（3-4 週）

- Agent 能預測用戶偏好
- 主動避免已知錯誤
- 提供更一致的建議

### 長期效果（2-3 個月）

- Agent 完全熟悉專案規範
- 能基於歷史做出精準預測
- 提供個性化的最佳實踐

---

## 📚 相關文檔

### 核心文檔
- [Redis Agent Database Schema](../architecture/redis-agent-database-schema.md) - 完整 Schema
- [Redis Agent Quick Reference](./redis-agent-quick-reference.md) - 快速參考 ⭐
- [Redis External Brain Guide](../../.github/agents/redis-external-brain-guide.md) - 外掛大腦指南

### Agent 配置
- [Agent Startup Checklist](../../.github/agents/agent-startup-checklist.md) - 啟動檢查清單
- [Memory Usage Guide](../../.github/agents/memory-usage-guide.md) - 記憶庫使用
- [Main Agent Configuration](../../.github/agents/ng-alain-github-agent.md) - 主配置

### 使用指南
- [Redis Usage Guide](./redis-usage-guide.md) - Redis 使用指南（含反模式）
- [MCP Tools Workflow Guide](../../.github/agents/mcp-tools-workflow-guide.md) - MCP 工具流程

---

**最後更新**：2025-11-21  
**維護者**：開發團隊  
**版本**：v1.0.0
