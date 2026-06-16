import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { LeaveTypeService } from 'src/app/services/leave-type.service';
import { LeaveType } from 'src/app/models/leave-type.interface';

@Component({
  selector: 'app-leave-type-form-dialog',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './leave-type-dialog.component.html',
  styleUrl: './leave-type-dialog.component.scss',
})
export class LeaveTypeDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;
  isLoading = false;
  isEditMode = !!this.data.leaveType;

  leaveTypeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    maxDaysPerYear: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { heading: string; leaveType?: LeaveType },
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.leaveType) {
      this.leaveTypeForm.patchValue({
        name: this.data.leaveType.name,
        maxDaysPerYear: this.data.leaveType.maxDaysPerYear,
      });
    }
  }

  save() {
    if (this.leaveTypeForm.invalid) return;

    const { name, maxDaysPerYear } = this.leaveTypeForm.getRawValue();
    const payload = { name, maxDaysPerYear };

    this.isLoading = true;

    const request = this.isEditMode
      ? this.leaveTypeService.editLeaveType(this.data.leaveType!.id, payload)
      : this.leaveTypeService.addLeaveType(payload);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage =
            'Error saving leave type. Please try again later.';
        } else if (err.status === 400) {
          this.errorMessage = err.error;
        }
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
