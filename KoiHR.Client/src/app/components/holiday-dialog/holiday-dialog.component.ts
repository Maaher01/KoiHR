import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { HolidayService } from 'src/app/services/holiday.service';
import { endDateAfterStartDate } from 'src/app/shared/validators/date.validator';
import { Holiday } from 'src/app/models/holiday.interface';

@Component({
  selector: 'app-holiday-dialog',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './holiday-dialog.component.html',
})
export class HolidayDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;
  isLoading = false;
  isEditMode = !!this.data.holiday;

  holidayForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },
    { validators: endDateAfterStartDate },
  );

  constructor(
    private holidayService: HolidayService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { heading: string; holiday?: Holiday },
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.holiday) {
      this.holidayForm.patchValue({
        name: this.data.holiday.name,
        startDate: this.data.holiday.startDate,
        endDate: this.data.holiday.endDate,
      });
    }
  }

  save() {
    if (this.holidayForm.invalid) return;

    const { name, startDate, endDate } = this.holidayForm.getRawValue();
    const payload = {
      name,
      startDate: formatDate(startDate, 'yyyy-MM-dd', 'en'),
      endDate: formatDate(endDate, 'yyyy-MM-dd', 'en'),
    };

    this.isLoading = true;

    const request = this.isEditMode
      ? this.holidayService.editHoliday(this.data.holiday!.id, payload)
      : this.holidayService.addHoliday(payload);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Error saving holiday. Please try again later.';
        } else if (err.status === 400) {
          this.errorMessage = err.error;
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
