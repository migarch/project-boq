import { NgModule } from "@angular/core";
import { RouterModule, Routes, } from "@angular/router";
import { SystemAdminComponent } from "./system-admin.component";

const routes:Routes = [
    {path: 'system', component:SystemAdminComponent}
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class SystemRoutingModule {}