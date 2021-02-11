import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../_shared/_material/angular-material.module";
import { SuperDashboardComponent } from "./super-dashboard/super-dashboard.component";

@NgModule({
    declarations:[
        SuperDashboardComponent
    ],
    exports:[
        SuperDashboardComponent
    ],
    imports:[FormsModule, ReactiveFormsModule, MaterialModule, CommonModule]
})

export class SuperAdminModule{

}