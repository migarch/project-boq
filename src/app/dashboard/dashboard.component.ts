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
  
  constructor(
    private authenticationService: AuthenticationService,
    private systemService: SystemService,
    private superService: SuperService,
    public dialog: MatDialog) {
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

  // System admin related

  public getCompany(){
    this.loading = true;
      this.systemService.GetAllRegisterCompany()
      .pipe(first())
      .subscribe(resp =>{
        this.loading = false;
        this.company = resp;
        this.displayedColumns = ['ContactEmail', 'CompanyName','ContactPhone','CompanyType','AddUser' ,'Edit','Delete'];
        this.dataSource = new MatTableDataSource(this.company);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  onRegisterCompany(action, obj){
    obj.action = action;
    const dialogRef = this.dialog.open(RegisterCompanyComponent,{
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Add'){
        this.addCompanyData(result.data);
      }else if(result.event == 'Update'){
        this.updateCompanyData(result.data);
      }
    });
  }

  addCompanyData(row_obj){
    this.systemService.RegisterCompany(row_obj)
    .pipe(first())
    .subscribe({
      next:() =>{
        this.getCompany();
      }
    });
  }

  updateCompanyData(row_obj){
    this.systemService.UpdateComapny(row_obj)
    .pipe(first())
    .subscribe({
      next:() =>{
        this.getCompany();
      }
    });
  }

  deleteCompany(id){
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
      if(confirmed == true){
        this.systemService.ArchiveCompany(id); 
      }
  });
    

  }

  // add super admin dialog
  openDialog(action, obj){
    obj.action = action;
    const dialogRef = this.dialog.open(AddSuperAdminDialog,{
      data:obj
    });
  }

  // Super Admin related code

  getProject(){
    this.loading = true;
    this.superService.getProject()
    .pipe(first())
    .subscribe(resPro => {
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
        this.addProjectData(result.data);
      }else if(result.event == 'Update'){
        this.updateProjectData(result.data);
      }
    });
  }

  addProjectData(row_obj){
    this.getProject();
  }

  updateProjectData(row_obj){
    this.superService.updateProject();
  }

  deleteProject(id){
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
        this.superService.archiveProject(id);
        this.getProject();
      }
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

  applyFilter(fiterValue: string){
    this.dataSource.filter = fiterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage;
    }
  }

}
