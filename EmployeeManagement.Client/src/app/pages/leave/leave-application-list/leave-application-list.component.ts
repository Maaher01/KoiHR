import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveApplicationDetailsDialogComponent } from 'src/app/components/leave-application-details-dialog/leave-application-details-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { LeaveApplication } from 'src/app/models/leave-application.interface';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';

@Component({
  selector: 'app-leave-application-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './leave-application-list.component.html',
  styleUrl: './leave-application-list.component.scss',
})
export class LeaveApplicationListComponent implements OnInit {
  leaveApplications = new MatTableDataSource<LeaveApplication>([]);
  errorResponse: any;
  isLoading = false;
  displayedColumns: string[] = [
    'employeeName',
    'leaveTypeName',
    'startDate',
    'endDate',
    'duration',
    'status',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private leaveApplicationService: LeaveApplicationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllLeaveApplications();
  }

  ngAfterViewInit() {
    this.leaveApplications.paginator = this.paginator;
  }

  getAllLeaveApplications() {
    this.isLoading = true;
    this.leaveApplicationService.getAllLeaveApplications().subscribe({
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

  approveLeave(id: number) {
    this.leaveApplicationService
      .updateLeaveApplicationStatus(id, { status: 1 })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.getAllLeaveApplications();
        },
        error: (err) => {
          this.errorResponse = err.message;
        },
      });
  }

  rejectLeave(id: number) {
    this.leaveApplicationService
      .updateLeaveApplicationStatus(id, { status: 2 })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.getAllLeaveApplications();
        },
        error: (err) => {
          this.errorResponse = err.message;
        },
      });
  }

  viewDetails(application: LeaveApplication) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Update Application Status',
      application: application,
    };

    const dialogRef = this.dialog.open(
      LeaveApplicationDetailsDialogComponent,
      dialogConf,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllLeaveApplications();
    });
  }
}
