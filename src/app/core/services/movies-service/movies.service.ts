import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from 'src/app/shared/models';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    const url = 'https://localhost:5001/api/movies';
    // const url = 'https://localhost:44361/api/movies';

  //  return this.http.get(url).subscribe(response => {
  //     return response as Poster[];
  // });
    // return this.http.get(url)
    // .pipe(map(response => {
    //   return response as Movie[];
    // }));

    return this.http.get<Movie[]>(url);
  }

  getMovie(id: string): Observable<Movie> {
    const url = `https://localhost:5001/api/movies/${id}`;
    // const url = 'https://localhost:44361/api/movies';

  //  return this.http.get(url).subscribe(response => {
  //     return response as Poster[];
  // });
    // return this.http.get(url)
    // .pipe(map(response => {
    //   return response as Movie[];
    // }));

    return this.http.get<Movie>(url);
  }
}
