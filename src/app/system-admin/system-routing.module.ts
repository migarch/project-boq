import { NgModule } from "@angular/core";
import { RouterModule, Routes, } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../shared";
import { RegisterCompanyComponent } from "./register-company/register-company.component";
import { SystemAdminComponent } from "./system-admin.component";

const routes:Routes = [
    
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class SystemRoutingModule {}