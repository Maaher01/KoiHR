import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role.interface';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { UserAdd } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DecodedToken } from 'src/app/models/decoded-token.interface';

@Component({
  selector: 'app-user-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit {
  responseData: any;
  errorMessage: any;
  roles: Role[];
  employees: Employee[];
  currentUser: DecodedToken | null = null;

  userAddForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
    employeeId: [''],
  });

  ngOnInit(): void {
    this.getAllRoles();
    this.getAllEmployees();

    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );

    if (this.currentUser?.role === 'HR') {
      this.userAddForm.patchValue({ role: 'Employee' });
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private roleService: RoleService,
  ) {}

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

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  addUser() {
    const rawEmployeeId = this.userAddForm.value.employeeId;
    const formValue = {
      ...this.userAddForm.value,
      employeeId: rawEmployeeId ? Number(rawEmployeeId) : null,
    } as UserAdd;

    this.userService.addUser(formValue).subscribe({
      next: (res) => {
        this.responseData = res;
        this.userAddForm.reset();
        this.errorMessage = null;
        this.router.navigate(['user']);
      },
      error: (err) => {
        if (err.status === 0) {
          this.errorMessage =
            'Error creating department. Please try again later.';
        } else if (err.status === 400 || err.status === 409) {
          if (Array.isArray(err.error)) {
            // IdentityResult errors: [{ code, description }]
            this.errorMessage = err.error
              .map((e: any) => e.description ?? e)
              .join(', ');
          } else if (typeof err.error === 'string') {
            // Plain string from BadRequest("...") or Conflict("...")
            this.errorMessage = err.error;
          } else if (err.error?.errors) {
            // ModelState dictionary: { errors: { fieldName: ["msg1", "msg2"] } }
            this.errorMessage = Object.values(err.error.errors)
              .flat()
              .join(', ');
          } else {
            this.errorMessage = 'Invalid request. Please check your input.';
          }
        } else {
          this.errorMessage =
            'An unexpected error occurred. Please try again later.';
        }
      },
    });
  }
}
