import { Component, ChangeDetectorRef, OnDestroy, OnInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models';
import { NavItem } from './_models/nav-item';
import { first } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @Input() getMenuList: NavItem[];
  user: User;
  constructor(
    private authenticationService: AuthenticationService,
    private auth: AuthenticationService, private router: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.authenticationService.user.subscribe(x => {
      this.user = x;
      if (this.user) {
        this.auth.getAssignMenu()
          .pipe(first())
          .subscribe(resp => {
            this.getMenuList = resp;
            this.router.events.subscribe(event => {
              if (event instanceof NavigationEnd) {
                if (this.router.url.includes('project/details')) {
                  switch (this.user.role) {
                    case 2:
                      this.getMenuList.push({
                        id: 0,
                        displayName: 'test',
                        iconName: 'calendar_view_month',
                        route: 'project/details/view/1'
                      })
                      break;
                    case 3:
                      this.getMenuList.push({
                        id: 0,
                        displayName: 'Demo3',
                        iconName: 'desktop_windows',
                        route: '/admin'
                      })
                      break;
                    case 4:
                      this.getMenuList.push({
                        id: 0,
                        displayName: 'Demo4',
                        iconName: 'desktop_windows',
                        route: '/admin'
                      })
                      break;

                    default:
                      break;
                  }
                } else {
                  this.auth.getAssignMenu()
                    .pipe(first())
                    .subscribe(resp => {
                      this.getMenuList = resp;
                    })
                }
              }
            });
          });
      }
    });

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener)
  }

  // getMenuList: NavItem [] = [];

  ngOnInit(): void {

  }

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  onLogout() {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
