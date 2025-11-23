# Blueprint Services

藍圖管理相關服務模組 | Blueprint Management Services Module

## 📋 概述 | Overview

此模組提供藍圖（Blueprint）管理相關的業務邏輯服務，包括藍圖的創建、版本控制、分支管理等 Git-like 功能。

This module provides business logic services for blueprint management, including blueprint creation, version control, branch management, and other Git-like features.

## 🎯 職責 | Responsibilities

- 提供藍圖相關業務邏輯的封裝
- 管理藍圖狀態（使用 Angular Signals）
- 協調 Repository 層進行資料操作
- 處理藍圖分支、合併等 Git-like 操作
- 管理藍圖模板和實例化

## 📦 主要服務 | Main Services

### 待實現服務 | Services to be Implemented

此模組目前處於規劃階段，預計包含以下服務：

- `BlueprintService` - 藍圖核心管理服務
- `BlueprintBranchService` - 藍圖分支管理服務
- `BlueprintTemplateService` - 藍圖模板服務
- `BlueprintVersionService` - 藍圖版本控制服務
- `BlueprintCollaborationService` - 藍圖協作服務

## 🔗 依賴關係 | Dependencies

- **Repository 層**: `@core/infra/repositories/blueprint`
- **Models 層**: `@shared/models/blueprint`
- **Types 層**: `@core/infra/types/blueprint`
- **Account Services**: `@shared/services/account`
- **Supabase Service**: `@core/infra/supabase`

## 📝 使用範例 | Usage Example

```typescript
import { inject } from '@angular/core';
import { BlueprintService } from '@shared/services/blueprint';

// 在組件或服務中注入
const blueprintService = inject(BlueprintService);

// 創建藍圖
const blueprint = await blueprintService.create({
  name: '專案藍圖',
  ownerId: 'org-id'
});

// 創建分支
const branch = await blueprintService.createBranch(blueprint.id, {
  name: 'feature-branch'
});

// 合併分支
await blueprintService.mergeBranch(branch.id);
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Shared Services 層**，屬於業務邏輯層，負責：
- 封裝藍圖相關業務邏輯
- 管理藍圖狀態（使用 Signals）
- 協調 Repository 層進行資料操作
- 實現 Git-like 分支模型

## 🔀 Git-like 分支模型 | Git-like Branch Model

藍圖系統採用類似 Git 的分支模型：

- **主分支 (Main Branch)**: 由擁有者組織控制，完全控制任務結構
- **組織分支 (Organization Branch)**: 協作組織的分支，只能操作承攬欄位
- **Pull Request**: 分支提交執行數據，由擁有者審核後合併

## 📚 相關文檔 | Related Documentation

- [藍圖模型文檔](../models/blueprint/README.md)
- [藍圖 Repository 文檔](../../core/infra/repositories/blueprint/README.md)
- [藍圖類型定義](../../core/infra/types/blueprint/README.md)
- [藍圖容器規劃文檔](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md)
- [藍圖任務模組設計](../../../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md)
- [系統架構文檔](../../../../docs/architecture/20-complete-architecture-flowchart.mermaid.md)

## 🚧 開發狀態 | Development Status

**狀態**: 規劃中 | Planning

此模組目前處於設計和規劃階段，相關服務將根據 [Blueprint Container Planning](../../../../docs/BLUEPRINT_CONTAINER_PLANNING.md) 文檔逐步實現。

## 🔄 更新日誌 | Changelog

**v0.1.0** (2025-01-XX)
- 初始規劃版本
- 建立模組結構和文檔

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

