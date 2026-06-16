import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Holiday, HolidayAddEdit } from '../models/holiday.interface';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  apiUrl = environment.baseUrl + 'Holiday/';

  private _httpClient = inject(HttpClient);

  addHoliday(addPayload: HolidayAddEdit): Observable<Holiday> {
    return this._httpClient.post<Holiday>(this.apiUrl, addPayload);
  }

  getAllHolidays(): Observable<Holiday[]> {
    return this._httpClient.get<Holiday[]>(this.apiUrl);
  }

  editHoliday(id: number, editPayload: HolidayAddEdit): Observable<Holiday> {
    return this._httpClient.put<Holiday>(this.apiUrl + `${id}`, editPayload);
  }

  deleteHoliday(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
