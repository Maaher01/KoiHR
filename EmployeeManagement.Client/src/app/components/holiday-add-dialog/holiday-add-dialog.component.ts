import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { HolidayService } from 'src/app/services/holiday.service';
import { endDateAfterStartDate } from 'src/app/shared/validators/date.validator';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday-add-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './holiday-add-dialog.component.html',
  providers: [provideNativeDateAdapter()],
})
export class HolidayAddDialogComponent {
  heading: string;
  errorMessage: any;
  endDateAfterStartDate = endDateAfterStartDate;
  responseData: any;
  isLoading = false;

  holidayAddForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },
    { validators: this.endDateAfterStartDate },
  );

  constructor(
    private holidayService: HolidayService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HolidayAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  addHoliday() {
    if (this.holidayAddForm.invalid) return;
    const { name, startDate, endDate } = this.holidayAddForm.getRawValue();
    const payload = {
      name,
      startDate: formatDate(startDate, 'yyyy-MM-dd', 'en'),
      endDate: formatDate(endDate, 'yyyy-MM-dd', 'en'),
    };
    this.isLoading = true;

    this.holidayService.addHoliday(payload).subscribe({
      next: (res) => {
        this.responseData = res;
        this.holidayAddForm.reset();
        this.errorMessage = null;
        this.closeDialog();
        window.location.reload();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          // Network error (no connection, server down, CORS, etc.)
          this.errorMessage = 'Error creating holiday. Please try again later.';
        } else if (err.status === 400) {
          // Bad request / model validation
          this.errorMessage = err.error;
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
