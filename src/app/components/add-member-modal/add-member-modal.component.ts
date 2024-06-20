import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RoomService } from 'src/app/services/room.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
})
export class AddMemberModalComponent {
  inputdata: any;
  myform = this.buildr.group({
    email: this.buildr.control('', [Validators.required, Validators.email]),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<AddMemberModalComponent>,
    private buildr: FormBuilder,
    private service: RoomService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.inputdata = this.data;
  }

  addMember() {
    if (this.myform.invalid || !this.myform.value.email) {
      return;
    }

    this.service
      .addRoomMember(this.myform.value.email?.trim(), this.inputdata.roomId)
      .subscribe({
        next: (res) => {
          this.toastr.success('SUCCESS', 'Room created successfully');
          this.closepopup();
        },
        error: (err) => {
          const toastErr =
            err.error?.errorMessages[0] || 'Failed to add member';
          this.toastr.error('ERROR', toastErr);
        },
      });
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
