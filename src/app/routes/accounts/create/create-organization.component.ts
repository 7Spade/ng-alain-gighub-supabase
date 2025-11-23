import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 創建組織組件
 * 
 * 允許用戶創建新的組織
 */
@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ],
  template: `
    <page-header [title]="'創建組織'" [autoBreadcrumb]="false">
      <ng-template #action>
        <button nz-button (click)="cancel()">取消</button>
        <button nz-button nzType="primary" (click)="submit()" [nzLoading]="loading" [disabled]="!form.valid">
          創建
        </button>
      </ng-template>
    </page-header>

    <nz-card>
      <form nz-form [formGroup]="form" (ngSubmit)="submit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>組織名稱</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請輸入組織名稱（2-100個字符）">
            <input nz-input formControlName="name" placeholder="請輸入組織名稱" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">組織描述</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <textarea nz-input formControlName="description" placeholder="請輸入組織描述" [nzAutosize]="{ minRows: 3, maxRows: 6 }"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>組織類型</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請選擇組織類型">
            <nz-select formControlName="type" nzPlaceHolder="請選擇組織類型">
              <nz-option nzValue="company" nzLabel="公司"></nz-option>
              <nz-option nzValue="team" nzLabel="團隊"></nz-option>
              <nz-option nzValue="community" nzLabel="社群"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class CreateOrganizationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  loading = false;
  
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    type: ['company', [Validators.required]]
  });

  submit(): void {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    
    // TODO: 實現組織創建邏輯（Supabase）
    console.log('Creating organization:', this.form.value);
    
    setTimeout(() => {
      this.loading = false;
      this.message.success('組織創建功能開發中，請稍候...');
      // this.router.navigate(['/accounts/org']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/accounts/org']);
  }
}
