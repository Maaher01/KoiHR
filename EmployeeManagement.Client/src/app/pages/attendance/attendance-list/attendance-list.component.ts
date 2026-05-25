import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceDetailsDialogComponent } from 'src/app/components/attendance-details-dialog/attendance-details-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { Attendance } from 'src/app/models/attendance.interface';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
})
export class AttendanceListComponent implements OnInit {
  attendance = new MatTableDataSource<Attendance>([]);
  dateControl = new FormControl(new Date());
  errorResponse: any;
  isLoading: boolean = false;
  displayedColumns: string[] = [
    'employeeName',
    'date',
    'inTime',
    'outTime',
    'status',
    'actions',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const dateParam = params['date'];
      const date = dateParam ? new Date(dateParam) : new Date();

      this.dateControl.setValue(date, { emitEvent: false });
      this.getAttendanceByDate(date);
    });

    this.dateControl.valueChanges.subscribe((date) => {
      if (date) {
        const dateStr = formatDate(date, 'yyyy-MM-dd', 'en');
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { date: dateStr },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  ngAfterViewInit() {
    this.attendance.paginator = this.paginator;
  }

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  viewAttendanceDetails(attendance: Attendance) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Attendance Details',
      attendance: attendance,
    };

    const dialogRef = this.dialog.open(
      AttendanceDetailsDialogComponent,
      dialogConf,
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAttendanceByDate(this.dateControl.value!);
    });
  }

  getAttendanceByDate(date: Date) {
    this.isLoading = true;
    const dateStr = formatDate(date, 'yyyy-MM-dd', 'en');
    this.attendanceService.getAttendanceByDate(dateStr).subscribe({
      next: (res) => {
        this.attendance.data = res;
        this.dataSource = this.attendance;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
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
