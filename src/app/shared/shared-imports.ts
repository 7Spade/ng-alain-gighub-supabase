// ============================================
// Angular 核心模块（Angular Core Modules）
// ============================================
import { AsyncPipe, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
// ============================================
// Delon 主题工具（Delon Theme Utilities）
// ============================================
import { DatePipe, I18nPipe } from '@delon/theme';

// ============================================
// 共享模块（Shared Modules）
// ============================================
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// ============================================
// 导出所有共享导入（Export All Shared Imports）
// ============================================
export const SHARED_IMPORTS = [
  // Angular 核心
  FormsModule,
  ReactiveFormsModule,
  RouterLink,
  RouterOutlet,
  NgTemplateOutlet,
  AsyncPipe,
  JsonPipe,

  // Delon 主题
  DatePipe,
  I18nPipe,

  // Delon 业务组件
  ...SHARED_DELON_MODULES,

  // NG-ZORRO 组件
  ...SHARED_ZORRO_MODULES
];
