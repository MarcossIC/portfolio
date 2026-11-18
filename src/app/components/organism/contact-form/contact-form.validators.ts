import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** `required` that treats whitespace-only values as empty. */
export const notBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  String(control.value ?? '').trim().length === 0 ? { required: true } : null;

/** `minLength` measured on the trimmed value; skips empty (notBlank owns that case). */
export const trimmedMinLength =
  (min: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const length = String(control.value ?? '').trim().length;
    return length > 0 && length < min
      ? { minlength: { requiredLength: min, actualLength: length } }
      : null;
  };

/** Stricter than Validators.email: requires a dotted domain (`a@b` is rejected). */
export const strictEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return value.length === 0 || EMAIL_PATTERN.test(value) ? null : { email: true };
};
