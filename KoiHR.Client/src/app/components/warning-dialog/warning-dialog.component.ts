import { Component, Inject } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './warning-dialog.component.html',
})
export class WarningDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
  ) {}
}
