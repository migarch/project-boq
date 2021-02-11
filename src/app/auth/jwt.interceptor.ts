import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthenticationService } from "../_services/authentication.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable()

export class JwtInterceptor implements HttpInterceptor{
    constructor(
        private authenticationService: AuthenticationService
    ){ }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if(isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'Content-type': 'application/json',
                    Authorization: `${user.token}`
                }
            });
        }
        return next.handle(request);
    }
}