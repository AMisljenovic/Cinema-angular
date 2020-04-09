import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/users`;
  }

  Login(username: string = 'user', password: string = 'cinemauser'): Observable<any> {
    const url = `${this.url}/login`;
    return this.http.post(url, {username, password}, {withCredentials: true});
  }
}
