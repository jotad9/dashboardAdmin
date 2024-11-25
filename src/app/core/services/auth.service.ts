import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: { name_admin: string, pass: string }): Observable<any> {
    console.log('Enviando solicitud de login', credentials);
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      map((response) => {
        console.log('Respuesta del servidor', response);
        if (response && response.accessToken) {
          if (isPlatformBrowser(this.platformId)) {
            console.log('Token recibido en authService', response.accessToken);
            localStorage.setItem('token', response.accessToken);
          }
        }
        return response;
      })
    );
  }
  register(credentials: { name_admin: string, name_business: string, email: string, pass: string }): Observable<any> {
    console.log('Enviando solicitud de registro', credentials);
    return this.http.post<any>(`${this.baseUrl}/register`, credentials).pipe(
      map((response) => {
        console.log('Respuesta del servidor', response);
        if (response && response.accessToken) {
          if (isPlatformBrowser(this.platformId)) {
            console.log('Token recibido en authService', response.accessToken);
            localStorage.setItem('token', response.accessToken);
          }
        }
        return response;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  public get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  public isAuthenticated(): boolean {
    // Check if there's a token on the localStorage
    return !!this.token;
  }
}
