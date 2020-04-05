import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HallService, TicketService } from 'src/app/core/services';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { Ticket, Hall } from 'src/app/shared/models';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  private seatImageUrl = '../../../../assets/seat.jpg';
  private repertoryIdParamName = 'repertoryId';
  private hallIdParamName = 'hallId';
  columnPropNames: string[] = [];

  dataAdapter: any;

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
    return '<img style="margin-top: 20%;margin-left: 25%" height="60" width="70" src="' + value + '"/>';
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
    .subscribe(tickets => {
      this.hallService.get(hallId).subscribe(hall => {
        this.hallrender(tickets, hall);
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
    const elements = Array.from(document.getElementsByClassName('jqx-grid-cell jqx-item'));
    elements.forEach(element => {
      const converted = element as HTMLElement;
      converted.style.border = 'none';
    });

    const pager = document.getElementsByClassName('jqx-clear jqx-position-absolute jqx-grid-statusbar jqx-widget-header')[0] as HTMLElement;
    pager.style.backgroundColor = '#c9c9c9';

    const jqxGridDiv = document.getElementsByClassName('jqx-grid jqx-reset jqx-rc-all jqx-widget jqx-widget-content')[0] as HTMLElement;
    jqxGridDiv.style.border = 'black';
  }

  hallrender(tickets: Ticket[], hall: Hall) {
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
    debugger
    //(TODO: AM): legenda za boje, takodje obojiti i blokirati zauzeta mesta
  }
}
