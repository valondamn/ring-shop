import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cartData: any; // Using 'any' type temporarily for simplicity
  cartTotal: number = 0;
  isLoggedIn: boolean = false;
  username: string | null = '';

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    this.cartService.cartDataObs$.subscribe((data) => {
      this.cartData = data;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.username = user ? user.username : null;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
