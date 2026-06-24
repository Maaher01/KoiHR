import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-details-dialog',
  imports: [CommonModule, MaterialModule],
  templateUrl: './attendance-details-dialog.component.html',
  styleUrl: './attendance-details-dialog.component.scss',
})
export class AttendanceDetailsDialogComponent {
  heading: string;
  errorMessage: any;

  constructor(
    private attendanceService: AttendanceService,
    private dialogRef: MatDialogRef<AttendanceDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  getAttendanceDetails(id: number) {
    this.attendanceService.getAttendanceDetails(id).subscribe({
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

  getStatus(status: number): { label: string; class: string } {
    switch (status) {
      case 0:
        return { label: 'Present', class: 'chip-present' };
      case 1:
        return { label: 'Late', class: 'chip-late' };
      case 2:
        return { label: 'Absent', class: 'chip-absent' };
      case 3:
        return { label: 'Weekend', class: 'chip-weekend' };
      case 4:
        return { label: 'Holiday', class: 'chip-holiday' };
      case 5:
        return { label: 'Leave', class: 'chip-leave' };
      default:
        return { label: 'Unknown', class: '' };
    }
  }
}
