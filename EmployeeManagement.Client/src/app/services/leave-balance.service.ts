import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LeaveBalance } from '../models/leave-balance.interface';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  apiUrl = environment.baseUrl + 'LeaveBalance/';

  private _httpClient = inject(HttpClient);

  getMyLeaveBalance(): Observable<LeaveBalance[]> {
    return this._httpClient.get<LeaveBalance[]>(this.apiUrl);
  }
}
