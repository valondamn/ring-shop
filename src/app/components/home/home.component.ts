import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { serverResponse } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

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
  isLoggedIn: boolean = false;

  serverURL = environment.serverURL;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private authService: AuthService
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

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      const from = user && user.email ? user.email : 'No name';
    }
  }

  sendQuestion(event: Event) {
    event.preventDefault();
    const user = this.authService.getUser();
    const from = user.email;

    if (this.isLoggedIn) {
      const emailContent = {
        from: from,
        to: 'danilovvadim.0404@gmail.com',
        subject: 'Новый вопрос с магазина Ring',
        text: `Добрый день!\nВам пришел новый вопрос с магазина Ring\n\nВопрос: ${this.question}`,
      };

      console.log(emailContent); // Добавьте это для отладки
      this.http.post(`${this.serverURL}send-email/new`, emailContent).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
        },
        (error) => {
          console.error('Error sending email', error);
        }
      );
    } else {
      const emailContent = {
        from: 'No name',
        to: 'danilovvadim.0404@gmail.com',
        subject: 'Новый вопрос с магазина Ring',
        text: `Добрый день!\nВам пришел новый вопрос с магазина Ring\n\nВопрос: ${this.question}\n\n *Анонимно`,
      };

      console.log(emailContent); // Добавьте это для отладки
      this.http.post(`${this.serverURL}send-email/new`, emailContent).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
        },
        (error) => {
          console.error('Error sending email', error);
        }
      );
    }
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
}
