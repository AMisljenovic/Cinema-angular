import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn = false;
  signedInAsAdmin = false;

  constructor(private userService: UserService,  private router: Router) {}

  ngOnInit() {
    this.isUserLoggedIn = sessionStorage.getItem('user') !== null;
    if (this.isUserLoggedIn) {
      this.userService.loggedInAsAdmin()
      .pipe(
        catchError(err => {
          if (err && err.status === 200) {
            this.signedInAsAdmin = true;
          }
          return of('ok');
        })
      )
      .subscribe(res => {
      });
    }
  }

  signout() {
    this.userService.signout()
    .subscribe(_ => {
      this.isUserLoggedIn = false;
      sessionStorage.removeItem('user');
      this.router.navigateByUrl('home');
    });
  }

  redirect(route) {
    this.router.navigateByUrl(route);
  }
}
