import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SystemAdminComponent } from "./system-admin.component";
import { SystemRoutingModule } from "./system-routing.module";

@NgModule({
    declarations:[
        SystemAdminComponent
    ],
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SystemRoutingModule
    ],
    exports:[
        SystemAdminComponent
    ]
})

export class SystemModule{ }