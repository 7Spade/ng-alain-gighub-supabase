import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NumberInfoModule } from '@delon/chart/number-info';
import { G2MiniAreaModule } from '@delon/chart/mini-area';
import { G2BarModule } from '@delon/chart/bar';
import { G2PieModule } from '@delon/chart/pie';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import type { G2BarData, G2PieData } from '@delon/chart/core';

@Component({
  selector: 'app-org-dashboard',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    NumberInfoModule,
    G2MiniAreaModule,
    G2BarModule,
    G2PieModule,
    G2MiniBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgDashboardComponent implements OnInit {
  // 統計數據
  totalMembers = signal(156);
  totalTeams = signal(12);
  totalBlueprints = signal(48);
  activeProjects = signal(23);

  // 趨勢數據
  memberTrendData = signal<Array<{ x: string; y: number }>>([]);
  activityData = signal<Array<{ x: string; y: number }>>([]);

  // 圖表數據
  blueprintData = signal<G2BarData[]>([]);
  memberRoleData = signal<G2PieData[]>([]);
  teamActivityData = signal<Array<{ x: string; y: number }>>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // 模擬載入數據 - 實際專案中應該從 Service/Facade 獲取
    this.loadMemberTrend();
    this.loadActivityData();
    this.loadBlueprintData();
    this.loadMemberRoleData();
    this.loadTeamActivityData();
  }

  private loadMemberTrend(): void {
    // 最近 7 天成員增長趨勢
    const data = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      data.push({
        x: `${date.getMonth() + 1}/${date.getDate()}`,
        y: Math.floor(140 + Math.random() * 20 + (6 - i) * 2)
      });
    }
    this.memberTrendData.set(data);
  }

  private loadActivityData(): void {
    // 最近 30 天活動趨勢
    const data = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      data.push({
        x: `${i}`,
        y: Math.floor(50 + Math.random() * 50)
      });
    }
    this.activityData.set(data);
  }

  private loadBlueprintData(): void {
    // 藍圖狀態分佈
    this.blueprintData.set([
      { x: '草稿', y: 12 },
      { x: '開發中', y: 18 },
      { x: '測試中', y: 8 },
      { x: '已完成', y: 10 }
    ]);
  }

  private loadMemberRoleData(): void {
    // 成員角色分佈
    this.memberRoleData.set([
      { x: 'Owner', y: 2 },
      { x: 'Admin', y: 8 },
      { x: 'Member', y: 98 },
      { x: 'Guest', y: 48 }
    ]);
  }

  private loadTeamActivityData(): void {
    // 團隊活動度（最近 7 天）
    const data = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      data.push({
        x: `${i}`,
        y: Math.floor(30 + Math.random() * 40)
      });
    }
    this.teamActivityData.set(data);
  }
}
