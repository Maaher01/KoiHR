import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceSettingAdd } from 'src/app/models/attendance-setting-add.interface';
import { Department } from 'src/app/models/department.interface';
import { AttendanceSettingService } from 'src/app/services/attendance-setting.service';
import { DepartmentService } from 'src/app/services/department.service';
import { formatTime } from 'src/app/shared/date-time.format';

@Component({
  selector: 'app-attendance-settings-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './attendance-settings-add.component.html',
  styleUrl: './attendance-settings-add.component.scss',
})
export class AttendanceSettingsAddComponent implements OnInit {
  responseData: any;
  errorMessage: any;
  departments: Department[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private attendanceSettingService: AttendanceSettingService,
    private departmentService: DepartmentService,
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
  }

  attendanceSettingAddForm = this.fb.nonNullable.group({
    inTime: [null as Date | null, [Validators.required]],
    outTime: [null as Date | null, [Validators.required]],
    gracePeriodMinutes: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
  });

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  addAttendanceSetting() {
    const { inTime, outTime, gracePeriodMinutes, departmentId } =
      this.attendanceSettingAddForm.value;

    const formValue: AttendanceSettingAdd = {
      inTime: formatTime(inTime ?? null),
      outTime: formatTime(outTime ?? null),
      gracePeriodMinutes: gracePeriodMinutes ? Number(gracePeriodMinutes) : 0,
      departmentId: departmentId ? Number(departmentId) : 0,
    };

    this.attendanceSettingService.addAttendanceSetting(formValue).subscribe({
      next: (result) => {
        this.responseData = result;
        this.attendanceSettingAddForm.reset();
        this.errorMessage = null;
        this.router.navigate(['attendance/settings']);
      },
      error: (err) => {
        if (err.status === 0) {
          // Network error (no connection, server down, CORS, etc.)
          this.errorMessage = 'Error creating setting. Please try again later.';
        } else if (err.status === 400) {
          // Bad request / model validation
          this.errorMessage = err.error;
        }
      },
    });
  }
}
