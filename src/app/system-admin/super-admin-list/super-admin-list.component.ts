import { Component, OnInit, ViewChild } from '@angular/core';
import { userDetails } from 'src/app/_models/user-details';
import { CommanService } from 'src/app/_services/comman.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { RegisterSuperAdminComponent } from 'src/app/_dailog/register-super-admin/register-super-admin.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin-list',
  templateUrl: './super-admin-list.component.html',
  styleUrls: ['./super-admin-list.component.css']
})
export class SuperAdminListComponent implements OnInit {
  error = '';
  loading = false;
  displayedColumns = ['Name','Email', 'PhoneNumber', 'UserRoleId','Active', 'Action', 'Delete'];
  dataSource;
  users: userDetails[] = [];
  toggleValue = false;

  constructor(
    private commanSerive: CommanService,
    public dialog: MatDialog,
  ) { }

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
      this.commanSerive.getUser()
      .pipe(first())
      .subscribe(res =>{
        this.loading = false;
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  openDialog(action, obj){
    obj.action = action;
    const dialogRef  = this.dialog.open(RegisterSuperAdminComponent,{
      disableClose: true,
      data:obj
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Add'){
        this.addUserData(result.data);
      }else if(result.event == 'Update'){
        this.updateUserData(result.data);
      }
    }); 
  }

  addUserData(row_obj){
    // this.commanSerive.userSignup(row_obj)
    // .pipe(first())
    // .subscribe({
    //   next:() =>{
    //     this.getSuperAdmin();
    //     Swal.fire({
    //       title: 'Register Successfull',
    //       icon:'success',
    //       timer:2000,
    //     });
    //   },
    //   error: error =>{
    //     Swal.fire(error,'','error')
    //   }
    // });
  }

  updateUserData(row_obj){
    this.commanSerive.updateUser(row_obj)
    .pipe(first())
    .subscribe({
      next:() =>{
        this.getSuperAdmin();
        Swal.fire({
          title: 'Update Successfull',
          icon:'success',
          timer:2000,
        });
      },
      error: error =>{
        Swal.fire(error,'','error');
      }
    });
  }

  archiveUsers(userEmail){
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
            this.commanSerive.archiveUser(userEmail);
            this.getSuperAdmin();
            Swal.fire({
              title: 'User delete successfully',
              icon:'success',
              timer:2000,
            });
        }
      })
  }

  changeStatus(userEmail){
    Swal.fire({
      title: 'Are you sure change status?',
      icon:'warning',
      showCancelButton: true,
      confirmButtonText: 'Confrim',
      cancelButtonText: 'Cancel',
      cancelButtonColor:'red',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if(result.value) {
          this.commanSerive.updateUserStatus(userEmail)
          .pipe(first())
          .subscribe({
            next:() =>{
              this.getSuperAdmin();
              Swal.fire({
                title: 'Change status successfully',
                icon:'success',
                timer:1000,
              });
            }
          });
      } 
      else if (result.dismiss === Swal.DismissReason.cancel){
        this.getSuperAdmin();
      }
    })
  }

}
