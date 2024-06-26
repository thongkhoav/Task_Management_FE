import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomInterceptor } from './interceptors/custom.interceptor';
import { MyInterceptor } from './interceptors/my.interceptor';
import { MyhttpInterceptor } from './interceptors/myhttp.interceptor';
import { CreateRoomModalComponent } from './components/create-room-modal/create-room-modal.component';
import { MaterialModule } from './material-module';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import {
  ConfirmRemoveModalComponent,
  RoomMemberComponent,
} from './components/room-member/room-member.component';
import { AddMemberModalComponent } from './components/add-member-modal/add-member-modal.component';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CreateRoomModalComponent,
    RoomDetailComponent,
    RoomMemberComponent,
    CreateTaskModalComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    AddMemberModalComponent,
    ConfirmRemoveModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    MaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
