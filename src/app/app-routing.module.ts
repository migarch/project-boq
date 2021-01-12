import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Role } from './shared';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { RegisterCompanyComponent } from './system-admin/register-company/register-company.component';
import { SystemAdminComponent } from './system-admin/system-admin.component';

const routes: Routes = [
  {path:'', component: DashboardComponent, pathMatch:'full'},
  {path:'system', component: SystemAdminComponent, canActivate:[AuthGuard], data:{roles:Role.System},
  children:[
    {path:'super-admin', component:SuperAdminComponent}
  ]},
  {path:'super', component: SuperAdminComponent, canActivate:[AuthGuard], data:{roles:Role.Super}},
  {path:'login', component: LoginComponent},
  {path:'**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
