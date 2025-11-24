/**
 * Task Status Pipe
 *
 * Transforms task status enum to display text
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module task-status.pipe
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '@core/infra/types';

@Pipe({
  name: 'taskStatus',
  standalone: true
})
export class TaskStatusPipe implements PipeTransform {
  private readonly statusTextMap: Record<TaskStatus, string> = {
    pending: '待處理',
    in_progress: '進行中',
    completed: '已完成',
    cancelled: '已取消'
  };

  transform(status: TaskStatus): string {
    return this.statusTextMap[status] || status;
  }
}
