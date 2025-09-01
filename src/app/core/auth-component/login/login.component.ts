// src/app/core/auth-component/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { TenantFormComponent } from 'app/core/components/tenant-components/tenant-form/tenant-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TenantFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSignupMode = false;
  errorMessage = '';
  successMessage = '';
  propertyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isSignupMode = params['signup'] === 'true';
      this.propertyId = params['propertyId'];
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Validez tous les champs requis';
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Bienvenue';
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Informations invalides';
      }
    });
  }
}