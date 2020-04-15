import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {

  isUserLoggedIn = false;

  constructor(private userService: UserService,  private router: Router) {}

  ngOnInit() {
    this.isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn') === 'true';
  }

  ngOnChanges() {
    this.isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn') === 'true';
  }

  logout() {
    this.userService.logout()
    .subscribe(_ => {
      this.isUserLoggedIn = false;
      sessionStorage.removeItem('isUserLoggedIn');
      this.router.navigateByUrl('home');
    });
  }
}
