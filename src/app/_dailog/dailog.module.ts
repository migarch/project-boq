import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../_shared/_material/angular-material.module";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { RegisterProjectsComponent } from "./register-projects/register-projects.component";
import { RegisterSuperAdminComponent } from "./register-super-admin/register-super-admin.component";
import { CopyItemsComponent } from './copy-items/copy-items.component';
import { CopyLineitemsComponent } from './copy-lineitems/copy-lineitems.component';
import { InsertMeasurmentComponent } from './insert-measurment/insert-measurment.component';
import { LengthCountComponent } from './length-count/length-count.component';
import { BreadthCountComponent } from './breadth-count/breadth-count.component';
import { DepthCountComponent } from './depth-count/depth-count.component';

@NgModule({
    declarations:[
        RegisterCompanyComponent,
        RegisterProjectsComponent,
        RegisterSuperAdminComponent,
        CopyItemsComponent,
        CopyLineitemsComponent,
        InsertMeasurmentComponent,
        LengthCountComponent,
        BreadthCountComponent,
        DepthCountComponent
    ],
    imports:[
        FormsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    exports:[
        RegisterCompanyComponent,
        RegisterProjectsComponent,
        RegisterSuperAdminComponent,
    ]
})
export class DailogModule{

}