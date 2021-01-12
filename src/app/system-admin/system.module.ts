import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SystemAdminComponent } from "./system-admin.component";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { MaterialModule } from "../shared/angular-material.module";
import { SystemRoutingModule } from "./system-routing.module";
import { RegisterSuperAdminComponent } from './register-super-admin/super-admin.component';

@NgModule({
    declarations:[
        SystemAdminComponent,
        RegisterCompanyComponent,
        RegisterSuperAdminComponent
    ],
    imports:[
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SystemRoutingModule
    ],
    exports:[
        SystemAdminComponent,
        RegisterCompanyComponent,
    ]
})

export class SystemModule{ }