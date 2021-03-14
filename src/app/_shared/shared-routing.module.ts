import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MeasurementSheetComponent } from "./measurement-sheet/measurement-sheet.component";
import { ProjectDetailsComponent } from "./project-list/project-details/project-details.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ViewProjectComponent } from "./project-list/view-project/view-project.component";

const routes: Routes = [
    {path:'', component:ProjectListComponent},
    {path:'details/:project_id', component: ProjectDetailsComponent},
    {path:'project/details/view/:project_id', component: ViewProjectComponent},
    {path:'measurement/:project_id', component: MeasurementSheetComponent}     
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class SharedRoutingModule{

}