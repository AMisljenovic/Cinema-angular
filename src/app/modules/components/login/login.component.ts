import { Component, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { jqxInputComponent } from 'jqwidgets-ng/jqxinput';
import { jqxPasswordInputComponent } from 'jqwidgets-ng/jqxpasswordinput';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('emailUsername', {static: false}) emailUsername: jqxInputComponent;
  @ViewChild('password', {static: false}) password: jqxPasswordInputComponent;

  private worngUserOrPassword = false;
  private inputCredentials = false;

  constructor(private userService: UserService,
              private router: Router) { }

  login() {
    const emailUsername = this.emailUsername.val();
    const password = this.password.val();
    this.inputCredentials = !(emailUsername && password);

    const username = this.emailUsername.val().includes('@') ? '' : this.emailUsername.val();
    const email = this.emailUsername.val().includes('@') ? this.emailUsername.val() : '';

    this.userService.login(username, email, password)
    .pipe
    (
      catchError(err => {
        if (err.status === 401) {
          this.worngUserOrPassword = true;
        }
        return of(err);
      })
    )
    .subscribe(res => {
      if (res && res.status === 0) {
        return;
      }

      sessionStorage.setItem('user', JSON.stringify(res));
      this.router.navigateByUrl('home');
    });


  }
}
