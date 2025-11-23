import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { STColumn, STComponent, STModule } from '@delon/abc/st';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * 組織管理組件
 * 
 * 顯示用戶所屬的所有組織（我的組織 + 我加入的組織）
 * 提供創建新組織的入口
 */
@Component({
  selector: 'app-org',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderModule,
    STModule,
    NzCardModule,
    NzButtonModule,
    NzDividerModule,
    NzTabsModule,
    NzIconModule
  ],
  template: `
    <page-header [title]="'組織管理'">
      <ng-template #action>
        <button nz-button nzType="primary" routerLink="/accounts/create/organization">
          <i nz-icon nzType="plus"></i>
          創建組織
        </button>
      </ng-template>
    </page-header>

    <nz-card>
      <nz-tabset>
        <nz-tab nzTitle="我的組織">
          <st #st [data]="myOrgs" [columns]="columns" [page]="{ show: false }"></st>
        </nz-tab>
        <nz-tab nzTitle="我加入的組織">
          <st #st [data]="joinedOrgs" [columns]="columns" [page]="{ show: false }"></st>
        </nz-tab>
      </nz-tabset>
    </nz-card>
  `
})
export class OrgComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  myOrgs: any[] = [];
  joinedOrgs: any[] = [];

  columns: STColumn[] = [
    { title: '組織名稱', index: 'name' },
    { title: '描述', index: 'description' },
    { title: '成員數', index: 'member_count', type: 'number' },
    { title: '創建時間', index: 'created_at', type: 'date' },
    {
      title: '操作',
      buttons: [
        {
          text: '查看',
          icon: 'eye',
          click: (record: any) => this.viewOrg(record)
        },
        {
          text: '成員',
          icon: 'team',
          click: (record: any) => this.router.navigate(['/accounts/org', record.id, 'members'])
        },
        {
          text: '設置',
          icon: 'setting',
          click: (record: any) => this.router.navigate(['/accounts', record.id, 'edit'])
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    // TODO: 從 Supabase 載入組織資料
    // 暫時使用空數據
    this.myOrgs = [];
    this.joinedOrgs = [];
    
    this.message.info('組織管理功能開發中，請稍候...');
  }

  viewOrg(record: any): void {
    this.router.navigate(['/accounts', record.id]);
  }
}
