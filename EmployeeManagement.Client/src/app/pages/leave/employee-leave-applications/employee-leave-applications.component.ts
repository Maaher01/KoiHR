import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LeaveApplicationAddDialogComponent } from 'src/app/components/leave-application-add-dialog/leave-application-add-dialog.component';
import { LeaveApplicationDetailsDialogComponent } from 'src/app/components/leave-application-details-dialog/leave-application-details-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { LeaveApplication } from 'src/app/models/leave-application.interface';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';

@Component({
  selector: 'app-employee-leave-applications',
  imports: [CommonModule, MaterialModule],
  templateUrl: './employee-leave-applications.component.html',
  styleUrl: './employee-leave-applications.component.scss',
})
export class EmployeeLeaveApplicationsComponent implements OnInit {
  leaveApplications = new MatTableDataSource<LeaveApplication>([]);
  errorResponse: any;
  isLoading = false;
  displayedColumns: string[] = [
    'leaveTypeName',
    'startDate',
    'endDate',
    'duration',
    'status',
    'notes',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private leaveApplicationService: LeaveApplicationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getMyLeaveApplications();
  }

  ngAfterViewInit() {
    this.leaveApplications.paginator = this.paginator;
  }

  getMyLeaveApplications() {
    this.isLoading = true;
    this.leaveApplicationService.getLeaveApplicationsByEmployee().subscribe({
      next: (res) => {
        this.leaveApplications.data = res;
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
        return { label: 'Pending', class: 'chip-pending' };
      case 1:
        return { label: 'Approved', class: 'chip-approved' };
      case 2:
        return { label: 'Rejected', class: 'chip-rejected' };
      default:
        return { label: 'Unknown', class: '' };
    }
  }

  addLeaveApplication() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Add Leave Application',
    };

    const dialogRef = this.dialog.open(
      LeaveApplicationAddDialogComponent,
      dialogConf,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getMyLeaveApplications();
    });
  }

  viewDetails(application: LeaveApplication) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Leave Application Details',
      application: application,
      readonly: true,
    };

    const dialogRef = this.dialog.open(
      LeaveApplicationDetailsDialogComponent,
      dialogConf,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getMyLeaveApplications();
    });
  }

  deleteLeaveType(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Leave Application',
        message: 'Are you sure you want to delete this application?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.leaveApplicationService.deleteLeaveApplication(id).subscribe({
          next: () => {
            this.getMyLeaveApplications();
          },
          error: () => {
            this.dialog.open(WarningDialogComponent, {
              width: '400px',
              data: {
                title: 'Failed to delete department',
                message:
                  'There was an error deleting the leave type. Please try again later',
              },
            });
          },
        });
      }
    });
  }
}
