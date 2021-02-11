import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models';
import { NavItem } from './_models/nav-item';
import { first } from 'rxjs/operators';
import { CommanService } from './_services/comman.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user: User;
  useremail;
  constructor(
    private authenticationService: AuthenticationService,
    private commanServe: CommanService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ){ 
    this.authenticationService.user.subscribe(x => this.user = x);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener)
  }

  getMenuList: NavItem [] = [];

  ngOnInit(): void{
    this.useremail = this.user.email;
    this.commanServe.getAssignMenu()
    .pipe(first())
    .subscribe(resp =>{
        this.getMenuList = resp;
    })
  }

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  onLogout(){
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
