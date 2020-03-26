import { Component, OnInit, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MoviesService } from './core/services';
import { Movie } from './shared/models';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';

@Component({
  selector: 'app-root',
  providers: [MoviesService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('myScrollView', {static: false}) myScrollView: jqxScrollViewComponent;

  movies: Movie[];
  selectedMovie: Movie;
  public source;
  public dataAdapter;
  movieIsSelected = false;

  public columns: jqwidgets.GridColumn[] = [
    { text: 'Poster', datafield: 'poster', width: 200, cellsrenderer: this.imagerenderer },

    { text: 'Year', datafield: 'year', width: 200 },

    { text: 'Title', datafield: 'title' }
  ];

  scrollViewSettings: jqwidgets.ScrollViewOptions =
    {
        width: 800,
        height: 700,
        buttonsOffset: [0, 0],
        slideShow: false,
    };

  gridSettings: jqwidgets.GridOptions =
    {
      theme: 'material-purple',
      width: '800',
      source: this.dataAdapter,
      columns: this.columns,
      pageable: true,
      sortable: true,
      editable: true,
      autoheight: true,
      autorowheight: true,
      altrows: true,
      enabletooltips: true
    };

  constructor(private moviesService: MoviesService) { }

  ngAfterViewInit(): void {
    this.moviesService.getMovies()
    .subscribe(movies => {

      this.movies = movies;

      const posters = document.getElementsByClassName('photo');
      for (let index = 0; index < posters.length; index++) {
        (posters[index] as HTMLElement).style.backgroundImage = `url(${movies[index].poster})`;
      }

      const nowPlayingPosters = document.getElementsByClassName('all-movies-poster');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (nowPlayingPosters[index] as HTMLImageElement).src = movies[index].poster;
      }

      const comingSoonPosters = document.getElementsByClassName('all-movies-poster-coming');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (comingSoonPosters[index] as HTMLImageElement).src = movies[index + 2].poster;
      }

    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  imagerenderer(row, datafield, value) {
    return '<img style="margin-left: 5px;" height="200" width="200" src="' + value + '"/>';
 }

 selectMovie(event: any) {
   const id = event.currentTarget.id;
   this.selectedMovie = this.movies[id];
   this.movieIsSelected = true;
 }
}
