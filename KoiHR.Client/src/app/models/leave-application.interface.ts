export interface LeaveApplication {
  id: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  appliedAt: string;
  duration: number;
  note: string;
  status: number;
}

export interface LeaveApplicationAddEdit {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  note: string;
}
