import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    if (!file) return null;
    return allowedTypes.includes(file.type) ? null : { invalidFileType: true };
  };
}

export function fileSizeValidator(maxSizeMB: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    if (!file) return null;
    return file.size > maxSizeMB * 1024 * 1024 ? { fileTooLarge: true } : null;
  };
}
