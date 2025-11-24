/**
 * Update Task Component
 *
 * Minimal CRUD component for updating tasks
 * Following Angular 20+ and enterprise development guidelines
 * Uses @delon/form for dynamic form generation
 *
 * @module update-task.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, UpdateTaskRequest, TaskModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.less'
})
export class UpdateTaskComponent implements OnInit {
  private readonly taskFacade = inject(TaskFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);

  readonly loading = signal(false);
  readonly task = signal<TaskModel | null>(null);
  readonly taskId = signal<string>('');

  // @delon/form schema
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '任務名稱',
        maxLength: 200,
        minLength: 1
      },
      description: {
        type: 'string',
        title: '描述',
        maxLength: 1000
      },
      status: {
        type: 'string',
        title: '狀態',
        enum: ['pending', 'in_progress', 'completed', 'cancelled']
      },
      priority: {
        type: 'string',
        title: '優先級',
        enum: ['low', 'medium', 'high', 'urgent']
      },
      area: {
        type: 'string',
        title: '區域',
        maxLength: 100
      },
      tags: {
        type: 'string',
        title: '標籤',
        description: '多個標籤以逗號分隔'
      },
      dueDate: {
        type: 'string',
        title: '截止日期',
        format: 'date'
      }
    },
    required: ['name']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    },
    $description: {
      widget: 'textarea',
      autosize: { minRows: 3, maxRows: 6 }
    },
    $status: {
      widget: 'select',
      placeholder: '請選擇狀態'
    },
    $priority: {
      widget: 'select',
      placeholder: '請選擇優先級'
    },
    $area: {
      widget: 'string',
      placeholder: '例如: 開發, 測試, 部署'
    },
    $tags: {
      widget: 'string',
      placeholder: '例如: 前端, 後端, API'
    },
    $dueDate: {
      widget: 'date',
      placeholder: '選擇截止日期'
    }
  };

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
   * Get form initial value
   */
  getFormValue(): unknown {
    const t = this.task();
    if (!t) return {};

    return {
      name: t.name,
      description: t.description,
      status: t.status,
      priority: t.priority,
      area: t.area,
      tags: t.tags.join(', '),
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : undefined
    };
  }

  /**
   * Handle form submission
   */
  async onSubmit(value: unknown): Promise<void> {
    this.loading.set(true);

    try {
      const formData = value as {
        name: string;
        description?: string;
        status: string;
        priority: string;
        area?: string;
        tags?: string;
        dueDate?: string;
      };

      const request: UpdateTaskRequest = {
        name: formData.name,
        description: formData.description,
        status: formData.status as UpdateTaskRequest['status'],
        priority: formData.priority as UpdateTaskRequest['priority'],
        area: formData.area,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      };

      await this.taskFacade.updateTask(this.taskId(), request);
      this.message.success('任務更新成功');
      this.router.navigate(['/blueprint/task']);
    } catch (error) {
      console.error('Failed to update task:', error);
      this.message.error('任務更新失敗');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.router.navigate(['/blueprint/task']);
  }
}
