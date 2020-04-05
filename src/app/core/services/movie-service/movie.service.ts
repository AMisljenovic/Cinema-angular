import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/movies`;
  }

  getMovies(): Observable<Movie[]> {
    // const url = 'https://localhost:44361/api/movies';

  //  return this.http.get(url).subscribe(response => {
  //     return response as Poster[];
  // });
    // return this.http.get(url)
    // .pipe(map(response => {
    //   return response as Movie[];
    // }));

    return this.http.get<Movie[]>(this.url);
  }

  getMovie(id: string): Observable<Movie> {
    const url = `${this.url}/${id}`;
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
