import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Project } from "../shared/project";

@Injectable({providedIn: 'root'})

export class SuperService{
    constructor(private http: HttpClient){}

    getProject(){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_project`);
    }

    addProject(project: Project){
        return this.http.post<any>(`${environment.apiUrl}/api/add_project`, project);
    }
}