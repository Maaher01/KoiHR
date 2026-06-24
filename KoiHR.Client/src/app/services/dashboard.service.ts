import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AttendanceCount } from '../models/attendance.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl = environment.baseUrl + 'Dashboard/';

  private _httpClient = inject(HttpClient);

  getAttendanceCountByDate(date: string): Observable<AttendanceCount> {
    return this._httpClient.get<AttendanceCount>(this.apiUrl, {
      params: { date: date },
    });
  }
}
