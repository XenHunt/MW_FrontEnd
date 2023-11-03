import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakeBackendProvider } from './shared/fake_backend';
import { LoginComponent } from './components/login/login.component';
import { SecondComponent } from './components/second/second.component';
import {DemoMaterialModule} from './modules/demo-material.module';
import { HttpClientModule } from '@angular/common/http';

import { authGuardGuard } from './services/auth.guard.guard';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { NotAccessComponent } from './components/not-access/not-access.component';
import { MenuBarComponent } from './shared/menu-bar/menu-bar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SecondComponent,
    AdminComponent,
    NotAccessComponent,
    MenuBarComponent,
    HomeComponent,
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
  providers: [fakeBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
