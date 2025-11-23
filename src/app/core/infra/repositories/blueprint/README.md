# Blueprint Repositories

藍圖管理倉儲層模組 | Blueprint Repository Layer Module

## 📋 概述 | Overview

此模組提供藍圖（Blueprint）管理相關的資料存取層（Repository Layer），封裝對 Supabase 資料庫的操作，提供型別安全的資料存取介面。

This module provides the data access layer (Repository Layer) for blueprint management, encapsulating operations on Supabase database and providing type-safe data access interfaces.

## 🎯 職責 | Responsibilities

- 封裝資料庫 CRUD 操作
- 提供型別安全的查詢介面
- 處理資料庫模型與業務模型的轉換
- 實現 RLS（Row Level Security）策略的查詢
- 管理藍圖分支、合併等 Git-like 操作
- 管理資料庫連線和錯誤處理

## 📦 主要 Repository | Main Repositories

### 待實現 Repository | Repositories to be Implemented

此模組目前處於規劃階段，預計包含以下 Repository：

### `BlueprintRepository`
藍圖基礎 Repository，提供藍圖的 CRUD 操作。

**預計方法：**
- `findById(id: string)` - 根據 ID 查詢藍圖
- `findByOwner(ownerId: string)` - 查詢擁有者的所有藍圖
- `create(data)` - 創建藍圖
- `update(id, data)` - 更新藍圖
- `softDelete(id)` - 軟刪除藍圖
- `restore(id)` - 恢復已刪除的藍圖

### `BlueprintBranchRepository`
藍圖分支 Repository，管理藍圖分支的 CRUD 操作。

**預計方法：**
- `findById(id)` - 根據 ID 查詢分支
- `findByBlueprint(blueprintId)` - 查詢藍圖的所有分支
- `findByOwner(ownerId)` - 查詢擁有者的所有分支
- `create(data)` - 創建分支
- `update(id, data)` - 更新分支
- `merge(sourceBranchId, targetBranchId)` - 合併分支

### `BlueprintTaskRepository`
藍圖任務 Repository，管理任務的 CRUD 操作。

**預計方法：**
- `findById(id)` - 根據 ID 查詢任務
- `findByBranch(branchId)` - 查詢分支的所有任務
- `findByAssignee(accountId)` - 查詢指派給帳號的任務
- `create(data)` - 創建任務
- `update(id, data)` - 更新任務
- `moveTask(taskId, newParentId, newOrder)` - 移動任務（拖放排序）

### `PullRequestRepository`
Pull Request Repository，管理 PR 的 CRUD 操作。

**預計方法：**
- `findById(id)` - 根據 ID 查詢 PR
- `findByBranch(branchId)` - 查詢分支的 PR
- `create(data)` - 創建 PR
- `update(id, data)` - 更新 PR
- `merge(prId)` - 合併 PR

## 🔗 依賴關係 | Dependencies

- **Types 層**: `@core/infra/types/blueprint` - 資料庫模型型別
- **Account Repositories**: `@core/infra/repositories/account` - 帳號相關 Repository
- **Supabase Service**: `@core/infra/supabase` - Supabase 客戶端
- **Database**: Supabase PostgreSQL 資料庫

## 📝 使用範例 | Usage Example

```typescript
import { inject } from '@angular/core';
import { BlueprintRepository, BlueprintBranchRepository } from '@core/infra/repositories/blueprint';
import { firstValueFrom } from 'rxjs';

// 在服務中注入
const blueprintRepo = inject(BlueprintRepository);
const branchRepo = inject(BlueprintBranchRepository);

// 查詢藍圖
const blueprint$ = blueprintRepo.findById('bp-id');
const blueprint = await firstValueFrom(blueprint$);

// 創建分支
const branch$ = branchRepo.create({
  blueprint_id: 'bp-id',
  name: 'feature-branch',
  owner_id: 'org-id',
  parent_branch_id: 'main-branch-id'
});
const branch = await firstValueFrom(branch$);

// 合併分支
await firstValueFrom(branchRepo.merge('source-branch-id', 'target-branch-id'));
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Core Infrastructure Repository 層**，屬於資料存取層，負責：
- 封裝資料庫操作
- 提供型別安全的查詢介面
- 處理資料庫模型與業務模型的轉換
- 實現 Git-like 分支和合併操作
- 實現資料庫查詢優化

## 🔀 Git-like 操作 | Git-like Operations

Repository 層實現類似 Git 的操作：

- **分支創建**: `createBranch()` - 從主分支或父分支創建新分支
- **分支合併**: `mergeBranch()` - 將分支合併到目標分支
- **Pull Request**: `createPR()`, `mergePR()` - PR 的創建和合併
- **任務移動**: `moveTask()` - 在分支內移動任務（拖放排序）

## 🔐 RLS 策略 | RLS Policies

Repository 層的查詢會自動遵循 Supabase RLS（Row Level Security）策略：

- 用戶只能查詢自己有權限的藍圖
- 組織成員只能查詢所屬組織的藍圖
- 分支只能由擁有者或協作者操作
- 軟刪除的資料不會被查詢到（除非明確指定）

## 🔄 資料轉換 | Data Transformation

Repository 層負責將資料庫模型轉換為業務模型：

```
Database Model (Infra Types)
  ↓ Repository 轉換
Business Model (Shared Models)
  ↓ Service 使用
Component/Service Usage
```

## 📚 相關文檔 | Related Documentation

- [藍圖服務文檔](../../../shared/services/blueprint/README.md)
- [藍圖模型文檔](../../../shared/models/blueprint/README.md)
- [藍圖類型定義](../types/blueprint/README.md)
- [藍圖容器規劃文檔](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md)
- [藍圖任務模組設計](../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [Supabase RLS 策略](../../../../docs/supabase/security/rls.md)
- [資料庫架構設計](../../../../docs/supabase/architecture/database.md)

## 🚧 開發狀態 | Development Status

**狀態**: 規劃中 | Planning

此模組目前處於設計和規劃階段，相關 Repository 將根據 [Blueprint Container Planning](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md) 文檔逐步實現。

## 🔄 更新日誌 | Changelog

**v0.1.0** (2025-01-XX)
- 初始規劃版本
- 建立模組結構和文檔

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

