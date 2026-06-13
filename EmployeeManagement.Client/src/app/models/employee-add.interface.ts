export interface EmployeeAdd {
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
