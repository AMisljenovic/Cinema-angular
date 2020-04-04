import { Component, OnInit, Input, OnChanges, DoCheck, AfterContentInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Movie, Repertory, WeekPlay } from 'src/app/shared/models';
import { MovieService, RepertoryService } from 'src/app/core/services';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  @ViewChild('jqxLoader', { static: false }) jqxLoader: jqxLoaderComponent;
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  selectedMovie: Movie;
  repertoires: Repertory[];
  private movieId = 'id';

  source: any = [
    {
      localdata: [],
      datatype: 'array',
      datafields:
      [
        { name: 'day', type: 'string' },
        { name: 'firstPlay', type: 'string' },
        { name: 'secondPlay', type: 'string' },
        { name: 'thirdPlay', type: 'string' },
      ]
    }
  ];
  dataAdapter: any;

  public columns: jqwidgets.GridColumn[] = [
    { text: 'Day', datafield: 'day', width: 100},
    { text: 'First play', datafield: 'firstPlay'},
    { text: 'Second play', datafield: 'secondPlay'},
    { text: 'Thrid play', datafield: 'thirdPlay'},
  ];

  //   imagerenderer(row, datafield, value) {
  //     return '<img style="margin-left: 5px;" height="200" width="200" src="' + value + '"/>';
  //  }


  constructor(private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private repertoryService: RepertoryService ) { }

  ngOnInit() {
    const id = this.route.snapshot.params[this.movieId];
    this.movieService.getMovie(id)
      .subscribe(movie => {
        this.selectedMovie = movie;
        this.repertoryService.getRepertoiresByMoveId(movie.id)
        .subscribe(repertoires => {
          this.repertoires = repertoires;
          this.repertoryDataGrid(repertoires);
        });
      });
  }

  repertoryDataGrid(repertoires: Repertory[]) {
    const  monday: WeekPlay = {day: 'Monday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  tuesday: WeekPlay = {day: 'Tuesday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  wednesday: WeekPlay = {day: 'Wednesday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  thursday: WeekPlay = {day: 'Thursday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  friday: WeekPlay = {day: 'Friday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  saturday: WeekPlay = {day: 'Saturday', firstPlay: '', secondPlay: '', thirdPlay: ''};
    const  sunday: WeekPlay = {day: 'Sunday', firstPlay: '', secondPlay: '', thirdPlay: ''};


    repertoires.forEach(rep => {
      switch (rep.day) {
        case 1: monday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 2: tuesday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 3: wednesday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 4: thursday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 5: friday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 6: saturday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        case 7: sunday[this.timeOfPlay(rep.playTime)] = rep.playTime; break;
        default:
          break;
      }
    });

    const days = [monday, tuesday, wednesday, thursday, friday , saturday, sunday];

    this.source.localdata = days;
    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  timeOfPlay(playTime: string) {
    if ( +playTime.split(':')[0] < 9) {
      return 'firstPlay';
    } else if ( +playTime.split(':')[0] < 16) {
      return 'secondPlay';
    } else {
      return 'thirdPlay';
    }
  }

  cellSelected(event: any, value: any) {
    const playTime = this.jqxGrid.getcelltext(event.args.rowindex, event.args.datafield);
  }
// TODO(AM)
// vreme izuvceno iz tabele, treba dodati dugme za prosledjivanje na sledecu stranicu, parametri: vreme, dan, movieId
// repertoare vec sve imas douvcene samo ga nadji po vremenu i danu prikazivanja
// u eventu imas red koji predstavalja dan i njegov indeks ce biti iskoristen
}
