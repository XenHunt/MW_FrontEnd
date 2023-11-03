import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authenService: AuthenticationService = inject (AuthenticationService);
  const router: Router = inject (Router);
  const user = authenService.userValue;
  if (user) {
    const { roles } = route.data;
    if (roles && !roles.includes(user.role)) {
      router.navigate(['/not']);
      return false;
    }
    return true;
  }
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
