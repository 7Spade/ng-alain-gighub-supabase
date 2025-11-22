#!/bin/bash

# 企業標準合規性驗證工具
# 自動檢查 Level 0-5 合規性
# 用途：在開發過程中或 PR 提交前驗證代碼是否符合企業標準

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 計分器
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# 工作目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  企業標準合規性驗證工具 v1.0${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查函數
check_item() {
    local level=$1
    local description=$2
    local command=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -n "[$level] 檢查: $description ... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 通過${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗ 失敗${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

check_item_warn() {
    local level=$1
    local description=$2
    local command=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -n "[$level] 檢查: $description ... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 通過${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${YELLOW}⚠ 警告${NC}"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
        return 1
    fi
}

# ============================================
# Level 0: 強制執行程序（必須 100% 通過）
# ============================================
echo -e "\n${BLUE}🔴 Level 0: 強制執行程序檢查${NC}"
echo "----------------------------------------"

check_item "L0" "記憶庫文件存在" \
    "test -f '$PROJECT_ROOT/.github/copilot/memory.jsonl'"

check_item "L0" "記憶庫包含開發順序實體" \
    "grep -q 'Five Layer Development Order' '$PROJECT_ROOT/.github/copilot/memory.jsonl'"

check_item "L0" "系統架構思維導圖存在" \
    "test -f '$PROJECT_ROOT/docs/architecture/01-system-architecture-mindmap.mermaid.md'"

check_item "L0" "啟動檢查清單存在" \
    "test -f '$PROJECT_ROOT/.github/agents/agent-startup-checklist.md'"

check_item "L0" "開發順序指南存在" \
    "test -f '$PROJECT_ROOT/.github/agents/development-sequence-guide.md'"

# ============================================
# Level 1: 核心開發原則（必須 100% 通過）
# ============================================
echo -e "\n${BLUE}🟠 Level 1: 核心開發原則檢查${NC}"
echo "----------------------------------------"

check_item "L1" "TypeScript strict mode 啟用" \
    "grep -q '\"strict\": true' '$PROJECT_ROOT/tsconfig.json'"

check_item "L1" "ESLint 配置存在" \
    "test -f '$PROJECT_ROOT/eslint.config.mjs'"

check_item "L1" "Prettier 配置存在" \
    "test -f '$PROJECT_ROOT/.prettierrc.js'"

check_item "L1" "Husky pre-commit hook 存在" \
    "test -f '$PROJECT_ROOT/.husky/pre-commit'"

# ============================================
# Level 2: 架構原則（必須 ≥90% 通過）
# ============================================
echo -e "\n${BLUE}🟡 Level 2: 架構原則檢查${NC}"
echo "----------------------------------------"

check_item_warn "L2" "Core 模組存在" \
    "test -d '$PROJECT_ROOT/src/app/core'"

check_item_warn "L2" "Shared 模組存在" \
    "test -d '$PROJECT_ROOT/src/app/shared'"

check_item_warn "L2" "Routes 模組存在" \
    "test -d '$PROJECT_ROOT/src/app/routes'"

check_item_warn "L2" "SHARED_IMPORTS 定義存在" \
    "grep -r 'SHARED_IMPORTS' '$PROJECT_ROOT/src/app/shared' > /dev/null 2>&1"

check_item_warn "L2" "BaseRepository 基類存在" \
    "find '$PROJECT_ROOT/src/app/core' -name '*base*repository*' -o -name '*repository.base*' | grep -q ."

# ============================================
# Level 3: 技術標準（必須 ≥85% 通過）
# ============================================
echo -e "\n${BLUE}🟢 Level 3: 技術標準檢查${NC}"
echo "----------------------------------------"

check_item_warn "L3" "Angular 配置文件存在" \
    "test -f '$PROJECT_ROOT/angular.json'"

check_item_warn "L3" "Package.json 存在" \
    "test -f '$PROJECT_ROOT/package.json'"

check_item_warn "L3" "使用 Standalone Components (檢查 package.json Angular 版本)" \
    "grep -q '\"@angular/core\": \".*20\\.' '$PROJECT_ROOT/package.json' || grep -q '\"@angular/core\": \".*19\\.' '$PROJECT_ROOT/package.json'"

check_item_warn "L3" "NG-ZORRO 已安裝" \
    "grep -q 'ng-zorro-antd' '$PROJECT_ROOT/package.json'"

check_item_warn "L3" "@delon 套件已安裝" \
    "grep -q '@delon' '$PROJECT_ROOT/package.json'"

# ============================================
# Level 4: 安全與效能（必須 ≥80% 通過）
# ============================================
echo -e "\n${BLUE}🔵 Level 4: 安全與效能檢查${NC}"
echo "----------------------------------------"

check_item_warn "L4" "環境變數範例文件存在" \
    "test -f '$PROJECT_ROOT/.env.example'"

check_item_warn "L4" ".gitignore 包含敏感文件規則" \
    "grep -q '.env' '$PROJECT_ROOT/.gitignore'"

check_item_warn "L4" "Supabase 已配置" \
    "grep -q 'supabase' '$PROJECT_ROOT/package.json'"

check_item_warn "L4" "RLS 策略文檔存在" \
    "find '$PROJECT_ROOT/docs' -name '*rls*' -o -name '*RLS*' -o -name '*策略*' | grep -q ."

# ============================================
# Level 5: 代碼品質（必須 ≥80% 通過）
# ============================================
echo -e "\n${BLUE}🔍 Level 5: 代碼品質檢查${NC}"
echo "----------------------------------------"

check_item_warn "L5" "測試配置存在" \
    "test -f '$PROJECT_ROOT/karma.conf.js' || test -f '$PROJECT_ROOT/jest.config.js'"

check_item_warn "L5" "Lint-staged 配置存在" \
    "grep -q 'lint-staged' '$PROJECT_ROOT/package.json'"

check_item_warn "L5" "TypeScript 配置正確" \
    "test -f '$PROJECT_ROOT/tsconfig.json' && test -f '$PROJECT_ROOT/tsconfig.app.json'"

check_item_warn "L5" "文檔目錄存在且有內容" \
    "test -d '$PROJECT_ROOT/docs' && [ \$(find '$PROJECT_ROOT/docs' -name '*.md' | wc -l) -gt 10 ]"

# ============================================
# 執行驗證命令（如果可用）
# ============================================
echo -e "\n${BLUE}⚙️  執行驗證命令${NC}"
echo "----------------------------------------"

if command -v yarn &> /dev/null; then
    echo "檢測到 Yarn，執行驗證命令..."
    
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        cd "$PROJECT_ROOT"
        
        # TypeScript 類型檢查
        if grep -q '"type-check"' package.json; then
            echo -n "執行 TypeScript 類型檢查 ... "
            if yarn type-check > /tmp/type-check.log 2>&1; then
                echo -e "${GREEN}✓ 通過${NC}"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                echo -e "${RED}✗ 失敗${NC}"
                echo "詳細日誌: /tmp/type-check.log"
                FAILED_CHECKS=$((FAILED_CHECKS + 1))
            fi
            TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
        fi
        
        # ESLint 檢查
        if grep -q '"lint"' package.json; then
            echo -n "執行 ESLint 檢查 ... "
            if yarn lint > /tmp/lint.log 2>&1; then
                echo -e "${GREEN}✓ 通過${NC}"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            else
                echo -e "${RED}✗ 失敗${NC}"
                echo "詳細日誌: /tmp/lint.log"
                FAILED_CHECKS=$((FAILED_CHECKS + 1))
            fi
            TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
        fi
    fi
else
    echo -e "${YELLOW}⚠ Yarn 未安裝，跳過驗證命令${NC}"
fi

# ============================================
# 總結報告
# ============================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  驗證結果總結${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "總檢查項目: $TOTAL_CHECKS"
echo -e "${GREEN}通過: $PASSED_CHECKS${NC}"
echo -e "${RED}失敗: $FAILED_CHECKS${NC}"
echo -e "${YELLOW}警告: $WARNING_CHECKS${NC}"
echo ""

# 計算通過率
if [ $TOTAL_CHECKS -gt 0 ]; then
    PASS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo "通過率: ${PASS_RATE}%"
    echo ""
    
    if [ $PASS_RATE -ge 95 ]; then
        echo -e "${GREEN}✓ 優秀！達到企業頂尖標準（≥95%）${NC}"
        exit 0
    elif [ $PASS_RATE -ge 90 ]; then
        echo -e "${GREEN}✓ 良好！達到企業標準（≥90%）${NC}"
        exit 0
    elif [ $PASS_RATE -ge 80 ]; then
        echo -e "${YELLOW}⚠ 合格，但仍有改進空間（≥80%）${NC}"
        exit 1
    else
        echo -e "${RED}✗ 不合格！需要立即改進（<80%）${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ 錯誤：無檢查項目${NC}"
    exit 1
fi
