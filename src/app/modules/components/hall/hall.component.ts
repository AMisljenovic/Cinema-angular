import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HallService, TicketService } from 'src/app/core/services';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { Ticket, Hall } from 'src/app/shared/models';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit {
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  columnPropNames: string[] = [];
  source: any = [
    {
      localdata: [],
      datatype: 'array',
      datafields: [] = []
    }
  ];
  dataAdapter: any;

  public columns: jqwidgets.GridColumn[] = [];
  // = [
  //   { text: 'Day', datafield: 'day', width: 100},
  //   { text: 'First play', datafield: 'firstPlay'},
  //   { text: 'Second play', datafield: 'secondPlay'},
  //   { text: 'Thrid play', datafield: 'thirdPlay'},
  // ];

  private repertoryIdParamName = 'repertoryId';
  private hallIdParamName = 'hallId';
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

  hallrender(tickets: Ticket[], hall: Hall) {
    for (let index = 0; index < hall.columns; index++) {
      const columnPropName = `column${index}`;
      this.columnPropNames.push(columnPropName);
      this.columns.push(
        {
          text: columnPropName,
          datafield: 'Image',
          width: 60,
          cellsrenderer: this.imagerenderer
        });
      this.source.datafields.push({
        name: columnPropName,
        type: 'string'
      });
    }

    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  imagerenderer = (row: number, datafield: string, value: string): string => {
    return '<img style="margin-left: 5px;" height="60" width="50" src="../../../../assets/seat.jpg' + value + '"/>';
  }

 //   imagerenderer(row, datafield, value) {
  //     return '<img style="margin-left: 5px;" height="200" width="200" src="' + value + '"/>';
  //  }

}
