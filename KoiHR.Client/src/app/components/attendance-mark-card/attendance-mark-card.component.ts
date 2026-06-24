import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceMarkDialogComponent } from '../attendance-mark-dialog/attendance-mark-dialog.component';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Attendance } from 'src/app/models/attendance.interface';
import { displayTime } from 'src/app/shared/date-time.format';
import { OutTimeSubmitDialogComponent } from '../out-time-submit-dialog/out-time-submit-dialog.component';

@Component({
  selector: 'app-attendance-mark-card',
  imports: [MaterialModule],
  templateUrl: './attendance-mark-card.component.html',
  styleUrl: './attendance-mark-card.component.scss',
})
export class AttendanceMarkCardComponent implements OnInit {
  todayAttendance: Attendance | null;
  displayTime = displayTime;

  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getTodayAttendanceByEmployee();
  }

  markAttendance() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'In Time',
      date: new Date(),
    };

    const dialogRef = this.dialog.open(
      AttendanceMarkDialogComponent,
      dialogConf,
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getTodayAttendanceByEmployee();
    });
  }

  updateAttendance(todayAttendance: Attendance) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Out Time',
      attendance: todayAttendance,
    };

    const dialogRef = this.dialog.open(
      OutTimeSubmitDialogComponent,
      dialogConf,
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getTodayAttendanceByEmployee();
    });
  }

  getTodayAttendanceByEmployee() {
    this.attendanceService.getTodayAttendanceByEmployee().subscribe({
      next: (res) => {
        this.todayAttendance = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
