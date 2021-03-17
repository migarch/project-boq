import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { NavItem } from 'src/app/_models';
import { userDetails } from 'src/app/_models/user-details';
import { CommanService } from 'src/app/_services/comman.service';
import { UserValidators } from 'src/app/_shared/_validators/user.validator';

@Component({
  selector: 'app-register-super-admin',
  templateUrl: './register-super-admin.component.html',
  styleUrls: ['./register-super-admin.component.css']
})

export class RegisterSuperAdminComponent implements OnInit {
  UserDetails: FormGroup;
  Credentials: FormGroup;
  RoleAndMenu: FormGroup;
  error='';
  hide = true;
  submitted = false;
  emailDisabled = false;
  action:string;
  local_data:any;
  menusList: NavItem[] = []

  constructor(
    public dialogRef: MatDialogRef<RegisterSuperAdminComponent>,
    private formBuilder: FormBuilder,
    private userValidators: UserValidators,
    private commanServe: CommanService,
    @Inject(MAT_DIALOG_DATA) public data:userDetails
  ) {  }

  public roleOption = [
    {id:2, name:'Super Admin'}
  ];

  doAction(){
    this.dialogRef.close({event:this.action,data:[this.UserDetails.value, this.Credentials.value, this.RoleAndMenu.value, this.data]});
   }

   closeDialog(){
     this.dialogRef.close({event:'Cancel'})
   }

  ngOnInit(): void {

    this.getMenuList()

    this.local_data = {...this.data};
    this.action = this.local_data.action;
    
    if(this.local_data.action == 'Add'){
      this.emailDisabled = true;
      this.UserDetails = this.formBuilder.group({
        Name:['', Validators.required],
        PhoneNumber:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)], this.userValidators.phoneValidator()]
      });

      this.Credentials = this.formBuilder.group({
        Email:[null, Validators.compose([Validators.email, Validators.required]), this.userValidators.emailValidator()],
        Password:['', Validators.required],
      });

      this.RoleAndMenu = this.formBuilder.group({
        UserRoleId:['',Validators.required],
        UserMenuId:[this.menusList,Validators.required]
      });
    }else{
      this.UserDetails = this.formBuilder.group({
        Name:[this.local_data.Name, Validators.required],
        PhoneNumber:[this.local_data.PhoneNumber,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
      });

      this.Credentials = this.formBuilder.group({
        Email:[this.local_data.Email, Validators.compose([Validators.email, Validators.required]),],
        Password:['', Validators.required],
      });

      this.RoleAndMenu = this.formBuilder.group({
        UserRoleId:[this.local_data.UserRoleId,Validators.required],
        UserMenuId:[this.menusList,Validators.required]
      });
    }
  }

  getMenuList(){
    this.commanServe.getAllMenu()
    .pipe(first())
    .subscribe(resp =>{
      this.menusList = resp;
    })
  }


}
