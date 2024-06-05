import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register(form: NgForm) {
    if (form.valid) {
      this.authService.register(form.value).subscribe(
        (response) => {
          console.log('User registered successfully!', response);
          this.errorMessage = null;
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error registering user:', error);
          this.errorMessage = error.error.message || 'Failed to register user.';
        }
      );
    }
  }
}
