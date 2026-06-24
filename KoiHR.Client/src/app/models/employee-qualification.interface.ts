export interface EmployeeQualification {
  id: number;
  employeeId: number;
  title: string;
  institution: string;
  passingYear: number;
  result?: string;
}

export interface EmployeeQualificationAddEdit {
  title: string;
  institution: string;
  passingYear: number;
  result?: string;
}
