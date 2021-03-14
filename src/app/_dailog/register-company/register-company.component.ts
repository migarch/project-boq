import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/_models';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {

  submitted = false;
  error = '';
  action:string;
  local_data:any;
  comanyDetails:FormGroup;
  frist:FormGroup;
  second:FormGroup;
  third:FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RegisterCompanyComponent>,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: Company
  ) { }

    doAction(){
      this.dialogRef.close({
        event:this.action,data:this.formArray.value
      });
     }
  
    closeDialog(){
      this.dialogRef.close({event:'Cancel'})
    }

  get formArray(): AbstractControl | null { return this.comanyDetails.get('formArray'); }

  ngOnInit(): void {
    this.local_data = {...this.data};
    this.action = this.local_data.action;

    this.comanyDetails = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          id:[this.local_data.id, Validators.required],
          ContactEmail:[this.local_data.ContactEmail, Validators.email],
          CompanyName:[this.local_data.CompanyName, Validators.required],
          ContactPhone:[this.local_data.ContactPhone, Validators.required],
          CompanyHOAddres:[this.local_data.CompanyHOAddres, Validators.required],
        }),
        this.formBuilder.group({
          CompanyType:[this.local_data.CompanyType, Validators.required],
          ProjectSubscription:[this.local_data.ProjectSubscription, Validators.required],
          CompanyProjectOffi:[this.local_data.CompanyProjectOffi],
          CompanyGST:[this.local_data.CompanyGST],
        }),
        this.formBuilder.group({
          CompanyLogo:[this.local_data.CompanyLogo],
        })
      ])
    });
  }

}
