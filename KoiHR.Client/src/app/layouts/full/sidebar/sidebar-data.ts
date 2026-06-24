import { NavItem } from '../../../models/nav-item.interface';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Attendance',
    iconName: 'solar:bill-list-line-duotone',
    chip: true,
    children: [
      {
        displayName: 'My Attendance',
        iconName: 'solar:banknote-line-duotone',
        route: '/attendance/employee',
        roles: ['Employee', 'HR'],
        chip: true,
      },
      {
        displayName: 'Attendance Settings',
        iconName: 'solar:settings-line-duotone',
        route: '/attendance/settings',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'Attendance List',
        iconName: 'solar:list-line-duotone',
        route: '/attendance',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'Monthly User Attendance',
        iconName: 'solar:calendar-date-line-duotone',
        route: '/attendance/employee/month',
        roles: ['Admin', 'HR'],
        chip: true,
      },
    ],
  },
  {
    displayName: 'Leave',
    iconName: 'solar:sleeping-line-duotone',
    chip: true,
    children: [
      {
        displayName: 'Leave Configuration',
        iconName: 'solar:settings-minimalistic-line-duotone',
        route: '/leave/leave-type',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'Leave Applications',
        iconName: 'solar:list-arrow-up-line-duotone',
        route: '/leave/leave-application',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'My Leave Applications',
        iconName: 'solar:traffic-economy-line-duotone',
        route: '/leave/leave-application/employee',
        roles: ['Employee', 'HR'],
        chip: true,
      },
      {
        displayName: 'My Leave Balance',
        iconName: 'solar:document-line-duotone',
        route: '/leave/leave-balance',
        roles: ['Employee', 'HR'],
        chip: true,
      },
    ],
  },
  {
    displayName: 'Notice',
    iconName: 'solar:notes-line-duotone',
    route: '/notice',
  },
  {
    navCap: 'HR',
    divider: true,
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Employees',
    iconName: 'solar:users-group-two-rounded-line-duotone',
    route: '/employee',
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Departments',
    iconName: 'solar:sidebar-minimalistic-line-duotone',
    route: '/department',
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Weekend',
    iconName: 'solar:armchair-line-duotone',
    route: '/weekend',
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Holidays',
    iconName: 'solar:wineglass-triangle-line-duotone',
    route: '/holiday',
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Salary',
    iconName: 'solar:dollar-line-duotone',
    chip: true,
    roles: ['Admin', 'HR'],
    children: [
      {
        displayName: 'Benefits',
        iconName: 'solar:heart-line-duotone',
        route: '/salary/benefit',
        chip: true,
      },
      {
        displayName: 'Salary Payment',
        iconName: 'solar:money-bag-line-duotone',
        route: '/salary/payment',
        chip: true,
      },
    ],
  },
  {
    navCap: 'ADMINISTRATION',
    divider: true,
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Users',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/user',
    roles: ['Admin', 'HR'],
  },
];
