// ============================================
// @delon/abc - 业务组件集（Business Components）
// ============================================
import { AutoFocusModule } from '@delon/abc/auto-focus';
import { CellModule } from '@delon/abc/cell';
import { CountDownModule } from '@delon/abc/count-down';
import { DatePickerModule as DelonDatePickerModule } from '@delon/abc/date-picker';
import { DownFileModule } from '@delon/abc/down-file';
import { EllipsisModule } from '@delon/abc/ellipsis';
import { ErrorCollectModule } from '@delon/abc/error-collect';
import { ExceptionModule } from '@delon/abc/exception';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { FullContentModule } from '@delon/abc/full-content';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { HotkeyModule } from '@delon/abc/hotkey';
import { LoadingModule } from '@delon/abc/loading';
import { LodopModule } from '@delon/abc/lodop';
import { MediaModule } from '@delon/abc/media';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { OnboardingModule } from '@delon/abc/onboarding';
import { PageHeaderModule } from '@delon/abc/page-header';
import { PdfModule } from '@delon/abc/pdf';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
import { SGModule } from '@delon/abc/sg';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { TagSelectModule } from '@delon/abc/tag-select';
import { XlsxModule } from '@delon/abc/xlsx';
// Note: ZipService is a service and doesn't require module import
// ============================================
// @delon/acl - 权限控制（ACL - Access Control List）
// ============================================
import { ACLDirective, ACLIfDirective } from '@delon/acl';
// ============================================
// @delon/form - 基于 JSON-Schema 的表单模块
// ============================================
import { DelonFormModule } from '@delon/form';
// ============================================
// @delon/util - 工具函数/通用库（Utilities）
// ============================================
import { CurrencyPricePipe } from '@delon/util';

// ============================================
// 导出共享模块数组
// ============================================
export const SHARED_DELON_MODULES = [
  // @delon/abc - 业务组件
  AutoFocusModule,
  CellModule,
  CountDownModule,
  DelonDatePickerModule,
  DownFileModule,
  EllipsisModule,
  ErrorCollectModule,
  ExceptionModule,
  FooterToolbarModule,
  FullContentModule,
  GlobalFooterModule,
  HotkeyModule,
  LoadingModule,
  LodopModule,
  MediaModule,
  NoticeIconModule,
  OnboardingModule,
  PageHeaderModule,
  PdfModule,
  QuickMenuModule,
  ReuseTabModule,
  SEModule,
  SGModule,
  STModule,
  SVModule,
  TagSelectModule,
  XlsxModule,

  // @delon/acl - 权限控制
  ACLDirective,
  ACLIfDirective,

  // @delon/form - 表单模块
  DelonFormModule,

  // @delon/util - 工具
  CurrencyPricePipe
];
