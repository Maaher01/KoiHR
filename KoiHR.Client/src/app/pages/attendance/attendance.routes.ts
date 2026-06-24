import { Routes } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { EmployeeAttendanceListComponent } from './employee-attendance-list/employee-attendance-list.component';
import { roleGuard } from 'src/app/guards/role.guard';
import { MonthlyAttendanceListComponent } from './monthly-attendance-list/monthly-attendance-list.component';

export const AttendanceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AttendanceListComponent,
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
      {
        path: 'employee',
        component: EmployeeAttendanceListComponent,
        canActivate: [roleGuard(['Employee', 'HR'])],
      },
      {
        path: 'employee/month',
        component: MonthlyAttendanceListComponent,
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./attendance-settings/attendance-settings.routes').then(
            (m) => m.AttendanceSettingRoutes,
          ),
        canActivate: [roleGuard(['Admin', 'HR'])],
      },
    ],
  },
];
