import { Component } from '@angular/core';
import { MoviesService } from './core/services';

@Component({
  selector: 'app-root',
  providers: [MoviesService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
}
