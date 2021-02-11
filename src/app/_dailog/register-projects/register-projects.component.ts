import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/_models';

@Component({
  selector: 'app-register-projects',
  templateUrl: './register-projects.component.html',
  styleUrls: ['./register-projects.component.css']
})
export class RegisterProjectsComponent implements OnInit {
  projectName: FormGroup;
  projectDetails: FormGroup;
  cleintInfo: FormGroup;
  consultantInfo:FormGroup;
  architectInfo:FormGroup;
  projectType:FormGroup;
  error = '';
  sumitted = false;
  action:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<RegisterProjectsComponent>,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DIALOG_DATA) private data:Project

  ) {
      this.dateAdapter.setLocale('fr-CA');
      this.local_data = {...data};
      this.action = this.local_data.action;
    }
  
    doAction(){
      this.dialogRef.close({event:this.action,data:this.local_data});
     }
  
     closeDialog(){
       this.dialogRef.close({event:'Cancel'})
     }

    ngOnInit(): void {
      this.projectName = this.formBuilder.group({
        ProjectName:['', Validators.required]
      });
  
      this.projectDetails = this.formBuilder.group({
        ProjectShortName:[''],
        StartDate:['', Validators.required],
        EndDate:['', Validators.required],
        ProjectAddress:['', Validators.required],
        PoAmount:['', Validators.required]
      });
  
      this.cleintInfo = this.formBuilder.group({
        ClientName:['', Validators.required],
        ClientAddress:['']
      });
  
      this.consultantInfo = this.formBuilder.group({
        StructuralConsultantName:['', Validators.required],
        StructuralConsultantAddress:['']
      });
  
      this.architectInfo = this.formBuilder.group({
        ArchitectName:['', Validators.required],
        ArchitectAddress:[''],
      });
      
      this.projectType = this.formBuilder.group({
        TypeOfProject:['', Validators.required]
      });
    }

}
