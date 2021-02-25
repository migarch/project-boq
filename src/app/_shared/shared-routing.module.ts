import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../_models";
import { MeasurementSheetComponent } from "./measurement-sheet/measurement-sheet.component";
import { ProjectDetailsComponent } from "./project-list/project-details/project-details.component";
import { ProjectListComponent } from "./project-list/project-list.component";

const routes: Routes = [
    {path:'', component:ProjectListComponent},
    {path:'details/:project_id', component: ProjectDetailsComponent},
    {path:'measurement/:project_id', component: MeasurementSheetComponent},        
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class SharedRoutingModule{

}