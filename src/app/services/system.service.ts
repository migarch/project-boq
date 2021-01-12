import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Company } from "../shared/company";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SystemService{
    constructor(
        private http: HttpClient,
    ){ }

    RegisterCompany(company: Company){
        return this.http.post<any>(`${environment.apiUrl}/api/add_company`, company);
    }

    GetAllRegisterCompany(){
       return this.http.get<any>(`${environment.apiUrl}/api/fetch_company`);
    }

    ArchiveCompany(ContactEmail){
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              email: ContactEmail,
            },
          };
        this.http.delete<any>(`${environment.apiUrl}/api/archive_company`,options)
        .subscribe((s)=>{
            console.log("Company delete");
        });
    }
}