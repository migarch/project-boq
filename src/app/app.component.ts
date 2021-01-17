import { Component } from '@angular/core';
import { AuthenticationService } from './services';
import { Role, User } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User;
  constructor(
    private authenticationService: AuthenticationService
  ){
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isSystem(){
    return this.user && this.user.role == Role.System;
  }

  get isSuper(){
    return this.user && this.user.role == Role.Super;
  }

  OnLogout(){
    this.authenticationService.logout();
  }
}
