import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { CreateRoomModalComponent } from '../create-room-modal/create-room-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  userRooms: any[] = [];
  user: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loadRooms();
    this.user = this.authService.decodedToken();
  }

  loadRooms() {
    this.subscriptions.push(
      this.roomService.getRooms().subscribe({
        next: (res) => {
          console.log(res);
          this.userRooms = res.result;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  joinRoom(roomId: string) {
    this.userService.joinRoom(roomId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Join room successfully');
        this.router.navigate(['room', roomId]);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  createRoom() {
    this.Openpopup(0, 'Create room', CreateRoomModalComponent);
  }

  Openpopup(code: any, title: any, component: any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        title: title,
        code: code,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      // console.log(item)
      this.loadRooms();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
