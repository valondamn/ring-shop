import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartModelServer } from '../../models/cart.model';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'mg-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cartData!: CartModelServer;
  cartTotal!: number;
  showSpinner!: boolean;
  checkoutForm: any;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.cartService.cartDataObs$.subscribe((data) => (this.cartData = data));
    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }

  onCheckout() {
    this.spinner.show().then((p) => {
      const currentUser = this.authService.getUser();
      if (currentUser) {
        const userId = currentUser.id;
        this.cartService.CheckoutFromCart(userId);
      } else {
        this.spinner.hide();
        this.router.navigate(['/login']); // Redirect to login if user is not authenticated
      }
    });
  }
}
