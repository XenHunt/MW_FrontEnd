import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BaseUser } from 'src/app/shared/helpers';
import { UserdataService } from 'src/app/services/userdata.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'button']
  users!: Array<BaseUser>
  dataSource: MatTableDataSource<BaseUser> = new MatTableDataSource<BaseUser>()
  subscription!: Subscription
  constructor(private userserv: UserdataService, private changeRef: ChangeDetectorRef) {
    // this.getUsers()

  }
  ngOnInit() {
    this.subscription = this.userserv.users.subscribe(users => {
      if (users) {
        this.users = users
        this.dataSource = new MatTableDataSource<BaseUser>(this.users)
        this.changeRef.detectChanges()
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
