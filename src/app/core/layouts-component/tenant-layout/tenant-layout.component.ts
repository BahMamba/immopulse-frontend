import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { TenantService } from '../../service/tenant/tenant.service';
import { TenantResponse } from '../../tenant.model';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-layout.component.html',
  styleUrls: ['./tenant-layout.component.css']
})
export class TenantLayoutComponent implements OnInit {
  sidebarOpen = false;
  userName: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.fullname || 'Locataire';
      this.isLoading = false;
    } else {
      this.tenantService.getTenantProfile().subscribe({
        next: (profile: TenantResponse) => {
          this.userName = profile.userFullname || 'Locataire';
          this.authService.updateUser({
            fullname: profile.userFullname,
            email: profile.userEmail,
            role: 'TENANT'
          });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.userName = 'Locataire';
          this.router.navigate(['/auth']);
        }
      });
    }
  }

  logout(): void {
    this.authService.clearStorage();
    this.router.navigate(['/auth']);
  }
}