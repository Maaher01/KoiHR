import { Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
      },
      {
        path: 'add',
        component: UserAddComponent,
      },
    ],
  },
];
