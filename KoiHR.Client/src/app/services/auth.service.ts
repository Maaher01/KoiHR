import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../models/decoded-token.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.baseUrl + 'Auth/';

  private _httpClient = inject(HttpClient);
  private _router = inject(Router);

  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(
    this.decodeToken(),
  );
  $currentUser = this.currentUserSubject.asObservable();

  login(userCred: any): Observable<any> {
    return this._httpClient.post<any>(this.apiUrl + 'login', userCred).pipe(
      tap((loginResponse) => {
        localStorage.setItem('token', loginResponse.token);
        this.currentUserSubject.next(this.decodeToken());
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  private decodeToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode<DecodedToken>(token);
  }

  refreshToken(): Observable<any> {
    return this._httpClient.post<any>(this.apiUrl + 'refresh-token', {}).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(this.decodeToken());
      }),
    );
  }
}
