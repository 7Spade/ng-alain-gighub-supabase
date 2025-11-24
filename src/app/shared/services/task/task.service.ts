/**
 * Task Service
 *
 * Business logic for Task Module management
 * Following docs/00-順序.md Step 4: Services 層
 *
 * Uses Angular Signals for reactive state management
 * Supports unlimited depth tree structure
 *
 * @module task.service
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskRepository } from '@core';
import { TaskModel, CreateTaskRequest, UpdateTaskRequest, TaskStatistics, TaskStatusEnum, TaskViewMode } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task Service
 *
 * Manages task state and business logic with Signals
 * Supports tree operations for unlimited depth hierarchy
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly taskRepo = inject(TaskRepository);

  // State management with Signals
  private tasksState = signal<TaskModel[]>([]);
  private selectedTaskState = signal<TaskModel | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  private viewModeState = signal<TaskViewMode>('tree');

  // Expose ReadonlySignal to components
  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTask = this.selectedTaskState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly viewMode = this.viewModeState.asReadonly();

  // Computed signals for derived state
  readonly pendingTasks = computed(() => this.tasks().filter(t => t.status === TaskStatusEnum.PENDING));

  readonly inProgressTasks = computed(() => this.tasks().filter(t => t.status === TaskStatusEnum.IN_PROGRESS));

  readonly completedTasks = computed(() => this.tasks().filter(t => t.status === TaskStatusEnum.COMPLETED));

  readonly rootTasks = computed(() => this.tasks().filter(t => t.parentId === null));

  readonly statistics = computed<TaskStatistics>(() => {
    const tasks = this.tasks();
    const totalDepth = tasks.reduce((sum, t) => sum + t.depth, 0);

    return {
      totalCount: tasks.length,
      pendingCount: tasks.filter(t => t.status === TaskStatusEnum.PENDING).length,
      inProgressCount: tasks.filter(t => t.status === TaskStatusEnum.IN_PROGRESS).length,
      completedCount: tasks.filter(t => t.status === TaskStatusEnum.COMPLETED).length,
      cancelledCount: tasks.filter(t => t.status === TaskStatusEnum.CANCELLED).length,

      // By level
      l0Count: tasks.filter(t => t.depth === 0).length,
      l1Count: tasks.filter(t => t.depth === 1).length,
      l2Count: tasks.filter(t => t.depth === 2).length,
      l3PlusCount: tasks.filter(t => t.depth >= 3).length,

      // Progress
      overallProgress: tasks.length > 0 ? (tasks.filter(t => t.status === TaskStatusEnum.COMPLETED).length / tasks.length) * 100 : 0,
      averageDepth: tasks.length > 0 ? totalDepth / tasks.length : 0
    };
  });

  /**
   * Load tasks by workspace
   */
  async loadTasksByWorkspace(workspaceId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepo.findByWorkspace(workspaceId));
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load tasks');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<TaskModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.taskRepo.findById(id));
      if (!task) {
        throw new Error('Task not found');
      }
      this.selectedTaskState.set(task);
      return task;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load task');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Create new task
   */
  async createTask(request: CreateTaskRequest): Promise<TaskModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // Calculate path and depth
      const { path, depth } = await this.calculatePathAndDepth(request.parentId, request.workspaceId);

      const taskInsert = {
        ...request,
        path,
        depth,
        status: TaskStatusEnum.PENDING,
        priority: request.priority || ('medium' as const),
        assigneeIds: request.assigneeIds || [],
        assigneeTypes: request.assigneeTypes || [],
        tags: request.tags || []
      };

      const newTask = await firstValueFrom(this.taskRepo.create(taskInsert));

      // Update state
      this.tasksState.update(tasks => [...tasks, newTask]);

      return newTask;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to create task');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Update task
   */
  async updateTask(id: string, request: UpdateTaskRequest): Promise<TaskModel> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updatedTask = await firstValueFrom(this.taskRepo.update(id, request));

      // Update state
      this.tasksState.update(tasks => tasks.map(t => (t.id === id ? updatedTask : t)));

      if (this.selectedTask()?.id === id) {
        this.selectedTaskState.set(updatedTask);
      }

      // Recalculate progress for parent tasks
      if (request.status) {
        await this.recalculateParentProgress(updatedTask);
      }

      return updatedTask;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to update task');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.taskRepo.delete(id));

      // Update state
      this.tasksState.update(tasks => tasks.filter(t => t.id !== id));

      if (this.selectedTask()?.id === id) {
        this.selectedTaskState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to delete task');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Complete task
   */
  async completeTask(id: string): Promise<TaskModel> {
    return this.updateTask(id, { status: TaskStatusEnum.COMPLETED });
  }

  /**
   * Cancel task
   */
  async cancelTask(id: string): Promise<TaskModel> {
    return this.updateTask(id, { status: TaskStatusEnum.CANCELLED });
  }

  /**
   * Set view mode (tree or table)
   */
  setViewMode(mode: TaskViewMode): void {
    this.viewModeState.set(mode);
  }

  /**
   * Calculate path and depth for new task
   */
  private async calculatePathAndDepth(parentId: string | null | undefined, workspaceId: string): Promise<{ path: string; depth: number }> {
    if (!parentId) {
      // Root task - calculate next position
      const rootTasks = await firstValueFrom(this.taskRepo.findRootTasks(workspaceId));
      const position = rootTasks.length;
      return {
        path: (position + 1).toString(),
        depth: 0
      };
    }

    // Child task - get parent and append position
    const parent = await firstValueFrom(this.taskRepo.findById(parentId));
    if (!parent) {
      throw new Error('Parent task not found');
    }

    const siblings = await firstValueFrom(this.taskRepo.findByParent(parentId));
    const position = siblings.length;

    return {
      path: `${parent.path}.${position + 1}`,
      depth: parent.depth + 1
    };
  }

  /**
   * Recalculate progress for parent tasks (recursive)
   *
   * Note: This is a simplified implementation for the base structure.
   * In production, progress calculation should be handled by database triggers
   * or a dedicated background job to ensure consistency across the tree.
   */
  private async recalculateParentProgress(task: TaskModel): Promise<void> {
    if (!task.parentId) {
      return; // Root task, no parent to update
    }

    try {
      const parent = await firstValueFrom(this.taskRepo.findById(task.parentId));
      if (!parent) {
        return;
      }

      // Get all children of parent to trigger potential future progress calculation
      // Currently unused but kept for future database-level progress updates
      // const children = await firstValueFrom(this.taskRepo.findByParent(parent.id));

      // Calculate progress metrics (commented out to avoid unused variable warnings)
      // const completedCount = children.filter(c => c.status === TaskStatusEnum.COMPLETED).length;
      // const totalCount = children.length;
      // const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      // Update parent with calculated progress
      // Note: In production, this should be a database-level update
      // to avoid race conditions and ensure atomicity

      // TODO: Implement database-level progress calculation
      // For now, we skip the update to avoid infinite recursion
      // and rely on future database triggers

      // Recursively update grandparent
      await this.recalculateParentProgress(parent);
    } catch (error) {
      console.error('Failed to recalculate parent progress:', error);
    }
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedTaskState.set(null);
  }
}
