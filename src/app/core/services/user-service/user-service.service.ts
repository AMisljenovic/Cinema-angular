import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/users`;
  }

  login(username: string = 'user', email: string, password: string = 'cinemauser'): Observable<any> {
    const url = `${this.url}/login`;
    return this.http.post(url, {username, email, password}, {withCredentials: true});
  }

  logout(): Observable<any> {
    const url = `${this.url}/logout`;
    return this.http.post(url, {withCredentials: true});
  }
}
