import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helpers/validationform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userStore: UserStoreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      fullname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    console.log('Form value', this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Invalid form');

      ValidateForm.validateAllFormFields(this.registerForm);
      this.toastr.error('ERROR', 'Invalid form');
      return;
    }

    this.authService
      .register({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        name: this.registerForm.value.fullname,
      })
      .subscribe({
        next: (res) => {
          console.log(res.message);
          this.registerForm.reset();
          // this.authService.storeToken(
          //   res.result.accessToken,
          //   res.result.refreshToken
          // );
          // const tokenPayload = this.authService.decodedToken();
          // this.userStore.setFullNameForStore(tokenPayload.name);
          // this.userStore.setRoleForStore(tokenPayload.role);
          this.toastr.success('SUCCESS', 'Register account successfully');
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.toastr.error('ERROR', err.error.message);
          console.log(err);
        },
      });
  }
}
