import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee.interface';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, MaterialModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
})
export class EmployeeDetailsComponent implements OnInit {
  errorMessage: any;
  employee: Employee;
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.imageUrl = employee.image
          ? 'https://localhost:7063/Photos/' + employee.image
          : null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  getGender(gender: number | null | undefined): string {
    switch (gender) {
      case 0:
        return 'Male';
      case 1:
        return 'Female';
      case 2:
        return 'Other';
      default:
        return '—';
    }
  }
}
