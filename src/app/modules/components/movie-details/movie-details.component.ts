import { Component, OnInit, Input, OnChanges, DoCheck, AfterContentInit } from '@angular/core';
import { Movie } from 'src/app/shared/models';
import { MoviesService } from 'src/app/core/services';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {

 @Input() selectedMovie: Movie;

  constructor(private moviesService: MoviesService,
              private router: Router,
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });

    this.route.data.subscribe(movie => {
        this.selectedMovie = movie as Movie;
    });




  // this.selectedMovie = {
    //   id: '250e62ef-70f1-4457-8b6d-5cd1825f1a3f',
    //   year: '2019',
    //   title: 'Bennett\'s War',
    //   rated: 'PG-13',
    //   released: '30 Aug 2019',
    //   runtime: '94 min',
    //   genre: 'Sport',
    //   writer: 'Alex Ranarivelo',
    //   actors: 'Michael Roark, Trace Adkins, Ali Afshar, Allison Paige',
    //   plot: 'After surviving an IED explosion in combat overseas, a young soldier with the Army Motorcycle Unit is medically discharged with a broken back and leg. Against all odds he trains to make an ...',
    //   country: 'USA',
    //   poster: 'https://m.media-amazon.com/images/M/MV5BNzM0Zjc2OWMtY2NjNS00ZmE4LWEzZTItMWE3NjQ4NmM2YzE2XkEyXkFqcGdeQXVyOTk0Mjc1MDA@._V1_SX300.jpg'
    // }
  }

  ngOnChanges() {
    // const movieId = this.route.snapshot.queryParamMap.get('id');
    // debugger
  }

}
