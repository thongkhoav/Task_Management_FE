import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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
