import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/users`;
  }


  loggedInAsAdmin(): Observable<string> {
    return this.http.get<string>(this.url, {withCredentials: true});
  }

  register(user): Observable<string[]> {
    return this.http.post<string[]>(this.url, user, {withCredentials: true});
  }

  update(user): Observable<any> {
    return this.http.put<any>(this.url, user, {withCredentials: true});
  }

  delete(user): Observable<any> {
    const url = `${this.url}/delete`;
    return this.http.post<any>(url, user, {withCredentials: true});
  }

  signin(username: string, email: string, password: string): Observable<User> {
    const url = `${this.url}/signin`;
    return this.http.post<User>(url, {username, email, password}, {withCredentials: true});
  }

  signout(): Observable<any> {
    const url = `${this.url}/signout`;
    return this.http.post(url, {withCredentials: true});
  }
}
