/**
 * Task List Container Component
 *
 * Container component for task module with dual display modes
 * Delegates to TaskTreeComponent or TaskTableComponent based on view mode
 *
 * Features:
 * - View mode toggle (tree/table)
 * - Statistics summary
 * - Search filtering
 * - Integration with WorkspaceContext
 *
 * @module features/blueprint/ui/task/task-list
 */

import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { WorkspaceContextFacade } from '@core';

import { TaskStore } from '../../../data-access';
import { TaskModel, TaskViewMode } from '../../../domain';
import { TaskTreeComponent } from '../task-tree';
import { TaskTableComponent } from '../task-table';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SHARED_IMPORTS, TaskTreeComponent, TaskTableComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.less'
})
export class TaskListComponent implements OnInit {
  private readonly taskStore = inject(TaskStore);
  private readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly route = inject(ActivatedRoute);

  // Store state
  readonly tasks = this.taskStore.tasks;
  readonly loading = this.taskStore.loading;
  readonly error = this.taskStore.error;
  readonly statistics = this.taskStore.statistics;

  // Context state
  readonly contextType = this.workspaceContext.contextType;
  readonly contextId = this.workspaceContext.contextId;

  // Local state
  readonly viewMode = signal<TaskViewMode>('tree');
  readonly searchTerm = signal<string>('');

  // Filtered tasks based on search
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

  constructor() {
    // Auto-load tasks when context changes
    effect(() => {
      const contextId = this.contextId();
      if (contextId) {
        this.loadTasks(contextId);
      }
    });
  }

  ngOnInit(): void {
    // Check for route parameter as fallback
    const paramId = this.route.snapshot.paramMap.get('workspaceId');
    if (paramId && !this.contextId()) {
      this.loadTasks(paramId);
    }
  }

  /**
   * Load tasks for workspace
   */
  private async loadTasks(workspaceId: string): Promise<void> {
    try {
      await this.taskStore.loadWorkspaceTasks(workspaceId);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  /**
   * Set view mode
   */
  setViewMode(mode: TaskViewMode): void {
    this.viewMode.set(mode);
  }

  /**
   * Handle search input
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Handle task selection
   */
  onTaskSelect(task: TaskModel): void {
    console.log('Task selected:', task);
  }

  /**
   * Handle create task
   */
  onCreateTask(parentId: string | null = null): void {
    console.log('Create task, parent:', parentId);
  }

  /**
   * Handle edit task
   */
  onEditTask(task: TaskModel): void {
    console.log('Edit task:', task);
  }

  /**
   * Handle delete task
   */
  onDeleteTask(task: TaskModel): void {
    console.log('Delete task:', task);
  }
}
