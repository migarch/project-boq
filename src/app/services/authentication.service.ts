import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators"
import { User } from "../shared";

@Injectable({providedIn:'root'})
export class AuthenticationService{
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    constructor(
        private router: Router,
        private http: HttpClient
    ){
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue():User{
        return this.userSubject.value;
    }

    login(email:string, password:string){
        return this.http.post<any>(`${environment.apiUrl}/api/login`, {email, password})
        .pipe(tap(user =>{
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
        }));
    }


    refreshToken(){
        return this.http.get<any>(`${environment.apiUrl}/api/refresh`,{ })
        .pipe(map(user => {
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
        }));

    }

    private refreshTokenTimeout;

    private startRefreshTokenTimer(){
        const jwttoken = JSON.parse(atob(this.userValue.token.split('.')[1]));
        this.userValue.email = jwttoken.email;
        this.userValue.role = jwttoken.role;
        const expires = new Date(jwttoken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        const refresh = timeout - 100;
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe((fun =>{
            console.log("refresh");
        })), refresh);
        // this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer(){
        clearTimeout(this.refreshTokenTimeout);
    }

    logout(){
        localStorage.removeItem('user');
        this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}