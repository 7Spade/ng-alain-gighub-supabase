# Developer Guide: Account Architecture Patterns

## Quick Start

This guide shows you how to use the refactored Account architecture patterns in your daily development.

---

## Table of Contents

1. [Creating a New Account Type](#creating-a-new-account-type)
2. [Querying Data](#querying-data)
3. [Creating Entities](#creating-entities)
4. [Updating Entities](#updating-entities)
5. [Deleting Entities](#deleting-entities)
6. [Form Handling](#form-handling)
7. [Error Handling](#error-handling)
8. [State Management](#state-management)
9. [Common Patterns](#common-patterns)

---

## Creating a New Account Type

If you need to add a new account type (e.g., `ServiceAccount`), follow this template:

### Step 1: Create Repository

```typescript
// src/app/core/infra/repositories/account/service-account.repository.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from '../base.repository';
import { AccountType, ServiceAccount, ServiceAccountInsert, ServiceAccountUpdate } from '../../types';

@Injectable({ providedIn: 'root' })
export class ServiceAccountRepository extends BaseRepository<
  ServiceAccount,
  ServiceAccountInsert,
  ServiceAccountUpdate
> {
  protected tableName = 'accounts';

  // Enforce type='ServiceAccount' filter
  override findAll(options?: QueryOptions): Observable<ServiceAccount[]> {
    const filters = {
      ...(options?.filters || {}),
      type: AccountType.SERVICE_ACCOUNT
    };
    return super.findAll({ ...options, filters });
  }

  // Add type-specific methods
  findByApiKey(apiKey: string): Observable<ServiceAccount | null> {
    return this.findOne({ apiKey, type: AccountType.SERVICE_ACCOUNT });
  }
}
```

### Step 2: Create Service

```typescript
// src/app/shared/services/account/service-account.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { ServiceAccountRepository } from '@core';
import { firstValueFrom } from 'rxjs';
import { ServiceAccountModel, CreateServiceAccountRequest, UpdateServiceAccountRequest } from '../../models/account';

@Injectable({ providedIn: 'root' })
export class ServiceAccountService {
  private readonly serviceAccountRepo = inject(ServiceAccountRepository);

  // State
  private serviceAccountsState = signal<ServiceAccountModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Readonly signals
  readonly serviceAccounts = this.serviceAccountsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  async findById(id: string): Promise<ServiceAccountModel | null> {
    const account = await firstValueFrom(this.serviceAccountRepo.findById(id));
    return account as ServiceAccountModel | null;
  }

  async createServiceAccount(request: CreateServiceAccountRequest): Promise<ServiceAccountModel> {
    const insertData = {
      name: request.name,
      apiKey: request.apiKey,
      // ... other fields
    };
    const account = await firstValueFrom(this.serviceAccountRepo.create(insertData as any));
    return account as ServiceAccountModel;
  }

  // Implement other CRUD methods...
}
```

### Step 3: Create Facade

```typescript
// src/app/core/facades/account/service-account.facade.ts

import { Injectable, inject } from '@angular/core';
import { ServiceAccountService, ServiceAccountModel, CreateServiceAccountRequest, UpdateServiceAccountRequest } from '@shared';
import { BaseAccountCrudFacade } from './base-account-crud.facade';

@Injectable({ providedIn: 'root' })
export class ServiceAccountFacade extends BaseAccountCrudFacade<
  ServiceAccountModel,
  CreateServiceAccountRequest,
  UpdateServiceAccountRequest
> {
  private readonly serviceAccountService = inject(ServiceAccountService);

  protected readonly entityTypeName = '服務帳戶';
  protected readonly facadeName = 'ServiceAccountFacade';

  // Proxy signals
  readonly serviceAccounts = this.serviceAccountService.serviceAccounts;
  readonly loading = this.serviceAccountService.loading;
  readonly error = this.serviceAccountService.error;

  // Implement execute methods
  protected executeCreate(request: CreateServiceAccountRequest): Promise<ServiceAccountModel> {
    return this.serviceAccountService.createServiceAccount(request);
  }

  protected executeUpdate(id: string, request: UpdateServiceAccountRequest): Promise<ServiceAccountModel> {
    return this.serviceAccountService.updateServiceAccount(id, request);
  }

  protected executeDelete(id: string): Promise<ServiceAccountModel> {
    return this.serviceAccountService.softDeleteServiceAccount(id);
  }

  // Public API methods
  async createServiceAccount(request: CreateServiceAccountRequest): Promise<ServiceAccountModel> {
    return this.create(request);
  }

  async updateServiceAccount(id: string, request: UpdateServiceAccountRequest): Promise<ServiceAccountModel> {
    return this.update(id, request);
  }

  async deleteServiceAccount(id: string): Promise<ServiceAccountModel> {
    return this.delete(id);
  }

  async findById(id: string): Promise<ServiceAccountModel | null> {
    return this.serviceAccountService.findById(id);
  }
}
```

### Step 4: Export Everything

```typescript
// Update index files:

// src/app/core/infra/repositories/account/index.ts
export * from './service-account.repository';

// src/app/shared/services/account/index.ts
export * from './service-account.service';

// src/app/core/facades/account/index.ts
export * from './service-account.facade';
```

---

## Querying Data

### Query All Entities

```typescript
// In component
export class ServiceAccountListComponent {
  private readonly facade = inject(ServiceAccountFacade);
  
  // Access reactive signal
  readonly serviceAccounts = this.facade.serviceAccounts;
  readonly loading = this.facade.loading;

  async ngOnInit() {
    // Load data
    await this.facade.loadServiceAccounts();
  }
}
```

### Query Single Entity

```typescript
async loadServiceAccount(id: string) {
  const serviceAccount = await this.facade.findById(id);
  if (serviceAccount) {
    console.log('Found:', serviceAccount);
  }
}
```

### Query with Filters

```typescript
// In service
async findActiveServiceAccounts(): Promise<ServiceAccountModel[]> {
  const accounts = await firstValueFrom(
    this.serviceAccountRepo.findAll({
      filters: { status: AccountStatus.ACTIVE }
    })
  );
  return accounts as ServiceAccountModel[];
}
```

---

## Creating Entities

### Pattern

```typescript
// In component
export class CreateServiceAccountComponent {
  private readonly facade = inject(ServiceAccountFacade);
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(NzModalRef);

  loading = false;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    apiKey: ['', [Validators.required]],
    description: ['']
  });

  async submit(): Promise<void> {
    // Use FormUtils for validation
    if (!validateForm(this.form)) {
      return;
    }

    this.loading = true;
    try {
      // Use FormUtils to extract and trim values
      const request = getTrimmedFormValue<CreateServiceAccountRequest>(this.form);
      
      // Facade handles error transformation and workspace reload
      const serviceAccount = await this.facade.createServiceAccount(request as CreateServiceAccountRequest);
      
      this.msg.success('服務帳戶創建成功！');
      this.modal.close(serviceAccount);
    } catch (error) {
      // Error is already user-friendly from facade
      this.msg.error(error instanceof Error ? error.message : '創建失敗');
    } finally {
      this.loading = false;
    }
  }
}
```

---

## Updating Entities

### Pattern

```typescript
export class UpdateServiceAccountComponent implements OnInit {
  private readonly facade = inject(ServiceAccountFacade);
  private readonly fb = inject(FormBuilder);
  
  serviceAccount!: ServiceAccountModel;
  form = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit(): void {
    // Load existing data
    const config = this.modal.getConfig() as any;
    this.serviceAccount = config?.nzComponentParams?.serviceAccount;
    
    // Patch form with existing values
    if (this.serviceAccount) {
      this.form.patchValue({
        name: this.serviceAccount.name,
        description: this.serviceAccount.description
      });
    }
  }

  async submit(): Promise<void> {
    if (!validateForm(this.form)) {
      return;
    }

    this.loading = true;
    try {
      const request = getTrimmedFormValue<UpdateServiceAccountRequest>(this.form);
      const updated = await this.facade.updateServiceAccount(
        this.serviceAccount.id,
        request as UpdateServiceAccountRequest
      );
      this.msg.success('服務帳戶更新成功！');
      this.modal.close(updated);
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '更新失敗');
    } finally {
      this.loading = false;
    }
  }
}
```

---

## Deleting Entities

### Pattern (Soft Delete)

```typescript
export class DeleteServiceAccountComponent implements OnInit {
  private readonly facade = inject(ServiceAccountFacade);
  
  serviceAccount!: ServiceAccountModel;
  loading = false;

  ngOnInit(): void {
    const config = this.modal.getConfig() as any;
    this.serviceAccount = config?.nzComponentParams?.serviceAccount;
  }

  async confirmDelete(): Promise<void> {
    this.loading = true;
    try {
      // Facade handles soft delete (sets status to DELETED)
      await this.facade.deleteServiceAccount(this.serviceAccount.id);
      this.msg.success('服務帳戶已刪除！');
      this.modal.close({ deleted: true });
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '刪除失敗');
    } finally {
      this.loading = false;
    }
  }
}
```

---

## Form Handling

### Using FormUtils

#### 1. Validate Form

```typescript
import { validateForm } from '@shared';

async submit(): Promise<void> {
  // Validates and marks all controls as touched
  if (!validateForm(this.form)) {
    return;  // Validation errors will be displayed
  }
  // Proceed with submission
}
```

#### 2. Extract Trimmed Values

```typescript
import { getTrimmedFormValue } from '@shared';

// Automatically trims all string values and converts empty strings to undefined
const request = getTrimmedFormValue<CreateRequest>(this.form);

// Before:
// { name: 'Test  ', email: '', description: ' desc ' }
// After:
// { name: 'Test', email: undefined, description: 'desc' }
```

#### 3. Mark Form Touched

```typescript
import { markFormGroupTouched } from '@shared';

// Manually mark all controls as touched (for custom validation scenarios)
markFormGroupTouched(this.form);
```

#### 4. Build Form Config

```typescript
import { buildFormConfig } from '@shared';

const form = this.fb.group(buildFormConfig<CreateRequest>({
  name: '',
  email: '',
  description: ''
}, {
  name: [Validators.required, Validators.minLength(2)],
  email: [Validators.email]
}));
```

#### 5. Check Control Errors

```typescript
import { hasError } from '@shared';

// In template
<span *ngIf="hasError(form.controls['name'], 'required')">
  Name is required
</span>

<span *ngIf="hasError(form.controls['email'], 'email')">
  Invalid email format
</span>
```

---

## Error Handling

### Facade-Level Error Handling

Facades extending `BaseAccountCrudFacade` automatically handle errors:

```typescript
// In facade (you don't write this - base class does)
async create(request: TCreateRequest): Promise<TModel> {
  try {
    const entity = await this.executeCreate(request);
    await this.reloadWorkspaceData();
    return entity;
  } catch (error) {
    // Transforms technical error to user-friendly message
    const errorMessage = this.errorHandler.getErrorMessage(
      error,
      'create',
      this.entityTypeName  // e.g., '服務帳戶'
    );
    this.errorHandler.logError(this.facadeName, `create ${this.entityTypeName}`, error);
    throw new Error(errorMessage);
  }
}
```

### Component-Level Error Handling

```typescript
// In component - just catch and display
try {
  await this.facade.createServiceAccount(request);
  this.msg.success('創建成功！');
} catch (error) {
  // Error message is already user-friendly
  this.msg.error(error instanceof Error ? error.message : '操作失敗');
}
```

### Custom Error Messages

If you need custom error handling beyond what BaseAccountCrudFacade provides:

```typescript
// In facade
async customOperation(id: string): Promise<void> {
  try {
    // Custom logic
    const result = await this.serviceAccountService.someOperation(id);
    await this.reloadWorkspaceData();
  } catch (error) {
    const errorMessage = this.errorHandler.getErrorMessage(error, 'custom', this.entityTypeName);
    this.errorHandler.logError(this.facadeName, 'custom operation', error);
    throw new Error(errorMessage);
  }
}
```

---

## State Management

### Using Signals

```typescript
// In service
export class ServiceAccountService {
  private serviceAccountsState = signal<ServiceAccountModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Expose readonly signals
  readonly serviceAccounts = this.serviceAccountsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  async loadServiceAccounts(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    try {
      const accounts = await firstValueFrom(this.serviceAccountRepo.findAll());
      this.serviceAccountsState.set(accounts);
    } catch (error) {
      this.errorState.set('Failed to load service accounts');
    } finally {
      this.loadingState.set(false);
    }
  }
}

// In component
export class ServiceAccountListComponent {
  private readonly facade = inject(ServiceAccountFacade);
  
  // Access signals directly (reactive)
  readonly serviceAccounts = this.facade.serviceAccounts;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  
  // Template automatically updates when signals change
}

// In template
<nz-spin [nzSpinning]="loading()">
  <div *ngFor="let account of serviceAccounts()">
    {{ account.name }}
  </div>
</nz-spin>

<nz-alert *ngIf="error()" [nzMessage]="error()" nzType="error"></nz-alert>
```

### Computed Signals

```typescript
// Derive state from existing signals
readonly activeAccounts = computed(() => {
  return this.serviceAccounts().filter(a => a.status === 'active');
});

readonly accountCount = computed(() => {
  return this.serviceAccounts().length;
});
```

---

## Common Patterns

### Pattern 1: Modal Create Form

```typescript
export class CreateModalComponent {
  private readonly facade = inject(ServiceAccountFacade);
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(NzMessageService);
  private readonly modal = inject(NzModalRef);

  loading = false;
  form = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  async submit(): Promise<void> {
    if (!validateForm(this.form)) return;

    this.loading = true;
    try {
      const request = getTrimmedFormValue<CreateRequest>(this.form);
      const result = await this.facade.create(request as CreateRequest);
      this.msg.success('創建成功！');
      this.modal.close(result);  // Return result to opener
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '創建失敗');
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.modal.destroy();
  }
}
```

### Pattern 2: List with Create Button

```typescript
export class ListComponent {
  private readonly facade = inject(ServiceAccountFacade);
  private readonly modal = inject(NzModalService);
  
  readonly accounts = this.facade.serviceAccounts;
  readonly loading = this.facade.loading;

  async ngOnInit() {
    await this.facade.loadServiceAccounts();
  }

  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: '創建服務帳戶',
      nzContent: CreateModalComponent,
      nzFooter: null
    });

    // Reload list after creation
    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.facade.loadServiceAccounts();  // Refresh list
      }
    });
  }
}
```

### Pattern 3: Inline Edit

```typescript
export class InlineEditComponent {
  private readonly facade = inject(ServiceAccountFacade);
  
  editingId: string | null = null;
  editForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  startEdit(account: ServiceAccountModel): void {
    this.editingId = account.id;
    this.editForm.patchValue({
      name: account.name,
      description: account.description
    });
  }

  async saveEdit(id: string): Promise<void> {
    if (!validateForm(this.editForm)) return;

    try {
      const request = getTrimmedFormValue<UpdateRequest>(this.editForm);
      await this.facade.update(id, request as UpdateRequest);
      this.msg.success('更新成功！');
      this.editingId = null;
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '更新失敗');
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editForm.reset();
  }
}
```

### Pattern 4: Confirm Delete

```typescript
export class ListComponent {
  private readonly facade = inject(ServiceAccountFacade);
  private readonly modal = inject(NzModalService);

  confirmDelete(account: ServiceAccountModel): void {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除服務帳戶「${account.name}」嗎？`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzOnOk: () => this.delete(account.id)
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.facade.delete(id);
      this.msg.success('刪除成功！');
      await this.facade.loadServiceAccounts();  // Refresh list
    } catch (error) {
      this.msg.error(error instanceof Error ? error.message : '刪除失敗');
    }
  }
}
```

---

## Best Practices

### DO ✅

1. **Use dedicated repositories** (UserRepository, BotRepository, etc.)
2. **Extend BaseAccountCrudFacade** for account-type facades
3. **Use FormUtils** for form validation and value extraction
4. **Use Signals** for reactive state management
5. **Let facades handle errors** - just catch and display
6. **Reload workspace data** through facades (automatic with BaseAccountCrudFacade)
7. **Use type-specific methods** from repositories (findByAuthUserId, etc.)

### DON'T ❌

1. **Don't use AccountRepository** in new code (deprecated)
2. **Don't check types at runtime** (if (account.type === 'User'))
3. **Don't manually trim form values** (use getTrimmedFormValue)
4. **Don't manually mark controls touched** (use validateForm)
5. **Don't forget to handle loading state** in UI
6. **Don't catch errors without displaying** them to users
7. **Don't reload workspace data manually** (facades do this)

---

## Checklist for New Features

When implementing new account-related features:

- [ ] Created dedicated Repository extending BaseRepository
- [ ] Repository enforces type filter in findAll override
- [ ] Created Service with Signals-based state management
- [ ] Service injects specific Repository (not AccountRepository)
- [ ] Created Facade extending BaseAccountCrudFacade
- [ ] Facade implements executeCreate/Update/Delete methods
- [ ] Facade exposes public API methods with proper names
- [ ] Component uses FormUtils (validateForm, getTrimmedFormValue)
- [ ] Component handles loading state in UI
- [ ] Component displays user-friendly error messages
- [ ] Updated all index.ts exports
- [ ] Added JSDoc comments to public methods
- [ ] Tested create/update/delete flows
- [ ] Verified workspace data reloads after mutations

---

## Troubleshooting

### Problem: TypeScript errors with AccountRepository

**Solution**: Don't use AccountRepository. Use UserRepository, BotRepository, or OrganizationRepository instead.

```typescript
// ❌ Wrong
private readonly accountRepo = inject(AccountRepository);

// ✅ Correct
private readonly userRepo = inject(UserRepository);
```

### Problem: Workspace data not updating after create/update

**Solution**: Ensure your facade extends BaseAccountCrudFacade, which automatically handles workspace reload.

```typescript
// ✅ Correct
export class MyFacade extends BaseAccountCrudFacade<...> {
  // Base class handles workspace reload
}
```

### Problem: Form validation not showing errors

**Solution**: Use `validateForm(this.form)` instead of checking `this.form.invalid`.

```typescript
// ❌ Wrong
if (this.form.invalid) {
  return;  // Errors not displayed
}

// ✅ Correct
if (!validateForm(this.form)) {
  return;  // Errors displayed
}
```

### Problem: Runtime type checking errors

**Solution**: Use dedicated repositories that enforce types at compile-time.

```typescript
// ❌ Wrong
const account = await this.accountRepo.findById(id);
if (account.type === 'User') {
  return account as UserAccountModel;
}

// ✅ Correct
const user = await this.userRepo.findById(id);
return user;  // Already UserAccountModel
```

---

## References

- [Architecture Documentation](./account-refactoring.md)
- [FormUtils API](../../src/app/shared/utils/form.utils.ts)
- [BaseAccountCrudFacade](../../src/app/core/facades/account/base-account-crud.facade.ts)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [ng-zorro-antd Components](https://ng.ant.design/)

---

**Last Updated**: 2025-11-24
**Version**: 1.0
**For Questions**: Contact @7Spade or open an issue
