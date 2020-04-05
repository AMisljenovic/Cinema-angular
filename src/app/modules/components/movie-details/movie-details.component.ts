import { Component, OnInit, Input, OnChanges, DoCheck, AfterContentInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Movie, Repertory, WeekPlay } from 'src/app/shared/models';
import { MovieService, RepertoryService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  @ViewChild('jqxLoader', { static: false }) jqxLoader: jqxLoaderComponent;
  @ViewChild('repertoryGrid', {static: false}) jqxGrid: jqxGridComponent;
  @ViewChild('jqxButton', { static: false }) jqxButton: jqxButtonComponent;
  selectedMovie: Movie;
  repertoires: Repertory[];
  private movieIdParamName = 'id';
  playTime: string;
  day: number;
  isMoviePlaying: boolean;

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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private repertoryService: RepertoryService ) { }

  ngOnInit() {
    const id = this.route.snapshot.params[this.movieIdParamName];
    this.movieService.getMovie(id)
      .subscribe(movie => {
        this.selectedMovie = movie;
        this.isMoviePlaying = movie.playing;
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
    if (event.args.datafield === 'day') {
      this.jqxGrid.unselectcell(event.args.rowindex, event.args.datafield);
      this.day = null;
      this.playTime = null;
      return;
    }

    this.day = event.args.rowindex;
    this.playTime = this.jqxGrid.getcelltext(event.args.rowindex, event.args.datafield);
  }

  seatsSelect() {
    const repertory = this.repertoires.find(rep => rep.playTime === this.playTime && rep.day === (this.day + 1));

    this.router.navigateByUrl(`hall/${repertory.hallId}/${repertory.id}`);
  }
}
