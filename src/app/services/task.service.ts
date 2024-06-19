import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl: string = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllTaskOfRoom(roomId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v1/tasks?roomId=${roomId}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/v1/tasks`, task);
  }

  updateStatusTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/v1/tasks/status`, task);
  }

  updateAssignUser(taskId: string, userId: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/api/v1/tasks/assign-user?taskId=${taskId}&userId=${userId}`,
      {}
    );
  }
}
