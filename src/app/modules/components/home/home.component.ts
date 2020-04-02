import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/shared/models';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';
import { MoviesService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('myScrollView', {static: false}) myScrollView: jqxScrollViewComponent;
  @ViewChild('jqxLoader', { static: false }) jqxLoader: jqxLoaderComponent;

  announcedMovies: Movie[];
  playingMovies: Movie[];
  public source;
  public dataAdapter;

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

  constructor(private moviesService: MoviesService,
              private router: Router) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.jqxLoader.open();

    this.moviesService.getMovies()
    .subscribe(movies => {
      this.jqxLoader.close();
      this.announcedMovies = movies.filter(movie => movie.playing === false);
      this.playingMovies = movies.filter(movie => movie.playing === true);

      const posters = document.getElementsByClassName('photo');
      for (let index = 0; index < posters.length; index++) {
        (posters[index] as HTMLElement).style.backgroundImage = `url(${movies[index].poster})`;
      }

      const nowPlayingPosters = document.getElementsByClassName('all-movies-poster');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (nowPlayingPosters[index] as HTMLImageElement).src = this.playingMovies[index].poster;
      }

      const comingSoonPosters = document.getElementsByClassName('all-movies-poster-coming');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (comingSoonPosters[index] as HTMLImageElement).src = this.announcedMovies[index].poster;
      }

    });
  }

  imagerenderer(row, datafield, value) {
    return '<img style="margin-left: 5px;" height="200" width="200" src="' + value + '"/>';
 }

 selectMovie(event: any) {
  const imageTagId = event.currentTarget.id as string;

  const route = this.router.config.find(r => r.path === 'movie-details/:id');

  if (imageTagId.includes('playing')) {
    route.data =  this.playingMovies[imageTagId.split('-')[1]];
  } else {
    route.data =  this.announcedMovies[imageTagId.split('-')[1]];
  }

  this.router.navigateByUrl(`movie-details/${imageTagId}`);
 }
}
