import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AuthService } from './services/auth.service';
import { Router } from "@angular/router";
import { inject } from "@angular/core";

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService); //inject dependencies into Angular
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
  }
  return authService.isAuthenticated();
};

export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);