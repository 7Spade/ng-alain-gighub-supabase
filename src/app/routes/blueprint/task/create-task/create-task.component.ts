/**
 * Create Task Component
 *
 * Minimal CRUD component for creating tasks
 * Following Angular 20+ and enterprise development guidelines
 * Uses @delon/form for dynamic form generation
 *
 * @module create-task.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, CreateTaskRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.less'
})
export class CreateTaskComponent implements OnInit {
  private readonly taskFacade = inject(TaskFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);

  readonly loading = signal(false);
  readonly workspaceId = signal<string>('');

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
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
      },
      priority: {
        type: 'string',
        title: '優先級',
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
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

  ngOnInit(): void {
    const workspaceId = this.route.snapshot.queryParamMap.get('workspaceId');
    if (!workspaceId) {
      this.message.error('缺少工作區 ID');
      this.router.navigate(['/blueprint']);
      return;
    }
    this.workspaceId.set(workspaceId);
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
        status?: string;
        priority?: string;
        area?: string;
        tags?: string;
        dueDate?: string;
      };

      const request: CreateTaskRequest = {
        workspaceId: this.workspaceId(),
        name: formData.name,
        description: formData.description,
        priority: (formData.priority as CreateTaskRequest['priority']) || 'medium',
        area: formData.area,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      };

      await this.taskFacade.createTask(request);
      this.message.success('任務建立成功');
      this.router.navigate(['/blueprint/task']);
    } catch (error) {
      console.error('Failed to create task:', error);
      this.message.error('任務建立失敗');
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
