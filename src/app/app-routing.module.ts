import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { unauthGuard } from './guards/unauth.guard';
import { AuthService } from './services/auth.service';

const getDefaultRoute = () => {
  const isLoggedIn = localStorage.getItem('task_management_token')
    ? true
    : false;
  return isLoggedIn ? '/home' : '/login';
};

const routes: Routes = [
  { path: '', redirectTo: getDefaultRoute(), pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [unauthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'room/:id',
        component: RoomDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
