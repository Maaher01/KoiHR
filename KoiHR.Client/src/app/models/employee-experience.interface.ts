export interface EmployeeExperience {
  id: number;
  employeeId: number;
  companyName: string;
  designation: string;
  startDate: string;
  endDate?: string;
}

export interface EmployeeExperienceAddEdit {
  companyName: string;
  designation: string;
  startDate: string;
  endDate?: string;
}
