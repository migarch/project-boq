import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services';
import { SystemService } from 'src/app/services/system.service';
import { Role, User } from 'src/app/shared';
import { ConfirmationDialog } from 'src/app/_modal/confirmation-dialog.component';
import { GetUsers } from '../system-shared/getuser';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class RegisterSuperAdminComponent implements OnInit {
  
  loading = false;
  user: User;
  displayedColumns = [];
  dataSource;
  users: GetUsers[] = [];
  dialogValue: string;
  sendValue: string;
 
  

  constructor(
    private authenticationService: AuthenticationService,
    private systemService: SystemService,
    public dialog: MatDialog,
    

  ) { 
    this.user = this.authenticationService.userValue
  }

  @ViewChild(MatPaginator, { static:true}) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getSuperAdmin();
  }

  applyFilter(fiterValue: string){
    this.dataSource.filter = fiterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage;
    }
  }

  getSuperAdmin(){
    this.loading = true;
    if(this.user.role == Role.System){
      this.systemService.GetUser()
      .pipe(first())
      .subscribe(res =>{
        this.loading = false;
        this.users = res;
        this.displayedColumns = ['Name','Email', 'PhoneNumber', 'UserRoleId','Active', 'Action', 'Delete'];
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  openDialog(action, obj){
    obj.action = action;
    const dialogRef  = this.dialog.open(AddSuperAdminDialog,{
      data:obj
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }
    });

    
  }

  addRowData(row_obj){
    this.getSuperAdmin();
  }

  updateRowData(row_obj){
    // Api Pending
  }


  ArchiveUser(Email){
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText:{
          ok:'Sure',
          cancel: 'No'
        }
      }
    });

  dialogRef.afterClosed().subscribe((confirmed: boolean) =>{
      if(confirmed){
        this.systemService.ArchiveUser(Email);
        this.getSuperAdmin();
      }
  });
  }
}

// -----------------ModaL ---------------------------

@Component({
  selector:'app-super-admin-add',
  templateUrl:'./super-admin-add-component.html',
  styleUrls: ['./super-admin.component.css']
})

export class AddSuperAdminDialog implements OnInit{
  RegiUser: FormGroup;
  error='';
  submitted = false;
  action:string;
  local_data:any;

  constructor(
  public dialogRef: MatDialogRef<AddSuperAdminDialog>,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private systemService: SystemService,
  @Inject(MAT_DIALOG_DATA) public data: GetUsers){
    this.local_data = {...data};
    this.action = this.local_data.action;
   }

   doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
   }

   closeDialog(){
     this.dialogRef.close({event:'Cancel'})
   }

  ngOnInit(): void{
    this.RegiUser = this.formBuilder.group({
      Name:['', Validators.required],
      Email:['', Validators.email],
      Password:['', Validators.required],
      PhoneNumber:['',Validators.required],
      UserRoleId:['',Validators.required],
      UserMenuId:['', Validators.required]
    });
  }

  get f() { return this.RegiUser.controls; }

  OnSubmit(){
    this.submitted = true;
    if (this.RegiUser.invalid) {
      return;
    }
    this.systemService.UserSignup(this.RegiUser.value)
    .pipe(first())
    .subscribe({
      next:() =>{
        // this.router.navigate(['/'], { relativeTo: this.route});
      }
    })
  }
    
}
