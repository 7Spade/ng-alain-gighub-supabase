# Account Routes

帳號管理路由頁面模組 | Account Management Routes Module

## 📋 概述 | Overview

此模組包含帳號管理相關的路由頁面組件，提供用戶、組織、團隊等帳號實體的管理介面。

This module contains route page components for account management, providing management interfaces for users, organizations, teams, and other account entities.

## 📂 目錄結構 | Directory Structure

```
account/
├── routes.ts                  # 主路由配置
├── user/                      # 用戶路由
│   ├── routes.ts
│   ├── dashboard/
│   ├── settings/
│   └── todos/
├── team/                      # 團隊路由
│   ├── routes.ts
│   ├── dashboard/
│   ├── members/
│   └── todos/
├── org/                       # 組織路由
│   ├── routes.ts
│   ├── dashboard/
│   ├── members/
│   ├── settings/
│   └── teams/
├── add-organization-member/   # 添加組織成員（模態框）
├── add-team-member/           # 添加團隊成員（模態框）
├── create-organization/       # 創建組織（模態框）
├── create-team/               # 創建團隊（模態框）
├── delete-organization/       # 刪除組織（模態框）
├── delete-team/               # 刪除團隊（模態框）
├── update-organization/       # 更新組織（模態框）
└── update-team/               # 更新團隊（模態框）
```

## 🛣️ 路由配置 | Route Configuration

### 用戶路由 | User Routes
- `/account/user/:userId/dashboard` - 個人儀表板
- `/account/user/:userId/todos` - 我的待辦
- `/account/user/:userId/settings` - 個人設定

### 團隊路由 | Team Routes
- `/account/team/:teamId/dashboard` - 團隊儀表板
- `/account/team/:teamId/todos` - 團隊待辦
- `/account/team/:teamId/members` - 團隊成員

### 組織路由 | Organization Routes
- `/account/org/:organizationId/dashboard` - 組織儀表板
- `/account/org/:organizationId/teams` - 團隊管理
- `/account/org/:organizationId/members` - 成員管理
- `/account/org/:organizationId/settings` - 組織設定

## 🎯 職責 | Responsibilities

- 提供帳號管理的使用者介面
- 處理使用者輸入和表單驗證
- 調用 Service 層進行業務操作
- 管理頁面狀態和導航

## 📦 主要頁面組件 | Main Page Components

### `CreateOrganizationComponent`
創建組織頁面組件。

**功能：**
- 提供創建組織的表單
- 驗證組織名稱、電子郵件等欄位
- 調用 `OrganizationService.createOrganization()` 創建組織
- 處理創建成功/失敗的狀態

**路由**: `/account/create-organization`

### `UpdateOrganizationComponent`
更新組織頁面組件。

**功能：**
- 提供編輯組織資訊的表單
- 載入現有組織資料
- 調用 `OrganizationService.updateOrganization()` 更新組織
- 處理更新成功/失敗的狀態

**路由**: `/account/update-organization/:id`

### `DeleteOrganizationComponent`
刪除組織頁面組件。

**功能：**
- 提供刪除組織的確認介面
- 調用 `OrganizationService.softDeleteOrganization()` 軟刪除組織
- 處理刪除成功/失敗的狀態

**路由**: `/account/delete-organization/:id`

### `CreateTeamComponent`
創建團隊頁面組件。

**功能：**
- 提供創建團隊的表單
- 選擇所屬組織
- 調用 `TeamService.createTeam()` 創建團隊

**路由**: `/account/create-team`

### `UpdateTeamComponent`
更新團隊頁面組件。

**功能：**
- 提供編輯團隊資訊的表單
- 載入現有團隊資料
- 調用 `TeamService.updateTeam()` 更新團隊

**路由**: `/account/update-team/:id`

### `DeleteTeamComponent`
刪除團隊頁面組件。

**功能：**
- 提供刪除團隊的確認介面
- 調用 `TeamService.softDeleteTeam()` 軟刪除團隊

**路由**: `/account/delete-team/:id`

## 🔗 依賴關係 | Dependencies

- **Services 層**: `@shared/services/account`
- **Models 層**: `@shared/models/account`
- **UI 組件**: `@delon/abc`, `ng-zorro-antd`
- **路由**: Angular Router

## 📝 使用範例 | Usage Example

### 路由配置

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('./routes/account/routes').then(m => m.routes)
  }
];
```

### 組件使用

```typescript
import { Component, inject } from '@angular/core';
import { OrganizationService } from '@shared/services/account';
import { CreateOrganizationRequest } from '@shared/models/account';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html'
})
export class CreateOrganizationComponent {
  private orgService = inject(OrganizationService);
  
  async onSubmit(request: CreateOrganizationRequest) {
    try {
      const org = await this.orgService.createOrganization(request);
      // 導航到組織詳情頁
      this.router.navigate(['/account/organization', org.id]);
    } catch (error) {
      // 處理錯誤
    }
  }
}
```

## 🏗️ 架構層級 | Architecture Layer

此模組位於 **Routes 層**，屬於展示層（Presentation Layer），負責：
- 提供使用者介面
- 處理使用者互動
- 調用 Service 層進行業務操作
- 管理頁面狀態和導航

## 🎨 UI 組件使用 | UI Components Usage

此模組使用以下 UI 組件庫：

- **ng-zorro-antd**: 基礎 UI 組件（按鈕、表單、表格等）
- **@delon/abc**: ng-alain 業務組件（表單、表格、頁面容器等）

## 📚 相關文檔 | Related Documentation

- [帳號服務文檔](../../shared/services/account/README.md)
- [帳號模型文檔](../../shared/models/account/README.md)
- [ng-alain 官方文檔](https://ng-alain.com)
- [ng-zorro 官方文檔](https://ng.ant.design)

## 🔄 更新日誌 | Changelog

**v1.1.0** (2025-11-25)
- 將 user、team、org 路由遷移至 account 模組下
- 統一路由結構：`/account/user`、`/account/team`、`/account/org`

**v1.0.0** (2025-01-XX)
- 初始版本
- 實現組織和團隊的 CRUD 頁面組件

---

**最後更新 | Last Updated**: 2025-01-XX  
**維護者 | Maintained by**: Development Team

