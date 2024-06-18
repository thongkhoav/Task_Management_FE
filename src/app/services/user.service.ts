import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = environment.API_URL;
  constructor(private http: HttpClient) {}

  getUsers(roomId: string, includeOwner: boolean): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/v1/users?roomId=${roomId}&includeOwner=${includeOwner}`
    );
  }

  joinRoom(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v1/users/join-room`, {
      roomId: roomId,
    });
  }
}
