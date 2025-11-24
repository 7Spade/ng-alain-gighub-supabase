/**
 * Task Edit Modal Component
 *
 * Modal for editing existing tasks with @delon/form
 * Pre-fills form with current task data
 *
 * @module task-edit-modal.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { TaskFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, UpdateTaskRequest, TaskModel, TaskPriorityEnum, TaskStatusEnum } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

/**
 * Task Edit Modal Component
 *
 * Uses @delon/form (sf) for form generation
 * Pre-fills with existing task data
 * Validates input and updates task via TaskFacade
 */
@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div class="modal-header">
      <h3>編輯任務</h3>
      @if (task) {
        <div class="task-info">
          <nz-tag [nzColor]="'blue'">L{{ task.depth }}</nz-tag>
          <span class="task-path">{{ task.path }}</span>
        </div>
      }
    </div>

    <sf
      #sf
      [schema]="schema"
      [ui]="ui"
      [formData]="formData()"
      [loading]="loading()"
      (formSubmit)="onSubmit($event)"
      (formError)="onError($event)"
    >
    </sf>

    <div class="modal-footer">
      <button nz-button (click)="onCancel()">取消</button>
      <button nz-button nzType="primary" [nzLoading]="loading()" (click)="sf.validator()"> 儲存變更 </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .modal-header {
        margin-bottom: 24px;

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .task-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);

          .task-path {
            font-family: monospace;
          }
        }
      }

      .modal-footer {
        margin-top: 24px;
        text-align: right;

        button {
          margin-left: 8px;
        }
      }
    `
  ]
})
export class TaskEditModalComponent implements OnInit {
  private readonly modal = inject(NzModalRef);
  private readonly taskFacade = inject(TaskFacade);
  private readonly message = inject(NzMessageService);

  // Component inputs (passed via modal data)
  task: TaskModel | null = null;

  // Local state
  readonly loading = signal(false);
  readonly formData = signal<Partial<UpdateTaskRequest>>({});

  // Form schema
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '任務名稱',
        maxLength: 500,
        ui: {
          placeholder: '請輸入任務名稱',
          autofocus: true
        }
      },
      description: {
        type: 'string',
        title: '任務描述',
        ui: {
          widget: 'textarea',
          placeholder: '請輸入任務描述（選填）',
          autosize: { minRows: 3, maxRows: 6 }
        }
      },
      status: {
        type: 'string',
        title: '狀態',
        enum: [TaskStatusEnum.PENDING, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.COMPLETED, TaskStatusEnum.CANCELLED],
        ui: {
          widget: 'select',
          placeholder: '請選擇狀態',
          enumNames: {
            [TaskStatusEnum.PENDING]: '待處理',
            [TaskStatusEnum.IN_PROGRESS]: '進行中',
            [TaskStatusEnum.COMPLETED]: '已完成',
            [TaskStatusEnum.CANCELLED]: '已取消'
          }
        }
      },
      priority: {
        type: 'string',
        title: '優先級',
        enum: [TaskPriorityEnum.LOW, TaskPriorityEnum.MEDIUM, TaskPriorityEnum.HIGH, TaskPriorityEnum.URGENT],
        ui: {
          widget: 'select',
          placeholder: '請選擇優先級',
          enumNames: {
            [TaskPriorityEnum.LOW]: '低',
            [TaskPriorityEnum.MEDIUM]: '中',
            [TaskPriorityEnum.HIGH]: '高',
            [TaskPriorityEnum.URGENT]: '緊急'
          }
        }
      },
      area: {
        type: 'string',
        title: '所屬區域',
        maxLength: 100,
        ui: {
          placeholder: '例如：前端、後端、設計（選填）'
        }
      },
      tags: {
        type: 'string',
        title: '標籤',
        ui: {
          widget: 'select',
          mode: 'tags',
          placeholder: '輸入標籤後按 Enter（選填）',
          tokenSeparators: [',', ' ']
        }
      },
      dueDate: {
        type: 'string',
        title: '截止日期',
        format: 'date-time',
        ui: {
          widget: 'date',
          placeholder: '請選擇截止日期（選填）',
          showTime: true
        }
      }
    },
    required: ['name', 'status', 'priority']
  };

  // UI schema
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    },
    $name: {
      grid: { span: 24 }
    },
    $description: {
      grid: { span: 24 }
    },
    $status: {
      grid: { span: 12 }
    },
    $priority: {
      grid: { span: 12 }
    },
    $area: {
      grid: { span: 12 }
    },
    $tags: {
      grid: { span: 24 }
    },
    $dueDate: {
      grid: { span: 24 }
    }
  };

  ngOnInit(): void {
    // Validate required inputs
    if (!this.task) {
      this.message.error('缺少 task 參數');
      this.modal.close();
      return;
    }

    // Pre-fill form with existing task data
    this.formData.set({
      name: this.task.name,
      description: this.task.description || undefined,
      status: this.task.status,
      priority: this.task.priority,
      area: this.task.area || undefined,
      tags: this.task.tags || [],
      dueDate: this.task.dueDate || undefined
    });
  }

  /**
   * Handle form submission
   */
  async onSubmit(value: any): Promise<void> {
    if (!this.task) {
      this.message.error('無效的任務');
      return;
    }

    try {
      this.loading.set(true);

      // Build update request
      const request: UpdateTaskRequest = {
        name: value.name,
        description: value.description,
        status: value.status,
        priority: value.priority,
        area: value.area,
        tags: value.tags || [],
        dueDate: value.dueDate ? new Date(value.dueDate) : undefined
      };

      // Update task via facade
      const updatedTask = await this.taskFacade.updateTask(this.task.id, request);

      this.message.success('任務更新成功');

      // Close modal and return updated task
      this.modal.close(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
      this.message.error(`更新任務失敗：${(error as Error).message}`);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Handle form validation error
   */
  onError(errors: any): void {
    console.error('Form validation errors:', errors);
    this.message.error('請檢查表單欄位');
  }

  /**
   * Handle cancel
   */
  onCancel(): void {
    this.modal.close();
  }
}
