---
description: 'ng-zorro-antd component usage guide for Angular projects - essential patterns for GitHub Copilot agent'
applyTo: '**/*.ts, **/*.html'
---

# NG-ZORRO Component Usage Guide

Essential patterns and API usage for ng-zorro-antd (Ant Design Angular) components. This guide enables GitHub Copilot to generate correct NG-ZORRO component code.

## Core Principles

1. **Always use `SHARED_IMPORTS`** - includes all NG-ZORRO modules
2. **Use new Angular control flow** - `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`
3. **Prefer signals** - use `signal()` and `computed()` for reactive state
4. **Use OnPush** - always use `ChangeDetectionStrategy.OnPush`

---

## Component Categories

| Category | Components |
|----------|------------|
| **Layout** | Grid, Layout, Space, Flex, Divider |
| **Navigation** | Menu, Breadcrumb, Tabs, Steps, Dropdown |
| **Data Entry** | Form, Input, Select, DatePicker, Checkbox, Radio, Switch, Upload |
| **Data Display** | Table, List, Card, Descriptions, Tree, Badge, Tag, Avatar |
| **Feedback** | Alert, Modal, Drawer, Message, Notification, Spin, Progress |
| **Other** | Button, Icon, Typography, Tooltip, Popover |

---

## Layout Components

### Grid System

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div nz-row [nzGutter]="[16, 16]">
      <div nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
        <nz-card>Column 1</nz-card>
      </div>
      <div nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
        <nz-card>Column 2</nz-card>
      </div>
      <div nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
        <nz-card>Column 3</nz-card>
      </div>
      <div nz-col [nzSpan]="24" [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
        <nz-card>Column 4</nz-card>
      </div>
    </div>
  `
})
```

### Responsive Breakpoints

| Breakpoint | Width | Property |
|------------|-------|----------|
| xs | <576px | `[nzXs]` |
| sm | ≥576px | `[nzSm]` |
| md | ≥768px | `[nzMd]` |
| lg | ≥992px | `[nzLg]` |
| xl | ≥1200px | `[nzXl]` |
| xxl | ≥1600px | `[nzXxl]` |

### Flex Layout

```typescript
@Component({
  template: `
    <div nz-flex [nzGap]="'middle'" [nzJustify]="'space-between'" [nzAlign]="'center'">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  `
})
```

---

## Form Components

### Basic Form

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" nzLayout="vertical" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label nzRequired>名稱</nz-form-label>
        <nz-form-control nzErrorTip="請輸入名稱">
          <input nz-input formControlName="name" placeholder="請輸入名稱" />
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-label nzRequired>Email</nz-form-label>
        <nz-form-control nzErrorTip="請輸入有效的 Email">
          <input nz-input formControlName="email" type="email" />
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-label>類型</nz-form-label>
        <nz-form-control>
          <nz-select formControlName="type" nzPlaceHolder="請選擇">
            @for (opt of options; track opt.value) {
              <nz-option [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [disabled]="!form.valid">提交</button>
          <button nz-button type="button" (click)="reset()">重置</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class FormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    type: ['']
  });
  
  options = [
    { value: 'a', label: '選項 A' },
    { value: 'b', label: '選項 B' }
  ];
  
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
  
  reset() {
    this.form.reset();
  }
}
```

### Form Layouts

```typescript
// Horizontal layout (default)
<form nz-form nzLayout="horizontal" [nzLabelCol]="{ span: 6 }" [nzWrapperCol]="{ span: 18 }">

// Vertical layout
<form nz-form nzLayout="vertical">

// Inline layout
<form nz-form nzLayout="inline">
```

### Input Components

```typescript
// Text input
<input nz-input placeholder="Basic" />

// Input with prefix/suffix
<nz-input-group [nzPrefix]="prefixIcon" [nzSuffix]="suffixIcon">
  <input nz-input />
</nz-input-group>
<ng-template #prefixIcon><span nz-icon nzType="user"></span></ng-template>
<ng-template #suffixIcon><span nz-icon nzType="search"></span></ng-template>

// Textarea
<textarea nz-input [nzAutosize]="{ minRows: 2, maxRows: 6 }"></textarea>

// Number input
<nz-input-number [(ngModel)]="value" [nzMin]="1" [nzMax]="100" [nzStep]="1"></nz-input-number>
```

### Select Component

```typescript
@Component({
  template: `
    <!-- Basic select -->
    <nz-select [(ngModel)]="selectedValue" nzPlaceHolder="請選擇">
      @for (opt of options; track opt.value) {
        <nz-option [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
      }
    </nz-select>
    
    <!-- Multiple select -->
    <nz-select [(ngModel)]="selectedValues" nzMode="multiple" nzPlaceHolder="請選擇多個">
      @for (opt of options; track opt.value) {
        <nz-option [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
      }
    </nz-select>
    
    <!-- Searchable select -->
    <nz-select 
      [(ngModel)]="selectedValue" 
      nzShowSearch 
      nzAllowClear
      nzPlaceHolder="搜尋並選擇"
      [nzFilterOption]="filterOption">
      @for (opt of options; track opt.value) {
        <nz-option [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
      }
    </nz-select>
  `
})
export class SelectComponent {
  selectedValue: string | null = null;
  selectedValues: string[] = [];
  options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ];
  
  filterOption = (input: string, option: NzOptionComponent) => {
    return option.nzLabel?.toLowerCase().includes(input.toLowerCase()) ?? false;
  };
}
```

### Date Picker

```typescript
@Component({
  template: `
    <!-- Date picker -->
    <nz-date-picker [(ngModel)]="date" nzFormat="yyyy-MM-dd"></nz-date-picker>
    
    <!-- Date range picker -->
    <nz-range-picker [(ngModel)]="dateRange" [nzFormat]="'yyyy-MM-dd'"></nz-range-picker>
    
    <!-- Month picker -->
    <nz-date-picker [(ngModel)]="month" nzMode="month"></nz-date-picker>
    
    <!-- With time -->
    <nz-date-picker [(ngModel)]="dateTime" nzShowTime nzFormat="yyyy-MM-dd HH:mm:ss"></nz-date-picker>
  `
})
export class DateComponent {
  date: Date | null = null;
  dateRange: Date[] = [];
  month: Date | null = null;
  dateTime: Date | null = null;
}
```

---

## Data Display Components

### Table

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-table 
      #basicTable 
      [nzData]="items()" 
      [nzLoading]="loading()"
      [nzPageSize]="10"
      [nzShowPagination]="true"
      [nzBordered]="true">
      <thead>
        <tr>
          <th>名稱</th>
          <th>狀態</th>
          <th>創建時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        @for (item of basicTable.data; track item.id) {
          <tr>
            <td>{{ item.name }}</td>
            <td>
              <nz-tag [nzColor]="item.status === 'active' ? 'green' : 'default'">
                {{ item.status }}
              </nz-tag>
            </td>
            <td>{{ item.createdAt | date:'yyyy-MM-dd HH:mm' }}</td>
            <td>
              <a (click)="edit(item)">編輯</a>
              <nz-divider nzType="vertical"></nz-divider>
              <a nz-popconfirm nzPopconfirmTitle="確定刪除?" (nzOnConfirm)="delete(item)">
                刪除
              </a>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class TableComponent {
  items = signal<Item[]>([]);
  loading = signal(false);
  
  edit(item: Item) { /* ... */ }
  delete(item: Item) { /* ... */ }
}
```

### Card

```typescript
@Component({
  template: `
    <nz-card [nzTitle]="titleTpl" [nzExtra]="extraTpl" [nzActions]="[actionEdit, actionDelete]">
      <p>Card content</p>
      <p>Card content</p>
    </nz-card>
    
    <ng-template #titleTpl>
      <span nz-icon nzType="file"></span> 卡片標題
    </ng-template>
    
    <ng-template #extraTpl>
      <a>更多</a>
    </ng-template>
    
    <ng-template #actionEdit>
      <span nz-icon nzType="edit" (click)="edit()"></span>
    </ng-template>
    
    <ng-template #actionDelete>
      <span nz-icon nzType="delete" (click)="delete()"></span>
    </ng-template>
  `
})
```

### List

```typescript
@Component({
  template: `
    <nz-list [nzDataSource]="items()" [nzRenderItem]="itemTpl" [nzLoading]="loading()">
      <ng-template #itemTpl let-item>
        <nz-list-item [nzActions]="[editAction, deleteAction]">
          <nz-list-item-meta
            nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            [nzTitle]="titleTpl"
            nzDescription="描述內容">
          </nz-list-item-meta>
          <ng-template #titleTpl>
            <a>{{ item.title }}</a>
          </ng-template>
          <ng-template #editAction>
            <a (click)="edit(item)">編輯</a>
          </ng-template>
          <ng-template #deleteAction>
            <a (click)="delete(item)">刪除</a>
          </ng-template>
        </nz-list-item>
      </ng-template>
    </nz-list>
  `
})
```

### Tag

```typescript
@Component({
  template: `
    <!-- Basic tags -->
    <nz-tag>Default</nz-tag>
    <nz-tag nzColor="success">Success</nz-tag>
    <nz-tag nzColor="processing">Processing</nz-tag>
    <nz-tag nzColor="error">Error</nz-tag>
    <nz-tag nzColor="warning">Warning</nz-tag>
    
    <!-- Custom color -->
    <nz-tag nzColor="#f50">#f50</nz-tag>
    <nz-tag nzColor="#2db7f5">#2db7f5</nz-tag>
    
    <!-- Checkable tag -->
    <nz-checkable-tag [(nzChecked)]="checked">Checkable</nz-checkable-tag>
    
    <!-- Closable tag -->
    <nz-tag nzMode="closeable" (nzOnClose)="onClose()">Closable</nz-tag>
  `
})
```

### Badge

```typescript
@Component({
  template: `
    <!-- Count badge -->
    <nz-badge [nzCount]="5">
      <a class="head-example"></a>
    </nz-badge>
    
    <!-- Status badge -->
    <nz-badge nzStatus="success" nzText="Success"></nz-badge>
    <nz-badge nzStatus="error" nzText="Error"></nz-badge>
    <nz-badge nzStatus="default" nzText="Default"></nz-badge>
    <nz-badge nzStatus="processing" nzText="Processing"></nz-badge>
    <nz-badge nzStatus="warning" nzText="Warning"></nz-badge>
    
    <!-- Dot badge -->
    <nz-badge nzDot>
      <span nz-icon nzType="notification"></span>
    </nz-badge>
  `
})
```

---

## Feedback Components

### Alert

```typescript
@Component({
  template: `
    <nz-alert nzType="success" nzMessage="成功提示"></nz-alert>
    <nz-alert nzType="info" nzMessage="資訊提示" nzDescription="詳細說明文字"></nz-alert>
    <nz-alert nzType="warning" nzMessage="警告提示" nzCloseable></nz-alert>
    <nz-alert nzType="error" nzMessage="錯誤提示" nzShowIcon></nz-alert>
  `
})
```

### Modal

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <button nz-button nzType="primary" (click)="showModal()">打開 Modal</button>
    
    <nz-modal
      [(nzVisible)]="isVisible()"
      nzTitle="Modal 標題"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()">
      <ng-container *nzModalContent>
        <p>Modal 內容</p>
      </ng-container>
    </nz-modal>
  `
})
export class ModalComponent {
  isVisible = signal(false);
  
  showModal() {
    this.isVisible.set(true);
  }
  
  handleOk() {
    console.log('OK clicked');
    this.isVisible.set(false);
  }
  
  handleCancel() {
    this.isVisible.set(false);
  }
}
```

### Modal Service

```typescript
@Component({
  template: `
    <button nz-button (click)="showConfirm()">確認對話框</button>
    <button nz-button (click)="showInfo()">資訊對話框</button>
  `
})
export class ModalServiceComponent {
  private modal = inject(NzModalService);
  
  showConfirm() {
    this.modal.confirm({
      nzTitle: '確定要刪除嗎?',
      nzContent: '刪除後無法恢復',
      nzOkText: '確定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => console.log('Confirmed'),
      nzCancelText: '取消'
    });
  }
  
  showInfo() {
    this.modal.info({
      nzTitle: '提示',
      nzContent: '這是一個提示訊息'
    });
  }
}
```

### Drawer

```typescript
@Component({
  template: `
    <button nz-button nzType="primary" (click)="open()">打開 Drawer</button>
    
    <nz-drawer
      [nzVisible]="visible()"
      nzTitle="Drawer 標題"
      [nzWidth]="500"
      nzPlacement="right"
      (nzOnClose)="close()">
      <ng-container *nzDrawerContent>
        <p>Drawer 內容</p>
      </ng-container>
    </nz-drawer>
  `
})
export class DrawerComponent {
  visible = signal(false);
  
  open() {
    this.visible.set(true);
  }
  
  close() {
    this.visible.set(false);
  }
}
```

### Message Service

```typescript
@Component({
  template: `
    <button nz-button (click)="showSuccess()">成功</button>
    <button nz-button (click)="showError()">錯誤</button>
    <button nz-button (click)="showLoading()">載入中</button>
  `
})
export class MessageComponent {
  private message = inject(NzMessageService);
  
  showSuccess() {
    this.message.success('操作成功');
  }
  
  showError() {
    this.message.error('操作失敗');
  }
  
  showLoading() {
    const id = this.message.loading('載入中...', { nzDuration: 0 }).messageId;
    setTimeout(() => {
      this.message.remove(id);
      this.message.success('載入完成');
    }, 2000);
  }
}
```

### Notification Service

```typescript
@Component({
  template: `<button nz-button (click)="showNotification()">通知</button>`
})
export class NotificationComponent {
  private notification = inject(NzNotificationService);
  
  showNotification() {
    this.notification.success(
      '成功',
      '操作已完成',
      { nzDuration: 3000 }
    );
  }
}
```

### Spin

```typescript
@Component({
  template: `
    <!-- Basic spin -->
    <nz-spin [nzSpinning]="loading()">
      <div class="content">Content</div>
    </nz-spin>
    
    <!-- With tip -->
    <nz-spin [nzSpinning]="loading()" nzTip="載入中...">
      <div class="content">Content</div>
    </nz-spin>
    
    <!-- Delay -->
    <nz-spin [nzSpinning]="loading()" [nzDelay]="500">
      <div class="content">Content</div>
    </nz-spin>
  `
})
export class SpinComponent {
  loading = signal(true);
}
```

---

## Navigation Components

### Menu

```typescript
@Component({
  template: `
    <!-- Vertical menu -->
    <ul nz-menu nzMode="inline">
      <li nz-submenu nzTitle="導航一" nzIcon="mail">
        <ul>
          <li nz-menu-item>選項 1</li>
          <li nz-menu-item>選項 2</li>
        </ul>
      </li>
      <li nz-menu-item nzSelected>
        <span nz-icon nzType="setting"></span>
        設定
      </li>
    </ul>
    
    <!-- Horizontal menu -->
    <ul nz-menu nzMode="horizontal">
      <li nz-menu-item nzSelected>首頁</li>
      <li nz-menu-item>關於</li>
    </ul>
  `
})
```

### Tabs

```typescript
@Component({
  template: `
    <nz-tabset [(nzSelectedIndex)]="selectedIndex()" (nzSelectedIndexChange)="onTabChange($event)">
      <nz-tab nzTitle="Tab 1">Content 1</nz-tab>
      <nz-tab nzTitle="Tab 2">Content 2</nz-tab>
      <nz-tab nzTitle="Tab 3">Content 3</nz-tab>
    </nz-tabset>
    
    <!-- With template title -->
    <nz-tabset>
      <nz-tab [nzTitle]="titleTpl">
        <ng-template #titleTpl>
          <span nz-icon nzType="apple"></span> Tab
        </ng-template>
        Content
      </nz-tab>
    </nz-tabset>
  `
})
export class TabsComponent {
  selectedIndex = signal(0);
  
  onTabChange(index: number) {
    this.selectedIndex.set(index);
  }
}
```

### Breadcrumb

```typescript
@Component({
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>
        <a routerLink="/">首頁</a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>
        <a routerLink="/list">列表</a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>詳情</nz-breadcrumb-item>
    </nz-breadcrumb>
  `
})
```

---

## Button Component

```typescript
@Component({
  template: `
    <!-- Types -->
    <button nz-button nzType="primary">Primary</button>
    <button nz-button nzType="default">Default</button>
    <button nz-button nzType="dashed">Dashed</button>
    <button nz-button nzType="text">Text</button>
    <button nz-button nzType="link">Link</button>
    
    <!-- Danger -->
    <button nz-button nzType="primary" nzDanger>Danger</button>
    
    <!-- Loading -->
    <button nz-button nzType="primary" [nzLoading]="loading()">Submit</button>
    
    <!-- With icon -->
    <button nz-button nzType="primary">
      <span nz-icon nzType="plus"></span>
      新增
    </button>
    
    <!-- Icon only -->
    <button nz-button nzType="primary" nzShape="circle">
      <span nz-icon nzType="search"></span>
    </button>
    
    <!-- Sizes -->
    <button nz-button nzType="primary" nzSize="large">Large</button>
    <button nz-button nzType="primary" nzSize="default">Default</button>
    <button nz-button nzType="primary" nzSize="small">Small</button>
    
    <!-- Button group -->
    <nz-button-group>
      <button nz-button>左</button>
      <button nz-button>右</button>
    </nz-button-group>
  `
})
```

---

## Icon Component

```typescript
@Component({
  template: `
    <!-- Basic icons -->
    <span nz-icon nzType="home"></span>
    <span nz-icon nzType="setting" nzTheme="fill"></span>
    <span nz-icon nzType="check-circle" nzTheme="twotone" [nzTwotoneColor]="'#52c41a'"></span>
    
    <!-- With rotation -->
    <span nz-icon nzType="loading" [nzSpin]="true"></span>
    <span nz-icon nzType="sync" [nzRotate]="180"></span>
    
    <!-- Sizes (using style) -->
    <span nz-icon nzType="home" style="font-size: 24px;"></span>
  `
})
```

---

## Tooltip & Popover

```typescript
@Component({
  template: `
    <!-- Tooltip -->
    <button nz-button nz-tooltip nzTooltipTitle="提示文字">Tooltip</button>
    
    <!-- Tooltip with template -->
    <span nz-tooltip [nzTooltipTitle]="tooltipTpl">Hover me</span>
    <ng-template #tooltipTpl>
      <div>自定義<b>內容</b></div>
    </ng-template>
    
    <!-- Popover -->
    <button nz-button nz-popover nzPopoverTitle="標題" nzPopoverContent="內容">Popover</button>
    
    <!-- Popconfirm -->
    <button 
      nz-button 
      nz-popconfirm 
      nzPopconfirmTitle="確定刪除?"
      (nzOnConfirm)="confirm()"
      (nzOnCancel)="cancel()">
      刪除
    </button>
  `
})
```

---

## Empty State

```typescript
@Component({
  template: `
    <nz-empty nzNotFoundImage="simple"></nz-empty>
    
    <nz-empty
      [nzNotFoundImage]="customImage"
      [nzNotFoundContent]="'暫無資料'"
      [nzNotFoundFooter]="footerTpl">
    </nz-empty>
    
    <ng-template #footerTpl>
      <button nz-button nzType="primary" (click)="createNew()">新建</button>
    </ng-template>
  `
})
```

---

## Common Patterns

### Loading State Pattern

```typescript
@Component({
  template: `
    <nz-spin [nzSpinning]="loading()">
      @if (error()) {
        <nz-alert nzType="error" [nzMessage]="error()" nzShowIcon></nz-alert>
      } @else if (items().length === 0 && !loading()) {
        <nz-empty></nz-empty>
      } @else {
        <nz-list [nzDataSource]="items()">...</nz-list>
      }
    </nz-spin>
  `
})
export class ListComponent {
  loading = signal(false);
  error = signal<string | null>(null);
  items = signal<Item[]>([]);
}
```

### Confirmation Pattern

```typescript
@Component({
  template: `
    <button 
      nz-button 
      nzDanger
      nz-popconfirm 
      nzPopconfirmTitle="確定要刪除這個項目嗎？"
      nzOkText="確定"
      nzCancelText="取消"
      nzOkDanger
      (nzOnConfirm)="delete(item)">
      刪除
    </button>
  `
})
```

### Form Validation Pattern

```typescript
@Component({
  template: `
    <nz-form-item>
      <nz-form-label nzRequired>Email</nz-form-label>
      <nz-form-control 
        [nzValidateStatus]="emailControl"
        [nzErrorTip]="emailErrorTpl">
        <input nz-input formControlName="email" />
      </nz-form-control>
      <ng-template #emailErrorTpl let-control>
        @if (control.hasError('required')) {
          請輸入 Email
        } @else if (control.hasError('email')) {
          Email 格式不正確
        }
      </ng-template>
    </nz-form-item>
  `
})
```

---

## Quick Reference

| Task | Component | Example |
|------|-----------|---------|
| Show loading | `nz-spin` | `<nz-spin [nzSpinning]="loading">` |
| Confirmation | `nz-popconfirm` | `nz-popconfirm nzPopconfirmTitle="Sure?"` |
| Toast message | `NzMessageService` | `message.success('Done')` |
| Modal dialog | `nz-modal` | `<nz-modal [(nzVisible)]="visible">` |
| Form layout | `nz-form` | `<form nz-form nzLayout="vertical">` |
| Data table | `nz-table` | `<nz-table [nzData]="items">` |
| Empty state | `nz-empty` | `<nz-empty>` |
| Status indicator | `nz-tag` | `<nz-tag nzColor="success">` |

---

**Version**: ng-zorro-antd ^20.3.0
**Last Updated**: 2025-11-26
