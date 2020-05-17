import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { User, UserReservation } from 'src/app/shared/models';
import { ReservationService, UserService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { jqxPasswordInputComponent } from 'jqwidgets-ng/jqxpasswordinput/public_api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HealthService } from 'src/app/core/services/health-service/health.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid/public_api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewChecked {
  @ViewChild('jqxPassword', { static: false })
  jqxPassword: jqxPasswordInputComponent;
  @ViewChild('grid', { static: false }) jqxGrid: jqxGridComponent;

  user = new User();
  areReservationsLoaded = false;
  isServerDown = false;
  ConfrimDeletion = false;
  wrongPassword = false;
  dataLoaded = false;
  reservations: UserReservation[] = [];
  reservationsToRemove = [];
  source: any = [
    {
      localdata: [],
      datatype: 'array',
      datafields: [
        { name: 'movieTitle', type: 'string' },
        { name: 'dateTime', type: 'string' },
        { name: 'row', type: 'string' },
        { name: 'column', type: 'string' },
        { name: 'price', type: 'string' }
      ]
    }
  ];
  dataAdapter: any;

  public columns: jqwidgets.GridColumn[] = [
    { text: 'Movie Title', datafield: 'movieTitle', width: '250' },
    { text: 'Date Time', datafield: 'dateTime', width: '160' },
    { text: 'Row', datafield: 'row' },
    { text: 'Column', datafield: 'column' },
    { text: 'Price', datafield: 'price' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private reservationService: ReservationService,
    private healthService: HealthService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.healthService
      .checkHealth()
      .pipe(
        catchError(err => {
          this.serverDown(err);
          return of(err);
        })
      )
      .subscribe(_ => {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (this.user === null) {
          alert('You must be signed in to access this page');
          this.router.navigateByUrl('signin');
        }

        this.getReservations();
      });
  }

  ngAfterViewChecked() {
    if (this.jqxPassword) {
      this.jqxPassword.placeHolder('');
    }

    if (!this.dataLoaded && this.reservations.length !== 0) {
      this.source.localdata = this.reservations;
      this.dataAdapter = new jqx.dataAdapter(this.source);
      this.dataLoaded = true;
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
    const deletionRequest = {
      username: this.user.username,
      email: this.user.email,
      password
    };

    this.userService
      .delete(deletionRequest)
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

  gridOnRowSelect(event) {
    const rowData = this.jqxGrid.getrowdata(event.args.rowindex);
    this.reservationsToRemove.push(rowData);
  }

  gridOnRowUnselect(event) {
    const rowData = this.jqxGrid.getrowdata(event.args.rowindex);
    const index = this.reservationsToRemove.findIndex(res => {
      return res.reservationId === rowData.reservationId;
    });

    if (index > -1) {
      this.reservationsToRemove.splice(index, 1);
    }
  }

  deleteReservations() {
    const reservationIds = this.reservationsToRemove.map(
      res => res.reservationId
    );

    this.reservationService
      .deleteByIds(reservationIds)
      .pipe(
        catchError(err => {
          if (err && err.status === 401) {
            this.redirectToLogin();
          }

          this.serverDown(err);
          return of(err);
        })
      )
      .subscribe(response => {
        if (response === null) {
          this.getReservations();
          this.clearGrid();
          alert('Reservation(s) successfully removed');
        }
      });
  }

  serverDown(err) {
    if (err && (err.status === 0 || err.status === 500)) {
      this.isServerDown = true;
    }
  }

  redirectToLogin() {
    alert(
      'You are not authorized to access this page. You will be redirected to sign in page'
    );
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('signin');
  }

  clearGrid() {
    const deleteRowIds = this.reservationsToRemove.map(res => res.uid);
    this.jqxGrid.deleterow(deleteRowIds);
    this.reservationsToRemove = [];
  }

  getReservations() {
    this.reservationService
      .getByUserId(this.user.id)
      .pipe(
        catchError(err => {
          if (err && err.status === 401) {
            this.redirectToLogin();
          }

          return of(err);
        })
      )
      .subscribe(reservations => {
        this.reservations = reservations
          .sort((a, b) => {
            const dateA = new Date(a.dateTime).getTime();
            const dateB = new Date(b.dateTime).getTime();

            return dateA - dateB;
          })
          .sort((a, b) => a.time > b.time)
          .map(res => {
            res.price += ' din.';
            return res;
          });

        this.areReservationsLoaded = true;
      });
  }
}
