import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Notice } from 'src/app/models/notice.interface';
import { NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-notice-dialog',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './notice-dialog.component.html',
})
export class NoticeDialogComponent {
  heading: string;
  errorMessage: any;
  isLoading = false;
  isEditMode = !!this.data.notice;

  noticeForm = this.fb.nonNullable.group({
    title: [
      this.data.notice?.title ?? '',
      [Validators.required, Validators.maxLength(150)],
    ],
    content: [this.data.notice?.content ?? '', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private noticeService: NoticeService,
    private dialogRef: MatDialogRef<NoticeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { heading: string; notice?: Notice },
  ) {
    this.heading = data.heading;
  }

  save() {
    if (this.noticeForm.invalid) return;

    const payload = this.noticeForm.getRawValue();
    this.isLoading = true;

    const request = this.isEditMode
      ? this.noticeService.editNotice(this.data.notice!.id, payload)
      : this.noticeService.addNotice(payload);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error ?? 'Failed to save notice. Please try again.';
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
