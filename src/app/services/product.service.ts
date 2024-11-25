import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'http://localhost:8080/api/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<any>{
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        throw error;
      })
    );
  }

  updateProducts(product:any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${product.id}`, product).pipe(
      catchError(error => {
        console.error('Error updating product', error);
        throw error;
      })
    );
  }

  deleteProduct(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting product', error);
        return error;
      })
    );
  }

  createProduct(product:any): Observable<any>{
    return this.http.post<any>(this.apiUrl, product).pipe(
      catchError(error => {
        console.error('Error creating product', error);
        return error;
      })
    );
  }
}
