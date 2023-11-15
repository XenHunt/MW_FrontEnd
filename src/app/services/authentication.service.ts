import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { User } from '../shared/helpers';
// import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  // public isAutenticated: Signal<boolean> = computed(this.userSubject.value ? () => true : () => false)

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser')!) || null);
    this.user = this.userSubject.asObservable();
    timer(100).subscribe(() => {
      this.refreshTokens()
    })
    interval(10000).subscribe(() => {
      this.refreshTokens()
    })
  }

  generateUpdateDate() {
    const date = new Date()
    // const timezoneOffset = date.getTimezoneOffset()
    // date.setMinutes(date.getMinutes() + timezoneOffset)
    date.setDate(date.getDate() + environment.frequencyOfUpdateRefreshByDay)
    return date
  }

  login(username: string, password: string) {
    // var formData: FormData = new FormData()
    // formData.append('username', username)
    // formData.append('password', password)
    const formData = { 'username': username, 'password': password }
    return this.http.post<any>(`${environment.apiUrl}/login`, formData, { withCredentials: true }).pipe(
      map(
        user => {
          if (!user) {
            // решить что делать
            this.userSubject.next(null)
            return throwError(() => 'Auth error')
          } else {
            // console.log(user)
            const token = user.refresh_token
            user.refresh_token = {
              token: token,
              update_date: this.generateUpdateDate()

            }
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.userSubject.next(user)
            return user
          }
        }
      )
    )
  }
  public get userValue(): User | null {
    return this.userSubject.value
  }
  logout() {
    // console.log("HERE")
    // Убить токен на беке
    this.http.delete<any>(`${environment.apiUrl}/logout`, { withCredentials: true }).subscribe(
      () => {
        console.log('logout')
      }
    )
    // console.log('logout')
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  private refreshAccessToken(currentUser: User) {
    // console.log(currentUser)
    if (currentUser) {
      this.http.get<any>(`${environment.apiUrl}/refresh-access`, { withCredentials: true }).subscribe({
        next: (user) => {
          // console.log('Good')
          currentUser.access_token = user.access_token
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.userSubject.next(currentUser)
        },
        error: () => {
          // console.log('Bad')
          this.logout()
        }
      })
    }
  }
  private refreshRefreshToken(currentUser: User) {
    if (currentUser) {
      this.http.get<any>(`${environment.apiUrl}/refresh-refresh`, { withCredentials: true }).subscribe({
        next: (user) => {
          user.refresh_token = {
            token: user.refresh_token,
            update_date: this.generateUpdateDate()
          }
          currentUser.refresh_token = user.refresh_token
          currentUser.access_token = user.access_token
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.userSubject.next(currentUser)
        },
        error: () => {
          this.logout()
        }
      })
    }
  }
  refreshTokens() {
    const today = new Date()
    // console.log('First')
    const currentUser = this.userValue
    // console.log('Second')
    if (!currentUser)
      return
    // today.setMinutes(today.getMinutes() + Date.)
    if (today > currentUser.refresh_token.update_date) {
      // this.refreshAccessToken()
      this.refreshRefreshToken(currentUser)
    } else {
      this.refreshAccessToken(currentUser)
    }
  }
}
