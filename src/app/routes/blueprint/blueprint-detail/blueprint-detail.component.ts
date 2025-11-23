import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { SHARED_IMPORTS } from '@shared';

import { Blueprint } from '../types';

@Component({
  selector: 'app-blueprint-detail',
  templateUrl: './blueprint-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, PageHeaderModule]
})
export class BlueprintDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  blueprintId?: string;
  blueprint?: Blueprint;
  isNew = false;

  ngOnInit(): void {
    this.blueprintId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isNew = this.blueprintId === 'new';

    if (!this.isNew && this.blueprintId) {
      this.loadBlueprint(this.blueprintId);
    }
  }

  /**
   * 載入藍圖詳情
   * TODO: 整合 Supabase 服務
   */
  private loadBlueprint(id: string): void {
    // 預留：從 Supabase 載入藍圖資料
    console.log('Loading blueprint:', id);
  }

  /**
   * 儲存藍圖
   * TODO: 整合 Supabase 服務
   */
  save(): void {
    // 預留：儲存藍圖到 Supabase
    console.log('Saving blueprint:', this.blueprint);
  }

  /**
   * 返回列表
   */
  goBack(): void {
    this.router.navigate(['/blueprint']);
  }

  /**
   * 檢視任務列表
   */
  viewTasks(): void {
    if (this.blueprintId && !this.isNew) {
      this.router.navigate(['/blueprint', this.blueprintId, 'tasks']);
    }
  }
}
