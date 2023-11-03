import { Component } from '@angular/core';
// import { DemoMaterialModule } from 'src/app/modules/demo-material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuBarComponent } from 'src/app/shared/menu-bar/menu-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {
  loginForm!: FormGroup;
  flag!:boolean
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, 
    private route: ActivatedRoute, private router: Router, private menuBar: MenuBarComponent) {
    this.flag = false
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:['',Validators.required],
      password:['', Validators.required]
    })
  }
  onSubmit(){
    if (this.loginForm.valid){
      console.log(this.f)
      this.authService.login(this.f['username'].value,this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () =>{
          const returnUrl = '/';
          this.router.navigateByUrl(returnUrl)
          console.log('Ok')
          this.menuBar.authed.set(true)
        },
        error: error =>{
          console.log('You shall not pass');
          console.log(error)
          this.flag = true
        }
      }
      )
    }
  }
  // Exit(){
  //   this.authService.logout()
  // }
  get f()
  {
    return this.loginForm.controls;
  }

}
