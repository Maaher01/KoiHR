export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserAdd {
  email: string;
  password: string;
  role: string;
  employeeId?: number;
}

export interface UserEdit {
  email: string;
  newPassword: string;
  role: string;
  employeeId?: number;
}
