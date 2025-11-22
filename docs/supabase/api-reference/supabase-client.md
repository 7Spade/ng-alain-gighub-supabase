# Supabase Client 使用指南 | Supabase Client Usage Guide

> **文件版本 | Document Version**: 1.0.0  
> **最後更新 | Last Updated**: 2025-11-22

---

## 📚 基礎使用 | Basic Usage

### 初始化 Client | Initialize Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
```

---

## 🔍 查詢操作 | Query Operations

### 基本 SELECT

```typescript
// 取得所有記錄
const { data, error } = await supabase
  .from('posts')
  .select('*');

// 選擇特定欄位
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at');

// 關聯查詢
const { data } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    user:users (
      id,
      name,
      email
    )
  `);
```

### 過濾條件 | Filters

```typescript
// 等於
.eq('status', 'published')

// 不等於
.neq('status', 'draft')

// 大於 / 小於
.gt('views', 100)
.gte('views', 100)
.lt('views', 1000)

// IN 查詢
.in('category', ['tech', 'news'])

// LIKE 查詢
.like('title', '%Angular%')
.ilike('title', '%angular%')  // 不區分大小寫

// 範圍查詢
.range(0, 9)  // 取得前 10 筆

// 組合條件
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('status', 'published')
  .gte('views', 100)
  .order('created_at', { ascending: false })
  .limit(10);
```

---

## ✏️ 資料操作 | Data Operations

### INSERT

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: 'New Post',
    content: 'Content here',
    user_id: userId
  })
  .select()
  .single();
```

### UPDATE

```typescript
const { data, error } = await supabase
  .from('posts')
  .update({ title: 'Updated Title' })
  .eq('id', postId)
  .select();
```

### DELETE

```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

---

## 🔐 認證操作 | Authentication

### 登入 / 註冊

```typescript
// Email/Password 登入
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Email/Password 註冊
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// OAuth 登入
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

### 登出

```typescript
const { error } = await supabase.auth.signOut();
```

---

## 📁 檔案儲存 | File Storage

### 上傳檔案

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`public/${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true
  });
```

### 下載檔案

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('public/avatar.png');
```

### 取得公開 URL

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar.png');

console.log(data.publicUrl);
```

---

## 🔄 即時訂閱 | Realtime Subscriptions

```typescript
const channel = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// 取消訂閱
channel.unsubscribe();
```

---

**完整 API 文件 | Full API Documentation**:
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [TypeScript 型別定義](./type-definitions.md)
