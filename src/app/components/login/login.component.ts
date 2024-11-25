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
  name_admin: string = '';
  pass: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.navigateToDashboard();
  }
  login(): void {
    console.log('Intentando iniciar sesión con', this.name_admin, this.pass);
    this.authService
      .login({ name_admin: this.name_admin, pass: this.pass })
      .subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          this.navigateToDashboard()
        },
        error: (error) => console.error('Error de autenticación', error),
      });
  }
  navigateToDashboard():void{
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
