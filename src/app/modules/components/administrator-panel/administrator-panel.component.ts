import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData } from 'src/app/shared/models';
import { ReservationService } from 'src/app/core/services';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart/public_api';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator-panel',
  templateUrl: './administrator-panel.component.html',
  styleUrls: ['./administrator-panel.component.css']
})
export class AdministratorPanelComponent implements OnInit {
    @ViewChild('chart', {static: false}) jqxChart: jqxChartComponent;
    @ViewChild('pieChart', {static: false}) jqxPieChart: jqxChartComponent;
    values: ChartData[] = [];
    dataAdapter: any;
    padding: any = { left: 10, top: 5, right: 10, bottom: 5 };
    titlePadding: any = { left: 50, top: 0, right: 0, bottom: 10 };

    xAxis: any =
    {
        gridLinesColor: '#ffc700',
        dataField: 'date',
        type: 'date',
        baseUnit: 'day',
        valuesOnTicks: true,
        minValue: '',
        maxValue: '',
        tickMarks: {
            visible: true,
            interval: 1,
            color: '#BCBCBC'
        },
        unitInterval: 1,
        gridLines: {
            visible: true,
            interval: 3,
            color: '#BCBCBC'
        },
        labels: {
            angle: -45,
            rotationPoint: 'topright',
            offset: { x: 0, y: -25 }
        }
    };
    valueAxis: any =
    {
        visible: false,
        title: { text: 'Resrvations per day<br>' },
        tickMarks: { color: '#FFC700' }
    };
    seriesGroups: any =
    [
        {
            type: 'line',
            borderLineColor: '#FFC700',
            series:
            [
                {
                    dataField: 'reservationsMade',
                    displayText: 'Reservations',
                    symbolType: 'square',
                    labels:
                    {
                        visible: true,
                        backgroundColor: '#FEFEFE',
                        backgroundOpacity: 0.2,
                        borderColor: '#7FC4EF',
                        borderOpacity: 0.7,
                        padding: { left: 5, right: 5, top: 0, bottom: 0 }
                    }
                },
            ]
        }
    ];

    pieChartsource = [
        {
            type: '',
            share: 0
        }
    ];

    pieChartdataAdapter;

    pieChartSeriesGroups: any[] =
    [
        {
            type: 'pie',
            showLabels: true,
            series:
            [
                {
                    dataField: 'share',
                    displayText: 'type',
                    labelRadius: 120,
                    initialAngle: 15,
                    radius: 170,
                    centerOffset: 0,
                    formatSettings: { sufix: '%', decimalPlaces: 1 }
                }
            ]
        }
    ];

    constructor(private reservationService: ReservationService,
                private router: Router) {}

    getWidth(): any {
      if (document.body.offsetWidth < 850) {
        return '90%';
      }
      return 850;
    }

    ngOnInit() {
        const dateNow = new Date();
        const datePreviousWeek = new Date(dateNow);
        datePreviousWeek.setDate(dateNow.getDate() - 7);
        this.xAxis.minValue = datePreviousWeek.toLocaleDateString();
        this.xAxis.maxValue = dateNow.toLocaleDateString();

        this.reservationService.getChartData()
        .pipe(
            catchError(err => {
                if (err && err.status === 404) {
                    alert('You are not authorize to access this page.');
                    this.router.navigateByUrl('home');
                } else if (err && err.status === 401) {
                    alert('Your session has expired. Please sign in again.');
                    this.router.navigateByUrl('signin');
                }

                return of(err);
            })
        )
        .subscribe(res => {
            this.values = res;
            this.dataAdapter = new jqx.dataAdapter(this.values);
            this.pieChartdata(res, dateNow.toLocaleDateString());
        });
    }

    pieChartdata(chartData: ChartData[], date: string) {
        const reservationsPerHall = 25;
        const playingMovies = 5;
        const moviePlaysPerDay = 3;
        const dailyStatistic = chartData.find(data => data.date === date);
        const totalAvailableReservations = reservationsPerHall * playingMovies *  moviePlaysPerDay;
        const reservedPercent = (100 * dailyStatistic.reservationsMade) / totalAvailableReservations;

        this.pieChartsource = [
            {
                type: 'Reserved',
                share: reservedPercent
            },
            {
                type: 'Available',
                share: 100 - reservedPercent
            }
        ];
        this.pieChartdataAdapter = new jqx.dataAdapter(this.pieChartsource);
    }
}
