import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { RoomService } from 'src/app/services/room.service';
import { CreateTaskModalComponent } from '../create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
})
export class RoomDetailComponent {
  subscriptions: Subscription[] = [];
  roomTaskList: any[] = [];
  roomDetail: any;
  user: any;
  roomId: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roomService: RoomService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (this.roomId) {
      this.loadRoom(this.roomId);
      this.loadTasks(this.roomId);
      this.user = this.authService.decodedToken();
    }
  }

  loadRoom(roomId: string) {
    this.subscriptions.push(
      this.roomService.getRoomDetail(roomId).subscribe({
        next: (res) => {
          console.log(res);
          this.roomDetail = res.result;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  loadTasks(roomId: string) {
    this.subscriptions.push(
      this.taskService.getAllTaskOfRoom(roomId).subscribe({
        next: (res) => {
          console.log(res);
          this.roomTaskList = res.result;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  createTask() {
    this.Openpopup(0, 'Create task', CreateTaskModalComponent);
  }

  Openpopup(code: any, title: any, component: any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        roomId: this.roomId,
        title: title,
        code: code,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      // console.log(item)
      this.loadTasks(this.roomId!);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
