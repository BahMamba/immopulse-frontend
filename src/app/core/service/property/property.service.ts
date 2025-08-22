// src/app/services/property/property.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PaginatedProperties, PropertyDetail, PropertyListItem } from '../../property.models';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly API = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) {}

  // Créer une propriété
  createProperty(property: FormData): Observable<PropertyDetail> {
    return this.http.post<PropertyDetail>(this.API, property).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de la création de la propriété'))
    );
  }

  // Mettre à jour une propriété
  updateProperty(id: number, property: FormData): Observable<PropertyDetail> {
    return this.http.put<PropertyDetail>(`${this.API}/${id}`, property).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de la mise à jour de la propriété'))
    );
  }

  // Lister les propriétés par owner avec filtres
  getPropertiesByOwner(page: number = 0, size: number = 6, title?: string, status?: string): Observable<PaginatedProperties<PropertyListItem>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', 'id');
    if (title) params = params.set('title', title);
    if (status) params = params.set('status', status);
    return this.http.get<PaginatedProperties<PropertyListItem>>(`${this.API}/owner`, { params }).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement de vos propriétés'))
    );
  }

  // Lister toutes les propriétés
  getProperties(page: number = 0, size: number = 6, title?: string, status?: string): Observable<PaginatedProperties<PropertyListItem>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', 'id');
    if (title) params = params.set('title', title);
    if (status) params = params.set('status', status);
    return this.http.get<PaginatedProperties<PropertyListItem>>(this.API, { params }).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement des propriétés'))
    );
  }

  // Obtenir les détails d'une propriété
  getPropertyDetail(id: number): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.API}/${id}`).pipe(
      catchError(err => this.handleError(err, 'Erreur lors du chargement des détails'))
    );
  }

  // Supprimer une propriété
  deleteProperty(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/${id}`).pipe(
      catchError(err => this.handleError(err, 'Erreur lors de la suppression'))
    );
  }

  // Gérer les erreurs
  private handleError(err: any, defaultMessage: string): Observable<never> {
    const message = err?.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}