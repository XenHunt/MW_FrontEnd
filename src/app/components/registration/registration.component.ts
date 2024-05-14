import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  registerForm!: FormGroup
  constructor(private formBuilder: FormBuilder, private authservice: AuthenticationService) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      firstName: ['', Validators.pattern('^[A-ZА-Я]')],
      // lastName: ['', Validators.pattern()],
    })
  }
}
