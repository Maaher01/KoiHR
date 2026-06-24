import { Routes } from '@angular/router';
import { SalaryBenefitListComponent } from './salary-benefit-list/salary-benefit-list.component';
import { MonthlySalaryEntryComponent } from './monthly-salary-entry/monthly-salary-entry.component';

export const SalaryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'benefit',
        component: SalaryBenefitListComponent,
      },
      {
        path: 'payment',
        component: MonthlySalaryEntryComponent,
      },
    ],
  },
];
