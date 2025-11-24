/**
 * Blueprint Create Component
 *
 * Component for creating new blueprints with @delon/form
 * Following enterprise standards and five-layer architecture
 * Located in Feature Module as per angular-enterprise-development-guidelines.md
 *
 * @module create-blueprint.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { BlueprintFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, CreateBlueprintRequest, BlueprintCategoryEnum, BlueprintVisibilityEnum } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

/**
 * Blueprint Create Component
 *
 * Uses @delon/form (sf) for form generation
 * Validates input and creates blueprint via BlueprintFacade
 */
@Component({
  selector: 'app-create-blueprint',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div class="modal-header">
      <h3>新增藍圖</h3>
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
      <button nz-button nzType="primary" [nzLoading]="loading()" (click)="sf.validator()"> 建立藍圖 </button>
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
export class CreateBlueprintComponent implements OnInit {
  private readonly modal = inject(NzModalRef);
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly message = inject(NzMessageService);

  // Component inputs (passed via modal data)
  ownerId = '';
  ownerType: 'user' | 'organization' | 'team' = 'user';

  // Local state
  readonly loading = signal(false);
  readonly formData = signal<Partial<CreateBlueprintRequest>>({
    category: BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT,
    visibility: BlueprintVisibilityEnum.PRIVATE
  });

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
        },
        default: BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT
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
        },
        default: BlueprintVisibilityEnum.PRIVATE
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
    required: ['name', 'description', 'category']
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
    if (!this.ownerId) {
      this.message.error('缺少 ownerId 參數');
      this.modal.close();
      return;
    }

    // Set initial form data with ownerId and ownerType
    this.formData.set({
      ...this.formData(),
      ownerId: this.ownerId,
      ownerType: this.ownerType
    });
  }

  /**
   * Handle form submission
   */
  async onSubmit(value: any): Promise<void> {
    try {
      this.loading.set(true);

      // Build create request
      const request: CreateBlueprintRequest = {
        name: value.name,
        description: value.description,
        category: value.category,
        visibility: value.visibility,
        ownerId: this.ownerId,
        ownerType: this.ownerType,
        tags: value.tags || [],
        iconUrl: value.iconUrl,
        thumbnailUrl: value.thumbnailUrl
      };

      // Create blueprint via facade
      const createdBlueprint = await this.blueprintFacade.createBlueprint(request);

      this.message.success('藍圖建立成功');

      // Close modal and return created blueprint
      this.modal.close(createdBlueprint);
    } catch (error) {
      console.error('Failed to create blueprint:', error);
      this.message.error(`建立藍圖失敗：${(error as Error).message}`);
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
