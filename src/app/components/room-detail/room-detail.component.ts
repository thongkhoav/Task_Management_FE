import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { RoomService } from 'src/app/services/room.service';
import { CreateTaskModalComponent } from '../create-task-modal/create-task-modal.component';
import { ToastrService } from 'ngx-toastr';

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
  users: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roomService: RoomService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (this.roomId) {
      this.loadRoom(this.roomId);
      this.loadTasks(this.roomId);
      this.user = this.authService.decodedToken();
    }
  }

  loadUsers() {
    if (!this.roomId) {
      return;
    }

    this.subscriptions.push(
      this.userService.getUsers(this.roomId, true).subscribe({
        next: (res) => {
          console.log(res);
          this.users = res.result;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
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

  updateStatus(task: any) {
    this.subscriptions.push(
      this.taskService
        .updateStatusTask({
          id: task.id,
          isComplete: task.isComplete === 'false' ? false : true,
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success('SUCCESS', 'Update status successfully');
            this.loadTasks(this.roomId!);
          },
          error: (err) => {
            console.log(err);
          },
        })
    );
  }

  updateAssignUser(task: any) {
    this.subscriptions.push(
      this.taskService.updateAssignUser(task.id, task.userId).subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success('SUCCESS', 'Update assign user successfully');
          this.loadTasks(this.roomId!);
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

  editTask(task: any) {
    this.Openpopup(task, 'Edit task', CreateTaskModalComponent);
  }

  Openpopup(task: any, title: any, component: any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '600ms',
      data: {
        roomId: this.roomId,
        title: title,
        task: task,
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
