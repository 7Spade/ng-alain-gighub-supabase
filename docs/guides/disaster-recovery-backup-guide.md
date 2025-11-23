# 災難恢復與備份指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [備份策略](#備份策略)
  - [Supabase 自動備份](#supabase-自動備份)
  - [備份類型](#備份類型)
  - [手動備份腳本](#手動備份腳本)
  - [Storage 備份](#storage-備份)
- [災難恢復計劃](#災難恢復計劃)
  - [災難場景分類](#災難場景分類)
    - [1. 資料庫故障 (P0)](#1-資料庫故障-p0)
    - [2. 應用程式故障 (P0)](#2-應用程式故障-p0)
    - [3. 資料遺失 (P1)](#3-資料遺失-p1)
    - [4. Storage 資料遺失 (P1)](#4-storage-資料遺失-p1)
  - [災難恢復時間線](#災難恢復時間線)
  - [RTO/RPO 目標](#rtorpo-目標)
- [資料遷移指南](#資料遷移指南)
  - [1. 資料庫 Schema 遷移](#1-資料庫-schema-遷移)
  - [2. 資料遷移腳本](#2-資料遷移腳本)
  - [3. 零停機遷移策略](#3-零停機遷移策略)
- [恢復演練](#恢復演練)
  - [季度演練計劃](#季度演練計劃)
  - [演練檢查清單](#演練檢查清單)
- [緊急聯絡清單](#緊急聯絡清單)
- [相關文檔](#相關文檔)

---


> **目的**：定義資料備份策略、災難恢復計劃和資料遷移流程

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊
**RTO (Recovery Time Objective)**：< 4 小時
**RPO (Recovery Point Objective)**：< 1 小時

- --

## 📋 目錄

1. [備份策略](#備份策略)
2. [災難恢復計劃](#災難恢復計劃)
3. [資料遷移指南](#資料遷移指南)
4. [恢復演練](#恢復演練)

- --

## 備份策略

### Supabase 自動備份

```typescript
// Supabase 備份設定
{
  "database": {
    "daily_backups": true,        // 每日自動備份
    "retention_days": 30,          // 保留 30 天
    "pitr_enabled": true,          // Point-In-Time Recovery
    "pitr_retention_days": 7       // PITR 保留 7 天
  }
}
```

### 備份類型

| 類型 | 頻率 | 保留期限 | 用途 |
|------|------|---------|------|
| **完整備份** | 每日 00:00 | 30 天 | 完整資料恢復 |
| **增量備份** | 每 6 小時 | 7 天 | 快速恢復 |
| **PITR** | 持續 | 7 天 | 精確時間點恢復 |
| **Storage 備份** | 每日 | 30 天 | 檔案恢復 |

### 手動備份腳本

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="production"

# 資料庫備份
pg_dump -h $SUPABASE_HOST \
        -U postgres \
        -d $DB_NAME \
        -F c \
        -b \
        -v \
        -f "$BACKUP_DIR/db_${DATE}.backup"

# 壓縮備份
gzip "$BACKUP_DIR/db_${DATE}.backup"

# 上傳到 S3
aws s3 cp "$BACKUP_DIR/db_${DATE}.backup.gz" \
          "s3://my-backups/database/" \
          --storage-class STANDARD_IA

# 清理本地舊備份 (保留 7 天)
find $BACKUP_DIR -name "db_*.backup.gz" -mtime +7 -delete

echo "Backup completed: db_${DATE}.backup.gz"
```

### Storage 備份

```bash
#!/bin/bash
# backup-storage.sh

DATE=$(date +%Y%m%d)
STORAGE_BUCKET="production-files"

# 同步 Supabase Storage 到 S3
rclone sync \
  supabase:$STORAGE_BUCKET \
  s3-backup:backups/storage/$DATE \
  --progress \
  --create-empty-src-dirs

echo "Storage backup completed: $DATE"
```

- --

## 災難恢復計劃

### 災難場景分類

#### 1. 資料庫故障 (P0)

**症狀**：
- 資料庫無法連線
- 查詢超時
- 資料損壞

**恢復步驟**：
```bash
# 1. 切換到備用資料庫 (如有)
# 2. 從最近的備份恢復
pg_restore -h $SUPABASE_HOST \
           -U postgres \
           -d $DB_NAME \
           -v backup_file.backup

# 3. 驗證資料完整性
psql -h $SUPABASE_HOST -U postgres -d $DB_NAME -c "
  SELECT COUNT(*) FROM accounts;
  SELECT COUNT(*) FROM blueprints;
  SELECT COUNT(*) FROM tasks;
"

# 4. 更新應用配置
# 5. 監控系統狀態
```

#### 2. 應用程式故障 (P0)

**症狀**：
- 應用無法存取
- 嚴重錯誤
- 部署失敗

**恢復步驟**：
```bash
# 1. 回滾到上一個穩定版本
git revert HEAD
git push origin main

# 2. 觸發重新部署
vercel --prod

# 3. 驗證應用狀態
curl https://app.example.com/health

# 4. 監控錯誤率
```

#### 3. 資料遺失 (P1)

**症狀**：
- 誤刪除資料
- 資料損壞
- 需要恢復特定時間點

**恢復步驟**：
```sql
-- 使用 PITR 恢復到特定時間點
-- Supabase Dashboard → Database → Restore

-- 或手動恢復特定表
CREATE TABLE accounts_restored AS
SELECT * FROM accounts_backup
WHERE created_at <= '2025-11-16 12:00:00';

-- 驗證資料
SELECT COUNT(*) FROM accounts_restored;

-- 替換原表 (謹慎操作)
BEGIN;
ALTER TABLE accounts RENAME TO accounts_old;
ALTER TABLE accounts_restored RENAME TO accounts;
COMMIT;
```

#### 4. Storage 資料遺失 (P1)

**恢復步驟**：
```bash
# 從 S3 備份恢復
aws s3 sync \
  s3://my-backups/storage/20251116 \
  /tmp/storage-restore

# 上傳回 Supabase Storage
supabase storage upload \
  --bucket production-files \
  --local-path /tmp/storage-restore
```

### 災難恢復時間線

```markdown
15-30 分鐘：啟動恢復程序
30-60 分鐘：執行資料恢復
60-120 分鐘：驗證與測試
120-240 分鐘：完整恢復與監控
```

### RTO/RPO 目標

| 服務 | RTO | RPO | 說明 |
|------|-----|-----|------|
| **資料庫** | 2 小時 | 1 小時 | 從備份恢復 |
| **應用程式** | 30 分鐘 | 0 分鐘 | Git 回滾 |
| **Storage** | 4 小時 | 24 小時 | 從 S3 恢復 |

- --

## 資料遷移指南

### 1. 資料庫 Schema 遷移

```sql
-- migration_001_add_new_table.sql
-- 使用 Supabase Migration 系統

-- Up Migration
CREATE TABLE IF NOT EXISTS new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引
CREATE INDEX idx_new_feature_name ON new_feature(name);

-- RLS 策略
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON new_feature FOR SELECT
  USING (auth.uid() = user_id);

-- Down Migration
-- DROP TABLE IF EXISTS new_feature CASCADE;
```

### 2. 資料遷移腳本

```typescript
// migrate-data.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function migrateData() {
  console.log('Starting data migration...');

  // 1. 讀取舊資料
  const { data: oldData, error: readError } = await supabase
    .from('old_table')
    .select('*');

  if (readError) throw readError;

  // 2. 轉換資料格式
  const newData = oldData.map(item => ({
    id: item.id,
    new_field: transformField(item.old_field),
    migrated_at: new Date().toISOString()
  }));

  // 3. 批次插入新資料
  const batchSize = 1000;
  for (let i = 0; i < newData.length; i += batchSize) {
    const batch = newData.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('new_table')
      .insert(batch);

    if (insertError) {
      console.error(`Batch ${i} failed:`, insertError);
      throw insertError;
    }

    console.log(`Migrated ${i + batch.length}/${newData.length} records`);
  }

  console.log('Migration completed successfully!');
}

function transformField(oldValue: any): any {
  // 資料轉換邏輯
  return oldValue;
}

migrateData().catch(console.error);
```

### 3. 零停機遷移策略

```typescript
// 雙寫策略 (Dual Write)
async function createUser(userData: any) {
  // 同時寫入舊表和新表
  await Promise.all([
    supabase.from('users_old').insert(userData),
    supabase.from('users_new').insert(transformUserData(userData))
  ]);
}

// 逐步遷移讀取
async function getUser(id: string) {
  // 先嘗試從新表讀取
  let { data } = await supabase
    .from('users_new')
    .select('*')
    .eq('id', id)
    .single();

  // 如果新表沒有，從舊表讀取並遷移
  if (!data) {
    const { data: oldData } = await supabase
      .from('users_old')
      .select('*')
      .eq('id', id)
      .single();

    if (oldData) {
      // 遷移到新表
      data = transformUserData(oldData);
      await supabase.from('users_new').insert(data);
    }
  }

  return data;
}
```

- --

## 恢復演練

### 季度演練計劃

**Q1: 資料庫恢復演練**
```bash
# 1. 在測試環境執行
# 2. 從生產備份恢復到測試資料庫
# 3. 驗證資料完整性
# 4. 測量恢復時間
# 5. 記錄問題並改進
```

**Q2: 完整系統恢復演練**
```bash
# 1. 模擬完全災難情境
# 2. 恢復資料庫、應用和 Storage
# 3. 完整功能測試
# 4. 記錄 RTO/RPO 實際值
```

**Q3: 資料遷移演練**
```bash
# 1. 測試 Schema 遷移腳本
# 2. 執行資料轉換
# 3. 驗證資料一致性
# 4. 測試回滾程序
```

**Q4: 安全事件應對演練**
```bash
# 1. 模擬資料洩露
# 2. 執行應急響應
# 3. 資料隔離與恢復
# 4. 檢討改進
```

### 演練檢查清單

- [ ] 備份可用性驗證
- [ ] 恢復時間測量
- [ ] 資料完整性檢查
- [ ] 應用功能測試
- [ ] 通知系統測試
- [ ] 文檔更新
- [ ] 經驗總結

- --

## 緊急聯絡清單

| 角色 | 姓名 | 電話 | Email | 職責 |
|------|------|------|-------|------|
| **系統管理員** | - | - | - | 系統恢復 |
| **資料庫專家** | - | - | - | 資料恢復 |
| **開發主管** | - | - | - | 技術決策 |
| **運維人員** | - | - | - | 基礎設施 |

- --

## 相關文檔

- [部署指南](./39-部署指南.md)
- [監控與告警配置指南](./56-監控與告警配置指南.md)
- [安全檢查清單](./41-安全檢查清單.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次演練**：2026-02-16
