import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        throw error;
      })
    );
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError(error => {
        console.error('Error updating user', error);
        throw error;
      })
    );
  }
 createUser(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {}).pipe(
      catchError(error => {
        console.error('Error creating user', error);
        return throwError(error);
      })
    );
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting user', error);
        return throwError(error);
      })
    );
  }
}
