import { Routes } from '@angular/router';

import { LeaveTypeListComponent } from './leave-type-list/leave-type-list.component';
import { LeaveApplicationListComponent } from './leave-application-list/leave-application-list.component';
import { EmployeeLeaveApplicationsComponent } from './employee-leave-applications/employee-leave-applications.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';

export const LeaveRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'leave-type',
        component: LeaveTypeListComponent,
      },
      {
        path: 'leave-application',
        component: LeaveApplicationListComponent,
      },
      {
        path: 'leave-balance',
        component: LeaveBalanceComponent,
      },
      {
        path: 'leave-application/employee',
        component: EmployeeLeaveApplicationsComponent,
      },
    ],
  },
];
