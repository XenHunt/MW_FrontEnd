import { environment } from "src/environment/environment";

import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const user = this.authenticationService.userValue;
    const isLoggedIn = user && user.access_token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isRefreshUrl = request.url.startsWith(environment.refreshtokenUrl) || request.url.startsWith(environment.logoutUrl);
    if (isLoggedIn && isRefreshUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.refresh_token.token}`
        }
      });
      // console.log(`refresh Bearer ${user.refresh_token.token}`)
    }
    if (isLoggedIn && isApiUrl && !isRefreshUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.access_token}`
        }
      });
      // console.log(`access Bearer ${user.access_token}`)
    }

    const uid = this.authenticationService.userIdValue
    if (uid && request.method != 'GET') {
      request = request.clone({
        body: {
          ...request.body,
          uid: uid.uid,
          system_string: uid.system_string
        }
      });
    }

    return next.handle(request);
  }
}
