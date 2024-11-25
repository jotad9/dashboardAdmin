import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private admins: any[] = [];
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name_admin: ['', Validators.required],
      name_business: ['', Validators.required],
      email: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const credentials = this.registerForm.value;
      this.authService.register(credentials).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => console.error('Error al registrar', error)
      });
    } else {
      console.error('Formulario inválido');
    }
  }
}
