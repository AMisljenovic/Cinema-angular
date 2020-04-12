import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Repertory } from 'src/app/shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepertoryService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/repertoires`;
  }

  getRepertoiresByMoveId(movieId: string): Observable<Repertory[]> {
    const url = `${this.url}/${movieId}`;

    return this.http.get<Repertory[]>(url);
  }

  getRepertory(repertoryId: string): Observable<Repertory> {
    const url = `${this.url}/repertory/${repertoryId}`;

    return this.http.get<Repertory>(url);
  }


}
