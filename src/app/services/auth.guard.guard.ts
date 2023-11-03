import { CanActivateFn } from '@angular/router';

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AuthenticationService } from './authentication.service';


@Injectable({providedIn:'root'})
export class authGuardGuard implements CanActivate{
  constructor(private router: Router, private authenticationService: AuthenticationService) {};

  canActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (user) {
      const {roles} = route.data;
      if (roles && !roles.includes(user.role))
      {
        this.router.navigate(['/']);
        return false
      }
      return true;
    }
    this.router.navigate(['/login'], {queryParams: {returnUrl : state.url}})
    return false;
  }
};
