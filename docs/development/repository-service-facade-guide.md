# Development Guide: Repository/Service/Facade Pattern

## 📋 Overview

This guide provides step-by-step instructions for developers working with the Repository/Service/Facade architecture pattern in the ng-alain-github-supabase project.

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 🏗️ Creating New Entities

### Step 1: Create Repository

**Location**: `src/app/core/repositories/`

**Template**:
```typescript
/**
 * [Entity] Repository
 *
 * Data access layer for [entity] operations.
 * Handles direct Supabase queries with type filtering.
 *
 * @module core/repositories
 */

import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Account } from '@shared';

@Injectable({ providedIn: 'root' })
export class [Entity]Repository {
  private readonly supabase = inject(SupabaseClient);
  private readonly tableName = 'accounts';
  private readonly accountType = '[type]' as const; // organization, team, user, bot

  /**
   * Find all [entities]
   * Filters by type=[accountType]
   */
  async findAll(): Promise<Account[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('type', this.accountType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Find [entity] by ID
   */
  async findById(id: string): Promise<Account | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('type', this.accountType)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  /**
   * Create new [entity]
   */
  async create(entity: Partial<Account>): Promise<Account> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({ ...entity, type: this.accountType })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update [entity] by ID
   */
  async update(id: string, updates: Partial<Account>): Promise<Account> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .eq('type', this.accountType)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft delete [entity] by ID
   */
  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('type', this.accountType);

    if (error) throw error;
  }

  /**
   * Hard delete [entity] by ID (use with caution)
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('type', this.accountType);

    if (error) throw error;
  }
}
```

**Key Points**:
- ✅ Always filter by `type` column
- ✅ Throw Supabase errors directly
- ✅ No business logic
- ✅ Return raw database entities

---

### Step 2: Create Service

**Location**: `src/app/core/services/`

**Template**:
```typescript
/**
 * [Entity] Service
 *
 * Business logic layer for [entity] operations.
 * Transforms repository entities to business models.
 *
 * @module core/services
 */

import { Injectable, inject } from '@angular/core';
import { [Entity]Repository } from '../repositories/[entity].repository';
import { Account, [Entity]BusinessModel, Create[Entity]Request, Update[Entity]Request } from '@shared';

@Injectable({ providedIn: 'root' })
export class [Entity]Service {
  private readonly repository = inject([Entity]Repository);

  /**
   * Get all [entities]
   * Returns business models with enriched data
   */
  async get[Entities](): Promise<[Entity]BusinessModel[]> {
    const accounts = await this.repository.findAll();
    return accounts.map(account => this.toBusinessModel(account));
  }

  /**
   * Get [entity] by ID
   */
  async get[Entity]ById(id: string): Promise<[Entity]BusinessModel | null> {
    const account = await this.repository.findById(id);
    if (!account) return null;
    return this.toBusinessModel(account);
  }

  /**
   * Create new [entity]
   * Validates business rules before creation
   */
  async create[Entity](
    userId: string,
    request: Create[Entity]Request
  ): Promise<[Entity]BusinessModel> {
    // Business validation
    this.validateCreate[Entity]Request(request);

    // Transform to database entity
    const entity: Partial<Account> = {
      type: '[type]',
      name: request.name,
      email: request.email,
      avatar: request.avatar,
      created_by: userId
    };

    const created = await this.repository.create(entity);
    return this.toBusinessModel(created);
  }

  /**
   * Update [entity]
   * Validates business rules before update
   */
  async update[Entity](
    id: string,
    request: Update[Entity]Request
  ): Promise<[Entity]BusinessModel> {
    // Business validation
    this.validateUpdate[Entity]Request(request);

    // Check if entity exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('[Entity] not found');
    }

    // Transform to database entity
    const updates: Partial<Account> = {
      name: request.name,
      email: request.email,
      avatar: request.avatar,
      updated_at: new Date().toISOString()
    };

    const updated = await this.repository.update(id, updates);
    return this.toBusinessModel(updated);
  }

  /**
   * Delete [entity]
   * Performs soft delete by default
   */
  async delete[Entity](id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('[Entity] not found');
    }

    await this.repository.softDelete(id);
  }

  /**
   * Transform database entity to business model
   * Adds computed properties and enriched data
   */
  private toBusinessModel(account: Account): [Entity]BusinessModel {
    return {
      ...account,
      displayName: (account as any).name || 'Unnamed [Entity]',
      // Add other computed properties here
    };
  }

  /**
   * Validate create [entity] request
   * Throws error if validation fails
   */
  private validateCreate[Entity]Request(request: Create[Entity]Request): void {
    if (!request.name || request.name.trim().length < 2) {
      throw new Error('[Entity] name must be at least 2 characters');
    }

    if (request.name.length > 50) {
      throw new Error('[Entity] name must not exceed 50 characters');
    }

    if (request.email && !this.isValidEmail(request.email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Validate update [entity] request
   */
  private validateUpdate[Entity]Request(request: Update[Entity]Request): void {
    if (request.name !== undefined && request.name.trim().length < 2) {
      throw new Error('[Entity] name must be at least 2 characters');
    }

    if (request.name && request.name.length > 50) {
      throw new Error('[Entity] name must not exceed 50 characters');
    }

    if (request.email && !this.isValidEmail(request.email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

**Key Points**:
- ✅ Implement business logic and validation
- ✅ Transform entities to business models
- ✅ Throw errors for invalid states
- ✅ No error handling (Facade handles it)

---

### Step 3: Create Facade

**Location**: `src/app/core/facades/`

**Template**:
```typescript
/**
 * [Entity] Facade
 *
 * Orchestration layer for [entity] operations.
 * Handles error handling, workspace reload, and user messages.
 *
 * @module core/facades
 */

import { Injectable, inject } from '@angular/core';
import { [Entity]Service } from '../services/[entity].service';
import { BaseAccountCrudFacade } from './base-account-crud.facade';
import { [Entity]BusinessModel, Create[Entity]Request, Update[Entity]Request } from '@shared';

@Injectable({ providedIn: 'root' })
export class [Entity]Facade extends BaseAccountCrudFacade {
  private readonly service = inject([Entity]Service);

  /**
   * Get all [entities]
   * Returns cached data from workspace context if available
   */
  async get[Entities](): Promise<[Entity]BusinessModel[]> {
    try {
      return await this.service.get[Entities]();
    } catch (error) {
      this.errorHandler.logError('[Entity]Facade', 'get[Entities]', error);
      this.messageService.error('載入[實體]失敗，請稍後再試');
      throw error;
    }
  }

  /**
   * Get [entity] by ID
   */
  async get[Entity]ById(id: string): Promise<[Entity]BusinessModel | null> {
    try {
      return await this.service.get[Entity]ById(id);
    } catch (error) {
      this.errorHandler.logError('[Entity]Facade', 'get[Entity]ById', error);
      this.messageService.error('載入[實體]詳情失敗');
      throw error;
    }
  }

  /**
   * Create new [entity]
   * Reloads workspace data after successful creation
   */
  async create[Entity](request: Create[Entity]Request): Promise<[Entity]BusinessModel> {
    try {
      const userId = await this.getCurrentUserId();
      const [entity] = await this.service.create[Entity](userId, request);

      // Reload workspace context
      await this.reloadWorkspace();

      this.messageService.success('[實體]創建成功！');
      return [entity];
    } catch (error) {
      this.errorHandler.logError('[Entity]Facade', 'create[Entity]', error);
      
      // User-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('name must be')) {
          this.messageService.error('名稱格式不正確');
        } else if (error.message.includes('email')) {
          this.messageService.error('電子郵件格式不正確');
        } else {
          this.messageService.error(error.message);
        }
      } else {
        this.messageService.error('創建[實體]失敗，請稍後再試');
      }
      
      throw error;
    }
  }

  /**
   * Update [entity]
   * Reloads workspace data after successful update
   */
  async update[Entity](
    id: string,
    request: Update[Entity]Request
  ): Promise<[Entity]BusinessModel> {
    try {
      const [entity] = await this.service.update[Entity](id, request);

      // Reload workspace context
      await this.reloadWorkspace();

      this.messageService.success('[實體]更新成功！');
      return [entity];
    } catch (error) {
      this.errorHandler.logError('[Entity]Facade', 'update[Entity]', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          this.messageService.error('[實體]不存在');
        } else if (error.message.includes('name must be')) {
          this.messageService.error('名稱格式不正確');
        } else {
          this.messageService.error(error.message);
        }
      } else {
        this.messageService.error('更新[實體]失敗，請稍後再試');
      }
      
      throw error;
    }
  }

  /**
   * Delete [entity]
   * Reloads workspace data after successful deletion
   */
  async delete[Entity](id: string): Promise<void> {
    try {
      await this.service.delete[Entity](id);

      // Reload workspace context
      await this.reloadWorkspace();

      this.messageService.success('[實體]已刪除！');
    } catch (error) {
      this.errorHandler.logError('[Entity]Facade', 'delete[Entity]', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        this.messageService.error('[實體]不存在');
      } else {
        this.messageService.error('刪除[實體]失敗，請稍後再試');
      }
      
      throw error;
    }
  }
}
```

**Key Points**:
- ✅ Extend BaseAccountCrudFacade
- ✅ Handle all errors with user-friendly messages
- ✅ Reload workspace after mutations
- ✅ Log errors for monitoring
- ✅ Rethrow errors after handling

---

### Step 4: Create DTOs and Business Models

**Location**: `src/app/shared/models/`

**Template**:
```typescript
/**
 * [Entity] Models and DTOs
 *
 * @module shared/models
 */

import { Account } from './account.model';

/**
 * [Entity] Business Model
 * Extends Account with computed properties
 */
export interface [Entity]BusinessModel extends Account {
  displayName: string;
  // Add other computed or enriched properties
}

/**
 * Create [Entity] Request DTO
 */
export interface Create[Entity]Request {
  name: string;
  email?: string;
  avatar?: string;
  // Add other required fields
}

/**
 * Update [Entity] Request DTO
 */
export interface Update[Entity]Request {
  name?: string;
  email?: string;
  avatar?: string;
  // Add other updatable fields
}
```

---

### Step 5: Create Component

**Location**: `src/app/routes/[feature]/[action]-[entity]/`

**Template**:
```typescript
/**
 * Create [Entity] Component
 *
 * Allows users to create a new [entity].
 * Integrated with [Entity]Facade.
 *
 * @module routes/[feature]
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { [Entity]Facade } from '@core';
import { SHARED_IMPORTS, Create[Entity]Request, FormUtils } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-[entity]',
  templateUrl: './create-[entity].component.html',
  styleUrls: ['./create-[entity].component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class Create[Entity]Component {
  private readonly fb = inject(FormBuilder);
  private readonly [entity]Facade = inject([Entity]Facade);
  private readonly modal = inject(NzModalRef);
  private readonly msg = inject(NzMessageService);

  loading = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    avatar: ['']
  });

  /**
   * Submit form to create [entity]
   */
  async submit(): Promise<void> {
    // Validate form with FormUtils
    if (!FormUtils.validateFormNzStyle(this.form)) {
      return;
    }

    this.loading = true;
    try {
      // Trim form values
      const request = FormUtils.trimFormValues(this.form.value) as Create[Entity]Request;
      
      // Call Facade (handles errors, workspace reload, messages)
      const [entity] = await this.[entity]Facade.create[Entity](request);
      
      // Close modal with result
      this.modal.close([entity]);
    } catch (error) {
      // Facade already handled error display
    } finally {
      this.loading = false;
    }
  }

  /**
   * Cancel and close modal
   */
  cancel(): void {
    this.modal.destroy();
  }
}
```

**Template HTML**:
```html
<nz-modal
  [nzVisible]="true"
  [nzTitle]="'創建[實體]'"
  [nzClosable]="true"
  [nzFooter]="null"
  (nzOnCancel)="cancel()"
>
  <div *nzModalContent>
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzRequired]="true">名稱</nz-form-label>
        <nz-form-control [nzErrorTip]="'請輸入名稱（2-50字元）'">
          <input
            nz-input
            formControlName="name"
            placeholder="請輸入[實體]名稱"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>電子郵件</nz-form-label>
        <nz-form-control [nzErrorTip]="'請輸入有效的電子郵件'">
          <input
            nz-input
            type="email"
            formControlName="email"
            placeholder="請輸入電子郵件（選填）"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>頭像URL</nz-form-label>
        <nz-form-control>
          <input
            nz-input
            formControlName="avatar"
            placeholder="請輸入頭像URL（選填）"
          />
        </nz-form-control>
      </nz-form-item>

      <div class="modal-footer">
        <button nz-button type="button" (click)="cancel()">取消</button>
        <button
          nz-button
          nzType="primary"
          type="submit"
          [nzLoading]="loading"
        >
          創建
        </button>
      </div>
    </form>
  </div>
</nz-modal>
```

**Key Points**:
- ✅ Use FormUtils for validation
- ✅ Call Facade only (never Service or Repository)
- ✅ Handle loading states
- ✅ Use ChangeDetectionStrategy.OnPush
- ✅ Minimal error handling (Facade handles it)

---

## 🧪 Writing Tests

### Repository Tests

**Location**: `src/app/core/repositories/[entity].repository.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { [Entity]Repository } from './[entity].repository';
import { SupabaseClient } from '@supabase/supabase-js';

describe('[Entity]Repository', () => {
  let repository: [Entity]Repository;
  let supabaseMock: jasmine.SpyObj<SupabaseClient>;

  beforeEach(() => {
    supabaseMock = jasmine.createSpyObj('SupabaseClient', ['from']);

    TestBed.configureTestingModule({
      providers: [
        [Entity]Repository,
        { provide: SupabaseClient, useValue: supabaseMock }
      ]
    });

    repository = TestBed.inject([Entity]Repository);
  });

  describe('findAll', () => {
    it('should filter by [type]', async () => {
      const mockData = [
        { id: '1', type: '[type]', name: 'Test [Entity]' }
      ];

      supabaseMock.from.and.returnValue({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: mockData, error: null })
          })
        })
      } as any);

      const result = await repository.findAll();

      expect(result).toEqual(mockData);
      expect(supabaseMock.from).toHaveBeenCalledWith('accounts');
    });

    it('should throw error on database failure', async () => {
      const mockError = new Error('Database error');

      supabaseMock.from.and.returnValue({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: null, error: mockError })
          })
        })
      } as any);

      await expectAsync(repository.findAll()).toBeRejectedWith(mockError);
    });
  });
});
```

### Service Tests

**Location**: `src/app/core/services/[entity].service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { [Entity]Service } from './[entity].service';
import { [Entity]Repository } from '../repositories/[entity].repository';

describe('[Entity]Service', () => {
  let service: [Entity]Service;
  let repositoryMock: jasmine.SpyObj<[Entity]Repository>;

  beforeEach(() => {
    repositoryMock = jasmine.createSpyObj('[Entity]Repository', [
      'findAll',
      'findById',
      'create',
      'update',
      'softDelete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        [Entity]Service,
        { provide: [Entity]Repository, useValue: repositoryMock }
      ]
    });

    service = TestBed.inject([Entity]Service);
  });

  describe('create[Entity]', () => {
    it('should validate and create [entity]', async () => {
      const request = { name: 'Test [Entity]', email: 'test@example.com' };
      const mockAccount = { id: '1', type: '[type]', ...request };
      
      repositoryMock.create.and.returnValue(Promise.resolve(mockAccount as any));

      const result = await service.create[Entity]('user123', request);

      expect(result.displayName).toBe('Test [Entity]');
      expect(repositoryMock.create).toHaveBeenCalled();
    });

    it('should throw error for invalid name', async () => {
      const request = { name: 'A' }; // Too short

      await expectAsync(
        service.create[Entity]('user123', request)
      ).toBeRejectedWithError('[Entity] name must be at least 2 characters');
    });
  });
});
```

### Facade Tests

**Location**: `src/app/core/facades/[entity].facade.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { [Entity]Facade } from './[entity].facade';
import { [Entity]Service } from '../services/[entity].service';
import { WorkspaceDataService } from '../services/workspace-data.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorHandlerService } from '../services/error-handler.service';

describe('[Entity]Facade', () => {
  let facade: [Entity]Facade;
  let serviceMock: jasmine.SpyObj<[Entity]Service>;
  let workspaceMock: jasmine.SpyObj<WorkspaceDataService>;
  let messageMock: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('[Entity]Service', [
      'get[Entities]',
      'create[Entity]',
      'update[Entity]',
      'delete[Entity]'
    ]);

    workspaceMock = jasmine.createSpyObj('WorkspaceDataService', ['reload']);
    messageMock = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        [Entity]Facade,
        { provide: [Entity]Service, useValue: serviceMock },
        { provide: WorkspaceDataService, useValue: workspaceMock },
        { provide: NzMessageService, useValue: messageMock }
      ]
    });

    facade = TestBed.inject([Entity]Facade);
  });

  describe('create[Entity]', () => {
    it('should create [entity] and reload workspace', async () => {
      const request = { name: 'Test [Entity]' };
      const mock[Entity] = { id: '1', type: '[type]', name: 'Test [Entity]' };

      serviceMock.create[Entity].and.returnValue(Promise.resolve(mock[Entity] as any));
      workspaceMock.reload.and.returnValue(Promise.resolve());

      await facade.create[Entity](request);

      expect(serviceMock.create[Entity]).toHaveBeenCalled();
      expect(workspaceMock.reload).toHaveBeenCalled();
      expect(messageMock.success).toHaveBeenCalledWith('[實體]創建成功！');
    });

    it('should handle errors with user message', async () => {
      const request = { name: 'Test' };
      const error = new Error('Validation failed');

      serviceMock.create[Entity].and.returnValue(Promise.reject(error));

      await expectAsync(facade.create[Entity](request)).toBeRejected();
      expect(messageMock.error).toHaveBeenCalled();
    });
  });
});
```

---

## 🔧 Common Tasks

### Adding a New Field

1. **Update Database Schema** (Supabase):
```sql
ALTER TABLE accounts ADD COLUMN new_field TEXT;
```

2. **Update Account Interface** (`src/app/shared/models/account.model.ts`):
```typescript
export interface Account {
  // ... existing fields
  new_field?: string;
}
```

3. **Update Request DTOs**:
```typescript
export interface Create[Entity]Request {
  // ... existing fields
  newField?: string;
}
```

4. **Update Repository** (if needed for filtering):
```typescript
async findByNewField(value: string): Promise<Account[]> {
  const { data, error } = await this.supabase
    .from(this.tableName)
    .select('*')
    .eq('type', this.accountType)
    .eq('new_field', value);

  if (error) throw error;
  return data || [];
}
```

5. **Update Service** (transform in toBusinessModel if needed):
```typescript
private toBusinessModel(account: Account): [Entity]BusinessModel {
  return {
    ...account,
    displayName: account.name || 'Unnamed',
    // Process new field if needed
    processedNewField: this.processNewField(account.new_field)
  };
}
```

6. **Update Component Form**:
```typescript
form: FormGroup = this.fb.group({
  // ... existing fields
  newField: ['', [/* validators */]]
});
```

---

### Debugging Tips

#### 1. Database Query Issues

```typescript
// Add logging in Repository
async findAll(): Promise<Account[]> {
  console.log('Fetching [entities] with type:', this.accountType);
  
  const { data, error } = await this.supabase
    .from(this.tableName)
    .select('*')
    .eq('type', this.accountType);

  console.log('Query result:', { data, error });
  
  if (error) throw error;
  return data || [];
}
```

#### 2. Business Logic Issues

```typescript
// Add logging in Service
async create[Entity](userId: string, request: Create[Entity]Request) {
  console.log('Creating [entity] with request:', request);
  
  this.validateCreate[Entity]Request(request);
  
  const entity = {
    type: '[type]',
    ...request,
    created_by: userId
  };
  
  console.log('Transformed entity:', entity);
  
  const created = await this.repository.create(entity);
  return this.toBusinessModel(created);
}
```

#### 3. Facade Error Handling

```typescript
// Log detailed error information
catch (error) {
  console.error('[Entity]Facade error:', {
    method: 'create[Entity]',
    error,
    stack: error instanceof Error ? error.stack : undefined
  });
  
  this.errorHandler.logError('[Entity]Facade', 'create[Entity]', error);
  this.messageService.error('創建失敗');
  throw error;
}
```

---

## 🎯 Best Practices Checklist

### Repository Layer
- [ ] Always filter by `type` column
- [ ] Throw Supabase errors directly
- [ ] No business logic
- [ ] Return raw database entities
- [ ] Use descriptive method names

### Service Layer
- [ ] Implement business validation
- [ ] Transform entities to business models
- [ ] Throw errors for invalid states
- [ ] Keep methods focused and single-purpose
- [ ] Document validation rules

### Facade Layer
- [ ] Extend BaseAccountCrudFacade for CRUD
- [ ] Handle all errors with user messages
- [ ] Reload workspace after mutations
- [ ] Log errors for monitoring
- [ ] Rethrow errors after handling

### Component Layer
- [ ] Use Facade only (never Service/Repository)
- [ ] Use FormUtils for validation
- [ ] Handle loading states
- [ ] Use ChangeDetectionStrategy.OnPush
- [ ] Minimal error handling

---

## 📚 Additional Resources

- [Architecture Documentation](../architecture/repository-service-facade-pattern.md)
- [Supabase Integration](../SUPABASE_INTEGRATION.md)
- [RLS Policies Guide](../RLS_INFINITE_RECURSION_FIX.md)
- [Testing Guide](./testing-guide.md)

---

**Last Updated**: 2025-11-24  
**Version**: 1.0  
**Maintained by**: Development Team
