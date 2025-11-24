/**
 * Task List Component
 *
 * Task module with dual display modes: tree-view and table
 * Supporting unlimited depth hierarchy (L0, L1, L2, L3+)
 * Following docs/00-順序.md Component layer standards
 *
 * Features:
 * - Tree view using NzTreeViewModule
 * - Table view with ng-zorro table
 * - View mode toggle switch
 * - Display: status, level, name, progress, assignees, area, tags
 * - Progress calculated from leaf nodes
 *
 * @module task-list.component
 */

import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { TaskFacade } from '@core';
import { ModalHelper } from '@delon/theme';
import { SHARED_IMPORTS, TaskModel, TaskViewMode } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

import { TaskCreateModalComponent } from './task-create-modal.component';
import { TaskEditModalComponent } from './task-edit-modal.component';

/**
 * Task List Component
 *
 * Displays tasks in tree or table view
 * Skeleton implementation for future expansion
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SHARED_IMPORTS, NzTreeViewModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.less'
})
export class TaskListComponent implements OnInit {
  private readonly taskFacade = inject(TaskFacade);
  private readonly modal = inject(ModalHelper);
  private readonly message = inject(NzMessageService);
  private readonly modalService = inject(NzModalService);

  // Component inputs
  readonly workspaceId = input.required<string>();

  // Facade state
  readonly tasks = this.taskFacade.tasks;
  readonly loading = this.taskFacade.loading;
  readonly error = this.taskFacade.error;
  readonly statistics = this.taskFacade.statistics;
  readonly rootTasks = this.taskFacade.rootTasks;

  // Local state
  readonly viewMode = signal<TaskViewMode>('tree');
  readonly searchTerm = signal<string>('');

  // Computed
  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const term = this.searchTerm().toLowerCase();

    if (!term) return tasks;

    return tasks.filter(
      task =>
        task.name.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term) ||
        task.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    // Load tasks for the workspace
    const wsId = this.workspaceId();
    if (wsId) {
      this.taskFacade.loadWorkspaceTasks(wsId);
    }
  }

  /**
   * Toggle view mode between tree and table
   */
  toggleViewMode(): void {
    this.viewMode.update(mode => (mode === 'tree' ? 'table' : 'tree'));
  }

  /**
   * Get task level display (L0, L1, L2, L3+)
   */
  getTaskLevel(task: TaskModel): string {
    return `L${task.depth}`;
  }

  /**
   * Get children tasks for a parent
   */
  getChildren(parentId: string): TaskModel[] {
    return this.tasks().filter(task => task.parentId === parentId);
  }

  /**
   * Handle task selection
   */
  onTaskSelect(task: TaskModel): void {
    console.log('Task selected:', task);
    // Placeholder for future implementation
  }

  /**
   * Handle task creation
   */
  onCreateTask(): void {
    const wsId = this.workspaceId();
    if (!wsId) {
      this.message.error('無效的工作區 ID');
      return;
    }

    this.modal.createStatic(TaskCreateModalComponent, { workspaceId: wsId, parentId: null }, { size: 'md' }).subscribe(result => {
      if (result) {
        this.message.success('任務建立成功');
        // Reload tasks to show the new task
        this.taskFacade.loadWorkspaceTasks(wsId);
      }
    });
  }

  /**
   * Handle task edit
   */
  onEditTask(task: TaskModel): void {
    this.modal.createStatic(TaskEditModalComponent, { task }, { size: 'md' }).subscribe(result => {
      if (result) {
        this.message.success('任務更新成功');
        // Reload tasks to show the updated task
        const wsId = this.workspaceId();
        if (wsId) {
          this.taskFacade.loadWorkspaceTasks(wsId);
        }
      }
    });
  }

  /**
   * Handle task delete
   */
  onDeleteTask(task: TaskModel): void {
    this.modalService.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除任務「${task.name}」嗎？此操作無法復原。`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: async () => {
        try {
          await this.taskFacade.deleteTask(task.id);
          this.message.success('任務刪除成功');

          // Reload tasks
          const wsId = this.workspaceId();
          if (wsId) {
            this.taskFacade.loadWorkspaceTasks(wsId);
          }
        } catch (error) {
          console.error('Failed to delete task:', error);
          this.message.error(`刪除任務失敗：${(error as Error).message}`);
        }
      }
    });
  }

  /**
   * Handle search input
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      pending: 'default',
      in_progress: 'processing',
      completed: 'success',
      cancelled: 'error'
    };
    return colorMap[status] || 'default';
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
   * Get priority color
   */
  getPriorityColor(priority: string): string {
    const colorMap: Record<string, string> = {
      low: 'default',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colorMap[priority] || 'default';
  }
}
