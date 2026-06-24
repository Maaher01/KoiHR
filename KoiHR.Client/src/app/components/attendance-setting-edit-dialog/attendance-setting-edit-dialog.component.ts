import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceSettingService } from 'src/app/services/attendance-setting.service';
import { formatTime, parseTime } from 'src/app/shared/date-time.format';

@Component({
  selector: 'app-attendance-setting-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './attendance-setting-edit-dialog.component.html',
})
export class AttendanceSettingEditDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;

  attendanceSettingEditForm = this.fb.nonNullable.group({
    inTime: [null as Date | null, [Validators.required]],
    outTime: [null as Date | null, [Validators.required]],
    gracePeriodMinutes: [0, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private attendanceSettingService: AttendanceSettingService,
    private dialogRef: MatDialogRef<AttendanceSettingEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    this.attendanceSettingEditForm.patchValue({
      inTime: parseTime(this.data.attendanceSetting.inTime),
      outTime: parseTime(this.data.attendanceSetting.outTime),
      gracePeriodMinutes: this.data.attendanceSetting.gracePeriodMinutes,
    });
  }

  editAttendanceSetting() {
    const payload = {
      inTime: formatTime(
        this.attendanceSettingEditForm.controls['inTime'].value!,
      ),
      outTime: formatTime(
        this.attendanceSettingEditForm.controls['outTime'].value!,
      ),
      gracePeriodMinutes:
        Number(
          this.attendanceSettingEditForm.controls['gracePeriodMinutes'].value!,
        ) ?? 0,
      departmentId: this.data.attendanceSetting.departmentId,
    };

    this.attendanceSettingService
      .editAttendanceSetting(this.data.attendanceSetting.id, payload)
      .subscribe({
        next: () => {
          this.closeDialog();
          window.location.reload();
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
