import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { SystemService } from "../_services/system-admin.service";
import { Company, User } from "../_models";
import { first } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { RegisterCompanyComponent } from "../_dailog/register-company/register-company.component";
import { RegisterSuperAdminComponent } from "../_dailog/register-super-admin/register-super-admin.component";
import Swal from "sweetalert2";

@Component({
    selector:'app-system-admin',
    templateUrl: './system-admin.component.html',
})
export class SystemAdmin implements OnInit{
    loading= false;
    user: User;
    company: Company[] = [];
    displayedColumns = ['CompanyName','ContactEmail','ContactPhone','CompanyType','AddUser' ,'Edit','Delete'];
    dataSource;

    constructor(
        private systemService: SystemService,
        public dialog: MatDialog,
    ){ }

    @ViewChild(MatPaginator, { static:true}) paginator:MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

        public getCompany(){
            this.loading = true;
            this.systemService.getRegisterCompany()
                .pipe(first())
                .subscribe(resp =>{
                    this.loading = false;
                    this.company = resp;
                    this.dataSource = new MatTableDataSource<Company>(this.company);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                });
        }
    
        onRegisterCompany(action, obj){
            obj.action = action;
            const dialogRef = this.dialog.open(RegisterCompanyComponent,{
                disableClose: true,
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
            console.log(row_obj);
            // this.systemService.registerCompany(row_obj)
            //     .pipe(first())
            //     .subscribe({
            //         next:() =>{
            //             this.getCompany();
            //             Swal.fire({
            //                 title: 'Register Successfull',
            //                 icon:'success',
            //                 timer:2000,
            //               });
            //         }, error: error =>{
            //             Swal.fire(error,'','error')
            //         }
            //     });
        }
    
        updateCompanyData(row_obj){
            console.log(row_obj);
            this.systemService.updateRegisterComapny(row_obj)
                .pipe(first())
                .subscribe({
                next:() =>{
                    this.getCompany();
                    Swal.fire({
                        title: 'Update Successfull',
                        icon:'success',
                        timer:2000,
                      });
                }, error: error =>{
                    Swal.fire(error,'','error');
                }
            });
        }

        deleteCompany(companyId){
            Swal.fire({
                title: 'Are you sure delete this company?',
                icon:'warning',
                showCancelButton: true,
                confirmButtonText: 'Confrim',
                cancelButtonText: 'Cancel',
                cancelButtonColor:'red',
                allowOutsideClick: false,
                allowEscapeKey: true,
              }).then((result) => {
                if(result.value) {
                    this.systemService.archiveCompany(companyId)
                    .pipe(first())
                    .subscribe({
                        next:() =>{
                            this.getCompany();
                            Swal.fire({
                                title: 'Delete Successfull',
                                icon:'success',
                                timer:2000,
                              });
                        },error: error =>{
                            Swal.fire(error,'','error');
                        }
                    });
                }
              })
        }
    
        ngOnInit(): void {
            this.getCompany();
        }

        applyFilter(fiterValue: string){
            this.dataSource.filter = fiterValue.trim().toLowerCase();
            if(this.dataSource.paginator){
                this.dataSource.paginator.firstPage;
            }
        }
        
        // add super admin dialog
        openDialog(action, obj){
        obj.action = action;
        const dialogRef = this.dialog.open(RegisterSuperAdminComponent,{
            disableClose: true,
            data:obj
        });
        }
}