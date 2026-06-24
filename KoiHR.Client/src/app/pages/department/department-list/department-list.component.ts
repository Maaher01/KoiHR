import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Department } from 'src/app/models/department.interface';
import { DepartmentService } from 'src/app/services/department.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { DepartmentEditDialogComponent } from 'src/app/components/department-edit-dialog/department-edit-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-department-list',
  imports: [MaterialModule, RouterModule],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit {
  departments = new MatTableDataSource<Department>([]);
  errorResponse: any;
  displayedColumns: string[] = ['name', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
  }

  ngAfterViewInit() {
    this.departments.paginator = this.paginator;
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments.data = res;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  editDepartment(department: Department) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Department',
      department: department,
    };

    this.dialog.open(DepartmentEditDialogComponent, dialogConf);
  }

  deleteDepartment(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Department',
        message: 'Are you sure you want to delete this department?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            this.getAllDepartments();
          },
          error: (err) => {
            if (err.status === 400) {
              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete department',
                  message:
                    'This department has employees. Delete all its employees first to delete the department',
                },
              });
            } else {
              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete department',
                  message:
                    'There was an error deleting the department. Please try again later',
                },
              });
            }
          },
        });
      }
    });
  }
}
