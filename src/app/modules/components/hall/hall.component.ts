import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HallService, UserService, RepertoryService, ReservationService } from 'src/app/core/services';
import {  Hall, SeatPosition, Repertory, Reservation, User } from 'src/app/shared/models';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxButtonComponent } from 'jqwidgets-ng/jqxbuttons';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit, AfterViewChecked {
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  @ViewChild('jqxButton', { static: false }) jqxButton: jqxButtonComponent;
  private seatImageUrl = '../../../../assets/seat.png';
  private repertoryIdParamName = 'repertoryId';
  private hallIdParamName = 'hallId';
  private repertoryId = '';
  private jqxGridPagerDisabled = false;
  private jqxGridOneTime = true;
  private cellsRendered = true;
  private reservationLimit = false;
  isHallIdValid = true;
  isRepertoryIdValid = true;
  columnPropNames: string[] = [];
  seats: number[];
  user: User;
  userReservationsSeats: number[];
  userReservations: Reservation[];
  dataAdapter: any;
  seatPosition: SeatPosition[] = [];
  hall = new Hall();
  repertory: Repertory;
  private pagerHeight: number;
  private jqxGridHeight: number;
  private jqxGridDiv: HTMLElement;

  source: any = [
    {
      localdata: [] = [],
      datatype: 'array',
      datafields:
      [
        { name: 'column0', type: 'string' },
        { name: 'column1', type: 'string' },
        { name: 'column2', type: 'string' },
        { name: 'column3', type: 'string' },
        { name: 'column4', type: 'string' },
      ]
    }
  ];

  imagerenderer(row, datafield, value) {
    return `<img id="${row}-${datafield}" style="margin-top: 20%;margin-left: 22%" height="60" width="70" src="${value}"/>`;
 }


  // tslint:disable-next-line: member-ordering
  public columns: jqwidgets.GridColumn[] = [
    {text: 'column0', datafield: 'column0', width: 120, cellsrenderer: this.imagerenderer},
    {text: 'column1', datafield: 'column1', width: 120, cellsrenderer: this.imagerenderer},
    {text: 'column2', datafield: 'column2', width: 120, cellsrenderer: this.imagerenderer},
    {text: 'column3', datafield: 'column3', width: 120, cellsrenderer: this.imagerenderer},
    {text: 'column4', datafield: 'column4', width: 120, cellsrenderer: this.imagerenderer},
  ];

  constructor(private route: ActivatedRoute,
              private hallService: HallService,
              private reservationService: ReservationService,
              private router: Router,
              private repertoryService: RepertoryService,
              public matDialog: MatDialog) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.repertoryId = this.route.snapshot.params[this.repertoryIdParamName];
    const hallId = this.route.snapshot.params[this.hallIdParamName];

    this.repertoryService.getRepertory(this.repertoryId)
    .subscribe(repertory => {
      if (repertory === null) {
        this.isRepertoryIdValid = false;
        return;
      }
      this.repertory = repertory;
    });

    this.reservationService.getByRepertoryId(this.repertoryId)
    .pipe
    (
      catchError(err => {
        if (err && err.status === 401) {
          this.redirectToLogin();
        }
        return of(err);
      })
    )
    .subscribe(seats => {
      this.hallService.get(hallId).subscribe(hall => {
        if (hall === null) {
          this.isHallIdValid = false;
          return;
        }
        this.seats = seats;
        this.hall = hall;
        this.hallrender(hall);
      });
    });

    this.reservationService.getByRepertoryAndUserId(this.repertoryId, this.user.id)
    .pipe
    (
      catchError(err => {
        return of(err);
      })
    )
    .subscribe(seats => {
      this.userReservationsSeats = seats;
    });
  }

  redirectToLogin() {
    alert('You are not authorized to access this page. You will be redirected to sign in page');
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('signin');
  }

  ngAfterViewChecked() {
    if (!this.jqxGridPagerDisabled) {
      const elements = Array.from(document.getElementsByClassName('jqx-grid-cell jqx-item'));
      elements.forEach(element => {
        const converted = element as HTMLElement;
        converted.style.border = 'none';
      });

      // tslint:disable-next-line: max-line-length
      const pager = document.getElementsByClassName('jqx-clear jqx-position-absolute jqx-grid-statusbar jqx-widget-header')[0] as HTMLElement;
      this.pagerHeight = +pager.style.height.split('px')[0];

      this.jqxGridDiv = document.getElementsByClassName('jqx-grid jqx-reset jqx-rc-all jqx-widget jqx-widget-content')[0] as HTMLElement;
      this.jqxGridDiv.style.border = 'black';
      this.jqxGridHeight =  +this.jqxGridDiv.style.height.split('px')[0];
    }

    this.renderSeats();
  }

  hallrender(hall: Hall) {
    for (let index = 0; index < hall.columns; index++) {
      const columnPropName = `column${index}`;
      this.columnPropNames.push(columnPropName);
    }
    const seats = [];
    for (let index = 0; index < hall.rows; index++) {
      const row = {
        column0: this.seatImageUrl,
        column1: this.seatImageUrl,
        column2: this.seatImageUrl,
        column3: this.seatImageUrl,
        column4: this.seatImageUrl
      };

      seats.push(row);
    }


    this.source.localdata = seats;
    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  cellSelected(event: any) {
    const seatRow = +event.args.rowindex;
    const seatColumn = +event.args.datafield.split('column')[1];

    if (this.seats[seatRow][seatColumn] === 1 || this.userReservationsSeats[seatRow][seatColumn] === 1) {
      this.jqxGrid.unselectcell(event.args.rowindex, event.args.datafield);
      return;
    }
    this.seatPosition.push({row: seatRow, column: seatColumn});
  }

  cellUnselected(event: any) {
    const seatRow = +event.args.rowindex;
    const seatColumn = +event.args.datafield.split('column')[1];

    const index = this.seatPosition.findIndex(seat => {
      return seat.row === seatRow && seat.column === seatColumn;
    });

    if (index > -1) {
      this.seatPosition.splice(index, 1);
    }
  }

  openModal() {
    if (this.reservationsOverLimit()) {
      this.reservationLimit = true;
      return;
    }

    this.reservationLimit = false;
    const totalPrice = this.seatPosition.length * this.repertory.price;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '600px';
    dialogConfig.width = '480px';
    dialogConfig.data = {
      seats: this.seatPosition,
      totalPrice
    };

    this.matDialog.open(ModalComponent, dialogConfig)
    .afterClosed()
    .subscribe(seatsReserved => {
      if (seatsReserved) {
        this.postReservations();
      }
    });
  }

  private reservationsOverLimit() {
    let numberOfReservations = 0;

    for (let i = 0; i < 5; i++) {
      for (let y = 0; y < 5; y++) {
        numberOfReservations = this.userReservationsSeats[i][y] === 1 ? numberOfReservations + 1 : numberOfReservations;
      }
    }

    return (numberOfReservations + this.seatPosition.length) > 10;
  }

  private postReservations() {
    const reservations: Reservation[] = [];
    this.seatPosition.forEach(seat =>  {
        reservations.push({
          id: '',
          repertoryId: this.repertoryId,
          seatRow: seat.row,
          seatColumn: seat.column,
          userId: this.user.id
        });
    });

    this.seatPosition.forEach(seat =>  {
      this.jqxGrid.unselectcell(seat.row, this.columns[seat.column].datafield);
    });

    this.reservationService.postReservations(reservations)
    .pipe(
      catchError(err => {
        if (err && err.status === 401) {
          this.sessionExpired();

          return of(err);
        }
      })
    )
    .subscribe(_ => {
      this.reservationService.getByRepertoryAndUserId(this.repertoryId, this.user.id)
      .pipe(
        catchError(err => {
          if (err && err.status === 401) {
            this.sessionExpired();

            return of(err);
          }
        })
      )
      .subscribe(seats => {
        this.userReservationsSeats = seats;
        this.cellsRendered = true;
        this.renderSeats();
      });
    });
  }

  private renderSeats() {
    if (this.seats && this.userReservationsSeats && this.cellsRendered) {
      for (let i = 0; i < 5; i++) {
        for (let y = 0; y < 5; y++) {
          if (this.userReservationsSeats[i][y] === 1) {
            const cell = document.getElementById(`${i}-column${y}`) as HTMLElement;
            cell.parentElement.style.backgroundColor = 'dodgerblue';
          } else if (this.seats[i][y] === 1) {
            const cell = document.getElementById(`${i}-column${y}`) as HTMLElement;
            cell.parentElement.style.backgroundColor = '#FFC700';
          }
        }
      }

      if (this.jqxGridOneTime) {
        this.jqxGridDiv = document.getElementsByClassName('jqx-grid jqx-reset jqx-rc-all jqx-widget jqx-widget-content')[0] as HTMLElement;
        this.jqxGridDiv.style.height = `${this.jqxGridHeight - this.pagerHeight - 2}px`;
        this.jqxGridOneTime = false;
      }

      this.cellsRendered = false;
    }
  }

  sessionExpired() {
    alert('Your session has expired. Please sign in again');
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('signin');
  }
}
