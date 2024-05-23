import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule],
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
    }
  }
}
