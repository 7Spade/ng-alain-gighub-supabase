import { Routes } from '@angular/router';

import { OrgComponent } from './org.component';

/**
 * 組織管理路由配置
 *
 * 路由結構：
 * /accounts/org - 組織列表（我的組織、我加入的組織）
 * /accounts/org/:id/members - 組織成員列表（待實現）
 * /accounts/org/:id/teams - 組織團隊列表（待實現）
 */
export const routes: Routes = [
  {
    path: '',
    component: OrgComponent,
    data: { title: '組織管理', titleI18n: 'menu.org' }
  }
  // TODO: 添加更多組織子路由
  // { path: ':id/members', component: OrgMembersComponent },
  // { path: ':id/teams', component: OrgTeamsComponent },
];
