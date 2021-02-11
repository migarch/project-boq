import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../_models";
import { ProjectDetailsComponent } from "./project-list/project-details/project-details.component";
import { ProjectListComponent } from "./project-list/project-list.component";

const routes: Routes = [
    {path:'', component:ProjectListComponent},
    {path:':project_id', component: ProjectDetailsComponent}        
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class SharedRoutingModule{

}