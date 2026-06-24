import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  LeaveApplication,
  LeaveApplicationAddEdit,
} from '../models/leave-application.interface';

@Injectable({
  providedIn: 'root',
})
export class LeaveApplicationService {
  apiUrl = environment.baseUrl + 'LeaveApplication/';

  private _httpClient = inject(HttpClient);

  addLeaveApplication(
    addPayload: LeaveApplicationAddEdit,
  ): Observable<LeaveApplicationAddEdit> {
    return this._httpClient.post<LeaveApplicationAddEdit>(
      this.apiUrl,
      addPayload,
    );
  }

  getAllLeaveApplications(): Observable<LeaveApplication[]> {
    return this._httpClient.get<LeaveApplication[]>(this.apiUrl);
  }

  getLeaveApplicationsByEmployee(): Observable<LeaveApplication[]> {
    return this._httpClient.get<LeaveApplication[]>(this.apiUrl + `employee`);
  }

  updateLeaveApplicationStatus(id: number, editPayload: any) {
    return this._httpClient.patch(this.apiUrl + `${id}/status`, editPayload);
  }

  deleteLeaveApplication(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
