import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { SalaryBenefit } from '../models/salary-benefit.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalaryBenefitService {
  apiUrl = environment.baseUrl + 'SalaryBenefit/';

  private _httpClient = inject(HttpClient);

  getAllSalaryBenefits(): Observable<SalaryBenefit[]> {
    return this._httpClient.get<SalaryBenefit[]>(this.apiUrl);
  }
}
