import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  succesMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Raccourci pour accéder facilement aux champs du formulaire
  get f() {
    return this.loginForm.controls;
  }

  // Méthode exécutée lors du submit
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Validez tous les champs requis';
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.errorMessage = '';
        this.succesMessage = 'Bienvenue';
        setTimeout(() => this.succesMessage = '', 4000);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Informations invalides';
      }
    });
  }
}
