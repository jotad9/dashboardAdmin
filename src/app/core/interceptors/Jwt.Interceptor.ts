import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
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
    return next.handle(request);
  }
}
