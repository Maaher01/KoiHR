import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import {
  EmployeeExperience,
  EmployeeExperienceAddEdit,
} from '../models/employee-experience.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeExperienceService {
  apiUrl = environment.baseUrl + 'EmployeeExperience/';

  private _httpClient = inject(HttpClient);

  addExperience(
    employeeId: number,
    addPayload: EmployeeExperienceAddEdit,
  ): Observable<EmployeeExperience> {
    return this._httpClient.post<EmployeeExperience>(
      this.apiUrl + `${employeeId}`,
      addPayload,
    );
  }

  getAllExperienceByEmployee(
    employeeId: number,
  ): Observable<EmployeeExperience[]> {
    return this._httpClient.get<EmployeeExperience[]>(
      this.apiUrl + `${employeeId}`,
    );
  }

  editExperience(
    id: number,
    editPayload: EmployeeExperienceAddEdit,
  ): Observable<EmployeeExperience> {
    return this._httpClient.put<EmployeeExperience>(
      this.apiUrl + `${id}`,
      editPayload,
    );
  }

  deleteExperience(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
