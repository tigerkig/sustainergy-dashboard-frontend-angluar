import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot,Router,  UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):any {
      let isLoggedIn = this.authService.isLoggedIn()
      if (isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/login']);
      }
    }
}
