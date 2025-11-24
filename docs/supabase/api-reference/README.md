# Supabase API 參考 | Supabase API Reference

> **目的**: 本目錄包含 Supabase API 使用參考文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- API 使用者

---

## 📚 文檔清單

- **supabase-client.md** ⭐⭐⭐⭐⭐ - Supabase Client 使用指南
  - Client 初始化
  - 認證 API
  - 資料庫 API
  - 儲存 API
  - Real-time API

- **type-definitions.md** ⭐⭐⭐⭐ - TypeScript 型別定義
  - 資料庫型別生成
  - 型別使用範例
  - 型別安全實踐

- **custom-apis.md** ⭐⭐⭐⭐ - 自訂 API 參考
  - Edge Functions
  - REST API
  - GraphQL API（如有）

---

## 🚀 快速開始

### 使用 Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

詳見：**supabase-client.md**

### 型別定義

```typescript
import type { Database } from './database.types'

const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

詳見：**type-definitions.md**

---

## 📖 相關文檔

- [../development/api-dev.md](../development/api-dev.md) - API 開發規範
- [../architecture/overview.md](../architecture/overview.md) - 架構概覽

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊

