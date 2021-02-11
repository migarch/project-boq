import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { Role } from './_models';
import { SystemAdmin } from './system-admin/system-admin.component';
import { SuperAdminListComponent } from './system-admin/super-admin-list/super-admin-list.component';
import { SuperDashboardComponent } from './super-admin/super-dashboard/super-dashboard.component';

const routes: Routes = [
  {path:'system-dashboard', component: SystemAdmin, canActivate:[AuthGuard], data: { roles: [Role.System]}},
  {path:'super-admin', component:SuperAdminListComponent, canActivate:[AuthGuard], data: { roles: [Role.System]}},
  {path:'super-dashboard', component: SuperDashboardComponent, canActivate:[AuthGuard], data: { roles: [Role.Super]}},
  {path:'project', canActivate:[AuthGuard], data:{roles: [Role.Super]},
  loadChildren:() => import('./_shared/shared.module').then(m => m.SharedModule)
  },
  
  {path:'login', component: LoginComponent},
  {path:'**', redirectTo:'system-dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
