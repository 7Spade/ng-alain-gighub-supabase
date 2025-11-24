/**
 * Delete Task Component
 *
 * Minimal CRUD component for deleting tasks
 * Following Angular 20+ and enterprise development guidelines
 * Uses NzModalService for confirmation dialog
 *
 * @module delete-task.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFacade } from '@core';
import { SHARED_IMPORTS, TaskModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.less'
})
export class DeleteTaskComponent implements OnInit {
  private readonly taskFacade = inject(TaskFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  readonly loading = signal(false);
  readonly task = signal<TaskModel | null>(null);
  readonly taskId = signal<string>('');

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('無效的任務 ID');
      this.router.navigate(['/blueprint/task']);
      return;
    }

    this.taskId.set(id);
    await this.loadTask(id);
  }

  /**
   * Load task data
   */
  private async loadTask(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const task = await this.taskFacade.getTask(id);
      this.task.set(task);
    } catch (error) {
      console.error('Failed to load task:', error);
      this.message.error('載入任務失敗');
      this.router.navigate(['/blueprint/task']);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Show delete confirmation dialog
   */
  showDeleteConfirm(): void {
    const t = this.task();
    if (!t) return;

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除任務「${t.name}」嗎？此操作無法復原。`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => this.deleteTask()
    });
  }

  /**
   * Delete task
   */
  async deleteTask(): Promise<void> {
    this.loading.set(true);
    try {
      await this.taskFacade.deleteTask(this.taskId());
      this.message.success('任務刪除成功');
      this.router.navigate(['/blueprint/task']);
    } catch (error) {
      console.error('Failed to delete task:', error);
      this.message.error('任務刪除失敗');
      this.loading.set(false);
    }
  }

  /**
   * Cancel deletion
   */
  onCancel(): void {
    this.router.navigate(['/blueprint/task']);
  }

  /**
   * Get task level display
   */
  getTaskLevel(task: TaskModel): string {
    return `L${task.depth}`;
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      pending: '待處理',
      in_progress: '進行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return textMap[status] || status;
  }

  /**
   * Get priority display text
   */
  getPriorityText(priority: string): string {
    const textMap: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '緊急'
    };
    return textMap[priority] || priority;
  }
}
