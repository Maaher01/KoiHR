import { Routes } from '@angular/router';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import { NoticeListComponent } from './notice-list/notice-list.component';

export const NoticeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: NoticeListComponent,
      },
      {
        path: ':id',
        component: NoticeDetailsComponent,
      },
    ],
  },
];
