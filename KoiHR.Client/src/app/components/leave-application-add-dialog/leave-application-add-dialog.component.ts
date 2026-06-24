import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';
import { endDateAfterStartDate } from 'src/app/shared/validators/date.validator';
import { formatDate } from '@angular/common';
import { LeaveTypeService } from 'src/app/services/leave-type.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-leave-application-add-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './leave-application-add-dialog.component.html',
  styleUrl: './leave-application-add-dialog.component.scss',
})
export class LeaveApplicationAddDialogComponent implements OnInit {
  leaveTypes: any[] = [];
  heading: string;
  errorMessage: any;
  responseData: any;
  isLoading = false;
  endDateAfterStartDate = endDateAfterStartDate;

  leaveAppAddForm = this.fb.nonNullable.group(
    {
      leaveTypeId: [0, [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      note: [''],
    },
    { validators: this.endDateAfterStartDate },
  );

  constructor(
    private leaveApplicationService: LeaveApplicationService,
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveApplicationAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  ngOnInit(): void {
    this.getAllLeaveTypes();
  }

  getAllLeaveTypes() {
    this.isLoading = true;
    this.leaveTypeService.getAllLeaveTypes().subscribe({
      next: (res) => {
        this.leaveTypes = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoading = false;
      },
    });
  }

  addLeaveApplication() {
    if (this.leaveAppAddForm.invalid) return;
    const { leaveTypeId, startDate, endDate, note } =
      this.leaveAppAddForm.getRawValue();
    const payload = {
      leaveTypeId,
      startDate: formatDate(startDate, 'yyyy-MM-dd', 'en'),
      endDate: formatDate(endDate, 'yyyy-MM-dd', 'en'),
      note,
    };
    this.isLoading = true;

    this.leaveApplicationService.addLeaveApplication(payload).subscribe({
      next: (res) => {
        this.responseData = res;
        this.leaveAppAddForm.reset();
        this.errorMessage = null;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          // Network error (no connection, server down, CORS, etc.)
          this.errorMessage = 'Error creating holiday. Please try again later.';
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
