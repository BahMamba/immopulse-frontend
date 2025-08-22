import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/auth-component/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./core/layouts-component/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'properties-owner', loadComponent: () => import('./core/components/property-by-owner/property-by-owner.component').then(m => m.PropertyByOwnerComponent)},
      { path: 'properties', loadComponent: () => import('./core/components/property-list/property-list.component').then(m => m.PropertyListComponent)},
      { path: 'add-property', loadComponent: () => import('./core/components/property-form/property-form.component').then(m => m.PropertyFormComponent)},
      { path: 'edit-property/:id', loadComponent: () => import('./core/components/property-form/property-form.component').then(m => m.PropertyFormComponent)},
      { path: 'detail-property/:id', loadComponent: () => import('./core/components/property-detail/property-detail.component').then(m=>m.PropertyDetailComponent)}
    ],
  },
  {
    path: 'agent',
    loadComponent: () =>
      import('./core/layouts-component/agent-layout/agent-layout.component').then(m => m.AgentLayoutComponent),
    children: [
      // Exemple : { path: '', loadComponent: () => import(...) }
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
