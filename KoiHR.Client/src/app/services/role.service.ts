import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Role } from '../models/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiUrl = environment.baseUrl + 'Role/';

  private _httpClient = inject(HttpClient);

  getAllRoles(): Observable<Role[]> {
    return this._httpClient.get<Role[]>(this.apiUrl);
  }
}
