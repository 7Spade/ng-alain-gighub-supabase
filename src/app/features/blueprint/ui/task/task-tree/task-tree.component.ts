/**
 * Task Tree Component
 *
 * Tree view for tasks using NzTreeViewModule
 * Supports unlimited depth hierarchy (L0, L1, L2, L3+)
 *
 * Features:
 * - Expandable/collapsible tree nodes
 * - Status badges
 * - Progress indicators
 * - Action buttons (edit, delete)
 *
 * @module features/blueprint/ui/task/task-tree
 */

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, input, output, computed, effect } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzTreeViewModule, NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

import { TaskModel } from '../../../domain';
import { getStatusColor, getStatusText, getTaskLevel, getLevelColor } from '../shared';

/**
 * Flat node for tree control
 */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  task: TaskModel;
}

@Component({
  selector: 'app-task-tree',
  standalone: true,
  imports: [SHARED_IMPORTS, NzTreeViewModule],
  templateUrl: './task-tree.component.html',
  styleUrl: './task-tree.component.less'
})
export class TaskTreeComponent {
  // Inputs
  readonly tasks = input.required<TaskModel[]>();
  readonly loading = input<boolean>(false);

  // Outputs
  readonly taskSelect = output<TaskModel>();
  readonly taskEdit = output<TaskModel>();
  readonly taskDelete = output<TaskModel>();
  readonly taskCreate = output<string | null>();

  // Pre-built children map for O(1) lookup
  private childrenMap = new Map<string | null, TaskModel[]>();

  // Tree control
  private transformer = (task: TaskModel, level: number): FlatNode => ({
    expandable: task.childCount > 0,
    name: task.name,
    level,
    task
  });

  private getChildrenFn = (task: TaskModel): TaskModel[] => {
    return this.childrenMap.get(task.id) || [];
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    this.getChildrenFn
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // Build tree data from flat tasks with optimized children lookup
  readonly treeData = computed(() => {
    const tasks = this.tasks();

    // Build children map for O(1) lookup
    this.childrenMap.clear();
    for (const task of tasks) {
      const parentId = task.parentId;
      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, []);
      }
      this.childrenMap.get(parentId)!.push(task);
    }

    return this.childrenMap.get(null) || [];
  });

  constructor() {
    // Update dataSource when treeData changes
    effect(() => {
      const rootTasks = this.treeData();
      this.dataSource.setData(rootTasks);
    });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  // Expose utility functions for template
  getStatusColor = getStatusColor;
  getStatusText = getStatusText;
  getTaskLevel = getTaskLevel;
  getLevelColor = getLevelColor;

  /** Handle task node click */
  onNodeClick(node: FlatNode): void {
    this.taskSelect.emit(node.task);
  }

  /** Handle edit action */
  onEdit(event: Event, task: TaskModel): void {
    event.stopPropagation();
    this.taskEdit.emit(task);
  }

  /** Handle delete action */
  onDelete(event: Event, task: TaskModel): void {
    event.stopPropagation();
    this.taskDelete.emit(task);
  }

  /** Handle add child task */
  onAddChild(event: Event, parentId: string | null): void {
    event.stopPropagation();
    this.taskCreate.emit(parentId);
  }
}
