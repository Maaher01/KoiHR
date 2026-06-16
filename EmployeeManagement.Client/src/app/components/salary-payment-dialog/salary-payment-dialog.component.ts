import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { SalaryEntry } from 'src/app/models/salary-entry';
import { SalaryPaymentAdd } from 'src/app/models/salary-payment-add.interface';
import { SalaryPaymentService } from 'src/app/services/salary-payment.service';

@Component({
  selector: 'app-salary-payment-dialog',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './salary-payment-dialog.component.html',
  styleUrl: './salary-payment-dialog.component.scss',
})
export class SalaryPaymentDialogComponent {
  isSaving = false;
  errorMessage: any;
  today = new Date();

  paymentForm = this.fb.nonNullable.group({
    paymentMethod: [0, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private salaryPaymentService: SalaryPaymentService,
    private dialogRef: MatDialogRef<SalaryPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { heading: string; payment: SalaryEntry },
  ) {}

  confirmPayment() {
    if (this.paymentForm.invalid) return;

    this.isSaving = true;
    const { paymentMethod } = this.paymentForm.getRawValue();

    const payload: SalaryPaymentAdd = {
      payDate: this.today.toISOString(),
      paymentMethod,
    };

    this.salaryPaymentService
      .createSalaryPayment(this.data.payment.entryId, payload)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message ?? 'Failed to process payment.';
          this.isSaving = false;
        },
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
