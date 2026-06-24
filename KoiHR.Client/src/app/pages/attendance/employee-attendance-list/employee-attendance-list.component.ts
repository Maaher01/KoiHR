import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { Attendance } from 'src/app/models/attendance.interface';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-employee-attendance-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './employee-attendance-list.component.html',
  styleUrl: './employee-attendance-list.component.scss',
})
export class EmployeeAttendanceListComponent implements OnInit {
  myAttendance = new MatTableDataSource<Attendance>([]);
  errorResponse: any;
  isLoading: boolean = false;
  displayedColumns: string[] = ['date', 'inTime', 'outTime', 'note', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.getAllAttendance();
  }

  ngAfterViewInit() {
    this.myAttendance.paginator = this.paginator;
  }

  getAllAttendance() {
    this.isLoading = true;

    this.attendanceService.getEmployeeAttendance().subscribe({
      next: (res) => {
        this.myAttendance.data = res;
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
