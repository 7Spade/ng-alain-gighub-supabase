#!/bin/bash

# 記憶庫覆蓋率檢查工具
# 檢查專案記憶庫的完整性和覆蓋率
# 用途：確保記憶庫包含足夠的知識實體和關係

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
MEMORY_FILE="$PROJECT_ROOT/.github/copilot/memory.jsonl"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  記憶庫覆蓋率檢查工具 v1.0${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 檢查記憶庫文件是否存在
if [ ! -f "$MEMORY_FILE" ]; then
    echo -e "${RED}✗ 錯誤：記憶庫文件不存在${NC}"
    echo "路徑: $MEMORY_FILE"
    exit 1
fi

echo -e "${GREEN}✓ 記憶庫文件存在${NC}"
echo "路徑: $MEMORY_FILE"
echo ""

# 檢查 jq 是否可用
if ! command -v jq &> /dev/null; then
    echo -e "${RED}✗ 錯誤：需要安裝 jq 工具${NC}"
    echo "請執行: sudo apt-get install jq  # Ubuntu/Debian"
    echo "或執行: brew install jq          # macOS"
    exit 1
fi

# ============================================
# 基本統計
# ============================================
echo -e "${BLUE}📊 基本統計${NC}"
echo "----------------------------------------"

TOTAL_LINES=$(wc -l < "$MEMORY_FILE")
echo "總行數: $TOTAL_LINES"

ENTITY_COUNT=$(grep -c '"type": "entity"' "$MEMORY_FILE" || true)
echo "實體數量: $ENTITY_COUNT"

RELATION_COUNT=$(grep -c '"type": "relation"' "$MEMORY_FILE" || true)
echo "關係數量: $RELATION_COUNT"

TOTAL_ITEMS=$((ENTITY_COUNT + RELATION_COUNT))
echo "總項目數: $TOTAL_ITEMS"
echo ""

# ============================================
# 實體類型分布
# ============================================
echo -e "${BLUE}📋 實體類型分布（Top 10）${NC}"
echo "----------------------------------------"

if command -v jq &> /dev/null; then
    cat "$MEMORY_FILE" | jq -r 'select(.type=="entity") | .entityType // "null"' | \
        sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "%-5s %s\n", $1, $2}'
else
    echo -e "${YELLOW}⚠ jq 未安裝，跳過實體類型分析${NC}"
fi
echo ""

# ============================================
# 關鍵實體檢查
# ============================================
echo -e "${BLUE}🔑 關鍵實體檢查${NC}"
echo "----------------------------------------"

check_entity() {
    local entity_name=$1
    if grep -q "\"name\": \"$entity_name\"" "$MEMORY_FILE"; then
        echo -e "${GREEN}✓${NC} $entity_name"
        return 0
    else
        echo -e "${RED}✗${NC} $entity_name ${YELLOW}(缺失)${NC}"
        return 1
    fi
}

MISSING_COUNT=0

# 核心架構實體
echo "核心架構實體:"
check_entity "Five Layer Architecture" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Five Layer Development Order" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Git-like Branch Model" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Database Schema" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Layered Architecture" || MISSING_COUNT=$((MISSING_COUNT + 1))
echo ""

# 開發實踐實體
echo "開發實踐實體:"
check_entity "Types Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Repositories Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Models Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Services Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Facades Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Routes Components Layer Development" || MISSING_COUNT=$((MISSING_COUNT + 1))
echo ""

# 核心原則實體
echo "核心原則實體:"
check_entity "Four Core Development Principles" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Development Pre-Check" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Development Post-Check" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Development Validation Sequence" || MISSING_COUNT=$((MISSING_COUNT + 1))
echo ""

# 技術棧實體
echo "技術棧實體:"
check_entity "Angular" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "NG-ZORRO" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "Supabase" || MISSING_COUNT=$((MISSING_COUNT + 1))
check_entity "TypeScript" || MISSING_COUNT=$((MISSING_COUNT + 1))
echo ""

# ============================================
# 覆蓋率評估
# ============================================
echo -e "${BLUE}📈 覆蓋率評估${NC}"
echo "----------------------------------------"

# 計算覆蓋率
EXPECTED_KEY_ENTITIES=20
FOUND_KEY_ENTITIES=$((EXPECTED_KEY_ENTITIES - MISSING_COUNT))
COVERAGE_RATE=$((FOUND_KEY_ENTITIES * 100 / EXPECTED_KEY_ENTITIES))

echo "關鍵實體覆蓋率: ${FOUND_KEY_ENTITIES}/${EXPECTED_KEY_ENTITIES} (${COVERAGE_RATE}%)"
echo ""

# 實體密度評估
LINES_PER_ENTITY=$((TOTAL_LINES / ENTITY_COUNT))
echo "實體密度: 每 ${LINES_PER_ENTITY} 行一個實體"

# 關係密度評估
if [ $ENTITY_COUNT -gt 0 ]; then
    RELATIONS_PER_ENTITY=$((RELATION_COUNT * 100 / ENTITY_COUNT))
    echo "關係密度: 每個實體平均 $(echo "scale=2; $RELATIONS_PER_ENTITY / 100" | bc) 個關係"
fi
echo ""

# ============================================
# 建議與警告
# ============================================
echo -e "${BLUE}💡 建議與警告${NC}"
echo "----------------------------------------"

if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠ 發現 $MISSING_COUNT 個關鍵實體缺失${NC}"
    echo "建議：補充缺失的關鍵實體以提高覆蓋率"
    echo ""
fi

if [ $ENTITY_COUNT -lt 100 ]; then
    echo -e "${YELLOW}⚠ 實體數量偏低（< 100）${NC}"
    echo "建議：增加更多專案相關的知識實體"
    echo ""
fi

if [ $RELATION_COUNT -lt $((ENTITY_COUNT / 2)) ]; then
    echo -e "${YELLOW}⚠ 關係數量相對偏低${NC}"
    echo "建議：建立更多實體之間的關聯關係"
    echo ""
fi

if [ $ENTITY_COUNT -ge 150 ] && [ $RELATION_COUNT -ge 150 ] && [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ 記憶庫覆蓋率優秀！${NC}"
    echo "實體和關係數量充足，關鍵實體完整"
    echo ""
fi

# ============================================
# 總結
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  檢查結果總結${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $COVERAGE_RATE -ge 90 ] && [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ 優秀！記憶庫覆蓋率達標（≥90%）${NC}"
    echo "關鍵實體完整，建議保持更新"
    exit 0
elif [ $COVERAGE_RATE -ge 80 ]; then
    echo -e "${YELLOW}⚠ 良好，但仍有改進空間（80-90%）${NC}"
    echo "建議補充缺失的關鍵實體"
    exit 0
else
    echo -e "${RED}✗ 覆蓋率不足（<80%）${NC}"
    echo "需要補充更多關鍵實體和關係"
    exit 1
fi
