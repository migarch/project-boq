import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { RegisterProjectsComponent } from 'src/app/_dailog/register-projects/register-projects.component';
import { Project, User } from 'src/app/_models';
import { SuperService } from 'src/app/_services/super-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  loading= false;
  user:User;
  projects: Project[] = [];
  displayedColumns2 = ['ProjectName','StartDate','EndDate','ClientName','ArchitectName','TypeOfProject','projectDetails','measurementSheet','Action'];
  dataSource;

  constructor(
    private superService: SuperService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator, { static:true}) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getProjects(){
    this.loading = true;
    this.superService.getProject()
    .pipe(first())
    .subscribe(res =>{
      this.loading = false;
      this.projects = res;
      this.dataSource = new MatTableDataSource(this.projects);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openProjectDialog(action, obj){
    obj.action = action;
    const dialogRef = this.dialog.open(RegisterProjectsComponent,{
      disableClose: true,
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
    this.loading = true
    this.superService.addProject(row_obj)
    .pipe(first())
    .subscribe({
      next:() =>{
        this.loading = false
        this.getProjects();
        Swal.fire({
          title: 'Project register successfull',
          icon:'success',
          timer:1500,
        });
      }, error: error =>{
        Swal.fire(error,'','error')
      }
    });
  }

  updateProjectData(row_obj){
    this.loading = true;
    this.superService.updateProject(row_obj)
    .pipe(first())
    .subscribe({
      next:() =>{
        this.loading = false;
        this.getProjects();
        Swal.fire({
          title: 'Project update successfull',
          icon:'success',
          timer:1500,
        });
      }, error: error =>{
        Swal.fire(error,'','error')
      }
    });
  }

  deleteProject(projectId){
    this.loading = true
    Swal.fire({
        title: 'Are you sure delete?',
        icon:'warning',
        showCancelButton: true,
        confirmButtonText: 'Confrim',
        cancelButtonText: 'Cancel',
        cancelButtonColor:'red',
        allowOutsideClick: false,
        allowEscapeKey: true,
      }).then((result) => {
        if(result.value) {
          this.superService.archiveProject(projectId).pipe(first())
          .subscribe({
            next:() =>{
              this.loading = false;
              this.getProjects();
              Swal.fire({
                title: 'User delete successfully',
                icon:'success',
                timer:2000,
              });
            }, error:error =>{
              Swal.fire({
                title: error,
                icon:'error',
                timer:2000,
              });
            }
          });   
        }
    });
  }

  ngOnInit(): void {
    this.getProjects();
  }

}
