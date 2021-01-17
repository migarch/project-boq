import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/_modal/confirmation-dialog.component';
import { AuthenticationService } from '../services';
import { SystemService } from '../services/system.service';
import { Role, User } from '../shared';
import { Company } from '../shared/company';
import { RegisterCompanyComponent } from '../system-admin/register-company/register-company.component';
import { AddSuperAdminDialog } from '../system-admin/register-super-admin/super-admin.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  loading= false;
  user: User;
  displayedColumns = [];
  dataSource;
  company: Company[] = [];
  dialogValue: string;
  sendValue: string;
  public RowID;
  
  constructor(
    private authenticationService: AuthenticationService,
    private systemService: SystemService,
    public dialog: MatDialog,
  ) {
    this.user = this.authenticationService.userValue;
   }

  get isSystem(){
    return this.user && this.user.role == Role.System;
  }

  get isSuper(){
    return this.user && this.user.role == Role.Super;
  }
   
  @ViewChild(MatPaginator, { static:true}) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onRegister(){
   
    const dialogRef = this.dialog.open(RegisterCompanyComponent,{
      data: { pageValue: this.sendValue},
    });

    dialogRef.afterClosed().subscribe(result =>{
      this.dialogValue = result.data;
    });
  }

  ngOnInit(): void {

    this.getCompany();
    
  }

  getCompany(){
    this.loading = true;
    if(this.user.role == Role.System){
      this.systemService.GetAllRegisterCompany()
      .pipe(first())
      .subscribe(systems =>{
        this.loading = false;
        this.company = systems;
        this.displayedColumns = ['ContactEmail', 'CompanyName','ContactPhone','CompanyType','AddUser' ,'Edit','Delete'];
        this.dataSource = new MatTableDataSource(this.company);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      });
    }
  }

  openDialog(action, obj){
    obj.action = action;
    const dialogRef = this.dialog.open(AddSuperAdminDialog,{
      data:obj
    });
  }

  getRecord(row){
    const dialogConfi = new MatDialogConfig();
    dialogConfi.disableClose = true;
    dialogConfi.autoFocus = true;
    dialogConfi.data = row ;
    const dialogRef = this.dialog.open(RegisterCompanyComponent, dialogConfi);
  }

  DeleteRecord(ContactEmail){
    const sendEmail = {email:ContactEmail};
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
        this.systemService.ArchiveCompany(ContactEmail);
        this.getCompany();
      }
  });
    

  }

  applyFilter(fiterValue: string){
    this.dataSource.filter = fiterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage;
    }
  }
}
