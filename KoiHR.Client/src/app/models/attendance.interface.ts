export interface Attendance {
  id: number;
  employeeName: string;
  date: string;
  inTime: string;
  outTime: string;
  note: string;
  status: string;
}

export interface AttendanceAddEdit {
  note: string;
}

export interface AttendanceCount {
  date: string;
  present: number;
  absent: number;
}
