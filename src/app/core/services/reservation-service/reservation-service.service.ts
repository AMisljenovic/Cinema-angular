import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Reservation, UserReservation } from 'src/app/shared/models';

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

  getByRepertoryAndUserId(repertoryId: string, userId: string): Observable<number[]> {
    const url = `${this.url}/${repertoryId}/${userId}`;

    return this.http.get<number[]>(url, {withCredentials: true});
  }

  getByUserId(userId: string): Observable<UserReservation[]> {
    const url = `${this.url}/user/${userId}`;

    return this.http.get<UserReservation[]>(url, {withCredentials: true});
  }

  postReservations(reservations: Reservation[]) {
    return this.http.post(this.url, reservations, {withCredentials: true});
  }

  deleteByIds(reservationIds: string[]): Observable<any> {
    const url = `${this.url}/delete`;
    return this.http.post<any>(url, reservationIds, {withCredentials: true});
  }
}
