import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})

export class SuperService{
    constructor(private http: HttpClient){}

    getProject(){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_project`);
    }

    addProject(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/add_project`, row_obj);
    }

    updateProject(row_obj){
        return this.http.put<any>(`${environment.apiUrl}/api/update_project`, row_obj);
    }

    archiveProject(projectId){
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            body: {
                project_id: projectId
            },
          };
        return this.http.delete<any>(`${environment.apiUrl}/api/archive_project`,options);
    }
}