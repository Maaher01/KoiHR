import { Routes } from '@angular/router';

import { AttendanceSettingsListComponent } from './attendance-settings-list/attendance-settings-list.component';
import { AttendanceSettingsAddComponent } from './attendance-settings-add/attendance-settings-add.component';

export const AttendanceSettingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AttendanceSettingsListComponent,
      },
      {
        path: 'add',
        component: AttendanceSettingsAddComponent,
      },
    ],
  },
];
