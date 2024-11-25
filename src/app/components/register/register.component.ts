import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  createAdminForm: FormGroup;
  private admins: any[] = [];
  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.createAdminForm = this.fb.group({
      name_admin: ['', Validators.required],
      name_business: ['', Validators.required],
      email: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  createAdmin(): void {
    if (this.createAdminForm.valid) {
      const admin = this.createAdminForm.value;
      this.adminService.createAdmin(admin).subscribe({
        next: (response) => {
          console.log('Admin create', response);
          this.admins.push(admin);
        },
        error: (error) => console.error('Error to create Admin', error)
      })
    } else {
      console.error('Form not valid');
    }
  }
}
