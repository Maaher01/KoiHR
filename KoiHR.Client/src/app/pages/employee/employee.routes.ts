import { Routes } from '@angular/router';

import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

export const EmployeeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EmployeeListComponent,
      },
      {
        path: 'add',
        component: EmployeeAddComponent,
      },
      {
        path: 'edit/:id',
        component: EmployeeEditComponent,
      },
      {
        path: ':id',
        component: EmployeeDetailsComponent,
      },
    ],
  },
];
