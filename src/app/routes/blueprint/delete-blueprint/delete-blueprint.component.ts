/**
 * Delete Blueprint Component
 *
 * Minimal CRUD component for deleting blueprints
 * Following Angular 20+ and enterprise development guidelines
 * Uses NzModalService for confirmation dialog
 *
 * @module delete-blueprint.component
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintFacade } from '@core';
import { SHARED_IMPORTS, BlueprintModel } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-blueprint',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './delete-blueprint.component.html',
  styleUrl: './delete-blueprint.component.less'
})
export class DeleteBlueprintComponent implements OnInit {
  private readonly blueprintFacade = inject(BlueprintFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  readonly loading = signal(false);
  readonly blueprint = signal<BlueprintModel | null>(null);
  readonly blueprintId = signal<string>('');

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
   * Show delete confirmation dialog
   */
  showDeleteConfirm(): void {
    const bp = this.blueprint();
    if (!bp) return;

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除藍圖「${bp.name}」嗎？此操作無法復原。`,
      nzOkText: '刪除',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => this.deleteBlueprint()
    });
  }

  /**
   * Delete blueprint
   */
  async deleteBlueprint(): Promise<void> {
    this.loading.set(true);
    try {
      await this.blueprintFacade.deleteBlueprint(this.blueprintId());
      this.message.success('藍圖刪除成功');
      this.router.navigate(['/blueprint']);
    } catch (error) {
      console.error('Failed to delete blueprint:', error);
      this.message.error('藍圖刪除失敗');
      this.loading.set(false);
    }
  }

  /**
   * Cancel deletion
   */
  onCancel(): void {
    this.router.navigate(['/blueprint']);
  }
}
