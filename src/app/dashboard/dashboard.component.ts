import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services';
import { SystemService } from '../services/system.service';
import { Role, User } from '../shared';
import { Company } from '../shared/company';
import { RegisterCompanyComponent } from '../system-admin/register-company/register-company.component';

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
  systems: Company[] = [];
  dialogValue: string;
  sendValue: string;
  
  constructor(
    private authenticationService: AuthenticationService,
    private systemService: SystemService,
    public dialog: MatDialog,
  ) {
    this.user = this.authenticationService.userValue;
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

  getRecord(id){
    console.log("get id", this.systems);
    const dialogRef = this.dialog.open(RegisterCompanyComponent,{
      data: { pageValue: this.sendValue},
    });
  }

  getCompany(){
    this.loading = true;
    if(this.user.role == Role.System){
      this.systemService.GetAllRegisterCompany()
      .pipe(first())
      .subscribe(systems =>{
        this.loading = false;
        this.systems = systems;
        this.displayedColumns = Object.keys(this.systems[0]);
        this.dataSource = new MatTableDataSource(this.systems);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
      });
    }
  }

  applyFilter(fiterValue: string){
    this.dataSource.filter = fiterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage;
    }
  }
}
