import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/reservations`;
  }

  getByRepertoryId(repertoryId: string): Observable<number[]> {
    const url = `${this.url}/${repertoryId}`;

    return this.http.get<number[]>(url, {withCredentials: true});
  }

  getByRepertoryAndUserId(repertoryId: string): Observable<number[]> {
    const userId = JSON.parse(sessionStorage.getItem('user')).id;
    const url = `${this.url}/${repertoryId}/${userId}`;

    return this.http.get<number[]>(url, {withCredentials: true});
  }

  postReservations(reservations: Reservation[]) {
    return this.http.post(this.url, reservations, {withCredentials: true});
  }
}
