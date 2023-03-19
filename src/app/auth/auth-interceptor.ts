import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // If user is logged in, but their token is expired, automagically refresh it before requesting data
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*
    if (this.authService.isExpired()) {
      this.authService.refresh().subscribe(
        data => {
          this.authService.setSession(data);
        }
      );
    }
    */

    const authToken = this.authService.getToken();

    if (authToken) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + authToken)

      });

      return next.handle(cloned);
    }
    else {
      return next.handle(request);
    }
  }
}
