import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SalaryPayment } from '../models/salary-payment.interface';
import { SalaryPaymentAdd } from '../models/salary-payment-add.interface';

@Injectable({
  providedIn: 'root',
})
export class SalaryPaymentService {
  apiUrl = environment.baseUrl + 'SalaryPayment/';

  private _httpClient = inject(HttpClient);

  createSalaryPayment(
    entryId: number,
    addPayload: SalaryPaymentAdd,
  ): Observable<SalaryPayment> {
    return this._httpClient.post<SalaryPayment>(
      this.apiUrl + `${entryId}`,
      addPayload,
    );
  }
}
