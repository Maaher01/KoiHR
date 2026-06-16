import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { SalaryBenefit } from 'src/app/models/salary-benefit.interface';
import { SalaryBenefitService } from 'src/app/services/salary-benefit.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SalaryBenefitDialogComponent } from 'src/app/components/salary-benefit-dialog/salary-benefit-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { WarningDialogComponent } from 'src/app/components/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-salary-benefit-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './salary-benefit-list.component.html',
  styleUrl: './salary-benefit-list.component.scss',
})
export class SalaryBenefitListComponent {
  benefits = new MatTableDataSource<SalaryBenefit>([]);
  errorResponse: any;
  displayedColumns: string[] = ['title', 'isAddition', 'amount', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private salaryBenefitService: SalaryBenefitService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllSalaryBenefits();
  }

  ngAfterViewInit() {
    this.benefits.paginator = this.paginator;
  }

  getAllSalaryBenefits() {
    this.salaryBenefitService.getAllSalaryBenefits().subscribe({
      next: (res) => {
        this.benefits.data = res;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  addSalaryBenefit() {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Add Salary Benefit',
    };

    const dialogRef = this.dialog.open(
      SalaryBenefitDialogComponent,
      dialogConf,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllSalaryBenefits();
    });
  }

  editBenefit(benefit: SalaryBenefit) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Edit Salary Benefit',
      benefit: benefit,
    };

    const dialogRef = this.dialog.open(
      SalaryBenefitDialogComponent,
      dialogConf,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllSalaryBenefits();
    });
  }

  deleteSalaryBenefit(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Benefit',
        message: 'Are you sure you want to delete this benefit?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryBenefitService.deleteSalaryBenefit(id).subscribe({
          next: () => {
            this.getAllSalaryBenefits();
          },
          error: () => {
            this.dialog.open(WarningDialogComponent, {
              width: '400px',
              data: {
                title: 'Failed to delete benefit',
                message:
                  'There was an error deleting the benefit. Please try again later',
              },
            });
          },
        });
      }
    });
  }
}
