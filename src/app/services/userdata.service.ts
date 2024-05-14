import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseUser, User } from '../shared/helpers';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private users$: BehaviorSubject<Array<BaseUser> | null>
  private usersObs: Observable<Array<BaseUser> | null>
  private user$: BehaviorSubject<BaseUser | null>;
  constructor(private http: HttpClient) {
    this.user$ = new BehaviorSubject<BaseUser | null>(null);
    this.users$ = new BehaviorSubject<Array<BaseUser> | null>(null);
    this.usersObs = this.users$.asObservable();
  }

  public setUser(user: BaseUser) {
    this.user$.next(user);
  }

  public get user() {
    return this.user$.value;
  }
  public get users() {
    if (this.users$.value == null) {
      this.http.post<any>(`${environment.apiUrl}/users`, { withCredentials: true }).pipe(map(res => Array.from(res.users))).subscribe({
        next: (users) => {
          this.users$.next(users as BaseUser[]);
        }, error: (err) => {
          console.log('Could not get users', err);
        }
      });
      // this.users$ = new BehaviorSubject<Array<BaseUser>|null>(null);
    }
    return this.usersObs;
  }
  updateUser(value: BaseUser) {
    const users = this.users$.value;
    if (users) {
      const index = users.findIndex(user => user.id === value.id);
      if (index > -1) {
        users[index] = value;
        this.users$.next(users);
        this.http.post<any>(`${environment.apiUrl}/update-user`, value, { withCredentials: true }).subscribe({
          next: (res) => {
            console.log('Updated users', res)
          }, error: (err) => {
            console.log('Could not update users', err)
          }
        })
      }
    }
  }
}
