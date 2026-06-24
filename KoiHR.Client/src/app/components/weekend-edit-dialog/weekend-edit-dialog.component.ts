import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { WeekendService } from 'src/app/services/weekend.service';

@Component({
  selector: 'app-weekend-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './weekend-edit-dialog.component.html',
  styleUrl: './weekend-edit-dialog.component.scss',
})
export class WeekendEditDialogComponent {
  heading: string;
  errorMessage: any;
  isLoading = false;
  dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  weekendEditForm = this.fb.nonNullable.group({
    weekendDays: this.fb.array(this.dayNames.map(() => this.fb.control(false))),
  });

  get daysArray(): FormArray {
    return this.weekendEditForm.get('weekendDays') as FormArray;
  }

  constructor(
    private weekendService: WeekendService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WeekendEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;

    const currentWeekendDays: number[] = data.weekend.weekendDays ?? [];
    currentWeekendDays.forEach((dayIndex) => {
      this.daysArray.at(dayIndex).setValue(true);
    });
  }

  editWeekend() {
    const selectedDays = this.daysArray.controls
      .map((control, index) => (control.value ? index : null))
      .filter((index) => index !== null) as number[];

    this.isLoading = true;
    this.weekendService
      .setWeekend({
        departmentId: this.data.weekend.departmentId,
        departmentName: this.data.weekend.departmentName,
        days: selectedDays,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close();
        },
        error: (err) => {
          this.errorMessage = err.error?.message;
          this.isLoading = false;
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
