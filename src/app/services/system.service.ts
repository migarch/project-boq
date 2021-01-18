import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Company } from "../shared/company";
import { environment } from "src/environments/environment";
import { GetUsers } from "../system-admin/system-shared/getuser";

@Injectable({ providedIn: 'root' })
export class SystemService{
    constructor(
        private http: HttpClient,
    ){ }

    RegisterCompany(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/add_company`, row_obj);
    }

    GetAllRegisterCompany(){
       return this.http.get<any>(`${environment.apiUrl}/api/fetch_company`);
    }

    UpdateComapny(row_obj){
      return this.http.put<any>(`${environment.apiUrl}/api/update_company`, row_obj);
    }

    ArchiveCompany(id){
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              company_id: id,
            },
          };
        this.http.delete<any>(`${environment.apiUrl}/api/archive_company`,options)
        .subscribe((s)=>{
            console.log("Company delete");
        });
    }

    UserSignup(users: GetUsers){
      return this.http.post<any>(`${environment.apiUrl}/api/signup`, users);
    }

    GetUser(){
      return this.http.get<any>(`${environment.apiUrl}/api/fetch_user`);
    }

    ArchiveUser(Email){
      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: {
            email: Email,
          },
        };
      this.http.delete<any>(`${environment.apiUrl}/api/archive_user`,options)
      .subscribe((s)=>{
          console.log("User Archive");
      });
    }
}