import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  userRooms: any[] = [];

  constructor(
    private userService: UserService,
    private roomService: RoomService
  ) {}
  ngOnInit(): void {
    this.loadRooms();
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }
}
