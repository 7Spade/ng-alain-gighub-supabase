/**
 * Task Table Component
 *
 * Table view for tasks using ng-zorro table
 * Displays tasks in a flat table with hierarchical indentation
 *
 * Features:
 * - Sortable columns
 * - Pagination
 * - Status badges and progress bars
 * - Action buttons
 *
 * @module features/blueprint/ui/task/task-table
 */

import { Component, input, output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { TaskModel } from '../../../domain';
import { getStatusColor, getStatusText, getTaskLevel, getLevelColor, getPriorityColor } from '../shared';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.less'
})
export class TaskTableComponent {
  // Inputs
  readonly tasks = input.required<TaskModel[]>();
  readonly loading = input<boolean>(false);
  readonly pageSize = input<number>(20);

  // Outputs
  readonly taskSelect = output<TaskModel>();
  readonly taskEdit = output<TaskModel>();
  readonly taskDelete = output<TaskModel>();

  // Expose utility functions for template
  getStatusColor = getStatusColor;
  getStatusText = getStatusText;
  getTaskLevel = getTaskLevel;
  getLevelColor = getLevelColor;
  getPriorityColor = getPriorityColor;

  /**
   * Handle row click
   */
  onRowClick(task: TaskModel): void {
    this.taskSelect.emit(task);
  }

  /**
   * Handle edit action
   */
  onEdit(event: Event, task: TaskModel): void {
    event.stopPropagation();
    this.taskEdit.emit(task);
  }

  /**
   * Handle delete action
   */
  onDelete(event: Event, task: TaskModel): void {
    event.stopPropagation();
    this.taskDelete.emit(task);
  }
}
