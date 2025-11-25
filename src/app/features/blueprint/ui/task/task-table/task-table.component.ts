/**
 * Task Table Component
 *
 * Table view for tasks with sorting and pagination
 * Displays all task information in tabular format
 *
 * @module features/blueprint/ui/task/task-table
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, Signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { Task } from '../../../domain';
import {
  getStatusColor,
  getStatusText,
  formatLevel,
  getLevelColor,
  getProgressStatus,
  formatAssigneeInitials,
  getPriorityColor,
  getPriorityText
} from '../shared';

/**
 * Task Table Component
 *
 * Renders tasks in a table format with pagination
 */
@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskTableComponent {
  /** Tasks signal from parent */
  @Input({ required: true }) tasks!: Signal<Task[]>;

  /** Task select event */
  @Output() readonly taskSelect = new EventEmitter<Task>();

  /** Task edit event */
  @Output() readonly taskEdit = new EventEmitter<Task>();

  /** Task delete event */
  @Output() readonly taskDelete = new EventEmitter<Task>();

  /** Page size options */
  readonly pageSizeOptions = [10, 20, 50, 100];

  /** Utility methods exposed to template */
  getStatusColor = getStatusColor;
  getStatusText = getStatusText;
  formatLevel = formatLevel;
  getLevelColor = getLevelColor;
  getProgressStatus = getProgressStatus;
  formatAssigneeInitials = formatAssigneeInitials;
  getPriorityColor = getPriorityColor;
  getPriorityText = getPriorityText;

  /** Handle row click */
  onRowClick(task: Task): void {
    this.taskSelect.emit(task);
  }

  /** Handle edit action */
  onEdit(event: Event, task: Task): void {
    event.stopPropagation();
    this.taskEdit.emit(task);
  }

  /** Handle delete action */
  onDelete(event: Event, task: Task): void {
    event.stopPropagation();
    this.taskDelete.emit(task);
  }

  /** Get indent padding for hierarchical display */
  getIndentPadding(depth: number): number {
    return depth * 20;
  }
}
