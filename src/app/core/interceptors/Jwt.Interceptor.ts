import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add the JWT token to the request headers if available
    const token = localStorage.getItem('token'); // Adjust according to your token storage
    if (token) {
      console.log('Adding token to request:', token); // Add logging
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('No token found'); // Add logging
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Redirigir al usuario a la página de inicio de sesión
          console.error('Unauthorized or Forbidden request, redirecting to login');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
