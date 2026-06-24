import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-profile-details',
  imports: [CommonModule, MaterialModule],
  providers: [DatePipe],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements OnInit {
  currentUser: DecodedToken | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.employeeService.uploadImage(formData).subscribe({
      next: (fileName) => {
        if (this.currentUser) {
          this.employeeService
            .updateImage(Number(this.currentUser.employeeId), fileName)
            .subscribe({
              next: () => {
                this.authService.refreshToken().subscribe({
                  next: (res) => {
                    this.currentUser!.image = fileName;
                  },
                  error: (err) => console.error(err),
                });
              },
              error: (err) => console.error(err),
            });
        }
      },
      error: (err) => console.error(err),
    });
  }
}
