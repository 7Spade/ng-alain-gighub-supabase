/**
 * Form Utilities
 *
 * 表單工具類
 * Form utility class
 *
 * Provides common form validation and manipulation utilities
 * to reduce code duplication across components.
 *
 * @module shared/utils
 */

import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * Form utility methods for validation and manipulation
 *
 * 表單工具方法
 */
export class FormUtils {
  /**
   * Recursively marks all controls in a FormGroup as touched
   * Useful for triggering validation messages on submit
   *
   * 遞迴標記 FormGroup 中所有控件為 touched
   * 用於在提交時觸發驗證訊息
   *
   * @param formGroup - The FormGroup to mark as touched
   *
   * @example
   * ```typescript
   * if (this.form.invalid) {
   *   FormUtils.markFormGroupTouched(this.form);
   *   return;
   * }
   * ```
   */
  static markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  /**
   * Validates a form and marks all invalid controls as touched
   * Returns true if form is valid, false otherwise
   *
   * 驗證表單並標記所有無效控件為 touched
   * 如果表單有效則返回 true，否則返回 false
   *
   * @param formGroup - The FormGroup to validate
   * @returns true if form is valid, false otherwise
   *
   * @example
   * ```typescript
   * async onSubmit() {
   *   if (!FormUtils.validateForm(this.form)) {
   *     return;
   *   }
   *   // Proceed with submission
   * }
   * ```
   */
  static validateForm(formGroup: FormGroup): boolean {
    if (formGroup.valid) {
      return true;
    }

    this.markFormGroupTouched(formGroup);
    return false;
  }

  /**
   * Marks all controls in a FormGroup as dirty and updates validity
   * Useful for ng-zorro-antd form validation display
   *
   * 標記 FormGroup 中所有控件為 dirty 並更新驗證狀態
   * 適用於 ng-zorro-antd 表單驗證顯示
   *
   * @param formGroup - The FormGroup to mark as dirty
   *
   * @example
   * ```typescript
   * if (this.form.invalid) {
   *   FormUtils.markFormGroupDirty(this.form);
   *   return;
   * }
   * ```
   */
  static markFormGroupDirty(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }

      if (control instanceof FormGroup) {
        this.markFormGroupDirty(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupDirty(arrayControl);
          } else if (arrayControl.invalid) {
            arrayControl.markAsDirty();
            arrayControl.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    });
  }

  /**
   * Validates a form using ng-zorro-antd style (mark as dirty)
   * Returns true if form is valid, false otherwise
   *
   * 使用 ng-zorro-antd 風格驗證表單（標記為 dirty）
   * 如果表單有效則返回 true，否則返回 false
   *
   * @param formGroup - The FormGroup to validate
   * @returns true if form is valid, false otherwise
   */
  static validateFormNzStyle(formGroup: FormGroup): boolean {
    if (formGroup.valid) {
      return true;
    }

    this.markFormGroupDirty(formGroup);
    return false;
  }

  /**
   * Resets a form to its initial state
   * Clears all values and validation states
   *
   * 重置表單到初始狀態
   * 清除所有值和驗證狀態
   *
   * @param formGroup - The FormGroup to reset
   */
  static resetForm(formGroup: FormGroup): void {
    formGroup.reset();
    this.clearValidationState(formGroup);
  }

  /**
   * Clears validation state without resetting values
   * Removes touched, dirty, and error states
   *
   * 清除驗證狀態但不重置值
   * 移除 touched、dirty 和錯誤狀態
   *
   * @param formGroup - The FormGroup to clear validation state
   */
  static clearValidationState(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);

      if (control instanceof FormGroup) {
        this.clearValidationState(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.clearValidationState(arrayControl);
          } else {
            arrayControl.markAsUntouched();
            arrayControl.markAsPristine();
            arrayControl.setErrors(null);
          }
        });
      }
    });
  }

  /**
   * Gets all errors from a FormGroup as a flat object
   * Useful for debugging and error display
   *
   * 從 FormGroup 獲取所有錯誤作為扁平物件
   * 用於除錯和錯誤顯示
   *
   * @param formGroup - The FormGroup to get errors from
   * @returns Object containing all errors with control names as keys
   */
  static getAllErrors(formGroup: FormGroup): Record<string, any> {
    const errors: Record<string, any> = {};

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control?.errors) {
        errors[key] = control.errors;
      }

      if (control instanceof FormGroup) {
        const nestedErrors = this.getAllErrors(control);
        Object.keys(nestedErrors).forEach(nestedKey => {
          errors[`${key}.${nestedKey}`] = nestedErrors[nestedKey];
        });
      }
    });

    return errors;
  }

  /**
   * Checks if a specific control has an error and is touched
   * Useful for conditional error display
   *
   * 檢查特定控件是否有錯誤且已被觸碰
   * 用於條件錯誤顯示
   *
   * @param control - The AbstractControl to check
   * @param errorType - Optional specific error type to check
   * @returns true if control has error and is touched
   */
  static hasError(control: AbstractControl | null, errorType?: string): boolean {
    if (!control) {
      return false;
    }

    const hasError = errorType ? control.hasError(errorType) : control.invalid;
    return hasError && (control.dirty || control.touched);
  }

  /**
   * Trims string values in form before submission
   * Removes leading and trailing whitespace
   *
   * 在提交前修剪表單中的字串值
   * 移除前後空白
   *
   * @param formValue - The form value object
   * @returns Trimmed form value object
   */
  static trimFormValues<T extends Record<string, any>>(formValue: T): T {
    const trimmed: any = {};

    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      
      if (typeof value === 'string') {
        trimmed[key] = value.trim() || undefined;
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        trimmed[key] = this.trimFormValues(value);
      } else {
        trimmed[key] = value;
      }
    });

    return trimmed as T;
  }
}
