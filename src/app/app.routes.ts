// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./core/auth-component/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./core/layouts-component/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'properties-owner', loadComponent: () => import('./core/components/property-components/property-by-owner/property-by-owner.component').then(m => m.PropertyByOwnerComponent) },
      { path: 'properties', loadComponent: () => import('./core/components/property-components/property-list/property-list.component').then(m => m.PropertyListComponent) },
      { path: 'add-property', loadComponent: () => import('./core/components/property-components/property-form/property-form.component').then(m => m.PropertyFormComponent) },
      { path: 'edit-property/:id', loadComponent: () => import('./core/components/property-components/property-form/property-form.component').then(m => m.PropertyFormComponent) },
      { path: 'detail-property/:id', loadComponent: () => import('./core/components/property-components/property-detail/property-detail.component').then(m => m.PropertyDetailComponent) },
      { path: 'edit-tenant/:tenantId', loadComponent: () => import('./core/components/tenant-components/tenant-form/tenant-form.component').then(m => m.TenantFormComponent) }
    ],
  },
  {
    path: 'client',
    loadComponent: () => import('./core/layouts-component/tenant-layout/tenant-layout.component').then(m => m.TenantLayoutComponent),
    children: [
      { path: '', redirectTo: 'tenant-profile', pathMatch: 'full' },
      { path: 'tenant-form', loadComponent: () => import('./core/components/tenant-components/tenant-form/tenant-form.component').then(m => m.TenantFormComponent) },
      { path: 'tenant-profile', loadComponent: () => import('./core/components/tenant-components/tenant-profile/tenant-profile.component').then(m => m.TenantProfileComponent) },
      { path: 'edit-tenant', loadComponent: () => import('./core/components/tenant-components/tenant-form/tenant-form.component').then(m => m.TenantFormComponent) } // Changement ici
    ],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];