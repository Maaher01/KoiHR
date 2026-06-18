import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {
  EmployeeQualification,
  EmployeeQualificationAddEdit,
} from '../models/employee-qualification.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeQualificationService {
  apiUrl = environment.baseUrl + 'EmployeeQualification/';

  private _httpClient = inject(HttpClient);

  addQualification(
    employeeId: number,
    addPayload: EmployeeQualificationAddEdit,
  ): Observable<EmployeeQualification> {
    return this._httpClient.post<EmployeeQualification>(
      this.apiUrl + `${employeeId}`,
      addPayload,
    );
  }

  getAllQualificationsByEmployee(
    employeeId: number,
  ): Observable<EmployeeQualification[]> {
    return this._httpClient.get<EmployeeQualification[]>(
      this.apiUrl + `${employeeId}`,
    );
  }

  editQualification(
    id: number,
    editPayload: EmployeeQualificationAddEdit,
  ): Observable<EmployeeQualification> {
    return this._httpClient.put<EmployeeQualification>(
      this.apiUrl + `${id}`,
      editPayload,
    );
  }

  deleteQualification(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
