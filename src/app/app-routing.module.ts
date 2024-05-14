import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SecondComponent } from './components/second/second.component';
// import { authGuardGuard } from './services/auth.guard.guard';
import { authGuard } from './services/auth.guard';
import { Role } from './shared/helpers';
import { AdminComponent } from './components/admin/admin.component';
import { NotAccessComponent } from './components/not-access/not-access.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { GraphComponent } from './components/graph/graph.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'second',
    component: SecondComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin, Role.User]
    }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin]
    }
  },
  {
    path: 'not',
    component: NotAccessComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [authGuard],
    data: {
      roles: [Role.Admin]
    }
  },
  {
    path: "user/:id",
    component: UserComponent,
    canActivate: [authGuard],
    // data: {
    //   roles: [Role.Admin]
    // }
  },
  {
    path: "graph", component: GraphComponent, canActivate: [authGuard],
    data: {
      roles: [Role.Admin]
    },
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
