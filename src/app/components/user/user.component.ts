import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserdataService } from 'src/app/services/userdata.service';
import { BaseUser } from 'src/app/shared/helpers';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  user: BaseUser | null;
  editForm: FormGroup;

  constructor(private userdase: UserdataService, private formBuilder: FormBuilder, private router: Router) {
    this.user = userdase.user
    if (this.user)
      this.editForm = this.formBuilder.group({
        username: [this.user.username, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        id: [this.user.id, Validators.required]
      })
    else
      this.editForm = this.formBuilder.group({
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        id: ['', Validators.required]
      })
  }

  onSubmit() {
    if (this.editForm.valid) {
      const updatedUser = this.user
      if (updatedUser) {
        updatedUser.username = this.editForm.value.username
        updatedUser.firstName = this.editForm.value.firstName
        updatedUser.lastName = this.editForm.value.lastName
        updatedUser.id = this.editForm.value.id
        this.userdase.updateUser(updatedUser)
      }
      this.router.navigateByUrl('/users')
    }
  }

  onRollback() {
    this.router.navigateByUrl('/users')
  }

}
