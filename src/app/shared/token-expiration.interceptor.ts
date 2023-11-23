import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError, timer } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environment/environment';
import { waitForAsync } from '@angular/core/testing';

@Injectable()
export class TokenExpirationInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('start intercept')
    const user = this.authService.userValue;
    const isRefresh = request.headers.get('Authorization') === `Bearer ${user?.refresh_token.token}`
    if (isRefresh) {
      console.log(`refresh in intercept Bearer ${user?.refresh_token.token}`)
    }
    if (isRefresh || this.isRefreshing) {
      console.log('isRefresh')
      return next.handle(request)
    }
    return next.handle(request).pipe(catchError((err) => {
      if (err.status === 401) {
        console.log('401 first')
        this.authService.refreshTokens(true);
        return this.handle401Error(request, next);
      }
      console.log('401 outside first')
      return next.handle(request);
    }));
  }
  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      // waitForAsync(() => {
      // })
      // this.isRefreshing = false;
    }
    return next.handle(request).pipe(catchError((err) => {
      this.isRefreshing = false;
      if (err.status === 401) {
        console.log('401 second')
        // this.authService.logout();
        // return next.handle(request);
      }
      console.log('401 outside second')
      return throwError(() => err);
    }));

  }
}
