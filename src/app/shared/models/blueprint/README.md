# Blueprint Models

藍圖管理相關資料模型模組 | Blueprint Management Data Models Module

## 📋 概述 | Overview

此模組定義藍圖（Blueprint）管理相關的業務資料模型（Business Models），包括藍圖、分支、任務等實體的型別定義和介面。

This module defines business data models for blueprint management, including type definitions and interfaces for blueprints, branches, tasks, and other entities.

## 🎯 職責 | Responsibilities

- 定義藍圖相關業務模型的型別
- 提供資料傳輸物件（DTO）的介面定義
- 定義請求/回應的資料結構
- 提供模型驗證和轉換工具

## 📦 主要模型 | Main Models

### 待實現模型 | Models to be Implemented

此模組目前處於規劃階段，預計包含以下模型：

### `BlueprintBusinessModel`
藍圖業務模型，定義藍圖的業務層資料結構。

**預計屬性：**
- `id: string` - 藍圖 ID
- `name: string` - 藍圖名稱
- `ownerId: string` - 擁有者帳號 ID
- `description: string | null` - 藍圖描述
- `status: BlueprintStatus` - 藍圖狀態
- `config: BlueprintConfig` - 藍圖配置
- `createdAt: Date` - 創建時間
- `updatedAt: Date` - 更新時間

### `BlueprintBranchBusinessModel`
藍圖分支業務模型，定義分支的業務層資料結構。

**預計屬性：**
- `id: string` - 分支 ID
- `blueprintId: string` - 所屬藍圖 ID
- `name: string` - 分支名稱
- `parentBranchId: string | null` - 父分支 ID
- `ownerId: string` - 分支擁有者 ID
- `status: BranchStatus` - 分支狀態

### `BlueprintTaskBusinessModel`
藍圖任務業務模型，定義任務的業務層資料結構。

### `PullRequestBusinessModel`
Pull Request 業務模型，定義 PR 的業務層資料結構。

## 📝 請求/回應模型 | Request/Response Models

### `CreateBlueprintRequest`
創建藍圖請求模型。

```typescript
interface CreateBlueprintRequest {
  name: string;
  description?: string;
  ownerId: string;
  config?: BlueprintConfig;
}
```

### `CreateBranchRequest`
創建分支請求模型。

```typescript
interface CreateBranchRequest {
  name: string;
  parentBranchId?: string;
  ownerId: string;
}
```

## 🔗 依賴關係 | Dependencies

- **Types 層**: `@core/infra/types/blueprint` - 基礎型別定義
- **Account Models**: `@shared/models/account` - 帳號相關模型
- **Enums**: `BlueprintStatus`, `BranchStatus`, `TaskStatus` 等

## 📝 使用範例 | Usage Example

```typescript
import { 
  BlueprintBusinessModel, 
  CreateBlueprintRequest 
} from '@shared/models/blueprint';

// 創建藍圖請求
const request: CreateBlueprintRequest = {
  name: '專案藍圖',
  description: '這是一個專案管理藍圖',
  ownerId: 'org-123',
  config: {
    workingDays: [1, 2, 3, 4, 5],
    notificationRules: []
  }
};

// 使用業務模型
const blueprint: BlueprintBusinessModel = {
  id: 'bp-123',
  name: '專案藍圖',
  ownerId: 'org-123',
  description: '這是一個專案管理藍圖',
  status: BlueprintStatus.ACTIVE,
  config: { /* ... */ },
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Shared Models 層**，屬於業務模型層，負責：
- 定義業務層的資料結構
- 提供型別安全的資料模型
- 與 Repository 層的資料模型分離（業務模型 vs 資料庫模型）

## 🔀 Git-like 模型關係 | Git-like Model Relationships

藍圖系統採用類似 Git 的模型關係：

```
Blueprint (Repository)
  ├── Main Branch (主分支)
  ├── Organization Branch A (組織分支 A)
  │   └── Tasks (任務)
  └── Organization Branch B (組織分支 B)
      └── Tasks (任務)
```

## 📚 相關文檔 | Related Documentation

- [藍圖服務文檔](../services/blueprint/README.md)
- [藍圖 Repository 文檔](../../core/infra/repositories/blueprint/README.md)
- [藍圖類型定義](../../core/infra/types/blueprint/README.md)
- [藍圖容器規劃文檔](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md)
- [藍圖任務模組設計](../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [資料模型對照表](../../../../docs/reference/data-model-mapping.md)

## 🚧 開發狀態 | Development Status

**狀態**: 規劃中 | Planning

此模組目前處於設計和規劃階段，相關模型將根據 [Blueprint Container Planning](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md) 文檔逐步實現。

## 🔄 更新日誌 | Changelog

**v0.1.0** (2025-01-XX)
- 初始規劃版本
- 建立模組結構和文檔

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

