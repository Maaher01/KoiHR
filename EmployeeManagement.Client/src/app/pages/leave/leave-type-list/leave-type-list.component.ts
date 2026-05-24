import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LeaveTypeAddDialogComponent } from 'src/app/components/leave-type-add-dialog/leave-type-add-dialog.component';
import { LeaveTypeEditDialogComponent } from 'src/app/components/leave-type-edit-dialog/leave-type-edit-dialog.component';
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

  addLeaveType() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Add Leave Type',
    };

    const dialogRef = this.dialog.open(LeaveTypeAddDialogComponent, dialogConf);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllLeaveTypes();
    });
  }

  editLeaveType(leaveType: LeaveType) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Leave Type',
      leaveType: leaveType,
    };

    const dialogRef = this.dialog.open(
      LeaveTypeEditDialogComponent,
      dialogConf,
    );
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
