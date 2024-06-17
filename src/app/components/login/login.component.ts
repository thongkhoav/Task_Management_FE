import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helpers/validationform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userStore: UserStoreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    console.log('Form value', this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('Invalid form');

      ValidateForm.validateAllFormFields(this.loginForm);
      this.toastr.error('ERROR', 'Invalid form');
      return;
    }

    this.authService.signIn(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res.message);
        this.loginForm.reset();
        this.authService.storeToken(
          res.result.accessToken,
          res.result.refreshToken
        );
        const tokenPayload = this.authService.decodedToken();
        this.userStore.setFullNameForStore(tokenPayload.name);
        this.userStore.setRoleForStore(tokenPayload.role);
        this.toastr.success('SUCCESS', 'Login successfully');
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.toastr.error('ERROR', err.error.message);
        console.log(err);
      },
    });
  }
}
