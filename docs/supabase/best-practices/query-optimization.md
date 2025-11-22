# 查詢優化技巧 | Query Optimization Techniques

> **文件版本 | Document Version**: 1.0.0  
> **最後更新 | Last Updated**: 2025-11-22  
> **效能目標 | Performance Goal**: < 100ms 回應時間

---

## 📋 優化策略 | Optimization Strategies

### 1. 索引優化 | Index Optimization

```sql
-- 單欄位索引
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- 複合索引（注意欄位順序）
CREATE INDEX idx_posts_user_status ON posts(user_id, status);

-- 部分索引（僅索引特定條件的資料）
CREATE INDEX idx_posts_published 
  ON posts(created_at) 
  WHERE status = 'published';

-- 函數索引
CREATE INDEX idx_posts_title_lower 
  ON posts(LOWER(title));
```

### 2. 選擇性查詢 | Selective Queries

```typescript
// ❌ 錯誤：查詢所有欄位
const { data } = await supabase
  .from('posts')
  .select('*');

// ✅ 正確：僅查詢需要的欄位
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at');
```

### 3. 分頁查詢 | Pagination

```typescript
// 使用 range 進行分頁
const pageSize = 20;
const page = 1;

const { data, count } = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .range((page - 1) * pageSize, page * pageSize - 1);
```

### 4. 避免 N+1 查詢 | Avoid N+1 Queries

```typescript
// ❌ 錯誤：N+1 查詢
const posts = await fetchPosts();
for (const post of posts) {
  post.author = await fetchUser(post.user_id);
}

// ✅ 正確：使用關聯查詢
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    author:users(id, name, email)
  `);
```

### 5. 使用 @delon/cache 快取 | Use @delon/cache

```typescript
import { Injectable } from '@angular/core';
import { CacheService } from '@delon/cache';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(
    private supabase: SupabaseService,
    private cache: CacheService
  ) {}

  async getPosts() {
    const cacheKey = 'posts:all';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data } = await this.supabase.client
      .from('posts')
      .select('*');

    // 快取 5 分鐘
    this.cache.set(cacheKey, data, { expire: 300000 });
    
    return data;
  }
}
```

---

## 📊 效能監控 | Performance Monitoring

### 使用 EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE user_id = 'xxx'
  AND status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

---

**延伸閱讀 | Further Reading**:
- [資料庫架構設計](../architecture/database.md)
- [索引策略](./database-design.md)
- [RLS 效能考量](../security/rls.md#6-效能考量--performance-considerations)
