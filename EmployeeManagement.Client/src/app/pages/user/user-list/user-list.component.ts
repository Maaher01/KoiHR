import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { UserEditDialogComponent } from 'src/app/components/user-edit-dialog/user-edit-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users = new MatTableDataSource<User>([]);
  currentUser: DecodedToken | null = null;
  errorResponse: any;
  displayedColumns: string[] = ['email', 'role', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllUsers();

    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users.data = res;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  editUser(user: User) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit User',
      user: user,
    };

    const dialogRef = this.dialog.open(UserEditDialogComponent, dialogConf);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllUsers();
    });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.getAllUsers();
          },
          error: (err) => {
            if (err) {
              this.dialog.open(WarningDialogComponent, {
                width: '400px',
                data: {
                  title: 'Failed to delete employee',
                  message:
                    'There was an unknown error. Please try again later.',
                },
              });
            }
          },
        });
      }
    });
  }
}
