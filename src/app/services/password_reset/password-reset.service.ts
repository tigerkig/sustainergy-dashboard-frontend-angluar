import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.backendBaseAddress
const PASSWORD_RESET_API = BASE_URL + "/password_reset/";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor(private http: HttpClient) { }

  verify_token(token: string): Observable<any> {
    var url = PASSWORD_RESET_API + "validate_token/";
    var body = JSON.stringify({"token": token});
    return this.http.post(url, body, httpOptions);
  }

  reset_password(token: string, password: string): Observable<any> {
    var url = PASSWORD_RESET_API + "confirm/";
    var body = JSON.stringify({"token": token, "password": password});
    return this.http.post(url, body, httpOptions);
  }
}
