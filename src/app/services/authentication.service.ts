import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { User, UniqueId, UserRegistration } from '../shared/helpers';
import { v4 as uuidv4 } from 'uuid';
// import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  private userId: BehaviorSubject<UniqueId | null>;
  private randomId: BehaviorSubject<string | null>;
  // public isAutenticated: Signal<boolean> = computed(this.userSubject.value ? () => true : () => false)

  constructor(private router: Router, private http: HttpClient) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser')!) || null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.randomId = new BehaviorSubject<string | null>(localStorage.getItem('Id')! || null);
    this.userId = new BehaviorSubject<UniqueId | null>(this.randomId.value ?
      { uid: this.randomId.value, system_string: navigator.userAgent } :
      null);
    if (!this.userIdValue) {
      this.generateId()
    }
    this.user = this.userSubject.asObservable();
    timer(1000).subscribe(() => {
      this.refreshTokens()
    })
    interval(30 * 1000).subscribe(() => {
      this.refreshTokens()
    })
  }

  private generateId() {
    localStorage.setItem('Id', uuidv4());
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.randomId.next(localStorage.getItem('Id')! || null)
    // console.log('UID successful')
  }

  public get userIdValue(): UniqueId | null {
    return this.userId.value
  }

  generateUpdateDate() {
    const date = new Date()
    // const timezoneOffset = date.getTimezoneOffset()
    // date.setMinutes(date.getMinutes() + timezoneOffset)
    date.setDate(date.getDate() + environment.frequencyOfUpdateRefreshByDay)
    return date
  }
  register(userReg: UserRegistration) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.post<any>(`${environment.apiUrl}/register`, { userReg }, { withCredentials: true }).subscribe({
      next: (user) => {
        // this.login(userReg.username, userReg.password)

        const token = user.refresh_token
        user.refresh_token = {
          token: token,
          update_date: this.generateUpdateDate()
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user)
      },
      error: () => {
        // this.logout()
        console.log('Bad register')
      }
    })
  }
  login(username: string, password: string) {
    // var formData: FormData = new FormData()
    // formData.append('username', username)
    // formData.append('password', password)
    const formData = {
      'username': username, 'password': password,
      // 'uid': this.userIdValue?.uid, 'system_string': this.userIdValue?.system_string
    }
    // console.log(formData)
    // console.log(formData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // console.log(user)
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
    const formData = {
      'access_token': this.userValue?.access_token,
      // 'uid': this.userIdValue?.uid, 'system_string': this.userIdValue?.system_string
    }
    // console.log(formData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.http.post<any>(`${environment.apiUrl}/logout`, formData, { withCredentials: true }).subscribe({
      next: () => {
        console.log('logout')
      },
      error: () => {
        console.log('Bad logout')
      },
    }
    )
    // console.log('logout')
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    this.generateId()
  }

  private refreshAccessToken(currentUser: User, reloading: boolean) {
    // console.log('start of executin refreshAccessToken')
    // console.log(currentUser)
    const formData = {
      access_token: currentUser.access_token,
      // uid: this.userIdValue?.uid, system_string: this.userIdValue?.system_string
    }
    // console.log(formData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.http.post<any>(`${environment.apiUrl}/refresh-access`, formData, { withCredentials: true }).subscribe(
      {
        next: (user) => {
          // console.log('start real Refresh Access')
          // console.log(user)
          // const old_access_token = currentUser.access_token
          // console.log(old_access_token == user.access_token)
          currentUser.access_token = user.access_token
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.userSubject.next(currentUser)
          // console.log('end real Refresh Access')
          if (reloading)
            location.reload()

        },
        error: () => {
          // console.log('Logout in access')
          this.logout()
        },
        complete: () => {
          // console.log('complete access Observable')
        }
      })
    // console.log('end of executin refreshAccessToken')
  }
  private refreshRefreshToken(currentUser: User) {
    const formData = {
      access_token: currentUser.access_token,
      // uid: this.userIdValue?.uid, system_string: this.userIdValue?.system_string
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.post<any>(`${environment.apiUrl}/refresh-refresh`, formData, { withCredentials: true }).subscribe({
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
  refreshTokens(reloading = false) {
    const today = new Date()
    // console.log('First')
    const currentUser = this.userValue
    // console.log(`User`)
    // console.log(currentUser)
    // console.log('Second')
    if (!currentUser)
      return
    // console.log('Refresh start')
    // today.setMinutes(today.getMinutes() + Date.)
    if (today > currentUser.refresh_token.update_date) {
      // this.refreshAccessToken()
      this.refreshRefreshToken(currentUser)
    } else {
      this.refreshAccessToken(currentUser, reloading)
    }
    // console.log('Refresh end')
  }
}
