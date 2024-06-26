import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { fakeBackendProvider } from './shared/fake_backend';
import { LoginComponent } from './components/login/login.component';
import { SecondComponent } from './components/second/second.component';
import { DemoMaterialModule } from './modules/demo-material.module';
import { HttpClientModule } from '@angular/common/http';

// import { authGuardGuard } from './services/auth.guard.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { NotAccessComponent } from './components/not-access/not-access.component';
import { MenuBarComponent } from './shared/menu-bar/menu-bar.component';
import { HomeComponent } from './components/home/home.component';
import { JwtInterceptor } from './shared/jwt-interceptor';
import { FakeBackendInteceptor } from './shared/fake_backend';
import { UsersComponent } from './components/users/users.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TokenExpirationInterceptor } from './shared/token-expiration.interceptor';
import { UserButtonComponent } from './components/user.button/user.button.component';
import { UserComponent } from './components/user/user.component';
import { GraphComponent } from './components/graph/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SecondComponent,
    AdminComponent,
    NotAccessComponent,
    MenuBarComponent,
    HomeComponent,
    UsersComponent,
    RegistrationComponent,
    UserButtonComponent,
    UserComponent,
    GraphComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [UserButtonComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TokenExpirationInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
