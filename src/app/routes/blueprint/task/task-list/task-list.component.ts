import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { STColumn, STModule } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';

import { Task } from '../../types';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, PageHeaderModule, STModule]
})
export class TaskListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  blueprintId?: string;
  tasks: Task[] = [];

  // 表格欄位定義
  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 80 },
    { title: '標題', index: 'title', width: 200 },
    { title: '描述', index: 'description' },
    {
      title: '狀態',
      index: 'status',
      type: 'badge',
      width: 100,
      badge: {
        todo: { text: '待辦', color: 'default' },
        in_progress: { text: '進行中', color: 'processing' },
        done: { text: '完成', color: 'success' },
        blocked: { text: '阻塞', color: 'error' }
      }
    },
    {
      title: '優先級',
      index: 'priority',
      type: 'badge',
      width: 100,
      badge: {
        low: { text: '低', color: 'default' },
        medium: { text: '中', color: 'processing' },
        high: { text: '高', color: 'warning' },
        critical: { text: '緊急', color: 'error' }
      }
    },
    { title: '負責人', index: 'assigned_to', width: 120 },
    { title: '建立時間', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 120,
      buttons: [
        {
          text: '檢視',
          icon: 'eye',
          click: (record: Task) => this.viewTask(record)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.blueprintId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.blueprintId) {
      this.loadTasks(this.blueprintId);
    }
  }

  /**
   * 載入任務列表
   * TODO: 整合 Supabase 服務
   */
  private loadTasks(blueprintId: string): void {
    // 預留：從 Supabase 載入任務資料
    console.log('Loading tasks for blueprint:', blueprintId);
    this.tasks = [];
  }

  /**
   * 檢視任務詳情
   */
  viewTask(task: Task): void {
    this.router.navigate(['/blueprint', this.blueprintId, 'tasks', task.id]);
  }

  /**
   * 建立新任務
   */
  createTask(): void {
    this.router.navigate(['/blueprint', this.blueprintId, 'tasks', 'new']);
  }

  /**
   * 返回藍圖詳情
   */
  goBack(): void {
    this.router.navigate(['/blueprint', this.blueprintId]);
  }
}
