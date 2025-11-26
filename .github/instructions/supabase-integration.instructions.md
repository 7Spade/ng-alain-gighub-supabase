---
description: 'Supabase integration patterns and best practices for ng-alain application'
applyTo: '**/*.ts'
---

# Supabase Integration Instructions

Guidelines for integrating Supabase with the ng-alain Angular application.

## Project Configuration

### Environment Setup

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'your-project-url',
    anonKey: 'your-anon-key',
    serviceRoleKey: 'your-service-role-key' // Only for server-side
  }
};
```

### Database Types

```typescript
// src/app/core/infra/types/database.types.ts
// Auto-generated from Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; name: string; email: string; created_at: string };
        Insert: { name: string; email: string };
        Update: { name?: string; email?: string };
      };
      // ... other tables
    };
  };
};
```

## Service Patterns

### Core SupabaseService

Always use `SupabaseService` for client access:

```typescript
import { inject } from '@angular/core';
import { SupabaseService } from '@core';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly supabase = inject(SupabaseService);
  
  getClient() {
    return this.supabase.getClient();
  }
}
```

### Repository Pattern

Use repositories for data access:

```typescript
// src/app/core/infra/repositories/user.repository.ts
import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Row'];
type CreateUser = Database['public']['Tables']['users']['Insert'];
type UpdateUser = Database['public']['Tables']['users']['Update'];

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly supabase = inject(SupabaseService);
  
  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data ?? [];
  }
  
  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
  
  async create(user: CreateUser): Promise<User> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async update(id: string, updates: UpdateUser): Promise<User> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

### Facade Pattern

Use facades for complex business logic:

```typescript
// src/app/core/facades/user.facade.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { UserRepository } from '../infra/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly repository = inject(UserRepository);
  
  // State
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedId = signal<string | null>(null);
  
  // Public selectors
  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  readonly selectedUser = computed(() => {
    const id = this._selectedId();
    return id ? this._users().find(u => u.id === id) : null;
  });
  
  readonly activeUsers = computed(() => 
    this._users().filter(u => u.status === 'active')
  );
  
  // Actions
  async loadUsers(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const users = await this.repository.findAll();
      this._users.set(users);
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      this._loading.set(false);
    }
  }
  
  selectUser(id: string | null): void {
    this._selectedId.set(id);
  }
  
  async createUser(user: CreateUser): Promise<void> {
    this._loading.set(true);
    
    try {
      const newUser = await this.repository.create(user);
      this._users.update(users => [...users, newUser]);
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      this._loading.set(false);
    }
  }
}
```

## Query Patterns

### Basic Queries

```typescript
// Select all columns
const { data } = await client.from('users').select('*');

// Select specific columns
const { data } = await client.from('users').select('id, name, email');

// Select with relationships
const { data } = await client
  .from('posts')
  .select(`
    id,
    title,
    author:users(id, name)
  `);
```

### Filtering

```typescript
// Equal
const { data } = await client.from('users').select('*').eq('status', 'active');

// Not equal
const { data } = await client.from('users').select('*').neq('status', 'deleted');

// Greater/Less than
const { data } = await client.from('orders').select('*').gt('total', 100);

// Contains (array)
const { data } = await client.from('users').select('*').contains('roles', ['admin']);

// Pattern matching
const { data } = await client.from('users').select('*').ilike('name', '%john%');

// Multiple conditions
const { data } = await client
  .from('users')
  .select('*')
  .eq('status', 'active')
  .gte('created_at', '2024-01-01');
```

### Pagination

```typescript
// Limit and offset
const { data } = await client
  .from('users')
  .select('*')
  .range(0, 9); // First 10 records

// With count
const { data, count } = await client
  .from('users')
  .select('*', { count: 'exact' })
  .range(0, 9);
```

### Ordering

```typescript
const { data } = await client
  .from('users')
  .select('*')
  .order('created_at', { ascending: false });

// Multiple columns
const { data } = await client
  .from('users')
  .select('*')
  .order('status', { ascending: true })
  .order('name', { ascending: true });
```

## Authentication Patterns

### Sign Up

```typescript
async signUp(email: string, password: string): Promise<void> {
  const { data, error } = await this.supabase
    .getClient()
    .auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  
  if (error) throw error;
}
```

### Sign In

```typescript
async signIn(email: string, password: string): Promise<void> {
  const { data, error } = await this.supabase
    .getClient()
    .auth.signInWithPassword({ email, password });
  
  if (error) throw error;
  
  // Store token for @delon/auth
  this.tokenService.set({ token: data.session.access_token });
}
```

### OAuth

```typescript
async signInWithGoogle(): Promise<void> {
  const { error } = await this.supabase
    .getClient()
    .auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  
  if (error) throw error;
}
```

### Session Management

```typescript
// Get current session
async getSession() {
  const { data: { session } } = await this.supabase
    .getClient()
    .auth.getSession();
  return session;
}

// Listen for auth changes
subscribeToAuth(callback: (session: Session | null) => void) {
  return this.supabase
    .getClient()
    .auth.onAuthStateChange((event, session) => {
      callback(session);
    });
}

// Sign out
async signOut(): Promise<void> {
  await this.supabase.getClient().auth.signOut();
  this.tokenService.clear();
}
```

## Real-time Subscriptions

### Subscribe to Changes

```typescript
import { Injectable, OnDestroy, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private channel: RealtimeChannel | null = null;
  private readonly _messages = signal<Message[]>([]);
  readonly messages = this._messages.asReadonly();
  
  subscribeToMessages(roomId: string): void {
    this.channel = this.supabase
      .getClient()
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          this._messages.update(msgs => [...msgs, payload.new as Message]);
        }
      )
      .subscribe();
  }
  
  ngOnDestroy(): void {
    this.channel?.unsubscribe();
  }
}
```

## Storage

### Upload Files

```typescript
async uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `avatars/${userId}.${fileExt}`;
  
  const { error } = await this.supabase
    .getClient()
    .storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });
  
  if (error) throw error;
  
  const { data } = this.supabase
    .getClient()
    .storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
```

### Download Files

```typescript
async downloadFile(bucket: string, path: string): Promise<Blob> {
  const { data, error } = await this.supabase
    .getClient()
    .storage
    .from(bucket)
    .download(path);
  
  if (error) throw error;
  return data;
}
```

## Error Handling

### Standard Error Handler

```typescript
interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
}

function handleSupabaseError(error: SupabaseError): never {
  console.error('Supabase error:', error);
  
  // Map common error codes
  switch (error.code) {
    case 'PGRST116':
      throw new Error('Record not found');
    case '23505':
      throw new Error('Duplicate record exists');
    case '23503':
      throw new Error('Referenced record does not exist');
    case '42501':
      throw new Error('Permission denied');
    default:
      throw new Error(error.message || 'An unexpected error occurred');
  }
}
```

### Component Error Handling

```typescript
@Component({
  template: `
    @if (error()) {
      <nz-alert 
        nzType="error" 
        [nzMessage]="error()" 
        nzShowIcon 
        nzCloseable
        (nzOnClose)="clearError()">
      </nz-alert>
    }
    
    @if (loading()) {
      <nz-spin nzSimple />
    } @else {
      <!-- Content -->
    }
  `
})
export class DataComponent {
  readonly facade = inject(DataFacade);
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  
  clearError(): void {
    this.facade.clearError();
  }
}
```

## Best Practices

### 1. Always Use Type-Safe Queries

```typescript
// ✅ Good - Uses generated types
const { data } = await client
  .from('users')
  .select('id, name, email')
  .returns<Pick<User, 'id' | 'name' | 'email'>[]>();

// ❌ Bad - No type safety
const { data } = await client.from('users').select('*');
```

### 2. Handle Loading and Error States

```typescript
// ✅ Good - Proper state management
private readonly _loading = signal(false);
private readonly _error = signal<string | null>(null);

async loadData(): Promise<void> {
  this._loading.set(true);
  this._error.set(null);
  
  try {
    const data = await this.repository.findAll();
    this._data.set(data);
  } catch (err) {
    this._error.set(err.message);
  } finally {
    this._loading.set(false);
  }
}
```

### 3. Clean Up Subscriptions

```typescript
// ✅ Good - Proper cleanup
@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private subscription: RealtimeChannel | null = null;
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
```

### 4. Use Row Level Security (RLS)

Always configure RLS policies in Supabase for data security:

```sql
-- Example RLS policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 5. Batch Operations

```typescript
// ✅ Good - Batch insert
const { data, error } = await client
  .from('items')
  .insert([
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ])
  .select();
```

## Testing

### Mock Supabase Client

```typescript
// test/mocks/supabase.mock.ts
export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: {}, error: null })
};

export const mockSupabaseService = {
  getClient: () => mockSupabaseClient
};
```

### Unit Test Example

```typescript
describe('UserRepository', () => {
  let repository: UserRepository;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserRepository,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });
    repository = TestBed.inject(UserRepository);
  });
  
  it('should find all users', async () => {
    mockSupabaseClient.select.mockResolvedValue({
      data: [{ id: '1', name: 'Test' }],
      error: null
    });
    
    const users = await repository.findAll();
    expect(users).toHaveLength(1);
  });
});
```
