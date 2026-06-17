import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LeaveTypeDialogComponent } from 'src/app/components/leave-type-dialog/leave-type-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { LeaveType } from 'src/app/models/leave-type.interface';
import { LeaveTypeService } from 'src/app/services/leave-type.service';

@Component({
  selector: 'app-leave-type-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './leave-type-list.component.html',
  styleUrl: './leave-type-list.component.scss',
})
export class LeaveTypeListComponent implements OnInit {
  leaveTypes = new MatTableDataSource<LeaveType>([]);
  errorResponse: any;
  isLoading = false;
  displayedColumns: string[] = ['name', 'maxDaysPerYear', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllLeaveTypes();
  }

  ngAfterViewInit() {
    this.leaveTypes.paginator = this.paginator;
  }

  getAllLeaveTypes() {
    this.isLoading = true;
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (res) => {
        this.leaveTypes.data = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(LeaveTypeDialogComponent, {
      width: '450px',
      data: { heading: 'Add Leave Type' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllLeaveTypes();
    });
  }

  openEditDialog(leaveType: LeaveType) {
    const dialogRef = this.dialog.open(LeaveTypeDialogComponent, {
      width: '450px',
      data: { heading: 'Edit Leave Type', leaveType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllLeaveTypes();
    });
  }

  deleteLeaveType(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Leave Type',
        message: 'Are you sure you want to delete this leave type?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.leaveTypeService.deleteLeaveType(id).subscribe({
          next: () => {
            this.getAllLeaveTypes();
          },
          error: () => {
            this.dialog.open(WarningDialogComponent, {
              width: '400px',
              data: {
                title: 'Failed to delete leave type',
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
