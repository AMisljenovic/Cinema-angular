import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models';
import { ReservationService, UserService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { jqxPasswordInputComponent } from 'jqwidgets-ng/jqxpasswordinput/public_api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('jqxPassword', {static: false}) jqxPassword: jqxPasswordInputComponent;

  user: User;
  ConfrimDeletion = false;
  wrongPassword = false;

  constructor(private router: Router,
              private userService: UserService,
              private reservationService: ReservationService,
              public matDialog: MatDialog) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user === null) {
      alert('You must be signed in to access this page');
      this.router.navigateByUrl('signin');
    }
  }


  edit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '500px';
    dialogConfig.width = '480px';
    dialogConfig.data = this.user;
    dialogConfig.data.newPassword = '';

    this.matDialog.open(ProfileModalComponent, dialogConfig);
  }

  deleteUser() {
    this.ConfrimDeletion = !this.ConfrimDeletion;
  }

  confirm() {
    const password = this.jqxPassword.val();
    const deletionRequest = {username: this.user.username, email: this.user.email, password};

    this.userService.delete(deletionRequest)
    .pipe(
      catchError(err => {
        if (err && err.status === 401) {
          this.wrongPassword = true;
        }

        return of(err);
      })
    )
    .subscribe(res => {
      if (res && res.status === 200) {
        this.wrongPassword = false;
        alert('Your account has been successfully deleted.');
        sessionStorage.removeItem('user');
        this.router.navigateByUrl('home');
      }
    });
  }


}
