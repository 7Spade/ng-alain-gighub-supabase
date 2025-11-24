/**
 * Form Utilities Tests
 *
 * 表單工具類測試
 * Form utility class tests
 *
 * @module shared/utils
 */

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FormUtils } from './form.utils';

describe('FormUtils', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('validateForm', () => {
    it('should return true for valid form', () => {
      const form = fb.group({
        name: ['John', Validators.required],
        email: ['john@example.com', [Validators.required, Validators.email]]
      });

      expect(FormUtils.validateForm(form)).toBe(true);
    });

    it('should return false and mark controls as touched for invalid form', () => {
      const form = fb.group({
        name: ['', Validators.required],
        email: ['invalid-email', Validators.email]
      });

      expect(FormUtils.validateForm(form)).toBe(false);
      expect(form.get('name')?.touched).toBe(true);
      expect(form.get('email')?.touched).toBe(true);
    });
  });

  describe('markFormGroupTouched', () => {
    it('should mark all controls as touched', () => {
      const form = fb.group({
        name: [''],
        email: [''],
        address: fb.group({
          street: [''],
          city: ['']
        })
      });

      FormUtils.markFormGroupTouched(form);

      expect(form.get('name')?.touched).toBe(true);
      expect(form.get('email')?.touched).toBe(true);
      expect(form.get('address.street')?.touched).toBe(true);
      expect(form.get('address.city')?.touched).toBe(true);
    });

    it('should handle FormArray controls', () => {
      const form = fb.group({
        items: fb.array([
          fb.control('item1'),
          fb.control('item2')
        ])
      });

      FormUtils.markFormGroupTouched(form);

      const items = form.get('items') as FormArray;
      expect(items.at(0).touched).toBe(true);
      expect(items.at(1).touched).toBe(true);
    });
  });

  describe('validateFormNzStyle', () => {
    it('should return true for valid form', () => {
      const form = fb.group({
        name: ['John', Validators.required]
      });

      expect(FormUtils.validateFormNzStyle(form)).toBe(true);
    });

    it('should mark invalid controls as dirty and update validity', () => {
      const form = fb.group({
        name: ['', Validators.required],
        email: ['invalid', Validators.email]
      });

      expect(FormUtils.validateFormNzStyle(form)).toBe(false);
      expect(form.get('name')?.dirty).toBe(true);
      expect(form.get('email')?.dirty).toBe(true);
    });
  });

  describe('markFormGroupDirty', () => {
    it('should mark all invalid controls as dirty', () => {
      const form = fb.group({
        name: ['', Validators.required],
        email: ['valid@email.com', Validators.email],
        phone: ['', Validators.required]
      });

      FormUtils.markFormGroupDirty(form);

      expect(form.get('name')?.dirty).toBe(true);
      expect(form.get('email')?.dirty).toBe(false); // valid, should not be marked dirty
      expect(form.get('phone')?.dirty).toBe(true);
    });

    it('should handle nested FormGroups', () => {
      const form = fb.group({
        name: ['', Validators.required],
        address: fb.group({
          street: ['', Validators.required],
          city: ['New York']
        })
      });

      FormUtils.markFormGroupDirty(form);

      expect(form.get('name')?.dirty).toBe(true);
      expect(form.get('address.street')?.dirty).toBe(true);
      expect(form.get('address.city')?.dirty).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should reset form values and clear validation state', () => {
      const form = fb.group({
        name: ['John', Validators.required],
        email: ['john@example.com']
      });

      form.get('name')?.markAsTouched();
      form.get('name')?.markAsDirty();

      FormUtils.resetForm(form);

      expect(form.get('name')?.value).toBeNull();
      expect(form.get('name')?.touched).toBe(false);
      expect(form.get('name')?.dirty).toBe(false);
    });
  });

  describe('clearValidationState', () => {
    it('should clear validation state without resetting values', () => {
      const form = fb.group({
        name: ['John', Validators.required]
      });

      form.get('name')?.markAsTouched();
      form.get('name')?.markAsDirty();
      form.get('name')?.setErrors({ custom: true });

      FormUtils.clearValidationState(form);

      expect(form.get('name')?.value).toBe('John');
      expect(form.get('name')?.touched).toBe(false);
      expect(form.get('name')?.dirty).toBe(false);
      expect(form.get('name')?.errors).toBeNull();
    });
  });

  describe('getAllErrors', () => {
    it('should return all errors from form', () => {
      const form = fb.group({
        name: ['', Validators.required],
        email: ['invalid', Validators.email],
        address: fb.group({
          street: ['', Validators.required]
        })
      });

      const errors = FormUtils.getAllErrors(form);

      expect(errors['name']).toEqual({ required: true });
      expect(errors['email']).toEqual({ email: true });
      expect(errors['address.street']).toEqual({ required: true });
    });

    it('should return empty object for valid form', () => {
      const form = fb.group({
        name: ['John', Validators.required],
        email: ['john@example.com', Validators.email]
      });

      const errors = FormUtils.getAllErrors(form);

      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('hasError', () => {
    it('should return true when control has error and is touched', () => {
      const control = fb.control('', Validators.required);
      control.markAsTouched();

      expect(FormUtils.hasError(control)).toBe(true);
    });

    it('should return true when control has error and is dirty', () => {
      const control = fb.control('', Validators.required);
      control.markAsDirty();

      expect(FormUtils.hasError(control)).toBe(true);
    });

    it('should return false when control has error but is pristine and untouched', () => {
      const control = fb.control('', Validators.required);

      expect(FormUtils.hasError(control)).toBe(false);
    });

    it('should return false for null control', () => {
      expect(FormUtils.hasError(null)).toBe(false);
    });

    it('should check specific error type', () => {
      const control = fb.control('invalid-email', Validators.email);
      control.markAsTouched();

      expect(FormUtils.hasError(control, 'email')).toBe(true);
      expect(FormUtils.hasError(control, 'required')).toBe(false);
    });
  });

  describe('trimFormValues', () => {
    it('should trim string values', () => {
      const formValue = {
        name: '  John  ',
        email: '  john@example.com  ',
        age: 25
      };

      const trimmed = FormUtils.trimFormValues(formValue);

      expect(trimmed.name).toBe('John');
      expect(trimmed.email).toBe('john@example.com');
      expect(trimmed.age).toBe(25);
    });

    it('should convert empty trimmed strings to undefined', () => {
      const formValue = {
        name: '   ',
        description: ''
      };

      const trimmed = FormUtils.trimFormValues(formValue);

      expect(trimmed.name).toBeUndefined();
      expect(trimmed.description).toBeUndefined();
    });

    it('should handle nested objects', () => {
      const formValue = {
        user: {
          name: '  John  ',
          email: '  john@example.com  '
        },
        age: 25
      };

      const trimmed = FormUtils.trimFormValues(formValue);

      expect(trimmed.user.name).toBe('John');
      expect(trimmed.user.email).toBe('john@example.com');
      expect(trimmed.age).toBe(25);
    });

    it('should preserve non-string values', () => {
      const formValue = {
        name: 'John',
        age: 25,
        active: true,
        items: [1, 2, 3],
        metadata: null
      };

      const trimmed = FormUtils.trimFormValues(formValue);

      expect(trimmed.age).toBe(25);
      expect(trimmed.active).toBe(true);
      expect(trimmed.items).toEqual([1, 2, 3]);
      expect(trimmed.metadata).toBeNull();
    });
  });
});
