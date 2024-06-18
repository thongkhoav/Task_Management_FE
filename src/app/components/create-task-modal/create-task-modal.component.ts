import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
})
export class CreateTaskModalComponent implements OnInit {
  inputdata: any;
  subscriptions: Subscription[] = [];
  editdata: any;
  users: any;
  closemessage = 'closed using directive';
  myform = this.buildr.group({
    title: this.buildr.control('', [Validators.required]),
    description: this.buildr.control('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CreateTaskModalComponent>,
    private buildr: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.inputdata = this.data;
    this.loadUsers();
    if (this.inputdata.code > 0) {
      // this.setpopupdata(this.inputdata.code);
    }
  }

  loadUsers() {
    this.subscriptions.push(
      this.userService.getUsers(this.inputdata.roomId, true).subscribe({
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

  createTask() {
    this.taskService
      .createTask({
        name: this.myform.value.title,
        description: this.myform.value.description,
      })
      .subscribe((res) => {
        this.toastr.success('SUCCESS', 'Task created successfully');
        this.closepopup();
      });
  }
}
