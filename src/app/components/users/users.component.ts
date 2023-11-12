import { Component } from '@angular/core';
import { UserWithPassword } from 'src/app/shared/helpers';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users?: Array<UserWithPassword>;
  constructor(private http: HttpClient) { }
  NgOnInit(): void {
    this.http
      .get<Array<UserWithPassword>>('http://localhost:3000/users')
      .subscribe((users) => (this.users = users));
  }
}
