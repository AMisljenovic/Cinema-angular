import { Component } from '@angular/core';
import { MovieService } from './core/services';

@Component({
  selector: 'app-root',
  providers: [MovieService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
}
