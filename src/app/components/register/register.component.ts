import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'mg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  register(form: NgForm) {
    if (form.valid) {
      this.authService.register(form.value).subscribe(
        (response) => {
          console.log('User registered successfully!', response);
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error registering user:', error);
          this.errorMessage = error.error.message || 'Failed to register user.';
        }
      );
    }
  }
}
