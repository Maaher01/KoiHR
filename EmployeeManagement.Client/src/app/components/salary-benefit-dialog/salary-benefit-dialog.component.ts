import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SalaryBenefitAdd } from 'src/app/models/salary-benefit-add.interface';
import { SalaryBenefit } from 'src/app/models/salary-benefit.interface';
import { SalaryBenefitService } from 'src/app/services/salary-benefit.service';

@Component({
  selector: 'app-salary-benefit-form',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './salary-benefit-dialog.component.html',
})
export class SalaryBenefitDialogComponent {
  errorMessage: any;
  isEditMode = !!this.data?.benefit;

  salaryBenefitForm = this.fb.nonNullable.group({
    title: [this.data?.benefit?.title ?? '', [Validators.required]],
    isAddition: [this.data?.benefit?.isAddition ?? true, [Validators.required]],
    amount: [
      this.data?.benefit?.amount ?? 0,
      [Validators.required, Validators.min(0)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private salaryBenefitService: SalaryBenefitService,
    private dialogRef: MatDialogRef<SalaryBenefitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { benefit?: SalaryBenefit },
  ) {}

  save() {
    const formValue: SalaryBenefitAdd = this.salaryBenefitForm.getRawValue();

    const request = this.isEditMode
      ? this.salaryBenefitService.editSalaryBenefit(
          this.data.benefit!.id,
          formValue,
        )
      : this.salaryBenefitService.addSalaryBenefit(formValue);

    request.subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage =
          err.status === 0
            ? 'Error saving benefit. Please try again later.'
            : err.error;
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
