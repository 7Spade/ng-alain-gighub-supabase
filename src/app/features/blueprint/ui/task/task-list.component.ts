/**
 * Task List Component
 *
 * Task module with dual display modes: tree-view and table
 * Supporting unlimited depth hierarchy (L0, L1, L2, L3+)
 * Following vertical slice architecture
 *
 * Features:
 * - Tree view using NzTreeViewModule
 * - Table view with ng-zorro table
 * - View mode toggle switch
 * - Display: status, level, name, progress, assignees, area, tags
 * - Progress calculated from leaf nodes
 *
 * @module features/blueprint/ui/task/task-list.component
 */

import { Component, inject, signal, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

import { TaskStore } from '../../data-access';
import { TaskModel, TaskViewMode } from '../../domain';

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
export class TaskListComponent {
  private readonly taskStore = inject(TaskStore);

  // Store state
  readonly tasks = this.taskStore.tasks;
  readonly loading = this.taskStore.loading;
  readonly error = this.taskStore.error;
  readonly statistics = this.taskStore.statistics;
  readonly rootTasks = this.taskStore.rootTasks;

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

  // Initialize component
  // Load tasks when workspaceId is available from route or context
  // ngOnInit implementation will be added when context switcher is integrated

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
    console.log('Create task clicked');
    // Placeholder for future implementation
  }

  /**
   * Handle task edit
   */
  onEditTask(task: TaskModel): void {
    console.log('Edit task:', task);
    // Placeholder for future implementation
  }

  /**
   * Handle task delete
   */
  onDeleteTask(task: TaskModel): void {
    console.log('Delete task:', task);
    // Placeholder for future implementation
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
