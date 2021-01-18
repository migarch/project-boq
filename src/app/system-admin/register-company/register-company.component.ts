import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/shared/company';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {
  RegiCompany: FormGroup;
  submitted = false;
  error = '';
  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<RegisterCompanyComponent>,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Company
  ) {
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
    this.RegiCompany = this.formBuilder.group({
      ContactEmail:['', Validators.email],
      CompanyName:['', Validators.required],
      ContactPhone:['', Validators.required],
      CompanyHOAddres:['', Validators.required],
      CompanyProjectOfﬁ:['', Validators.required],
      CompanyLogo:['', Validators.required],
      CompanyGST:['', Validators.required],
      CompanyType:['', Validators.required],
      ProjectSubscription:['', Validators.required]

    });
  }

  get f() { return this.RegiCompany.controls; }

}
