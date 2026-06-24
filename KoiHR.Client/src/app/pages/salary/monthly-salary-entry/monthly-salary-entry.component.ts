import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryPaymentDialogComponent } from 'src/app/components/salary-payment-dialog/salary-payment-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { SalaryBenefit } from 'src/app/models/salary-benefit.interface';
import { SalaryEntry } from 'src/app/models/salary-entry';
import { SalaryEntryService } from 'src/app/services/salary-entry.service';

@Component({
  selector: 'app-monthly-salary-entry',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './monthly-salary-entry.component.html',
  styleUrl: './monthly-salary-entry.component.scss',
})
export class MonthlySalaryEntryComponent {
  salaryEntry: SalaryEntry[] = [];
  monthControl = new FormControl(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  );
  errorResponse: any;
  isLoading: boolean = false;
  benefitTitles: string[] = [];
  displayedColumns: string[] = [];
  baseColumns: string[] = [
    'employeeName',
    'workingDays',
    'presentDays',
    'absentDays',
    'basicSalary',
    'absentDeduction',
  ];
  trailingColumns: string[] = ['netSalary', 'action'];
  dataSource: any;
  maxDate: Date;
  payingId: number | null = null;

  constructor(
    private salaryEntryService: SalaryEntryService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    const now = new Date();
    // Last day of the previous month
    this.maxDate = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const monthParam = params['month'];
      const yearParam = params['year'];

      if (monthParam && yearParam) {
        const restoredDate = new Date(
          Number(yearParam),
          Number(monthParam) - 1,
          1,
        );

        this.monthControl.setValue(restoredDate, { emitEvent: false });
      }

      const date = this.monthControl.value ?? new Date();
      this.getMonthlySalaryEntry(date.getMonth() + 1, date.getFullYear());
    });

    this.monthControl.valueChanges.subscribe((date) => {
      if (date) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  onMonthSelected(date: Date, picker: MatDatepicker<Date>): void {
    this.monthControl.setValue(date);
    picker.close();
  }

  getMonthlySalaryEntry(month: number, year: number) {
    this.isLoading = true;
    this.errorResponse = null;

    this.salaryEntryService.getSalaryEntryByMonth(month, year).subscribe({
      next: (res) => {
        console.log(res);

        this.salaryEntry = res;
        this.buildDynamicColumns();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse =
          err.error?.message ?? 'Failed to load salary entries.';
        this.isLoading = false;
      },
    });
  }

  generateSalaryEntry() {
    const date = this.monthControl.value ?? new Date();
    this.isLoading = true;

    this.salaryEntryService
      .generateSalaryEntry(date.getMonth() + 1, date.getFullYear())
      .subscribe({
        next: (res) => {
          this.salaryEntry = res;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorResponse =
            err.error?.message ?? 'Failed to generate payroll.';
          this.isLoading = false;
        },
      });
  }

  buildDynamicColumns() {
    const titlesSet = new Set<string>();
    for (const entry of this.salaryEntry) {
      for (const b of entry.benefitBreakdown) {
        titlesSet.add(b.title);
      }
    }
    this.benefitTitles = Array.from(titlesSet);

    this.displayedColumns = [
      ...this.baseColumns,
      ...this.benefitTitles.map((t) => `benefit_${t}`),
      ...this.trailingColumns,
    ];
  }

  getBenefitAmount(row: SalaryEntry, title: string): SalaryBenefit | undefined {
    return row.benefitBreakdown.find((b) => b.title === title);
  }

  get totalEmployees(): number {
    return this.salaryEntry.length;
  }

  get totalNetSalary(): number {
    return this.salaryEntry.reduce((sum, e) => sum + e.netSalary, 0);
  }

  openPayDialog(entry: SalaryEntry) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '500px';
    dialogConf.data = {
      heading: 'Create Salary Payment',
      payment: entry,
    };

    const dialogRef = this.dialog.open(
      SalaryPaymentDialogComponent,
      dialogConf,
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        entry.isPaid = true;
      }
    });
  }
}
