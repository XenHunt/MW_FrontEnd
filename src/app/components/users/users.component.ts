import { Component } from '@angular/core';
import { Role, UserWithPassword } from 'src/app/shared/helpers';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { map } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: Array<UserWithPassword> | null = null;
  constructor(private http: HttpClient) {
    this.http.get<any>(`${environment.apiUrl}/users`).pipe(map(data => data.users)).subscribe({
      next: (users) => {
        this.users = users
      }
    })
  }
}
