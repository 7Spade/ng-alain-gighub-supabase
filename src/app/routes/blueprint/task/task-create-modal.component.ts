/**
 * Task Create Modal Component
 *
 * Modal for creating new tasks with @delon/form
 * Supports parent task selection and full task properties
 *
 * @module task-create-modal.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { TaskFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, CreateTaskRequest, TaskPriorityEnum } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

/**
 * Task Create Modal Component
 *
 * Uses @delon/form (sf) for form generation
 * Validates input and creates task via TaskFacade
 */
@Component({
  selector: 'app-task-create-modal',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div class="modal-header">
      <h3>新增任務</h3>
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
      <button nz-button nzType="primary" [nzLoading]="loading()" (click)="sf.validator()"> 建立任務 </button>
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
          margin: 0;
          font-size: 18px;
          font-weight: 600;
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
export class TaskCreateModalComponent implements OnInit {
  private readonly modal = inject(NzModalRef);
  private readonly taskFacade = inject(TaskFacade);
  private readonly message = inject(NzMessageService);

  // Component inputs (passed via modal data)
  workspaceId = '';
  parentId?: string | null = null;

  // Local state
  readonly loading = signal(false);
  readonly formData = signal<Partial<CreateTaskRequest>>({
    priority: TaskPriorityEnum.MEDIUM
  });

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
      priority: {
        type: 'string',
        title: '優先級',
        enum: [TaskPriorityEnum.LOW, TaskPriorityEnum.MEDIUM, TaskPriorityEnum.HIGH, TaskPriorityEnum.URGENT],
        ui: {
          widget: 'select',
          placeholder: '請選擇優先級'
        },
        default: TaskPriorityEnum.MEDIUM
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
    required: ['name']
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
    if (!this.workspaceId) {
      this.message.error('缺少 workspaceId 參數');
      this.modal.close();
      return;
    }

    // Set initial form data with workspaceId and parentId
    this.formData.set({
      ...this.formData(),
      workspaceId: this.workspaceId,
      parentId: this.parentId
    });
  }

  /**
   * Handle form submission
   */
  async onSubmit(value: any): Promise<void> {
    try {
      this.loading.set(true);

      // Merge form data with required fields
      const request: CreateTaskRequest = {
        workspaceId: this.workspaceId,
        name: value.name,
        description: value.description,
        priority: value.priority,
        parentId: this.parentId,
        area: value.area,
        tags: value.tags || [],
        dueDate: value.dueDate ? new Date(value.dueDate) : undefined
      };

      // Create task via facade
      const createdTask = await this.taskFacade.createTask(request);

      this.message.success('任務建立成功');

      // Close modal and return created task
      this.modal.close(createdTask);
    } catch (error) {
      console.error('Failed to create task:', error);
      this.message.error(`建立任務失敗：${(error as Error).message}`);
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
