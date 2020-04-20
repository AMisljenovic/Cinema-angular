import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Reservation, Movie, Repertory } from 'src/app/shared/models';
import { ReservationService, UserService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { jqxPasswordInputComponent } from 'jqwidgets-ng/jqxpasswordinput/public_api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HealthService } from 'src/app/core/services/health.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('jqxPassword', {static: false}) jqxPassword: jqxPasswordInputComponent;

  user: User;
  isServerDown = false;
  ConfrimDeletion = false;
  wrongPassword = false;
  reservations: Reservation[] = [];
  movies: Movie[] = [];
  repertoires: Repertory[] = [];

  source: any = [
    {
      localdata: [],
      datatype: 'array',
      datafields:
      [
        { name: 'movie', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'time', type: 'string' },
        { name: 'row', type: 'string' },
        { name: 'column', type: 'string' },
        { name: 'price', type: 'string' },
      ]
    }
  ];
  dataAdapter: any;

  public columns: jqwidgets.GridColumn[] = [
    { text: 'Movie', datafield: 'movie'},
    { text: 'Date', datafield: 'date'},
    { text: 'Time', datafield: 'time'},
    { text: 'Row', datafield: 'row'},
    { text: 'Column', datafield: 'column'},
    { text: 'Price', datafield: 'price'},
  ];

  constructor(private router: Router,
              private userService: UserService,
              private reservationService: ReservationService,
              private healthService: HealthService,
              public matDialog: MatDialog) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user === null) {
      alert('You must be signed in to access this page');
      this.router.navigateByUrl('signin');
    }

    this.healthService.checkHealth()
    .pipe(
      catchError(err => {
        this.serverDown(err);
        return of(err);
      })
      )
      .subscribe(_ => console.log(_));

    this.reservationService.getByUserId(this.user.id)
    .pipe(
      catchError(err => {
        if (err && err.status === 401) {
          this.redirectToLogin();
        }
        // ADD logic to bekend to retrevie structure {ReservationId,movieName,Date,time,row,column,price}
        // also maybe to add din. in migration
        return of(err);
      })
    )
    .subscribe(reservations => console.log(reservations));

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
        this.serverDown(err);

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


  serverDown(err) {
    if (err && (err.status === 0 || err.status === 500)) {
      this.isServerDown = true;
    }
  }

  redirectToLogin() {
    alert('You are not authorized to access this page. You will be redirected to sign in page');
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('signin');
  }

}
