import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SystemService{
    constructor(
        private http: HttpClient,
    ){ }
    
    getRegisterCompany(){
       return this.http.get<any>(`${environment.apiUrl}/api/fetch_company`);
    }

    registerCompany(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/add_company`, row_obj);
    }

    updateRegisterComapny(row_obj){
      return this.http.put<any>(`${environment.apiUrl}/api/update_company`, row_obj);
    }

    archiveCompany(companyId){
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              company_id: companyId,
            },
          };
        return this.http.delete<any>(`${environment.apiUrl}/api/archive_company`,options);
       
    }

}