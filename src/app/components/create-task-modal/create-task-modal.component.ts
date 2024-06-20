import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
    dueDate: this.buildr.control('', [Validators.required, this.dateValidator]),
    userId: this.buildr.control(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CreateTaskModalComponent>,
    private buildr: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inputdata = this.data;
    console.log(this.data);

    this.loadUsers();
    if (this.data?.task?.id) {
      console.log('edit task');
      this.setpopupdata(this.data.task);
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

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to the start of the day

    return inputDate > today ? null : { invalidDate: true };
  }

  // USE for edit 1 room
  setpopupdata(task: any) {
    this.editdata = task;
    console.log('we2421');

    this.myform.setValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      userId: task.user.id,
    });
    // this.myform.get('title')?.setValue(task.title);
    console.log(this.myform.value);

    this.cd.detectChanges();
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  saveTask() {
    if (this.myform.valid) {
      console.log(this.myform.value);
      if (this.editdata) {
        this.taskService
          .updateTask(this.editdata.id, {
            title: this.myform.value.title,
            description: this.myform.value.description,
            roomId: this.inputdata.roomId,
            dueDate: this.myform.value.dueDate,
            userId: this.myform.value.userId,
          })
          .subscribe((res) => {
            this.toastr.success('SUCCESS', 'Task updated successfully');
            this.closepopup();
          });
      } else {
        this.taskService
          .createTask({
            title: this.myform.value.title,
            description: this.myform.value.description,
            roomId: this.inputdata.roomId,
            dueDate: this.myform.value.dueDate,
            userId: this.myform.value.userId,
          })
          .subscribe((res) => {
            this.toastr.success('SUCCESS', 'Task created successfully');
            this.closepopup();
          });
      }
    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }
}
