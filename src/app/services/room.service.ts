import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseUrl: string = environment.API_URL;
  constructor(private http: HttpClient) {}

  getRooms(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v1/rooms`);
  }
}