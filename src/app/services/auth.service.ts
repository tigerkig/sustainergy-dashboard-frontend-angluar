import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import * as moment from "moment";

const BASE_URL = environment.backendBaseAddress;
const AUTH_API = BASE_URL + "/auth/token/";
const PASSWORD_RESET_API = BASE_URL + "/password_reset/";

const httpOptionsReg = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const httpOptionsRefresh = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API, JSON.stringify({
      email, password }), httpOptionsReg);
  }

  logout(): void {
    var url = AUTH_API + "logout/";
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expires_at');
    //return this.http.post(url, null, httpOptionsRefresh);
  }

  refresh(): Observable<any> {
    return this.http.post(AUTH_API + 'refresh/', null,  httpOptionsRefresh);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(PASSWORD_RESET_API, JSON.stringify({email}), httpOptionsReg);
  }

  public setSession(data: any) {
    let decoded_access: any = jwt_decode(data.access);
    const expires_at: any = moment.unix(decoded_access.exp);

    localStorage.setItem('auth_token', data.access);
    localStorage.setItem('user_role', data.user_role);
    localStorage.setItem('expires_at', JSON.stringify(expires_at.valueOf()) );
  }

  public getSession(value:any){
    let role = localStorage.getItem(value);
    return role
  }

  public current_user_id() {
    var jwt:any = localStorage.getItem("auth_token");
    var decoded:any = jwt_decode(jwt);
    return decoded.user_id
  }

  public getToken() {
    return localStorage.getItem("auth_token");
  }

  public isLoggedIn() {
    if (localStorage.getItem('auth_token'))
      return true;
    return false;
  }

  public isExpired() {
    // Check if user is logged in first. Otherwise we might call refresh API for signed out users.
    if (this.isLoggedIn()) {
      if (moment().isBefore(this.getExpiration()))
        return false;
      return true;
    }
    return false;
  }

  getExpiration() {
    const expiration: any = localStorage.getItem('expires_at');
    const expiresAt: any = JSON.parse(expiration);
    return moment(expiresAt)
  }
}
