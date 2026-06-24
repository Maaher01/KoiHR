import { formatDate } from '@angular/common';
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
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-mark-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './attendance-mark-dialog.component.html',
})
export class AttendanceMarkDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;

  inTimeForm = this.fb.nonNullable.group({
    note: [''],
  });

  ngOnInit(): void {
    this.inTimeForm.patchValue({
      note: this.data.inTimeForm.note,
    });
  }

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private dialogRef: MatDialogRef<AttendanceMarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  markAttendance() {
    const payload = {
      note: this.inTimeForm.controls['note'].value,
    };

    this.attendanceService.markAttendance(payload).subscribe({
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
