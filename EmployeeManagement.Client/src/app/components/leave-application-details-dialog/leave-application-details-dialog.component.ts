import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';

@Component({
  selector: 'app-leave-application-details-dialog',
  imports: [CommonModule, MaterialModule],
  templateUrl: './leave-application-details-dialog.component.html',
  styleUrl: './leave-application-details-dialog.component.scss',
})
export class LeaveApplicationDetailsDialogComponent {
  heading: string;
  errorMessage: any;
  responseData: any;
  isLoading = false;

  constructor(
    private leaveApplicationService: LeaveApplicationService,
    private dialogRef: MatDialogRef<LeaveApplicationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  getStatus(status: number): {
    label: string;
    bannerClass: string;
    icon: string;
  } {
    switch (status) {
      case 0:
        return {
          label: 'Pending',
          bannerClass: 'banner-pending',
          icon: 'hourglass_empty',
        };
      case 1:
        return {
          label: 'Approved',
          bannerClass: 'banner-approved',
          icon: 'check_circle',
        };
      case 2:
        return {
          label: 'Rejected',
          bannerClass: 'banner-rejected',
          icon: 'cancel',
        };
      default:
        return { label: 'Unknown', bannerClass: '', icon: 'help' };
    }
  }

  approveLeave(id: number) {
    this.leaveApplicationService
      .updateLeaveApplicationStatus(id, { status: 1 })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  rejectLeave(id: number) {
    this.leaveApplicationService
      .updateLeaveApplicationStatus(id, { status: 2 })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
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
