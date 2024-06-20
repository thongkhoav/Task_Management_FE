import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  title = 'task_management_fe';
  user: any;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.user = this.authService.decodedToken();
    console.log(this.user);
  }

  logout() {
    this.authService.signOut();
  }
}
