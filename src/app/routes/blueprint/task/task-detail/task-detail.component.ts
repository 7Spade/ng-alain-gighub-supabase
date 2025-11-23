import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { SHARED_IMPORTS } from '@shared';

import { Task } from '../../types';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, PageHeaderModule]
})
export class TaskDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  blueprintId?: string;
  taskId?: string;
  task?: Task;
  isNew = false;

  ngOnInit(): void {
    this.blueprintId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.taskId = this.route.snapshot.paramMap.get('taskId') ?? undefined;
    this.isNew = this.taskId === 'new';

    if (!this.isNew && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  /**
   * 載入任務詳情
   * TODO: 整合 Supabase 服務
   */
  private loadTask(id: string): void {
    // 預留：從 Supabase 載入任務資料
    console.log('Loading task:', id);
  }

  /**
   * 儲存任務
   * TODO: 整合 Supabase 服務
   */
  save(): void {
    // 預留：儲存任務到 Supabase
    console.log('Saving task:', this.task);
  }

  /**
   * 返回任務列表
   */
  goBack(): void {
    this.router.navigate(['/blueprint', this.blueprintId, 'tasks']);
  }
}
