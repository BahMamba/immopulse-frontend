import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse, UserProfile } from '../../users.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private http: HttpClient, private router: Router) {}

  // Authentifie l'utilisateur, stocke le token, récupère le profil et redirige selon le rôle
  login(credentials: { email: string; password: string }): Observable<UserProfile> {
    this.clearStorage();

    return this.http.post<LoginResponse>(`${this.API}/login`, credentials).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res.token)),
      switchMap(() => this.getProfile()),
      tap(profile => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
        this.redirectByRole(profile.role);
      }),
      catchError(err => throwError(() => err))
    );
  }

  // Récupère le profil de l'utilisateur connecté via le token
  getProfile(): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('User not authenticated'));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserProfile>(`${this.API}/me`, { headers });
  }

  // Retourne le token JWT stocké localement
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Retourne les infos du user stockées localement
  getUser(): UserProfile | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Supprime le token et les infos user du stockage local
  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Redirige l'utilisateur selon son rôle
  private redirectByRole(role: string): void {
    const routeMap: Record<string, string> = {
      ADMIN: '/admin',
      OWNER: '/agent',
      CLIENT: '/client'
    };

    this.router.navigate([routeMap[role] || '/auth']);
  }
}
