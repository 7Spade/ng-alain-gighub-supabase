/**
 * Blueprint Update Component
 *
 * Component for editing existing blueprints with @delon/form
 * Pre-fills form with current blueprint data
 * Located in Feature Module as per angular-enterprise-development-guidelines.md
 *
 * @module update-blueprint.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { BlueprintFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import {
  SHARED_IMPORTS,
  UpdateBlueprintRequest,
  BlueprintModel,
  BlueprintCategoryEnum,
  BlueprintVisibilityEnum,
  BlueprintStatusEnum
} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

/**
 * Blueprint Update Component
 *
 * Uses @delon/form (sf) for form generation
 * Pre-fills with existing blueprint data
 * Validates input and updates blueprint via BlueprintFacade
 */
@Component({
  selector: 'app-update-blueprint',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div class="modal-header">
      <h3>編輯藍圖</h3>
      @if (blueprint) {
        <div class="blueprint-info">
          <nz-tag [nzColor]="'blue'">{{ blueprint.category }}</nz-tag>
          <nz-tag [nzColor]="'green'">{{ blueprint.status }}</nz-tag>
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

        .blueprint-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
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
export class UpdateBlueprintComponent implements OnInit {
  private readonly modal = inject(NzModalRef);
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly message = inject(NzMessageService);

  // Component inputs (passed via modal data)
  blueprint: BlueprintModel | null = null;

  // Local state
  readonly loading = signal(false);
  readonly formData = signal<Partial<UpdateBlueprintRequest>>({});

  // Form schema
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '藍圖名稱',
        maxLength: 255,
        ui: {
          placeholder: '請輸入藍圖名稱',
          autofocus: true
        }
      },
      description: {
        type: 'string',
        title: '藍圖描述',
        ui: {
          widget: 'textarea',
          placeholder: '請輸入藍圖描述',
          autosize: { minRows: 3, maxRows: 6 }
        }
      },
      category: {
        type: 'string',
        title: '類別',
        enum: [
          BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT,
          BlueprintCategoryEnum.MARKETING,
          BlueprintCategoryEnum.SALES,
          BlueprintCategoryEnum.HR,
          BlueprintCategoryEnum.OPERATIONS,
          BlueprintCategoryEnum.CUSTOM
        ],
        ui: {
          widget: 'select',
          placeholder: '請選擇類別',
          enumNames: {
            [BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT]: '軟體開發',
            [BlueprintCategoryEnum.MARKETING]: '行銷',
            [BlueprintCategoryEnum.SALES]: '銷售',
            [BlueprintCategoryEnum.HR]: '人力資源',
            [BlueprintCategoryEnum.OPERATIONS]: '營運',
            [BlueprintCategoryEnum.CUSTOM]: '自訂'
          }
        }
      },
      visibility: {
        type: 'string',
        title: '可見性',
        enum: [
          BlueprintVisibilityEnum.PRIVATE,
          BlueprintVisibilityEnum.ORGANIZATION,
          BlueprintVisibilityEnum.TEAM,
          BlueprintVisibilityEnum.PUBLIC
        ],
        ui: {
          widget: 'select',
          placeholder: '請選擇可見性',
          enumNames: {
            [BlueprintVisibilityEnum.PRIVATE]: '私有',
            [BlueprintVisibilityEnum.ORGANIZATION]: '組織',
            [BlueprintVisibilityEnum.TEAM]: '團隊',
            [BlueprintVisibilityEnum.PUBLIC]: '公開'
          }
        }
      },
      status: {
        type: 'string',
        title: '狀態',
        enum: [BlueprintStatusEnum.DRAFT, BlueprintStatusEnum.PUBLISHED, BlueprintStatusEnum.ARCHIVED],
        ui: {
          widget: 'select',
          placeholder: '請選擇狀態',
          enumNames: {
            [BlueprintStatusEnum.DRAFT]: '草稿',
            [BlueprintStatusEnum.PUBLISHED]: '已發布',
            [BlueprintStatusEnum.ARCHIVED]: '已封存'
          }
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
      iconUrl: {
        type: 'string',
        title: '圖示 URL',
        format: 'uri',
        ui: {
          placeholder: '請輸入圖示 URL（選填）'
        }
      },
      thumbnailUrl: {
        type: 'string',
        title: '縮圖 URL',
        format: 'uri',
        ui: {
          placeholder: '請輸入縮圖 URL（選填）'
        }
      }
    },
    required: ['name', 'description', 'category', 'visibility', 'status']
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
    $category: {
      grid: { span: 12 }
    },
    $visibility: {
      grid: { span: 12 }
    },
    $status: {
      grid: { span: 12 }
    },
    $tags: {
      grid: { span: 24 }
    },
    $iconUrl: {
      grid: { span: 12 }
    },
    $thumbnailUrl: {
      grid: { span: 12 }
    }
  };

  ngOnInit(): void {
    // Validate required inputs
    if (!this.blueprint) {
      this.message.error('缺少 blueprint 參數');
      this.modal.close();
      return;
    }

    // Pre-fill form with existing blueprint data
    this.formData.set({
      name: this.blueprint.name,
      description: this.blueprint.description,
      category: this.blueprint.category,
      visibility: this.blueprint.visibility,
      status: this.blueprint.status,
      tags: this.blueprint.tags || [],
      iconUrl: this.blueprint.iconUrl,
      thumbnailUrl: this.blueprint.thumbnailUrl
    });
  }

  /**
   * Handle form submission
   */
  async onSubmit(value: any): Promise<void> {
    if (!this.blueprint) {
      this.message.error('無效的藍圖');
      return;
    }

    try {
      this.loading.set(true);

      // Build update request
      const request: UpdateBlueprintRequest = {
        name: value.name,
        description: value.description,
        category: value.category,
        visibility: value.visibility,
        status: value.status,
        tags: value.tags || [],
        iconUrl: value.iconUrl,
        thumbnailUrl: value.thumbnailUrl
      };

      // Update blueprint via facade
      const updatedBlueprint = await this.blueprintFacade.updateBlueprint(this.blueprint.id, request);

      this.message.success('藍圖更新成功');

      // Close modal and return updated blueprint
      this.modal.close(updatedBlueprint);
    } catch (error) {
      console.error('Failed to update blueprint:', error);
      this.message.error(`更新藍圖失敗：${(error as Error).message}`);
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
