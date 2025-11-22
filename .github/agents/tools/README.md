# 🛠️ GitHub Copilot Agent 自動化工具

> **目的**：提供自動化驗證、檢查和監控工具，提升 GitHub Copilot Agent 的使用效率和合規性

**版本**：v1.0.0  
**最後更新**：2025-01-19

---

## 📋 工具清單

### 1. validate-compliance.sh - 企業標準合規性驗證
**用途**：自動檢查 Level 0-5 合規性

**檢查項目**：
- ✅ Level 0：強制執行程序（記憶庫、架構圖、檢查清單）
- ✅ Level 1：核心開發原則（TypeScript strict、ESLint、Prettier）
- ✅ Level 2：架構原則（分層架構、SHARED_IMPORTS、BaseRepository）
- ✅ Level 3：技術標準（Angular、NG-ZORRO、@delon）
- ✅ Level 4：安全與效能（環境變數、RLS 策略）
- ✅ Level 5：代碼品質（測試配置、lint-staged、文檔）

**使用方式**：
```bash
# 在專案根目錄執行
./.github/agents/tools/validate-compliance.sh

# 或使用完整路徑
bash .github/agents/tools/validate-compliance.sh
```

**輸出範例**：
```
========================================
  企業標準合規性驗證工具 v1.0
========================================

🔴 Level 0: 強制執行程序檢查
----------------------------------------
[L0] 檢查: 記憶庫文件存在 ... ✓ 通過
[L0] 檢查: 記憶庫包含開發順序實體 ... ✓ 通過
...

========================================
  驗證結果總結
========================================

總檢查項目: 35
通過: 33
失敗: 0
警告: 2

通過率: 94%

✓ 優秀！達到企業頂尖標準（≥95%）
```

**返回值**：
- `0`：通過率 ≥90%
- `1`：通過率 <90%

---

### 2. check-memory-coverage.sh - 記憶庫覆蓋率檢查
**用途**：檢查專案記憶庫的完整性和覆蓋率

**檢查項目**：
- 📊 實體和關係數量統計
- 📋 實體類型分布分析
- 🔑 關鍵實體存在性檢查
- 📈 覆蓋率評估

**使用方式**：
```bash
./.github/agents/tools/check-memory-coverage.sh
```

**輸出範例**：
```
========================================
  記憶庫覆蓋率檢查工具 v1.0
========================================

✓ 記憶庫文件存在
路徑: /path/to/.github/copilot/memory.jsonl

📊 基本統計
----------------------------------------
總行數: 366
實體數量: 149
關係數量: 170
總項目數: 319

📋 實體類型分布（Top 10）
----------------------------------------
68    null
38    Standard
7     UI Pattern
7     Development Standard
...

🔑 關鍵實體檢查
----------------------------------------
核心架構實體:
✓ Five Layer Architecture
✓ Five Layer Development Order
✓ Git-like Branch Model
...

========================================
  檢查結果總結
========================================

關鍵實體覆蓋率: 20/20 (100%)

✓ 優秀！記憶庫覆蓋率達標（≥90%）
```

**返回值**：
- `0`：覆蓋率 ≥80%
- `1`：覆蓋率 <80%

---

### 3. verify-dev-sequence.sh - 開發順序遵循驗證
**用途**：驗證代碼是否遵循五層架構開發順序

**檢查項目**：
- 🏗️ 五層架構結構完整性
- 🔗 層級依賴關係正確性
- 📝 命名規範合規性
- 📁 文件組織標準化

**使用方式**：
```bash
# 檢查整個專案
./.github/agents/tools/verify-dev-sequence.sh

# 檢查特定目錄
./.github/agents/tools/verify-dev-sequence.sh src/app/routes/my-feature
```

**輸出範例**：
```
========================================
  開發順序遵循驗證工具 v1.0
========================================

檢查目標: src/app

🏗️  五層架構結構檢查
----------------------------------------

第 1 層：Types（類型定義）
檢查 Types 層 ... ✓ 存在
  找到 12 個文件

第 2 層：Repositories（數據訪問）
檢查 Repositories 層 ... ✓ 存在
  找到 8 個文件

...

========================================
  檢查結果總結
========================================

發現層級: 7 / 7
完整度: 100%

✓ 優秀！完全遵循五層架構開發順序
```

**返回值**：
- `0`：完全遵循或基本遵循（≥5層）
- `1`：未遵循（<5層）

---

### 4. monitoring-prototype.md - 監控追蹤系統雛型
**用途**：Agent 使用監控追蹤系統的設計文檔

**包含內容**：
- 📊 監控功能說明
- 📈 統計指標定義
- 🖥️ 儀表板概念設計
- 💻 實現建議（Shell + Python）
- 🔗 Git Hooks 整合
- 🚀 CI/CD 整合範例

**查看方式**：
```bash
cat .github/agents/tools/monitoring-prototype.md
```

---

## 🚀 快速開始

### 1. 執行完整檢查
```bash
cd /path/to/ng-alain-gighub

# 1. 企業標準合規性檢查
./.github/agents/tools/validate-compliance.sh

# 2. 記憶庫覆蓋率檢查
./.github/agents/tools/check-memory-coverage.sh

# 3. 開發順序驗證
./.github/agents/tools/verify-dev-sequence.sh
```

### 2. 整合到 Git Hooks
```bash
# 編輯 .husky/pre-commit
cat >> .husky/pre-commit << 'EOF'

# Agent 合規性檢查
echo "執行 Agent 合規性檢查..."
./.github/agents/tools/validate-compliance.sh || {
  echo "⚠️ 合規性檢查未通過，但允許提交"
  echo "請查看上方錯誤信息並儘快修復"
}
EOF

chmod +x .husky/pre-commit
```

### 3. 整合到 CI/CD
```yaml
# .github/workflows/agent-compliance.yml
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
        run: bash .github/agents/tools/validate-compliance.sh
      
      - name: Check Memory Coverage
        run: bash .github/agents/tools/check-memory-coverage.sh
      
      - name: Verify Dev Sequence
        run: bash .github/agents/tools/verify-dev-sequence.sh
```

---

## 📊 預期效果

### 使用這些工具後
1. **自動化驗證**：減少人工檢查時間 80%
2. **標準化**：確保所有開發遵循企業標準
3. **可追溯性**：完整記錄合規性檢查結果
4. **及早發現問題**：開發過程中即時發現違規
5. **持續改進**：通過監控數據優化開發流程

### 與手動檢查對比

| 項目 | 手動檢查 | 自動化工具 |
|------|---------|-----------|
| 檢查時間 | 30-60 分鐘 | 2-5 分鐘 |
| 覆蓋率 | 60-70% | 95-100% |
| 一致性 | 中等 | 優秀 |
| 可追溯性 | 差 | 優秀 |
| 成本 | 高 | 低 |

---

## 🔧 依賴需求

### 必需依賴
- **Bash** ≥4.0
- **grep**、**find**、**wc** 等基本 Unix 工具

### 可選依賴（增強功能）
- **jq**：JSON 處理（用於記憶庫分析）
  ```bash
  # Ubuntu/Debian
  sudo apt-get install jq
  
  # macOS
  brew install jq
  ```

- **bc**：浮點數計算
  ```bash
  # Ubuntu/Debian
  sudo apt-get install bc
  
  # macOS（已預裝）
  ```

---

## 🐛 故障排除

### 問題 1：權限不足
```bash
# 解決方法：添加執行權限
chmod +x .github/agents/tools/*.sh
```

### 問題 2：找不到 jq 命令
```bash
# 解決方法：安裝 jq
sudo apt-get install jq  # Ubuntu/Debian
brew install jq          # macOS
```

### 問題 3：路徑錯誤
```bash
# 解決方法：確保在專案根目錄執行
cd /path/to/ng-alain-gighub
./github/agents/tools/validate-compliance.sh
```

---

## 📝 開發計劃

### v1.0（當前版本）✅
- [x] validate-compliance.sh - 企業標準合規性驗證
- [x] check-memory-coverage.sh - 記憶庫覆蓋率檢查
- [x] verify-dev-sequence.sh - 開發順序遵循驗證
- [x] monitoring-prototype.md - 監控系統雛型

### v1.1（計劃中）
- [ ] 增加 JSON 格式輸出選項
- [ ] 支持配置文件自定義檢查項
- [ ] 增加詳細的錯誤報告
- [ ] 支持多語言輸出

### v2.0（未來）
- [ ] Python 版本實現
- [ ] Web 儀表板
- [ ] 即時監控功能
- [ ] 機器學習預測

---

## 🤝 貢獻指南

歡迎貢獻改進建議和代碼！

### 貢獻流程
1. Fork 專案
2. 創建功能分支（`feature/new-tool`）
3. 提交變更（遵循 Commit 規範）
4. 推送到分支
5. 創建 Pull Request

### Commit 規範
```
feat(tools): 添加新的驗證工具
fix(tools): 修復記憶庫檢查錯誤
docs(tools): 更新工具使用說明
```

---

## 📄 授權

MIT License - 詳見 LICENSE 文件

---

## 📞 聯繫方式

有問題或建議？請：
- 創建 GitHub Issue
- 聯繫專案維護者

---

**最後更新**：2025-01-19  
**維護者**：開發團隊  
**版本**：v1.0.0
