import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { serverResponse } from '../../models/product.model';

@Component({
  selector: 'app-chains',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgForOf, NgIf, TitleCasePipe],
  templateUrl: './chains.component.html',
  styleUrl: './chains.component.scss',
})
export class ChainsComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  noDataFound: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService
      .getAllProducts(1000)
      .subscribe((prods: serverResponse) => {
        this.products = prods.products.filter(
          (product) => product.cat_id === 2
        );
        console.log(this.products);
      });
  }
  AddProduct(id: number) {
    this.cartService.AddProductToCart(id);
  }

  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }

  searchProducts(searchTerm: string) {
    if (searchTerm.trim() !== '') {
      this.products = this.products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.noDataFound = this.products.length === 0;
    } else {
      this.productService
        .getAllProducts(1000)
        .subscribe((prods: serverResponse) => {
          this.products = prods.products.filter(
            (product) => product.cat_id === 1
          );
          this.noDataFound = false;
        });
    }
  }
}