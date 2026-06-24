import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Attendance } from '../models/attendance.interface';
import { AttendanceAddEdit } from '../models/attendance.interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  apiUrl = environment.baseUrl + 'Attendance/';

  private _httpClient = inject(HttpClient);

  getAttendanceByDate(date: string): Observable<Attendance[]> {
    return this._httpClient.get<Attendance[]>(this.apiUrl, {
      params: { date: date },
    });
  }

  getMonthlyAttendanceByEmployee(
    id: number,
    month: number,
    year: number,
  ): Observable<Attendance[]> {
    return this._httpClient.get<Attendance[]>(this.apiUrl + 'employee/month', {
      params: { id: id, month: month, year: year },
    });
  }

  markAttendance(addPayload: AttendanceAddEdit): Observable<Attendance> {
    return this._httpClient.post<Attendance>(this.apiUrl, addPayload);
  }

  getAttendanceDetails(id: number) {
    return this._httpClient.get<Attendance>(this.apiUrl + `${id}`);
  }

  updateEmployeeAttendance(
    editPayload: AttendanceAddEdit,
  ): Observable<Attendance> {
    return this._httpClient.put<Attendance>(
      this.apiUrl + `employee/edit`,
      editPayload,
    );
  }

  getEmployeeAttendance(): Observable<Attendance[]> {
    return this._httpClient.get<Attendance[]>(this.apiUrl + 'employee');
  }

  getTodayAttendanceByEmployee(): Observable<Attendance> {
    return this._httpClient.get<Attendance>(this.apiUrl + 'employee/today');
  }
}
