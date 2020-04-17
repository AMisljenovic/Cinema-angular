import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn = false;

  constructor(private userService: UserService,  private router: Router) {}

  ngOnInit() {
    this.isUserLoggedIn = sessionStorage.getItem('user') !== null;
  }

  logout() {
    this.userService.logout()
    .subscribe(_ => {
      this.isUserLoggedIn = false;
      sessionStorage.removeItem('user');
      this.router.navigateByUrl('home');
    });
  }
}
