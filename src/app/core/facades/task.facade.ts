/**
 * Task Facade
 *
 * Unified interface for Task Module management
 * Following docs/00-順序.md Step 5: Facades 層
 *
 * Coordinates TaskService
 * Provides unified Signal state interface
 *
 * @module task.facade
 */

import { Injectable, inject } from '@angular/core';

import { TaskService } from '@shared';
import {
  TaskModel,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatistics,
  TaskViewMode
} from '@shared';

/**
 * Task Facade
 *
 * Provides unified API for Task Module
 * Ready for integration with Blueprint Container
 */
@Injectable({ providedIn: 'root' })
export class TaskFacade {
  private readonly taskService = inject(TaskService);

  // Expose Task Service state
  readonly tasks = this.taskService.tasks;
  readonly selectedTask = this.taskService.selectedTask;
  readonly loading = this.taskService.loading;
  readonly error = this.taskService.error;
  readonly viewMode = this.taskService.viewMode;
  readonly statistics = this.taskService.statistics;

  // Computed signals (shortcuts)
  readonly pendingTasks = this.taskService.pendingTasks;
  readonly inProgressTasks = this.taskService.inProgressTasks;
  readonly completedTasks = this.taskService.completedTasks;
  readonly rootTasks = this.taskService.rootTasks;

  /**
   * Load tasks for workspace
   */
  async loadWorkspaceTasks(workspaceId: string): Promise<void> {
    try {
      await this.taskService.loadTasksByWorkspace(workspaceId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<TaskModel> {
    return this.taskService.getTaskById(id);
  }

  /**
   * Create new task
   */
  async createTask(request: CreateTaskRequest): Promise<TaskModel> {
    return this.taskService.createTask(request);
  }

  /**
   * Update task
   */
  async updateTask(id: string, request: UpdateTaskRequest): Promise<TaskModel> {
    return this.taskService.updateTask(id, request);
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  /**
   * Complete task
   */
  async completeTask(id: string): Promise<TaskModel> {
    return this.taskService.completeTask(id);
  }

  /**
   * Cancel task
   */
  async cancelTask(id: string): Promise<TaskModel> {
    return this.taskService.cancelTask(id);
  }

  /**
   * Set view mode (tree or table)
   */
  setViewMode(mode: TaskViewMode): void {
    this.taskService.setViewMode(mode);
  }

  /**
   * Toggle view mode between tree and table
   */
  toggleViewMode(): void {
    const currentMode = this.viewMode();
    this.setViewMode(currentMode === 'tree' ? 'table' : 'tree');
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.taskService.clearError();
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.taskService.clearSelection();
  }
}
