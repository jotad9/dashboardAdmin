import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:8080/api/users';

  constructor(private readonly http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching data', error);
    if (error.status === 403) {
      console.error('Access forbidden: Invalid or missing token');
    }
    return throwError('Error fetching data');
  }
}
