# Agent 使用監控追蹤系統（雛型）
# 用於記錄和分析 GitHub Copilot Agent 的使用情況

## 📊 監控追蹤功能說明

### 1. 使用統計記錄

#### 記錄格式（JSON Lines）
```jsonl
{"timestamp": "2025-01-19T10:30:00Z", "agent": "angular-agent", "action": "code_generation", "feature": "component", "success": true}
{"timestamp": "2025-01-19T10:35:00Z", "agent": "development-sequence-guide", "action": "consultation", "topic": "five-layer-architecture", "success": true}
{"timestamp": "2025-01-19T10:40:00Z", "agent": "enterprise-compliance", "action": "validation", "level": "L2.5", "result": "passed"}
```

#### 記錄位置
- `.github/agents/logs/usage.jsonl` - 使用記錄
- `.github/agents/logs/violations.jsonl` - 違規記錄
- `.github/agents/logs/metrics.jsonl` - 指標記錄

### 2. 統計指標

#### 基本指標
- **調用次數**：各 Agent 被調用的總次數
- **成功率**：成功完成任務的比例
- **響應時間**：Agent 響應的平均時間
- **錯誤率**：失敗或錯誤的比例

#### 開發順序指標
- **層級完成順序**：實際開發順序 vs 標準順序
- **順序違規次數**：跳過或錯序開發的次數
- **順序合規率**：完全遵循開發順序的比例

#### 企業標準指標
- **Level 0-5 通過率**：各級別檢查的通過率
- **關鍵檢查項達成率**：重要檢查項的完成情況
- **改進趨勢**：合規率的時間趨勢

### 3. 監控儀表板（概念）

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Copilot Agent 使用監控儀表板                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 本週統計 (2025-01-15 ~ 2025-01-19)                      │
│  ────────────────────────────────────────                   │
│  總調用次數: 1,247                                           │
│  成功率: 94.3%                                               │
│  平均響應時間: 2.3s                                          │
│                                                              │
│  🏆 最常用 Agents (Top 5)                                    │
│  ────────────────────────────────────────                   │
│  1. development-sequence-guide    427 次 (34%)              │
│  2. angular-agent                 298 次 (24%)              │
│  3. typescript-agent              189 次 (15%)              │
│  4. security-agent                142 次 (11%)              │
│  5. enterprise-compliance         103 次  (8%)              │
│                                                              │
│  ✅ 開發順序合規率                                           │
│  ────────────────────────────────────────                   │
│  完全遵循: 87.5%  ████████████████████░░░░                  │
│  部分遵循: 10.2%  ███░░░░░░░░░░░░░░░░░░░░                  │
│  未遵循:    2.3%  █░░░░░░░░░░░░░░░░░░░░░                   │
│                                                              │
│  📈 企業標準合規趨勢                                         │
│  ────────────────────────────────────────                   │
│  Level 0:  100% ████████████████████████                    │
│  Level 1:  100% ████████████████████████                    │
│  Level 2:   95% ███████████████████████░                    │
│  Level 2.5: 92% ██████████████████████░░                    │
│  Level 3:   88% █████████████████████░░░                    │
│  Level 4:   85% ████████████████████░░░░                    │
│  Level 5:   83% ███████████████████░░░░░                    │
│                                                              │
│  ⚠️  本週違規提醒                                            │
│  ────────────────────────────────────────                   │
│  • 跳過 Types 層直接開發 Service: 3 次                       │
│  • 未執行啟動檢查清單: 5 次                                  │
│  • 缺少單元測試: 8 次                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4. 實現建議

#### Shell 腳本實現（簡易版）

**記錄使用日誌**
```bash
#!/bin/bash
# log-agent-usage.sh

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
AGENT=$1
ACTION=$2
DETAILS=$3

LOG_FILE=".github/agents/logs/usage.jsonl"
mkdir -p "$(dirname "$LOG_FILE")"

echo "{\"timestamp\": \"$TIMESTAMP\", \"agent\": \"$AGENT\", \"action\": \"$ACTION\", \"details\": \"$DETAILS\"}" >> "$LOG_FILE"
```

**查詢統計**
```bash
#!/bin/bash
# query-agent-stats.sh

LOG_FILE=".github/agents/logs/usage.jsonl"

echo "=== Agent 使用統計 ==="
echo ""
echo "總調用次數:"
wc -l < "$LOG_FILE"
echo ""
echo "各 Agent 調用次數:"
cat "$LOG_FILE" | jq -r '.agent' | sort | uniq -c | sort -rn
echo ""
echo "最近 10 次調用:"
tail -10 "$LOG_FILE" | jq -r '[.timestamp, .agent, .action] | @tsv'
```

#### Python 實現（進階版）

```python
#!/usr/bin/env python3
# monitor-dashboard.py

import json
from datetime import datetime, timedelta
from collections import Counter, defaultdict

def load_logs(log_file):
    """載入日誌文件"""
    logs = []
    with open(log_file, 'r') as f:
        for line in f:
            logs.append(json.loads(line))
    return logs

def calculate_stats(logs, days=7):
    """計算統計數據"""
    cutoff = datetime.now() - timedelta(days=days)
    recent_logs = [
        log for log in logs
        if datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00')) > cutoff
    ]
    
    stats = {
        'total_calls': len(recent_logs),
        'agent_counts': Counter(log['agent'] for log in recent_logs),
        'success_rate': sum(1 for log in recent_logs if log.get('success', True)) / len(recent_logs) * 100,
    }
    
    return stats

def print_dashboard(stats):
    """打印儀表板"""
    print("=" * 60)
    print("  GitHub Copilot Agent 使用監控儀表板")
    print("=" * 60)
    print(f"\n總調用次數: {stats['total_calls']}")
    print(f"成功率: {stats['success_rate']:.1f}%")
    print("\n最常用 Agents (Top 5):")
    for agent, count in stats['agent_counts'].most_common(5):
        percentage = count / stats['total_calls'] * 100
        print(f"  {agent:30} {count:4} 次 ({percentage:5.1f}%)")

if __name__ == '__main__':
    logs = load_logs('.github/agents/logs/usage.jsonl')
    stats = calculate_stats(logs)
    print_dashboard(stats)
```

### 5. Git Hooks 整合

**Pre-commit Hook**
```bash
#!/bin/bash
# .husky/pre-commit

# 記錄開發順序合規性
.github/agents/tools/verify-dev-sequence.sh || true

# 記錄企業標準合規性
.github/agents/tools/validate-compliance.sh || exit 1

# 記錄到日誌
.github/agents/tools/log-agent-usage.sh "pre-commit-check" "validation" "compliance-check"
```

### 6. CI/CD 整合

**GitHub Actions Workflow**
```yaml
name: Agent Compliance Check

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate Compliance
        run: |
          bash .github/agents/tools/validate-compliance.sh
      
      - name: Check Memory Coverage
        run: |
          bash .github/agents/tools/check-memory-coverage.sh
      
      - name: Verify Dev Sequence
        run: |
          bash .github/agents/tools/verify-dev-sequence.sh
      
      - name: Generate Report
        run: |
          echo "## Agent 合規性報告" >> $GITHUB_STEP_SUMMARY
          echo "- ✅ 企業標準檢查通過" >> $GITHUB_STEP_SUMMARY
          echo "- ✅ 記憶庫覆蓋率達標" >> $GITHUB_STEP_SUMMARY
          echo "- ✅ 開發順序遵循正確" >> $GITHUB_STEP_SUMMARY
```

### 7. 未來擴展方向

1. **機器學習分析**
   - 預測開發順序違規風險
   - 推薦最佳 Agent 使用時機
   - 自動優化檢查清單優先級

2. **即時監控**
   - WebSocket 即時推送
   - 瀏覽器擴展程序
   - VSCode 擴展整合

3. **團隊協作**
   - 團隊使用統計對比
   - 最佳實踐分享
   - 違規案例學習

4. **自動化建議**
   - 根據使用模式提供改進建議
   - 自動生成合規報告
   - 智能推薦相關文檔

---

## 🚀 快速開始

### 1. 創建日誌目錄
```bash
mkdir -p .github/agents/logs
```

### 2. 初始化日誌文件
```bash
touch .github/agents/logs/usage.jsonl
touch .github/agents/logs/violations.jsonl
touch .github/agents/logs/metrics.jsonl
```

### 3. 執行監控腳本
```bash
# 查看使用統計
cat .github/agents/logs/usage.jsonl | jq -r '.agent' | sort | uniq -c

# 查看違規記錄
cat .github/agents/logs/violations.jsonl | jq .

# 計算合規率
# (實現在 validate-compliance.sh 中)
```

---

**版本**：v1.0.0 (雛型)  
**最後更新**：2025-01-19  
**狀態**：概念驗證階段

**注意**：此為監控系統的雛型設計，實際實現需根據專案需求進行調整和擴展。
