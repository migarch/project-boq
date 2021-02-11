import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../_shared/_material/angular-material.module";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { RegisterProjectsComponent } from "./register-projects/register-projects.component";
import { RegisterSuperAdminComponent } from "./register-super-admin/register-super-admin.component";
import { CopyItemsComponent } from './copy-items/copy-items.component';

@NgModule({
    declarations:[
        RegisterCompanyComponent,
        RegisterProjectsComponent,
        RegisterSuperAdminComponent,
        CopyItemsComponent
    ],
    imports:[
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports:[
        RegisterCompanyComponent,
        RegisterProjectsComponent,
        RegisterSuperAdminComponent
    ]
})
export class DailogModule{

}