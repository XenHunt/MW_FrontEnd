import { Component, Input } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';
import { BaseUser } from 'src/app/shared/helpers';

@Component({
  selector: 'app-user-button',
  templateUrl: './user.button.component.html',
  styleUrls: ['./user.button.component.css']
})
export class UserButtonComponent {
  @Input() user!: BaseUser;
  constructor(private userdase: UserdataService) { }
  onClick() {
    this.userdase.setUser(this.user)
    console.log("Click")
    // console.log(this.user)
  }
}
