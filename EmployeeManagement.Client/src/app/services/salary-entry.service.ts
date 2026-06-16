import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SalaryEntry } from '../models/salary-entry';

@Injectable({
  providedIn: 'root',
})
export class SalaryEntryService {
  apiUrl = environment.baseUrl + 'SalaryEntry/';

  private _httpClient = inject(HttpClient);

  getSalaryEntryByMonth(
    month: number,
    year: number,
  ): Observable<SalaryEntry[]> {
    return this._httpClient.get<SalaryEntry[]>(this.apiUrl, {
      params: { month: month, year: year },
    });
  }

  generateSalaryEntry(month: number, year: number): Observable<SalaryEntry[]> {
    return this._httpClient.post<SalaryEntry[]>(
      this.apiUrl + 'generate',
      {},
      {
        params: { month: month, year: year },
      },
    );
  }
}
