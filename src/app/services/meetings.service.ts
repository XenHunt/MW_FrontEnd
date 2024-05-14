import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MeetingsTable } from '../shared/helpers';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  meetings: BehaviorSubject<null | Array<MeetingsTable>>;
  meetings$: Observable<null | Array<MeetingsTable>>
  constructor(private http: HttpClient,) {
    this.meetings = new BehaviorSubject<null | Array<MeetingsTable>>(null);
    this.meetings$ = this.meetings.asObservable();
  }

  getMeetings() {
    if (this.meetings.value == null) {
      this.http.get<any>(`${environment.apiUrl}/group_by-adress`).pipe(
        map(res => Array.from(res.ga))
      ).subscribe({
        next: (meetings) => {
          console.log(meetings)
          this.meetings.next(meetings as MeetingsTable[])
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
    return this.meetings$

  }
}
