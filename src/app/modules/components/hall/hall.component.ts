import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HallService, TicketService } from 'src/app/core/services';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { Ticket, Hall, SeatPosition } from 'src/app/shared/models';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  private seatImageUrl = '../../../../assets/seat.png';
  private repertoryIdParamName = 'repertoryId';
  private hallIdParamName = 'hallId';
  private jqxGridPagerDisabled = false;
  private cellsRendered = true;
  columnPropNames: string[] = [];
  seats: number[];
  dataAdapter: any;
  seatPosition: SeatPosition[] = [];
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
              private ticketService: TicketService) { }

  ngOnInit() {
    const repertoryId = this.route.snapshot.params[this.repertoryIdParamName];
    const hallId = this.route.snapshot.params[this.hallIdParamName];

    this.ticketService.getByRepertoryid(repertoryId)
    .subscribe(seats => {
      this.hallService.get(hallId).subscribe(hall => {
        this.seats = seats;
        this.hallrender(hall);
      });
    });
  }

  ngAfterViewInit() {
    // const elements = Array.from(document.getElementsByClassName('jqx-grid-cell jqx-item test-class'));
    // elements.forEach(element => {
    //   const converted = element as HTMLElement;
    //   converted.style.border = 'none';
    // });
  }

  ngAfterViewChecked() {
    if (!this.jqxGridPagerDisabled) {
      const elements = Array.from(document.getElementsByClassName('jqx-grid-cell jqx-item'));
      elements.forEach(element => {
        const converted = element as HTMLElement;
        converted.style.border = 'none';
      });

      const pager = document.getElementsByClassName('jqx-clear jqx-position-absolute jqx-grid-statusbar jqx-widget-header')[0] as HTMLElement;
      pager.style.backgroundColor = '#c9c9c9';
      this.pagerHeight = +pager.style.height.split('px')[0];

      this.jqxGridDiv = document.getElementsByClassName('jqx-grid jqx-reset jqx-rc-all jqx-widget jqx-widget-content')[0] as HTMLElement;
      this.jqxGridDiv.style.border = 'black';
      this.jqxGridHeight =  +this.jqxGridDiv.style.height.split('px')[0];
    }

    if (this.seats && this.cellsRendered) {
      for (let i = 0; i < 5; i++) {
        for (let y = 0; y < 5; y++) {
          if (this.seats[i][y] === 1) {
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

    if (this.seats[seatRow][seatColumn] === 1) {
      this.jqxGrid.unselectcell(event.args.rowindex, event.args.datafield);
      return;
    }
    this.seatPosition.push({row: seatRow, column: seatColumn});

    //(TODO: AM): legenda za boje, takodje obojiti i blokirati zauzeta mesta
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
}
