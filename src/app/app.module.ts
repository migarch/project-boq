import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './system-admin/dashboard/dashboard.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemModule } from './system-admin/system.module';
import { appInitializer } from './auth/app.initializer';
import { AuthenticationService } from './services';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { MaterialModule } from './shared/angular-material.module';
import { ConfirmationDialog } from './_modal/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SuperAdminComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    ConfirmationDialog
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SystemModule,
    HttpClientModule,
    MaterialModule,
    
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory:appInitializer, multi:true, deps:[AuthenticationService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
