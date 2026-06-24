import { Routes } from '@angular/router';

import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentAddComponent } from './department-add/department-add.component';

export const DepartmentRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DepartmentListComponent,
      },
      {
        path: 'add',
        component: DepartmentAddComponent,
      },
    ],
  },
];
