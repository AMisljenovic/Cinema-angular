import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Hall } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class HallService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/halls`;
  }

  get(id: string): Observable<Hall> {
    const url = `${this.url}/${id}`;

    return this.http.get<Hall>(url);
  }
}
