import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './_material/angular-material.module';
import { ProjectDetailsComponent } from './project-list/project-details/project-details.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
declarations:[
    ProjectDetailsComponent,
    ProjectListComponent,
],
imports:[
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedRoutingModule
],
exports:[ ],
})

export class SharedModule{

}