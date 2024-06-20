import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { RoomService } from 'src/app/services/room.service';
import { ToastrService } from 'ngx-toastr';
import { AddMemberModalComponent } from '../add-member-modal/add-member-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-member',
  templateUrl: './room-member.component.html',
  styleUrls: ['./room-member.component.scss'],
})
export class RoomMemberComponent {
  subscriptions: Subscription[] = [];
  roomDetail: any;
  user: any;
  roomId: string | null = null;
  members: any;
  isOwner: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roomService: RoomService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    if (this.roomId) {
      this.loadMembers();
      this.user = this.authService.decodedToken();
      this.loadRoom(this.roomId);
    }
  }

  loadMembers() {
    if (!this.roomId) {
      return;
    }

    this.subscriptions.push(
      this.userService.getUsers(this.roomId, false).subscribe({
        next: (res) => {
          console.log(res);
          this.members = res.result;
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
          this.isOwner = this.user.nameid === res.result.owner.id;
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  addMember() {
    var _popup = this.dialog.open(AddMemberModalComponent, {
      width: '40%',
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '600ms',
      data: {
        roomId: this.roomId,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      // console.log(item)
      this.loadMembers();
    });
  }

  removeMember(member: any) {
    var _popup = this.dialog.open(ConfirmRemoveModalComponent, {
      width: '40%',
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '600ms',
      data: {
        name: member.name,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      // console.log(item);
      if (!item.isRemove || !this.roomId) return;
      this.roomService.removeRoomMember(this.roomId, member.id).subscribe({
        next: (res) => {
          this.toastr.success('SUCCESS', 'Member removed successfully');
          this.loadMembers();
        },
        error: (err) => {
          this.toastr.error('ERROR', 'Failed to remove member');
        },
      });
      this.loadMembers();
    });
  }
}

export interface DialogData {
  roomId: string;
  memberId: string;
  name: string;
}

@Component({
  selector: 'confirm-remove-modal',
  templateUrl: 'confirm-remove-modal.component.html',
})
export class ConfirmRemoveModalComponent {
  inputdata: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<AddMemberModalComponent>
  ) {}

  ngOnInit(): void {
    this.inputdata = this.data;
  }

  onConfirm() {
    this.closepopup(true);
  }

  onCancelConfirm() {
    this.closepopup(false);
  }

  closepopup(isRemove: boolean) {
    this.ref.close({
      isRemove,
    });
  }
}
