# Supabase Migration 同步問題修復指南

## 問題描述

當執行 `npx supabase db push` 時出現錯誤：
```
Remote migration versions not found in local migrations directory.
```

這表示遠端資料庫的 migration 歷史與本地不同步。

## 原因分析

1. **遠端有本地沒有的 migrations**：可能有人透過 Supabase Dashboard 直接執行 SQL，這些被記錄為 migrations
2. **本地 migrations 目錄不完整**：本地缺少部分 migration 檔案
3. **多人協作未同步**：團隊成員的 migrations 未正確合併到本地

## 解決方案

### 方案 1：同步遠端 migrations 到本地（推薦）

這會將遠端資料庫的所有 migrations 下載到本地，確保本地和遠端同步。

```bash
# 1. 先備份現有的 migrations（可選但建議）
git add supabase/migrations/
git commit -m "chore: backup migrations before sync"

# 2. 從遠端拉取所有 migrations
npx supabase db pull

# 3. 檢查下載的 migrations
ls supabase/migrations/

# 4. 驗證 migration 狀態
npx supabase migration list
```

**優點**：
- 保留所有 migration 歷史
- 確保本地和遠端完全同步
- 不會遺失任何 migration 記錄

**注意事項**：
- 可能會下載很多 migration 檔案
- 需要檢查是否有衝突的 migrations

### 方案 2：修復 migration 歷史（進階）

如果確定遠端的某些 migrations 不需要保留，可以使用 repair 命令標記為已還原。

```bash
# 1. 查看遠端的 migration 狀態
npx supabase migration list --linked

# 2. 將不需要的 migrations 標記為 reverted
npx supabase migration repair --status reverted <migration_version_1> <migration_version_2> ...

# 範例（根據錯誤訊息中的版本列表）
npx supabase migration repair --status reverted \
  20251121195412 \
  20251121202814 \
  20251122081854 \
  # ... 其他版本號
```

**優點**：
- 可以清理不需要的 migration 記錄
- 保持 migration 歷史整潔

**缺點**：
- 需要手動指定每個要標記的版本
- 如果標記錯誤可能導致資料庫狀態不一致

### 方案 3：重置 migration 歷史（不推薦，僅用於開發環境）

⚠️ **警告**：此方法會清除所有 migration 歷史，僅適用於開發環境！

```bash
# 1. 導出當前資料庫結構
npx supabase db dump -f supabase/migrations/$(date +%Y%m%d%H%M%S)_initial_schema.sql

# 2. 重置 migration 歷史（需要手動操作資料庫）
# 在 Supabase Dashboard 的 SQL Editor 中執行：
# DELETE FROM supabase_migrations.schema_migrations;

# 3. 重新初始化 migration
npx supabase migration new initial_schema
```

## 推薦流程

對於您目前的情況，建議使用**方案 1**：

```bash
# Step 1: 備份當前狀態
git add supabase/migrations/
git commit -m "chore: backup before migration sync"

# Step 2: 同步遠端 migrations
npx supabase db pull

# Step 3: 檢查同步結果
npx supabase migration list

# Step 4: 驗證可以正常 push
npx supabase db push --dry-run

# Step 5: 如果一切正常，提交新的 migrations
git add supabase/migrations/
git commit -m "chore: sync migrations from remote"
```

## 預防措施

1. **統一使用 CLI**：避免在 Supabase Dashboard 直接執行 SQL，改用 migration 檔案
2. **定期同步**：開發前先執行 `npx supabase db pull` 確保本地最新
3. **版本控制**：所有 migrations 都應該提交到 Git
4. **團隊協作**：Pull 最新代碼後先同步 migrations

## 相關文檔

- [Supabase Migration 官方文檔](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [專案 Migration 規範](../supabase/development/database-dev.md)

---

**最後更新**：2025-01-20  
**維護者**：開發團隊

