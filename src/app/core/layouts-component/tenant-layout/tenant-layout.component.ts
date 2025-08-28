import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'app/core/service/auth/auth.service';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-layout.component.html',
  styleUrl: './tenant-layout.component.css'
})
export class TenantLayoutComponent {
  sidebarOpen = false;
  userName: string | null = null;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.fullname || 'Locataire';
  }
}
