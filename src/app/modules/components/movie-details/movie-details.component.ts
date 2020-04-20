import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Movie, Repertory, WeekPlay } from 'src/app/shared/models';
import { MovieService, RepertoryService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { jqxLoaderComponent } from 'jqwidgets-ng/jqxloader';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxButtonComponent } from 'jqwidgets-ng/jqxbuttons';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild('jqxLoader', { static: false }) jqxLoader: jqxLoaderComponent;
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  @ViewChild('jqxButton', { static: false }) jqxButton: jqxButtonComponent;
  private movieIdParamName = 'id';
  private jqxGridPagerDisabled = false;
  isMovieIdValid = true;
  isServerDown = false;
  playTime: string;
  day: number;
  offset: number;
  isMoviePlaying: boolean;
  selectedMovie: Movie;
  repertoires: Repertory[];

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
    { text: 'Day', datafield: 'day', width: 130},
    { text: 'First play', datafield: 'firstPlay'},
    { text: 'Second play', datafield: 'secondPlay'},
    { text: 'Thrid play', datafield: 'thirdPlay'},
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private repertoryService: RepertoryService ) { }

  ngOnInit() {
    const id = this.route.snapshot.params[this.movieIdParamName];
    this.movieService.getMovie(id)
    .pipe(
      catchError(err => {
        if (err && (err.status === 0 || err.status === 500)) {
          this.isServerDown = true;
        }
        return of(err);
      })
      )
      .subscribe(movie => {
        if (movie === null) {
          this.isMovieIdValid = false;
          return;
        }
        this.selectedMovie = movie;
        this.isMoviePlaying = movie.playing;
        this.repertoryService.getRepertoiresByMoveId(movie.id)
        .subscribe(repertoires => {
          this.repertoires = repertoires;
          this.repertoryDataGrid(repertoires);
        });
      });
  }

  ngAfterViewChecked() {
    if (!this.jqxGridPagerDisabled && this.isMoviePlaying) {
      // tslint:disable-next-line: max-line-length
      const pager = document.getElementsByClassName('jqx-clear jqx-position-absolute jqx-grid-statusbar jqx-widget-header')[0] as HTMLElement;
      pager.style.backgroundColor = '#c9c9c9';
      this.jqxGridPagerDisabled = true;
    }
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
        case 1: monday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 2: tuesday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 3: wednesday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 4: thursday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 5: friday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 6: saturday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        case 7: sunday[this.timeOfPlay(rep.playTime)] = `${rep.playTime} - ${rep.price} din.`; break;
        default:
          break;
      }
    });

    const days = [monday, tuesday, wednesday, thursday, friday , saturday, sunday];
    const sourceData = [];

    const dateNow = new Date(2020, 3, 25);
    this.offset = dateNow.getDay() - 1;

    for (let index = 0; index < 7; index++) {
      const nextday = new Date(dateNow);
      nextday.setDate(dateNow.getDate() + index);
      const parsedDate = nextday.toLocaleDateString().split('/');

      const dayIndex = (index + this.offset) % 7;
      const currentDate = days[dayIndex];
      currentDate.day  += ` - ${parsedDate[1]}.${parsedDate[0]}`;

      sourceData.push(currentDate);
    }

    this.source.localdata = sourceData;
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

  cellSelected(event: any) {
    if (event.args.datafield === 'day') {
      this.jqxGrid.unselectcell(event.args.rowindex, event.args.datafield);
      this.day = null;
      this.playTime = null;
      return;
    }

    this.day = event.args.rowindex;
    this.playTime = this.jqxGrid.getcelltext(event.args.rowindex, event.args.datafield).split(' ')[0];
  }

  seatsSelect() {
    const repertory = this.repertoires.find(rep => rep.playTime === this.playTime && rep.day === ((this.day + this.offset) % 7 + 1));

    this.router.navigateByUrl(`hall/${repertory.hallId}/${repertory.id}`);
  }
}
