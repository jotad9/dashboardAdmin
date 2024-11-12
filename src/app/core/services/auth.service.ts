import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: { nombre: string, password: string }): Observable<any> {
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

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token'); // Elimina el token del localStorage
    }
  }

  public get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  public isAuthenticated(): boolean {
    // Verifica si hay un token en el localStorage
    return !!this.token;
  }
}
