import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'mg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login(form: NgForm) {
    if (form.valid) {
      this.authService.login(form.value).subscribe(
        (response: any) => {
          this.authService.storeUserData(response.token, response.user);
          this.router.navigate(['/profile']);
        },
        (error) => console.error('Error logging in user:', error)
      );
    }
  }
}
