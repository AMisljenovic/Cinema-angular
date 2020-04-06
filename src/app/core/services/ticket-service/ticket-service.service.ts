import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/tickets`;
  }

  getByRepertoryid(repertoryId: string): Observable<number[]> {
    const url = `${this.url}/${repertoryId}`;

    return this.http.get<number[]>(url);
  }
}
