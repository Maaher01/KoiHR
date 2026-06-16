import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { LeaveTypeService } from 'src/app/services/leave-type.service';

@Component({
  selector: 'app-leave-type-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './leave-type-edit-dialog.component.html',
  styleUrl: './leave-type-edit-dialog.component.scss',
})
export class LeaveTypeEditDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;
  responseData: any;
  isLoading = false;

  leaveTypeEditForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    maxDaysPerYear: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveTypeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    this.leaveTypeEditForm.patchValue({
      name: this.data.leaveType.name,
      maxDaysPerYear: this.data.leaveType.maxDaysPerYear,
    });
  }

  editLeaveType() {
    if (this.leaveTypeEditForm.invalid) return;
    const { name, maxDaysPerYear } = this.leaveTypeEditForm.getRawValue();
    const payload = {
      name,
      maxDaysPerYear,
    };

    this.leaveTypeService
      .editLeaveType(this.data.leaveType.id, payload)
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
