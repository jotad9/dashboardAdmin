import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/api/admins';

  constructor(private readonly http:HttpClient) { }

  getAdmins() {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => this.handleError(error, "error fetchind data getAdmins"))
    );
  }
  getAdminById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, "error fetchind data getAdmin by id"))
    );
  }
  createAdmin(admin:any): Observable<any>{
    return this.http.post<any>(this.apiUrl, admin).pipe(
      catchError(error => this.handleError(error, "error createAdmin"))
    );
  }

  private handleError(error: HttpErrorResponse, message: string) {
    console.error(error);
    if (error.status === 403) {
      return throwError(() => new Error('Access forbidden: Invalid or missing token'));
    }
    return throwError(() => new Error(message));
  }
}
