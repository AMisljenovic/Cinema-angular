import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Movie } from 'src/app/shared/models';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {

 @Input() selectedMovie: Movie;

  constructor() { }

  ngOnInit() {
    this.selectedMovie = {
      id: '250e62ef-70f1-4457-8b6d-5cd1825f1a3f',
      year: '2019',
      title: 'Bennett\'s War',
      rated: 'PG-13',
      released: '30 Aug 2019',
      runtime: '94 min',
      genre: 'Sport',
      writer: 'Alex Ranarivelo',
      actors: 'Michael Roark, Trace Adkins, Ali Afshar, Allison Paige',
      plot: 'After surviving an IED explosion in combat overseas, a young soldier with the Army Motorcycle Unit is medically discharged with a broken back and leg. Against all odds he trains to make an ...',
      country: 'USA',
      poster: 'https://m.media-amazon.com/images/M/MV5BNzM0Zjc2OWMtY2NjNS00ZmE4LWEzZTItMWE3NjQ4NmM2YzE2XkEyXkFqcGdeQXVyOTk0Mjc1MDA@._V1_SX300.jpg'
    }
  }

  ngOnChanges() {
  }

}
