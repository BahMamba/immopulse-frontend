import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Paginated, TenantResponse, UserRequest, UserResponse } from 'app/core/tenant.model';
import { NotificationService } from '../alert-service/notification.service';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly API = 'http://localhost:8080/api/tenants';

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  createTenant(request: UserRequest, password: string): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(this.API, request, { params: { password } }).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de l\'inscription'))
    );
  }

  getTenantProfile(): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${this.API}/profile`).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement du profil'))
    );
  }

  getTenantById(tenantId: number): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${this.API}/${tenantId}`).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement du locataire'))
    );
  }

  getAllTenants(fullname?: string, page: number = 0, size: number = 10): Observable<Paginated<TenantResponse>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'id,asc');
    if (fullname) params = params.set('fullname', fullname);
    return this.http.get<Paginated<TenantResponse>>(this.API, { params }).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement des locataires'))
    );
  }

  updateTenantProfile(tenantId: number | null, request: UserRequest): Observable<UserResponse> {
    const url = tenantId ? `${this.API}/${tenantId}` : `${this.API}/profile`;
    return this.http.put<UserResponse>(url, request).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de la mise à jour du profil'))
    );
  }

  deleteTenantProfile(tenantId: number | null): Observable<string> {
    const url = tenantId ? `${this.API}/${tenantId}` : `${this.API}/profile`;
    return this.http.delete<string>(url).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de la suppression du profil'))
    );
  }

  private handleError(err: any, defaultMessage: string): Observable<never> {
    const message = err?.error?.message || defaultMessage;
    this.notification.showError(message);
    return throwError(() => new Error(message));
  }
}