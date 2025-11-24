/**
 * Update Blueprint Component
 *
 * Minimal CRUD component for updating blueprints
 * Following Angular 20+ and enterprise development guidelines
 * Uses @delon/form for dynamic form generation
 *
 * @module update-blueprint.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintFacade } from '@core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, UpdateBlueprintRequest, BlueprintModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-update-blueprint',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './update-blueprint.component.html',
  styleUrl: './update-blueprint.component.less'
})
export class UpdateBlueprintComponent implements OnInit {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);

  readonly loading = signal(false);
  readonly blueprint = signal<BlueprintModel | null>(null);
  readonly blueprintId = signal<string>('');

  // @delon/form schema
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
        enum: ['software_development', 'marketing', 'sales', 'hr', 'operations', 'custom']
      },
      visibility: {
        type: 'string',
        title: '可見性',
        enum: ['private', 'organization', 'team', 'public']
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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('無效的藍圖 ID');
      this.router.navigate(['/blueprint']);
      return;
    }

    this.blueprintId.set(id);
    await this.loadBlueprint(id);
  }

  /**
   * Load blueprint data
   */
  private async loadBlueprint(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const blueprint = await this.blueprintFacade.getBlueprint(id);
      this.blueprint.set(blueprint);
    } catch (error) {
      console.error('Failed to load blueprint:', error);
      this.message.error('載入藍圖失敗');
      this.router.navigate(['/blueprint']);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get form initial value
   */
  getFormValue(): Record<string, unknown> {
    const bp = this.blueprint();
    if (!bp) return {};

    return {
      name: bp.name,
      description: bp.description,
      category: bp.category,
      visibility: bp.visibility,
      tags: bp.tags.join(', ')
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
        description: string;
        category: string;
        visibility: string;
        tags?: string;
      };

      const request: UpdateBlueprintRequest = {
        name: formData.name,
        description: formData.description,
        category: formData.category as UpdateBlueprintRequest['category'],
        visibility: formData.visibility as UpdateBlueprintRequest['visibility'],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      await this.blueprintFacade.updateBlueprint(this.blueprintId(), request);
      this.message.success('藍圖更新成功');
      this.router.navigate(['/blueprint']);
    } catch (error) {
      console.error('Failed to update blueprint:', error);
      this.message.error('藍圖更新失敗');
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
