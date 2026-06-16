export interface Weekend {
  id: number;
  departmentId: number;
  departmentName: string;
  days: number[];
}

export interface WeekendAddEdit {
  departmentId: number;
  departmentName: string;
  days: number[];
}
