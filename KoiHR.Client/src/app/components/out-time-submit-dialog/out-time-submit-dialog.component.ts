import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-out-time-submit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './out-time-submit-dialog.component.html',
})
export class OutTimeSubmitDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;

  outTimeForm = this.fb.nonNullable.group({
    note: [''],
  });

  ngOnInit(): void {
    this.outTimeForm.patchValue({
      note: this.data.attendance.note,
    });
  }

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private dialogRef: MatDialogRef<OutTimeSubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  updateAttendance() {
    const payload = {
      note: this.outTimeForm.controls['note'].value!,
    };

    this.attendanceService.updateEmployeeAttendance(payload).subscribe({
      next: () => {
        this.closeDialog();
        window.location.reload();
      },
      error: (err) => {
        if (err.status === 400 || err.status === 401) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Error updating. Please try again later.';
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
