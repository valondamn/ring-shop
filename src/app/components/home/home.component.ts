import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductModelServer, serverResponse } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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
          (product) => product.cat_id === 1
        );
        console.log(this.products);
      });
  }

  imageBlocks = [
    { image: 'assets/img/image1.jpg' },
    { image: 'assets/img/image2.jpg' },
    { image: 'assets/img/image3.jpg' },
    { image: 'assets/img/image4.jpg' },
    { image: 'assets/img/image5.jpg' },
    { image: 'assets/img/image6.jpg' },
    { image: 'assets/img/image7.jpg' },
    { image: 'assets/img/image8.jpg' },
  ];

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
          this.products = prods.products;
          this.noDataFound = false;
        });
    }
  }
}
