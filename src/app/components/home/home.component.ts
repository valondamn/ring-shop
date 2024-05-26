import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductModelServer, serverResponse } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  noDataFound: boolean = false;
  question: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
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

  sendQuestion(event: Event) {
    event.preventDefault();
    const emailContent = {
      subject: 'Новый вопрос с магазина Ring',
      body: `Добрый день!\nВам пришел новый вопрос с магазина Ring\n\nВопрос: ${this.question}`,
    };

    this.http.post('/api/send-email', emailContent).subscribe(
      (response) => {
        console.log('Email sent successfully', response);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }

  imageBlocks = [
    { image: 'assets/img/main/ring.jpg', text: 'Кольца', link: 'rings' },
    { image: 'assets/img/main/earrings.jpg', text: 'Серьги', link: 'earrings' },
    { image: 'assets/img/main/necklace.jpg', text: 'Колье', link: 'necklace' },
    {
      image: 'assets/img/main/pearcing.jpg',
      text: 'Пирсинг',
      link: 'piercing',
    },
    {
      image: 'assets/img/main/pendant.jpg',
      text: 'Подвески',
      link: 'suspensions',
    },
    {
      image: 'assets/img/main/bacelets.jpg',
      text: 'Браслеты',
      link: 'bracelets',
    },
    { image: 'assets/img/main/brooches.jpg', text: 'Броши', link: 'brooches' },
    { image: 'assets/img/main/crosses.jpg', text: 'Кресты', link: 'crosses' },
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
