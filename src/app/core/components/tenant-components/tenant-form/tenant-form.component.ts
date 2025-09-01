// src/app/core/components/tenant-components/tenant-form/tenant-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantService } from 'app/core/service/tenant/tenant.service';
import { NotificationService } from '../../../service/alert-service/notification.service';
import { UserRequest, TenantResponse } from 'app/core/tenant.model';

@Component({
  selector: 'app-tenant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.css']
})
export class TenantFormComponent implements OnInit {
  isEditMode = false;
  form: FormGroup;
  isSubmitting = false;
  propertyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+224[0-9]{9}$/)]],
      password: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.isEditMode = url.some(segment => segment.path === 'edit-tenant');
    });
    this.route.queryParams.subscribe(params => {
      this.propertyId = params['propertyId'] || null;
    });

    if (this.isEditMode) {
      this.form.removeControl('password');
      this.tenantService.getTenantProfile().subscribe({
        next: (profile: TenantResponse) => {
          this.form.patchValue({
            fullname: profile.userFullname,
            email: profile.userEmail,
            phoneNumber: profile.userPhoneNumber
          });
        },
        error: () => this.notification.showError('Erreur lors du chargement du profil')
      });
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.showError('Veuillez remplir tous les champs requis');
      return;
    }

    this.isSubmitting = true;
    const request: UserRequest = {
      fullname: this.form.value.fullname,
      email: this.form.value.email,
      phoneNumber: this.form.value.phoneNumber
    };

    if (this.isEditMode) {
      this.tenantService.updateTenantProfile(null, request).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.showSuccess('Profil mis à jour');
          this.router.navigate(['/client/tenant-profile']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notification.showError('Erreur lors de la mise à jour');
        }
      });
    } else {
      const password = this.form.value.password;
      this.tenantService.createTenant(request, password).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.showSuccess('Inscription réussie ! Connectez-vous');
          this.router.navigate(['/auth'], { queryParams: { propertyId: this.propertyId } });
        },
        error: () => {
          this.isSubmitting = false;
          this.notification.showError('Erreur lors de l\'inscription');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(this.isEditMode ? ['/client/tenant-profile'] : ['/auth'], {
      queryParams: { propertyId: this.propertyId }
    });
  }
}