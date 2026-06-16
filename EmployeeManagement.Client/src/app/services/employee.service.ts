import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Employee, EmployeeAddEdit } from '../models/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = environment.baseUrl + 'Employee/';

  private _httpClient = inject(HttpClient);

  addEmployee(addPayload: EmployeeAddEdit): Observable<Employee> {
    return this._httpClient.post<Employee>(this.apiUrl, addPayload);
  }

  uploadImage(formData: FormData): Observable<string> {
    return this._httpClient.post(this.apiUrl + `UploadImage`, formData, {
      responseType: 'text',
    });
  }

  updateImage(employeeId: number, image: string): Observable<any> {
    return this._httpClient.patch(this.apiUrl + `${employeeId}/image`, {
      image,
    });
  }

  getAllEmployees(): Observable<Employee[]> {
    return this._httpClient.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number) {
    return this._httpClient.get<Employee>(this.apiUrl + `${id}`);
  }

  editEmployee(id: number, editPayload: EmployeeAddEdit): Observable<Employee> {
    return this._httpClient.put<Employee>(this.apiUrl + `${id}`, editPayload);
  }

  deleteEmployee(id: number) {
    return this._httpClient.delete(this.apiUrl + `${id}`);
  }
}
