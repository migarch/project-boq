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
      this.dialogRef.close({event:this.action,
        data:[this.projectName.value, this.projectDetails.value, this.cleintInfo.value,
        this.consultantInfo.value, this.architectInfo.value, this.projectType.value]});
     }
  
     closeDialog(){
       this.dialogRef.close({event:'Cancel'})
     }

    ngOnInit(): void {
      this.local_data = {...this.data};
      this.action = this.local_data.action;

      this.projectName = this.formBuilder.group({
        ProjectName:[this.local_data.ProjectName, Validators.required]
      });
  
      this.projectDetails = this.formBuilder.group({
        ProjectShortName:[this.local_data.ProjectShortName],
        StartDate:[this.local_data.StartDate, Validators.required],
        EndDate:[this.local_data.EndDate, Validators.required],
        ProjectAddress:[this.local_data.ProjectAddress, Validators.required],
        PoAmount:[this.local_data.PoAmount, Validators.required]
      });
  
      this.cleintInfo = this.formBuilder.group({
        ClientName:[this.local_data.ClientName, Validators.required],
        ClientAddress:[this.local_data.ClientAddress]
      });
  
      this.consultantInfo = this.formBuilder.group({
        StructuralConsultantName:[this.local_data.StructuralConsultantName, Validators.required],
        StructuralConsultantAddress:[this.local_data.StructuralConsultantAddress]
      });
  
      this.architectInfo = this.formBuilder.group({
        ArchitectName:[this.local_data.ArchitectName, Validators.required],
        ArchitectAddress:[this.local_data.ArchitectAddress],
      });
      
      this.projectType = this.formBuilder.group({
        TypeOfProject:[this.local_data.TypeOfProject, Validators.required]
      });
    }

}
