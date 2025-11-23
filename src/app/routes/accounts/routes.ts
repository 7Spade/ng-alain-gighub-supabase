import { Routes } from '@angular/router';

import { CreateOrganizationComponent } from './create/create-organization.component';

/**
 * 帳戶管理路由配置
 *
 * 路由結構：
 * /accounts - 重定向到 /accounts/org（組織管理）
 * /accounts/create/organization - 創建組織
 * /accounts/org - 組織管理（懶加載）
 *
 * 注意：
 * - 用戶帳戶通過註冊流程的觸發器自動創建，不需要手動創建組件
 */
export const routes: Routes = [
  { path: '', redirectTo: 'org', pathMatch: 'full' },
  
  // 創建路由：按帳戶類型分離
  { path: 'create/organization', component: CreateOrganizationComponent },
  
  // 組織管理路由
  {
    path: 'org',
    loadChildren: () => import('./org/routes').then(m => m.routes)
  }
  
  // TODO: 添加更多路由
  // { path: ':id', component: AccountDetailComponent },
  // { path: ':id/edit', component: AccountFormComponent }
];
