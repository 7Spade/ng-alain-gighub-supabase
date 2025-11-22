#!/bin/bash

# 開發順序遵循驗證工具
# 驗證代碼是否遵循五層架構開發順序
# 用途：檢查新功能開發是否按照 Types → Repositories → Models → Services → Facades → Components → Tests 順序

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 工作目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  開發順序遵循驗證工具 v1.0${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查參數
TARGET_DIR="${1:-$PROJECT_ROOT/src/app}"
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}✗ 錯誤：目標目錄不存在${NC}"
    echo "用法: $0 [目標目錄]"
    echo "範例: $0 src/app/routes/my-feature"
    exit 1
fi

echo "檢查目標: $TARGET_DIR"
echo ""

# ============================================
# 五層架構檢查
# ============================================
echo -e "${BLUE}🏗️  五層架構結構檢查${NC}"
echo "----------------------------------------"

# 計數器
FOUND_LAYERS=0
MISSING_LAYERS=0

# 檢查各層是否存在
check_layer() {
    local layer=$1
    local pattern=$2
    local path=$3
    
    echo -n "檢查 $layer 層 ... "
    
    if find "$TARGET_DIR" -path "*/$path/*" -name "$pattern" 2>/dev/null | grep -q .; then
        echo -e "${GREEN}✓ 存在${NC}"
        local count=$(find "$TARGET_DIR" -path "*/$path/*" -name "$pattern" 2>/dev/null | wc -l)
        echo "  找到 $count 個文件"
        FOUND_LAYERS=$((FOUND_LAYERS + 1))
        return 0
    else
        echo -e "${YELLOW}⚠ 未找到${NC}"
        MISSING_LAYERS=$((MISSING_LAYERS + 1))
        return 1
    fi
}

# 檢查 Types 層（最底層）
echo -e "\n${CYAN}第 1 層：Types（類型定義）${NC}"
check_layer "Types" "*.types.ts" "core/infra/types" || \
check_layer "Types" "*.types.ts" "types" || \
echo "  建議位置: src/app/core/infra/types/"

# 檢查 Repositories 層
echo -e "\n${CYAN}第 2 層：Repositories（數據訪問）${NC}"
check_layer "Repositories" "*repository.ts" "core/infra/repositories" || \
check_layer "Repositories" "*repository.ts" "repositories" || \
echo "  建議位置: src/app/core/infra/repositories/"

# 檢查 Models 層
echo -e "\n${CYAN}第 3 層：Models（數據模型）${NC}"
check_layer "Models" "*.models.ts" "shared/models" || \
check_layer "Models" "*.models.ts" "models" || \
echo "  建議位置: src/app/shared/models/"

# 檢查 Services 層
echo -e "\n${CYAN}第 4 層：Services（業務邏輯）${NC}"
check_layer "Services" "*.service.ts" "shared/services" || \
check_layer "Services" "*.service.ts" "services" || \
echo "  建議位置: src/app/shared/services/"

# 檢查 Facades 層
echo -e "\n${CYAN}第 5 層：Facades（門面模式）${NC}"
check_layer "Facades" "*.facade.ts" "core/facades" || \
check_layer "Facades" "*.facade.ts" "facades" || \
echo "  建議位置: src/app/core/facades/"

# 檢查 Components 層
echo -e "\n${CYAN}第 6 層：Components（UI 組件）${NC}"
check_layer "Components" "*.component.ts" "routes" || \
echo "  建議位置: src/app/routes/"

# 檢查 Tests
echo -e "\n${CYAN}第 7 層：Tests（測試）${NC}"
check_layer "Tests" "*.spec.ts" "." || \
echo "  建議：每個文件都應有對應的 .spec.ts 測試文件"

echo ""

# ============================================
# 依賴關係檢查
# ============================================
echo -e "${BLUE}🔗 依賴關係檢查${NC}"
echo "----------------------------------------"

check_dependencies() {
    local layer=$1
    local file_pattern=$2
    local allowed_imports=$3
    local forbidden_imports=$4
    
    echo "檢查 $layer 層的依賴關係..."
    
    local files=$(find "$TARGET_DIR" -name "$file_pattern" 2>/dev/null)
    if [ -z "$files" ]; then
        echo -e "${YELLOW}⚠ 未找到 $layer 層文件${NC}"
        return
    fi
    
    local violation_count=0
    
    for file in $files; do
        # 檢查是否有禁止的導入
        for forbidden in $forbidden_imports; do
            if grep -q "from.*$forbidden" "$file" 2>/dev/null; then
                echo -e "${RED}✗ 違規${NC}: $(basename $file) 導入了 $forbidden"
                violation_count=$((violation_count + 1))
            fi
        done
    done
    
    if [ $violation_count -eq 0 ]; then
        echo -e "${GREEN}✓ $layer 層依賴關係正確${NC}"
    else
        echo -e "${RED}✗ 發現 $violation_count 個依賴違規${NC}"
    fi
    echo ""
}

# Types 層不應依賴其他層
check_dependencies "Types" "*.types.ts" "無" "repository service facade component"

# Repositories 層只能依賴 Types
check_dependencies "Repositories" "*repository.ts" "types" "service facade component"

# Models 層只能依賴 Types
check_dependencies "Models" "*.models.ts" "types" "repository service facade component"

# Services 層可依賴 Repositories 和 Models
check_dependencies "Services" "*.service.ts" "repository models types" "facade component"

# Facades 層可依賴 Services
check_dependencies "Facades" "*.facade.ts" "service repository models types" "component"

# Components 層可依賴 Facades
check_dependencies "Components" "*.component.ts" "facade service" "repository"

# ============================================
# 命名規範檢查
# ============================================
echo -e "${BLUE}📝 命名規範檢查${NC}"
echo "----------------------------------------"

check_naming() {
    local layer=$1
    local pattern=$2
    local suffix=$3
    
    echo -n "檢查 $layer 層命名規範 ... "
    
    local files=$(find "$TARGET_DIR" -name "$pattern" 2>/dev/null)
    if [ -z "$files" ]; then
        echo -e "${YELLOW}⚠ 跳過（無文件）${NC}"
        return
    fi
    
    local violation_count=0
    for file in $files; then
        if [[ ! "$(basename $file)" =~ \.$suffix\.ts$ ]]; then
            violation_count=$((violation_count + 1))
        fi
    done
    
    if [ $violation_count -eq 0 ]; then
        echo -e "${GREEN}✓ 通過${NC}"
    else
        echo -e "${YELLOW}⚠ 發現 $violation_count 個命名不規範${NC}"
    fi
}

check_naming "Repositories" "*repository.ts" "repository"
check_naming "Models" "*.models.ts" "models"
check_naming "Services" "*.service.ts" "service"
check_naming "Facades" "*.facade.ts" "facade"
check_naming "Components" "*.component.ts" "component"

echo ""

# ============================================
# 文件結構建議
# ============================================
echo -e "${BLUE}📁 標準文件結構建議${NC}"
echo "----------------------------------------"
echo "推薦的五層架構目錄結構："
echo ""
echo "src/app/"
echo "├── core/"
echo "│   ├── infra/"
echo "│   │   ├── types/          # 第 1 層：類型定義"
echo "│   │   │   └── *.types.ts"
echo "│   │   └── repositories/   # 第 2 層：數據訪問"
echo "│   │       └── *.repository.ts"
echo "│   └── facades/            # 第 5 層：門面模式"
echo "│       └── *.facade.ts"
echo "├── shared/"
echo "│   ├── models/             # 第 3 層：數據模型"
echo "│   │   └── *.models.ts"
echo "│   └── services/           # 第 4 層：業務邏輯"
echo "│       └── *.service.ts"
echo "└── routes/                 # 第 6 層：UI 組件"
echo "    └── */                  # 第 7 層：測試（與源文件同級）"
echo "        ├── *.component.ts"
echo "        └── *.spec.ts"
echo ""

# ============================================
# 總結
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  檢查結果總結${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

TOTAL_LAYERS=7
COMPLETION_RATE=$((FOUND_LAYERS * 100 / TOTAL_LAYERS))

echo "發現層級: $FOUND_LAYERS / $TOTAL_LAYERS"
echo "完整度: ${COMPLETION_RATE}%"
echo ""

if [ $FOUND_LAYERS -eq $TOTAL_LAYERS ]; then
    echo -e "${GREEN}✓ 優秀！完全遵循五層架構開發順序${NC}"
    exit 0
elif [ $FOUND_LAYERS -ge 5 ]; then
    echo -e "${YELLOW}⚠ 良好，但建議補充缺失的層級${NC}"
    exit 0
else
    echo -e "${RED}✗ 警告：未完全遵循五層架構開發順序${NC}"
    echo "建議：按照 Types → Repositories → Models → Services → Facades → Components → Tests 順序開發"
    exit 1
fi
