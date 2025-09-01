// src/app/core/components/tenant-components/tenant-profile/tenant-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TenantService } from 'app/core/service/tenant/tenant.service';
import { NotificationService } from 'app/core/service/alert-service/notification.service';
import { AuthService } from 'app/core/service/auth/auth.service';
import { TenantResponse } from 'app/core/tenant.model';

@Component({
  selector: 'app-tenant-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tenant-profile.component.html',
  styleUrls: ['./tenant-profile.component.css']
})
export class TenantProfileComponent implements OnInit {
  tenantProfile: TenantResponse | null = null;

  constructor(
    private service: TenantService,
    private notification: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.service.getTenantProfile().subscribe({
      next: (profile: TenantResponse) => {
        this.tenantProfile = profile;
      },
      error: () => {
        this.notification.showError('Erreur de chargement du profil !');
      }
    });
  }

  editProfile(): void {
    if (this.tenantProfile) {
      this.router.navigate(['/client/edit-tenant']); // Changement ici
    } else {
      this.notification.showError('Impossible de modifier : profil non chargé');
    }
  }

  deleteProfile(): void {
    this.notification.showConfirmation(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer votre profil ?',
      () => {
        this.service.deleteTenantProfile(null).subscribe({
          next: () => {
            this.notification.showSuccess('Profil supprimé');
            this.authService.clearStorage();
            this.router.navigate(['/auth']);
          },
          error: () => {
            this.notification.showError('Erreur lors de la suppression !');
          }
        });
      }
    );
  }

  logout(): void {
    this.authService.clearStorage();
    this.router.navigate(['/auth']);
  }
}