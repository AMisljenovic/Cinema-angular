import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/shared/models';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';
import { MovieService } from 'src/app/core/services';
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
  movies: Movie[];
  public source;
  public dataAdapter;

  movieIds: string[] = [
    '0fe4656a-4598-4f6f-9e7c-3f9347153a10',
    '13e6d16d-e8a9-4112-a3d0-fda72a846b17',
    '164ca3af-4b7f-454f-bd07-9b8d6c3736cc',
    '1df1dac8-0b73-486e-b1a0-ded9d9d0849c',
    '251759f9-a3c5-43d3-9734-39a288f2a461'
  ];

  // public columns: jqwidgets.GridColumn[] = [
  //   { text: 'Poster', datafield: 'poster', width: 200, cellsrenderer: this.imagerenderer },

  //   { text: 'Year', datafield: 'year', width: 200 },

  //   { text: 'Title', datafield: 'title' }
  // ];

//   imagerenderer(row, datafield, value) {
//     return '<img style="margin-left: 5px;" height="200" width="200" src="' + value + '"/>';
//  }

//   scrollViewSettings: jqwidgets.ScrollViewOptions =
//     {
//         width: 800,
//         height: 700,
//         buttonsOffset: [0, 0],
//         slideShow: false,
//     };

//   gridSettings: jqwidgets.GridOptions =
//     {
//       theme: 'material-purple',
//       width: '800',
//       source: this.dataAdapter,
//       columns: this.columns,
//       pageable: true,
//       sortable: true,
//       editable: true,
//       autoheight: true,
//       autorowheight: true,
//       altrows: true,
//       enabletooltips: true
//     };

  constructor(private movieService: MovieService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.jqxLoader.open();

    this.movieService.getMovies()
    .subscribe(movies => {
      this.jqxLoader.close();
      this.movies = movies;
      this.announcedMovies = movies.filter(movie => movie.playing === false);
      this.playingMovies = movies.filter(movie => movie.playing === true);

      const posters = document.getElementsByClassName('photo');
      for (let index = 0; index < posters.length; index++) {
        (posters[index] as HTMLElement).style.backgroundImage = `url(../../../../assets/wide-${this.movieIds[index]}.jpg)`;
      }

      const nowPlayingPosters = document.getElementsByClassName('all-movies-poster');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (nowPlayingPosters[index] as HTMLImageElement).src = `../../../../assets/${this.playingMovies[index].id}.jpg`;
      }

      const comingSoonPosters = document.getElementsByClassName('all-movies-poster-coming');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (comingSoonPosters[index] as HTMLImageElement).src = `../../../../assets/${this.announcedMovies[index].id}.jpg`;
      }

    });
  }

 selectMovie(event: any) {
  const imageTagId = event.currentTarget.id;

  // const route = this.router.config.find(r => r.path === 'movie-details/:id');
  let movieId = '';

  if (imageTagId.includes('playing')) {
    movieId =  this.playingMovies[imageTagId.split('-')[1]].id;
  } else if (imageTagId.includes('coming')) {
    movieId =  this.announcedMovies[imageTagId.split('-')[1]].id;
  } else {
    movieId =  this.movies[imageTagId.split('-')[1]].id;
  }

  this.router.navigateByUrl(`movie-details/${movieId}`);
 }
}
