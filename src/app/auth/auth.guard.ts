import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Role } from "../_models";
import { AuthenticationService } from "../_services/authentication.service";

@Injectable({providedIn:'root'})

    export class AuthGuard implements CanActivate {
        constructor(
            private router: Router,
            private authenticationService: AuthenticationService
        ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const user = this.authenticationService.userValue;
        if(user){
            if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
                    if(user.role === Role.System){
                        this.router.navigate(['/system-dashboard']);
                    }
                    else if(user.role === Role.Super){
                        this.router.navigate(['/super-dashboard']);
                    }
                    return false;
                }
                return true;
        }
        this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url } });
        return false;

    }
}