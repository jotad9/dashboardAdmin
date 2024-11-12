import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  nombre: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
  login(): void {
    console.log('Intentando iniciar sesión con', this.nombre, this.password);
    this.authService
      .login({ nombre: this.nombre, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          this.router.navigate(['dashboard']);
        },
        error: (error) => console.error('Error de autenticación', error),
      });
  }
}
