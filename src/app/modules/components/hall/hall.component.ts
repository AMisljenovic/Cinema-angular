import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HallService, TicketService, UserService } from 'src/app/core/services';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { Ticket, Hall, SeatPosition } from 'src/app/shared/models';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  @ViewChild('jqxButton', { static: false }) jqxButton: jqxButtonComponent;
  private seatImageUrl = '../../../../assets/seat.png';
  private repertoryIdParamName = 'repertoryId';
  private hallIdParamName = 'hallId';
  private jqxGridPagerDisabled = false;
  private cellsRendered = true;
  columnPropNames: string[] = [];
  seats: number[];
  userReservations: number[];
  dataAdapter: any;
  seatPosition: SeatPosition[] = [];
  hall = new Hall();
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
              private ticketService: TicketService,
              private userService: UserService,
              public matDialog: MatDialog) { }

  ngOnInit() {
    const repertoryId = this.route.snapshot.params[this.repertoryIdParamName];
    const hallId = this.route.snapshot.params[this.hallIdParamName];

    this.ticketService.getByRepertoryId(repertoryId)
    .pipe
    (
      catchError(err => {
        // TODO(AM): add mechanism for relogin
        return of(err);
      })
    )
    .subscribe(seats => {
      this.hallService.get(hallId).subscribe(hall => {
        this.seats = seats;
        this.hall = hall;
        this.hallrender(hall);
      });
    });

    this.ticketService.getByRepertoryAndUserId(repertoryId)
    .pipe
    (
      catchError(err => {
        // TODO(AM): add mechanism for relogin
        return of(err);
      })
    )
    .subscribe(seats => {
      this.userReservations = seats;
    });

  }

  ngAfterViewInit() {
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

    if (this.seats && this.userReservations && this.cellsRendered) {
      for (let i = 0; i < 5; i++) {
        for (let y = 0; y < 5; y++) {
          if (this.userReservations[i][y] === 1) {
            const cell = document.getElementById(`${i}-column${y}`) as HTMLElement;
            cell.parentElement.style.backgroundColor = 'dodgerblue';
          } else if (this.seats[i][y] === 1) {
            const cell = document.getElementById(`${i}-column${y}`) as HTMLElement;
            cell.parentElement.style.backgroundColor = '#FFC700';
          }
        }
      }

      this.jqxGridDiv = document.getElementsByClassName('jqx-grid jqx-reset jqx-rc-all jqx-widget jqx-widget-content')[0] as HTMLElement;
      this.jqxGridDiv.style.height = `${this.jqxGridHeight - this.pagerHeight - 2}px`;

      this.cellsRendered = false;
    }
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

    if (this.seats[seatRow][seatColumn] === 1 || this.userReservations[seatRow][seatColumn] === 1) {
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

  reserveSeats() {
    // login part
    // this.userService.Login()
    // .pipe
    // (
    //   catchError(err => {
    //     // TODO(AM): add mechanism for relogin
    //     return of(err);
    //   })
    // )
    // .subscribe(_ => {
    // });
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
  }
}
