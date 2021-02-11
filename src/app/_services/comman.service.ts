import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn:'root' })

export class CommanService{

    constructor(private http:HttpClient){ }

    userSignup(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/signup`, row_obj);
    }
  
    updateUser(row_obj){
        return this.http.put<any>(`${environment.apiUrl}/api/edit_user`, row_obj);
    }
  
    getUser(){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_user`);
    }
  
    archiveUser(userEmail){
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            body: {
              email: userEmail,
            },
          };
        this.http.delete<any>(`${environment.apiUrl}/api/archive_user`,options)
        .subscribe((s)=>{
            console.log("User Archive");
        });
    }
  
    updateUserStatus(userEmail){
        return this.http.put<any>(`${environment.apiUrl}/api/update_user_status?email=${userEmail}`, {userEmail});
    }
  
    getAllMenu(){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_all_menu`)
    }

    getAssignMenu(){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_menu`);
    }

}