import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((res: AuthResponse) => {
        localStorage.setItem('access_token', res.access_token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null;
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
