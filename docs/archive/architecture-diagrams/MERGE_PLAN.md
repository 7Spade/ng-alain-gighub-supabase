# Phase 3: Architecture Diagram Reorganization Plan

## Merge Operations (18 → 12 files)

### ✅ Completed: Archive for integration
- 16-API-介面映射圖.mermaid.md → archived (integrate to 26-API-接口詳細文檔.md)
- 19-可觀測性與CI-CD管道圖.mermaid.md → archived (integrate to 32-部署指南.md)

### 📋 Renumbering Plan (Keep core diagrams, renumber 10-19)

**Keep as references (will be source for merges)**:
- 20-完整架構流程圖.mermaid.md → Keep as 20 (master diagram ⭐⭐⭐⭐⭐)
- 21-架構審查報告.md → Keep as 21 (production readiness ⭐⭐⭐⭐⭐)

**New numbering (10-19 series)**:
1. **10-系統架構總覽.mermaid.md** ← merge 01+02+03
2. **11-業務與帳戶層.mermaid.md** ← merge 04+05
3. **12-資料庫ER圖.mermaid.md** ← rename 06
4. **13-資料生命週期與Storage.mermaid.md** ← merge 07+08
5. **14-安全與RLS權限矩陣.md** ← rename 09 (not mermaid)
6. **15-部署與容器.mermaid.md** ← merge 10+18
7. **16-元件模組.mermaid.md** ← merge 11+12
8. **17-時序與事件.mermaid.md** ← merge 13+15
9. **18-狀態圖.mermaid.md** ← rename 14
10. **19-Supabase架構.mermaid.md** ← rename 17

**Files to remove after merge**:
- 01, 02, 03, 04, 05, 07, 08, 10, 11, 12, 13, 14, 15, 17, 18 (15 files)

## Implementation Strategy

Due to complexity and need to preserve content:
1. Keep original files as archive/architecture-v2/ for reference
2. Create merged files with combined content
3. Update cross-references in Phase 4
4. Validate all mermaid diagrams render correctly

## Status: Planning Complete, Ready for Execution
