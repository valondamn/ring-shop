import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  updateProfile(form: NgForm) {
    if (form.valid) {
      this.authService.updateProfile(this.user).subscribe(
        (response) => console.log('Profile updated successfully!', response),
        (error) => console.error('Error updating profile:', error)
      );
      this.authService.logout();
    }
  }
}
