import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './_material/angular-material.module';
import { ProjectDetailsComponent } from './project-list/project-details/project-details.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { SharedRoutingModule } from './shared-routing.module';
import { EditableComponent } from './editable/editable.component';
import { ViewModeDirective } from './editable/view-mode.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { FocusableDirective } from './project-list/project-details/focusable.directive';
import { EditableOnEnterDirective } from './editable/edit-on-enter.directive';

@NgModule({
declarations:[
    ProjectDetailsComponent,
    ProjectListComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    FocusableDirective,
    EditableOnEnterDirective
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