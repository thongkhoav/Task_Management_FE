import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RoomService } from 'src/app/services/room.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.scss'],
})
export class CreateRoomModalComponent implements OnInit {
  inputdata: any;
  editdata: any;
  closemessage = 'closed using directive';
  myform = this.buildr.group({
    title: this.buildr.control('', [Validators.required]),
    description: this.buildr.control('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CreateRoomModalComponent>,
    private buildr: FormBuilder,
    private service: RoomService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.code > 0) {
      // this.setpopupdata(this.inputdata.code);
    }
  }

  // USE for edit 1 room
  // setpopupdata(code: any) {
  //   this.service.GetCustomerbycode(code).subscribe((item) => {
  //     this.editdata = item;
  //     this.myform.setValue({
  //       name: this.editdata.name,
  //       email: this.editdata.email,
  //       phone: this.editdata.phone,
  //       status: this.editdata.status,
  //     });
  //   });
  // }

  closepopup() {
    this.ref.close('Closed using function');
  }

  createRoom() {
    this.service
      .createRoom({
        name: this.myform.value.title,
        description: this.myform.value.description,
      })
      .subscribe((res) => {
        this.toastr.success('SUCCESS', 'Room created successfully');
        this.closepopup();
      });
  }
}
