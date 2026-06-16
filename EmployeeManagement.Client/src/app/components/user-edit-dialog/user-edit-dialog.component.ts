import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { Role } from 'src/app/models/role.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './user-edit-dialog.component.html',
})
export class UserEditDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;
  roles: Role[];
  currentUser: DecodedToken | null = null;

  userEditForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: [''],
    role: ['', [Validators.required]],
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    this.getAllRoles();

    this.userEditForm.patchValue({
      email: this.data.user.email,
      newPassword: this.data.user.newPassword,
      role: this.data.user.role,
    });

    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );

    if (this.currentUser?.role === 'HR') {
      this.userEditForm.patchValue({ role: 'Employee' });
    }
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  editUser() {
    const payload = {
      email: this.userEditForm.controls['email'].value!,
      newPassword: this.userEditForm.controls['newPassword'].value!,
      role: this.userEditForm.controls['role'].value!,
    };

    this.userService.editUser(this.data.user.id, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage =
          err.error ?? 'Failed to update user. Please try again.';
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
