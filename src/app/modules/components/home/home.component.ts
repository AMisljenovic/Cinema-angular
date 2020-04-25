import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/shared/models';
import { MovieService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { jqxScrollViewComponent } from 'jqwidgets-ng/jqxscrollview';
import { jqxLoaderComponent } from 'jqwidgets-ng/jqxloader';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('myScrollView', {static: false}) myScrollView: jqxScrollViewComponent;
  @ViewChild('jqxLoader', { static: false }) jqxLoader: jqxLoaderComponent;

  isServerDown = false;
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

  constructor(private movieService: MovieService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.jqxLoader.open();

    this.movieService.getMovies()
    .pipe(
      catchError(err => {
        if (err && (err.status === 0 || err.status === 500)) {
          this.isServerDown = true;
        }
        return of(err);
      })
    )
    .subscribe(movies => {
      this.jqxLoader.close();
      this.movies = movies;
      this.announcedMovies = movies.filter(movie => movie.playing === false);
      this.playingMovies = movies.filter(movie => movie.playing === true);

      const posters = document.getElementsByClassName('photo');
      for (let index = 0; index < posters.length; index++) {
        (posters[index] as HTMLElement).style.backgroundImage = `url(assets/wide-${this.movieIds[index]}.jpg)`;
      }

      const nowPlayingPosters = document.getElementsByClassName('all-movies-poster');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (nowPlayingPosters[index] as HTMLImageElement).src = `assets/${this.playingMovies[index].id}.jpg`;
      }

      const comingSoonPosters = document.getElementsByClassName('all-movies-poster-coming');

      for (let index = 0; index < nowPlayingPosters.length; index++) {
        (comingSoonPosters[index] as HTMLImageElement).src = `assets/${this.announcedMovies[index].id}.jpg`;
      }

    });
  }

 selectMovie(event: any) {
  const imageTagId = event.currentTarget.id;
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
