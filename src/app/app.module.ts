import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appInitializer } from './auth/app.initializer';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './_shared/_material/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './_services/authentication.service';
import { DailogModule } from './_dailog/dailog.module';
import { SystemAdminModule } from './system-admin/system-admin.module';
import { SuperAdminModule } from './super-admin/system-admin.module';
import { LoginComponent } from './auth/login/login.component';
import { MeasurementSheetComponent } from './_shared/measurement-sheet/measurement-sheet.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MeasurementSheetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DailogModule,
    SystemAdminModule,
    SuperAdminModule,
    MatDialogModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory:appInitializer, multi:true, deps:[AuthenticationService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
