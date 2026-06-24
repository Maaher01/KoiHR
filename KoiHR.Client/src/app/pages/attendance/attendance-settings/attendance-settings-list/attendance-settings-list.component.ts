import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AttendanceSettingEditDialogComponent } from 'src/app/components/attendance-setting-edit-dialog/attendance-setting-edit-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { AttendanceSetting } from 'src/app/models/attendance-setting.interface';
import { AttendanceSettingService } from 'src/app/services/attendance-setting.service';

@Component({
  selector: 'app-attendance-settings-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './attendance-settings-list.component.html',
  styleUrl: './attendance-settings-list.component.scss',
})
export class AttendanceSettingsListComponent implements OnInit {
  settings = new MatTableDataSource<AttendanceSetting>([]);
  errorResponse: any;
  displayedColumns: string[] = [
    'departmentName',
    'inTime',
    'outTime',
    'gracePeriodMinutes',
    'actions',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private attendanceSettingService: AttendanceSettingService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllSettings();
  }

  ngAfterViewInit() {
    this.settings.paginator = this.paginator;
  }

  getAllSettings() {
    this.attendanceSettingService.getAttendanceSettings().subscribe({
      next: (res) => {
        this.settings.data = res;
        this.dataSource = this.settings;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  editAttendanceSetting(attendanceSetting: AttendanceSetting) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Attendance Setting',
      attendanceSetting: attendanceSetting,
    };

    this.dialog.open(AttendanceSettingEditDialogComponent, dialogConf);
  }
}
