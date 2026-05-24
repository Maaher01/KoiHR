import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LeaveType } from '../models/leave-type.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  apiUrl = environment.baseUrl + 'LeaveType/';

  private _httpClient = inject(HttpClient);

  addLeaveType(addPayload: LeaveType): Observable<LeaveType> {
    return this._httpClient.post<LeaveType>(this.apiUrl, addPayload);
  }

  getAllLeaveTypes(): Observable<LeaveType[]> {
    return this._httpClient.get<LeaveType[]>(this.apiUrl);
  }

  editLeaveType(id: number, editPayload: any) {
    return this._httpClient.put(this.apiUrl + `${id}`, editPayload);
  }

  deleteLeaveType(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
