import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../_shared/_material/angular-material.module";
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';
import { SystemAdmin } from "./system-admin.component";

@NgModule({
    declarations:[SuperAdminListComponent, SystemAdmin],
    exports:[SuperAdminListComponent, SystemAdmin],
    imports:[ReactiveFormsModule, FormsModule, MaterialModule, CommonModule]
})


export class SystemAdminModule{


}