export interface Employee {
  id: number;
  name: string;
  departmentId: number;
  departmentName?: string;
  dateOfJoining: string;
  image?: string;
  phone?: string;
  address?: string;
  dob: string;
  gender?: number | null;
  designation: string;
  basicSalary: number;
}

export interface EmployeeAddEdit {
  name: string;
  departmentId: number;
  dateOfJoining: string;
  image: string;
  phone?: string;
  address?: string;
  dob?: string | null;
  gender?: string | null;
  designation?: string;
  basicSalary: number;
}
