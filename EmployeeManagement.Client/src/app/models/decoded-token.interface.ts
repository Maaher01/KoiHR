export interface DecodedToken {
  uid: string;
  employeeId: number;
  name?: string;
  email: string;
  image: string;
  dateOfJoining: string;
  department?: string;
  role: string;
  exp: number;
}
