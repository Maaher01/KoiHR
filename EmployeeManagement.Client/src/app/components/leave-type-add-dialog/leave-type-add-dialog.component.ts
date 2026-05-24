import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { LeaveTypeService } from 'src/app/services/leave-type.service';

@Component({
  selector: 'app-leave-type-add-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './leave-type-add-dialog.component.html',
  styleUrl: './leave-type-add-dialog.component.scss',
})
export class LeaveTypeAddDialogComponent {
  heading: string;
  errorMessage: any;
  responseData: any;
  isLoading = false;

  leaveTypeAddForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    maxDaysPerYear: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveTypeAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  addLeaveType() {
    if (this.leaveTypeAddForm.invalid) return;
    const { name, maxDaysPerYear } = this.leaveTypeAddForm.getRawValue();
    const payload = {
      name,
      maxDaysPerYear,
    };

    this.leaveTypeService.addLeaveType(payload).subscribe({
      next: (res) => {
        this.responseData = res;
        this.leaveTypeAddForm.reset();
        this.errorMessage = null;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          // Network error (no connection, server down, CORS, etc.)
          this.errorMessage =
            'Error creating leave type. Please try again later.';
        } else if (err.status === 400) {
          // Bad request / model validation
          this.errorMessage = err.error;
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
