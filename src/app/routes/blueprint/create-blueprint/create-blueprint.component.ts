/**
 * Create Blueprint Component
 *
 * Minimal CRUD component for creating blueprints
 * Following Angular 20+ and enterprise development guidelines
 * Uses @delon/form for dynamic form generation
 *
 * @module create-blueprint.component
 */

import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BlueprintFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, CreateBlueprintRequest } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-blueprint',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './create-blueprint.component.html',
  styleUrl: './create-blueprint.component.less'
})
export class CreateBlueprintComponent {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly loading = signal(false);

  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '藍圖名稱',
        maxLength: 100,
        minLength: 1
      },
      description: {
        type: 'string',
        title: '描述',
        maxLength: 500
      },
      category: {
        type: 'string',
        title: '類別',
        enum: ['software_development', 'marketing', 'sales', 'hr', 'operations', 'custom'],
        default: 'software_development'
      },
      visibility: {
        type: 'string',
        title: '可見性',
        enum: ['private', 'organization', 'team', 'public'],
        default: 'private'
      },
      tags: {
        type: 'string',
        title: '標籤',
        description: '多個標籤以逗號分隔'
      }
    },
    required: ['name', 'description', 'category']
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
    $category: {
      widget: 'select',
      placeholder: '請選擇類別'
    },
    $visibility: {
      widget: 'select',
      placeholder: '請選擇可見性'
    },
    $tags: {
      widget: 'string',
      placeholder: '例如: 專案管理, 敏捷開發'
    }
  };

  /**
   * Handle form submission
   */
  async onSubmit(value: unknown): Promise<void> {
    this.loading.set(true);

    try {
      const formData = value as {
        name: string;
        description: string;
        category: string;
        visibility?: string;
        tags?: string;
      };

      // TODO: Get ownerId and ownerType from authentication context
      const ownerId = 'temp-owner-id'; // Placeholder
      const ownerType = 'user'; // Placeholder

      const request: CreateBlueprintRequest = {
        name: formData.name,
        description: formData.description,
        category: formData.category as CreateBlueprintRequest['category'],
        visibility: (formData.visibility as CreateBlueprintRequest['visibility']) || 'private',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        ownerId,
        ownerType
      };

      await this.blueprintFacade.createBlueprint(request);
      this.message.success('藍圖建立成功');
      this.router.navigate(['/blueprint']);
    } catch (error) {
      console.error('Failed to create blueprint:', error);
      this.message.error('藍圖建立失敗');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.router.navigate(['/blueprint']);
  }
}
