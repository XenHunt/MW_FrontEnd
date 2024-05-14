import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Signal, computed } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// import { MatListModule } from '@angular/material/list';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { NgIf, NgFor } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private subscription?: Subscription;
  authed = false;
  routes = [
    { name: "Home", link: "/" },
    { name: 'Login', link: '/login' },
    { name: 'Admin', link: '/admin' },
    { name: 'Second', link: '/second' },
    { name: 'Not', link: '/not' },
    { name: 'Users', link: '/users' }
  ];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthenticationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => {
      this.authed = !!user
    })
  }

  ngOnDestroy(): void {
    // this.mobileQuery.removeListener(this._mobileQueryListener);
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscription?.unsubscribe()
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  logout() {
    this.authService.logout()
  }
}
