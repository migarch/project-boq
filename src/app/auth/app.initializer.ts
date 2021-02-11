
import { AuthenticationService } from "../_services/authentication.service";

export function appInitializer(authenticationService: AuthenticationService){
    return () => new Promise(resolve => {
        authenticationService.refreshToken()
        .subscribe()
        .add(resolve);
    })
}