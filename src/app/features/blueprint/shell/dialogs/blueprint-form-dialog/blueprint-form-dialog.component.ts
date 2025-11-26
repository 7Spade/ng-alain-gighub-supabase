/**
 * Blueprint Form Dialog Component
 *
 * Modal dialog for creating/editing blueprints (藍圖表單對話框)
 * Using @delon/form for dynamic form generation
 * Following enterprise guidelines and vertical slice architecture
 *
 * Dependency flow:
 * Component → Store (Facade) → Service → Repository
 *
 * @module features/blueprint/shell/dialogs/blueprint-form-dialog
 */

import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { BlueprintStore } from '../../../data-access';
import { BlueprintModel, CreateBlueprintRequest, UpdateBlueprintRequest, BlueprintVisibility, OwnerType } from '../../../domain';

/**
 * Dialog mode for create/edit
 */
export type BlueprintFormMode = 'create' | 'edit';

/**
 * Dialog input data
 */
export interface BlueprintFormDialogData {
  mode: BlueprintFormMode;
  blueprint?: BlueprintModel;
  ownerId?: string;
  ownerType?: OwnerType;
}

/**
 * Form values interface
 * Simplified: only essential fields
 */
interface BlueprintFormValues {
  name: string;
  description: string;
  visibility: BlueprintVisibility;
  tags?: string;
}

/**
 * Blueprint Form Dialog Component
 *
 * Smart component for blueprint CRUD operations
 * Uses @delon/form for schema-driven forms
 */
@Component({
  selector: 'app-blueprint-form-dialog',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './blueprint-form-dialog.component.html'
})
export class BlueprintFormDialogComponent implements OnInit {
  @ViewChild('sf') sf!: SFComponent;

  private readonly modalRef = inject(NzModalRef);
  private readonly messageService = inject(NzMessageService);
  private readonly blueprintStore = inject(BlueprintStore);
  private readonly dialogData = inject<BlueprintFormDialogData>(NZ_MODAL_DATA);

  // Form state
  readonly loading = signal<boolean>(false);
  readonly formData = signal<Partial<BlueprintFormValues>>({});

  // Dialog properties
  readonly mode = this.dialogData.mode;
  readonly isEditMode = this.mode === 'edit';
  readonly dialogTitle = this.isEditMode ? '編輯藍圖' : '建立藍圖';

  /**
   * Form schema definition (JSON Schema)
   * Simplified: removed category, iconUrl, thumbnailUrl
   * Visibility: only public/hidden
   */
  readonly schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '藍圖名稱',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        title: '描述',
        maxLength: 500
      },
      visibility: {
        type: 'string',
        title: '可見性',
        enum: [
          { label: '公開', value: 'public' },
          { label: '隱藏', value: 'hidden' }
        ],
        default: 'hidden'
      },
      tags: {
        type: 'string',
        title: '標籤'
      }
    },
    required: ['name', 'description']
  };

  /**
   * UI schema for form layout
   */
  readonly uiSchema: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    },
    $name: {
      widget: 'string',
      placeholder: '請輸入藍圖名稱'
    },
    $description: {
      widget: 'textarea',
      placeholder: '請輸入藍圖描述',
      autosize: { minRows: 3, maxRows: 6 }
    },
    $visibility: {
      widget: 'select',
      placeholder: '請選擇可見性'
    },
    $tags: {
      widget: 'string',
      placeholder: '輸入標籤，用逗號分隔'
    }
  };

  ngOnInit(): void {
    // Initialize form data for edit mode
    if (this.isEditMode && this.dialogData.blueprint) {
      const blueprint = this.dialogData.blueprint;
      this.formData.set({
        name: blueprint.name,
        description: blueprint.description,
        visibility: blueprint.visibility,
        tags: blueprint.tags?.join(',')
      });
    }
  }

  /**
   * Trigger form submit programmatically
   */
  triggerSubmit(): void {
    if (this.sf?.valid) {
      this.onSubmit(this.sf.value as BlueprintFormValues);
    } else {
      // Show validation errors
      this.messageService.warning('請填寫所有必填欄位');
    }
  }

  /**
   * Handle form submission
   */
  async onSubmit(formValue: BlueprintFormValues): Promise<void> {
    this.loading.set(true);

    try {
      // Parse tags from string if needed
      const tags = this.parseTags(formValue.tags);

      if (this.isEditMode) {
        await this.handleUpdate(formValue, tags);
      } else {
        await this.handleCreate(formValue, tags);
      }
    } catch (error) {
      console.error('Blueprint form error:', error);
      this.messageService.error('操作失敗，請稍後再試');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Handle blueprint creation
   * Simplified: removed unused fields
   */
  private async handleCreate(formValue: BlueprintFormValues, tags: string[]): Promise<void> {
    if (!this.dialogData.ownerId || !this.dialogData.ownerType) {
      throw new Error('Owner ID and Owner Type are required for creation');
    }

    const request: CreateBlueprintRequest = {
      name: formValue.name,
      description: formValue.description,
      visibility: formValue.visibility || 'hidden',
      ownerId: this.dialogData.ownerId,
      ownerType: this.dialogData.ownerType,
      tags
    };

    const result = await this.blueprintStore.createBlueprint(request);
    this.messageService.success('藍圖建立成功');
    this.modalRef.close(result);
  }

  /**
   * Handle blueprint update
   * Simplified: removed unused fields
   */
  private async handleUpdate(formValue: BlueprintFormValues, tags: string[]): Promise<void> {
    if (!this.dialogData.blueprint) {
      throw new Error('Blueprint not found for update');
    }

    const request: UpdateBlueprintRequest = {
      name: formValue.name,
      description: formValue.description,
      visibility: formValue.visibility,
      tags
    };

    const result = await this.blueprintStore.updateBlueprint(this.dialogData.blueprint.id, request);
    this.messageService.success('藍圖更新成功');
    this.modalRef.close(result);
  }

  /**
   * Parse tags from string
   */
  private parseTags(tags: string | undefined): string[] {
    if (!tags) return [];
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  /**
   * Handle cancel action
   */
  onCancel(): void {
    this.modalRef.close();
  }
}
