# Testing Documentation

## Overview

This document provides comprehensive testing guidelines for the refactored architecture, covering Repository, Service, Facade, and Routes layers.

## Test Structure

```
tests/
├── unit/                          # Unit tests (*.spec.ts files)
│   ├── repositories/              # Repository layer tests
│   ├── services/                  # Service layer tests
│   └── facades/                   # Facade layer tests
├── integration/                   # Integration tests
│   └── account-flow.spec.ts      # Full account management flows
└── e2e/                          # End-to-end tests
    └── account-routes.spec.ts    # Complete user journeys
```

## Unit Testing Guidelines

### Repository Layer Testing

**File**: `src/app/core/infra/repositories/account/*.repository.spec.ts`

**What to Test**:
1. Type enforcement (ensure type filter is always applied)
2. Query method correctness
3. Error handling
4. Null/undefined returns

**Example**:
```typescript
describe('UserRepository', () => {
  it('should enforce type=User filter automatically', (done) => {
    repository.findAll().subscribe({
      next: (users) => {
        expect(eqSpy).toHaveBeenCalledWith('type', AccountType.USER);
        done();
      }
    });
  });
});
```

**Coverage Target**: 80%+

### Service Layer Testing

**File**: `src/app/shared/services/account/*.service.spec.ts`

**What to Test**:
1. Business logic correctness
2. Repository dependency injection
3. Signal state management
4. Error propagation
5. Async operations

**Example**:
```typescript
describe('BotService', () => {
  it('should load bots and update signal', async () => {
    botRepositorySpy.findAll.and.returnValue(of([mockBot]));
    await service.getAllBots();
    expect(service.bots()).toEqual([mockBot]);
  });
});
```

**Coverage Target**: 85%+

### Facade Layer Testing

**File**: `src/app/core/facades/account/*.facade.spec.ts`

**What to Test**:
1. Coordination logic (service call → workspace reload → error handling)
2. BaseAccountCrudFacade inheritance
3. Token service integration
4. Error message translation
5. Workspace data reloading

**Example**:
```typescript
describe('BotFacade', () => {
  it('should create bot, reload workspace, and return bot', async () => {
    const result = await facade.createBot(createRequest);
    expect(dataServiceSpy.loadWorkspaceData).toHaveBeenCalledWith('user-1');
  });
});
```

**Coverage Target**: 75%+

## Integration Testing

### TEST-001: Repository Layer Integration Tests

**Purpose**: Test repositories with real Supabase connection

**Setup**:
```typescript
describe('UserRepository Integration', () => {
  let supabaseClient: SupabaseClient;
  
  beforeAll(async () => {
    supabaseClient = createClient(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_ANON_KEY']!
    );
  });
  
  it('should create and retrieve user with type enforcement', async () => {
    const user = await userRepository.create({ /* ... */ });
    expect(user.type).toBe('User');
    
    const retrieved = await userRepository.findById(user.id);
    expect(retrieved).toEqual(user);
  });
});
```

**Test Cases**:
1. ✅ CRUD operations work correctly
2. ✅ Type filters are enforced at database level
3. ✅ Soft delete works (deleted_at is set)
4. ✅ RLS policies allow/deny access correctly
5. ✅ No infinite recursion errors

**Running**: `npm run test:integration:repositories`

### TEST-002: Service Layer Integration Tests

**Purpose**: Test services with mocked repositories

**Test Cases**:
1. ✅ Services correctly inject repositories
2. ✅ Business logic executes correctly
3. ✅ Signals update in response to operations
4. ✅ Error handling is consistent
5. ✅ Async operations complete successfully

**Running**: `npm run test:integration:services`

### TEST-003: Facade Layer Integration Tests

**Purpose**: Test facades with real services and mocked Supabase

**Test Cases**:
1. ✅ Facades call correct service methods
2. ✅ Workspace data reloads after operations
3. ✅ Errors are translated to user-friendly messages
4. ✅ BaseAccountCrudFacade logic works across all facades
5. ✅ Token service provides correct user ID

**Running**: `npm run test:integration:facades`

### TEST-004: Complete Flow E2E Tests

**Purpose**: Test complete user journeys from UI to database

**Scenarios**:

#### Scenario 1: Create Organization Flow
```
User → Click "Create" → Fill Form → Submit
  ↓
CreateOrganizationComponent (FormUtils)
  ↓
OrganizationFacade.createOrganization()
  ↓
OrganizationService.createOrganization()
  ↓
OrganizationRepository.create()
  ↓
Supabase (with RLS)
  ↓
WorkspaceDataService.loadWorkspaceData()
  ↓
UI Updates with new organization
```

**Assertions**:
- ✅ Form validation works (validateForm)
- ✅ Input trimming works (getTrimmedFormValue)
- ✅ Organization created in database
- ✅ User auto-added as owner (RLS trigger)
- ✅ Workspace data reloaded
- ✅ Success message displayed
- ✅ Organization appears in list

#### Scenario 2: Update Organization Flow
Similar to creation, but tests update path

#### Scenario 3: Delete Organization Flow
Tests soft delete and workspace reload

#### Scenario 4: RLS Policy Verification
- ✅ User sees only their organizations
- ✅ No infinite recursion errors
- ✅ Proper access control enforced

**Running**: `npm run test:e2e`

## Performance Testing (TEST-005)

### Repository Performance

**Test**: Query performance with type filters

```typescript
describe('Repository Performance', () => {
  it('should execute findAll within 500ms', async () => {
    const start = Date.now();
    await userRepository.findAll();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });
});
```

**Targets**:
- findAll: < 500ms for 1000 records
- findById: < 100ms
- create: < 200ms
- update: < 200ms

### Service Performance

**Test**: Business logic execution time

**Targets**:
- getAllUsers: < 600ms (includes repository + signal update)
- createUser: < 300ms

### Facade Performance

**Test**: Complete operation time including workspace reload

**Targets**:
- createOrganization: < 1000ms (create + reload workspace)
- updateOrganization: < 800ms

### E2E Performance

**Test**: Complete user journey time

**Targets**:
- Create organization flow: < 2 seconds
- Update organization flow: < 1.5 seconds
- Delete organization flow: < 1 second

**Running**: `npm run test:performance`

## Test Execution

### Run All Tests
```bash
npm test                    # All unit tests
npm run test:integration   # All integration tests
npm run test:e2e           # All E2E tests
npm run test:performance   # Performance tests
npm run test:all           # Everything
```

### Run Specific Test Suites
```bash
npm test -- user.repository.spec.ts
npm test -- bot.service.spec.ts
npm test -- organization.facade.spec.ts
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:performance
```

## Test Data Management

### Test Database Setup

```sql
-- Create test user
INSERT INTO auth.users (id, email) VALUES
  ('test-user-1', 'test@example.com');

-- Create test account
INSERT INTO public.accounts (id, type, name, email, auth_user_id) VALUES
  ('test-account-1', 'User', 'Test User', 'test@example.com', 'test-user-1');

-- Create test organization
INSERT INTO public.accounts (id, type, name, email, creator_id) VALUES
  ('test-org-1', 'Organization', 'Test Org', 'org@example.com', 'test-account-1');

-- Add user as organization owner
INSERT INTO public.organization_members (organization_id, account_id, role) VALUES
  ('test-org-1', 'test-account-1', 'owner');
```

### Cleanup

```typescript
afterEach(async () => {
  // Clean up test data
  await supabase.from('organization_members').delete().eq('account_id', 'test-account-1');
  await supabase.from('accounts').delete().eq('creator_id', 'test-account-1');
  await supabase.from('accounts').delete().eq('id', 'test-account-1');
});
```

## Troubleshooting

### Test Failures

**Issue**: "infinite recursion detected in policy"
**Solution**: Ensure RLS migrations are deployed

**Issue**: "Cannot read property 'id' of undefined"
**Solution**: Check token service mock provides correct structure

**Issue**: "Timeout of 2000ms exceeded"
**Solution**: Increase timeout or check for unresolved promises

### Performance Issues

**Issue**: Tests are slow
**Solutions**:
1. Use `--max-workers=4` for parallel execution
2. Mock expensive operations
3. Use test-specific Supabase instance

## Best Practices

1. **Arrange-Act-Assert**: Follow AAA pattern
2. **One Assertion per Test**: Keep tests focused
3. **Descriptive Names**: `should create bot and reload workspace`
4. **Mock External Dependencies**: Use spies for Supabase, services
5. **Test Edge Cases**: Null, undefined, errors
6. **Keep Tests Fast**: Unit tests < 100ms, E2E < 5s
7. **Cleanup**: Always clean up test data
8. **Isolation**: Tests should not depend on each other

## Coverage Targets

| Layer | Target | Current |
|-------|--------|---------|
| Repositories | 80% | TBD |
| Services | 85% | TBD |
| Facades | 75% | TBD |
| Components | 70% | TBD |
| **Overall** | **75%** | **TBD** |

## Conclusion

This testing strategy ensures:
- ✅ Type safety is enforced
- ✅ Business logic is correct
- ✅ RLS policies work without recursion
- ✅ User experience is smooth
- ✅ Performance is acceptable
- ✅ Regressions are caught early

Follow these guidelines to maintain high code quality and confidence in the refactored architecture.
