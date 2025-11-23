import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { STColumn, STModule } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';

import { Blueprint } from '../types';

@Component({
  selector: 'app-blueprint-list',
  templateUrl: './blueprint-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, PageHeaderModule, STModule]
})
export class BlueprintListComponent implements OnInit {
  private readonly router = inject(Router);

  // 藍圖列表資料（初始為空，預留後續整合）
  blueprints: Blueprint[] = [];

  // 表格欄位定義
  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 80 },
    { title: '名稱', index: 'name', width: 200 },
    { title: '描述', index: 'description' },
    {
      title: '狀態',
      index: 'status',
      type: 'badge',
      width: 100,
      badge: {
        draft: { text: '草稿', color: 'default' },
        active: { text: '進行中', color: 'processing' },
        archived: { text: '已封存', color: 'default' }
      }
    },
    { title: '建立時間', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '檢視',
          icon: 'eye',
          click: (record: Blueprint) => this.viewBlueprint(record)
        },
        {
          text: '任務',
          icon: 'unordered-list',
          click: (record: Blueprint) => this.viewTasks(record)
        }
      ]
    }
  ];

  ngOnInit(): void {
    // 預留：載入藍圖列表資料
    this.loadBlueprints();
  }

  /**
   * 載入藍圖列表
   * TODO: 整合 Supabase 服務
   */
  private loadBlueprints(): void {
    // 模擬資料，實際應從 Supabase 取得
    this.blueprints = [];
  }

  /**
   * 檢視藍圖詳情
   */
  viewBlueprint(blueprint: Blueprint): void {
    this.router.navigate(['/blueprint', blueprint.id]);
  }

  /**
   * 檢視藍圖的任務列表
   */
  viewTasks(blueprint: Blueprint): void {
    this.router.navigate(['/blueprint', blueprint.id, 'tasks']);
  }

  /**
   * 建立新藍圖
   */
  createBlueprint(): void {
    this.router.navigate(['/blueprint', 'new']);
  }
}
