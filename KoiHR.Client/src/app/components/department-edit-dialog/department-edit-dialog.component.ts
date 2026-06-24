import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-department-edit-dialog',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './department-edit-dialog.component.html',
})
export class DepartmentEditDialogComponent implements OnInit {
  heading: string;
  errorMessage: any;

  departmentEditForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.departmentEditForm.patchValue({
      name: this.data.department.name,
    });
  }

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.heading = data.heading;
  }

  editDepartment() {
    const payload = {
      name: this.departmentEditForm.controls['name'].value!,
    };

    this.departmentService
      .editDepartment(this.data.department.id, payload)
      .subscribe({
        next: () => {
          this.closeDialog();
          window.location.reload();
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
