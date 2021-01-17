import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/_modal/confirmation-dialog.component';
import { AuthenticationService } from '../services';
import { SuperService } from '../services/super.service';
import { SystemService } from '../services/system.service';
import { Role, User } from '../shared';
import { Company } from '../shared/company';
import { Project } from '../shared/project';
import { AddProjectModalComponent } from '../super-admin/add-project-modal/add-project-modal.component';
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
  project: Project[] = [];
  dialogValue: string;
  sendValue: string;
  public RowID;
  
  constructor(
    private authenticationService: AuthenticationService,
    private systemService: SystemService,
    private superService: SuperService,
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
    if(this.user.role == Role.System){
      this.getCompany();
    }
    else if(this.user.role == Role.Super){
      this.getProject();
    }
    
  }

  getCompany(){
    this.loading = true;
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

  // Super Admin

  getProject(){
    this.loading = true;
    this.superService.getProject()
    .pipe(first())
    .subscribe(resPro => {
      console.log(resPro);
      this.loading = false;
      this.project = resPro;
      this.displayedColumns = ['ProjectName','StartDate','EndDate','ClientName','ArchitectName','TypeOfProject','Action','Delete'];
      this.dataSource = new MatTableDataSource(this.project);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  openProjectDialog(action, obj){
    obj.action = action;
    const dialogRef = this.dialog.open(AddProjectModalComponent,{
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
    this.getProject();
  }

  updateRowData(row_obj){

  }

  

}
