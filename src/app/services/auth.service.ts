import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.API_URL;
  private userPayload: any;
  constructor(private router: Router, private http: HttpClient) {
    this.userPayload = this.decodedToken();
  }

  register(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}/api/auth/register`, userObj);
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, loginObj);
  }

  signOut() {
    localStorage.removeItem('task_management_token');
    this.router.navigate(['login']);
  }

  storeToken(accessToken: string, refreshToken: string) {
    localStorage.setItem(
      'task_management_token',
      JSON.stringify({
        accessToken,
        refreshToken,
      })
    );
  }

  getAccessToken() {
    return localStorage.getItem('task_management_token')
      ? JSON.parse(localStorage.getItem('task_management_token')!).accessToken
      : null;
  }

  getRefreshToken() {
    return localStorage.getItem('task_management_token')
      ? JSON.parse(localStorage.getItem('task_management_token')!).refreshToken
      : null;
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getAccessToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }
}
