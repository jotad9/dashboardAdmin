import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Asegúrate de tener este servicio

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Verifica si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Si no está autenticado, redirige a la página de login
      this.router.navigate(['login']);
      return false;
    }
  }
}
