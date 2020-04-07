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

  getByRepertoryId(repertoryId: string): Observable<number[]> {
    const url = `${this.url}/${repertoryId}`;

    return this.http.get<number[]>(url);
  }

  getByRepertoryAndUserId(repertoryId: string, userId: string = 'fcce9446-45f6-40f9-a8de-8d8ba40aebf9'): Observable<number[]> {
    const url = `${this.url}/${repertoryId}/${userId}`;

    return this.http.get<number[]>(url);
  }
}
