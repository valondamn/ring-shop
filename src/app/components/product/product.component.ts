import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductModelServer, serverResponse } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

declare let $: any;

@Component({
  selector: 'mg-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements AfterViewInit, OnInit {
  id!: number;
  product!: any;
  thumbimages: any[] = [];
  products: any[] = [];
  searchTerm: string = '';
  noDataFound: boolean = false;
  newComment: string = '';
  comments: any[] = [];
  isLoggedIn: boolean = false;
  user: any;
  question: string = '';

  serverURL = environment.serverURL;

  @ViewChild('quantity') quantityInput!: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe((prodId) => {
        this.id = prodId;
        this.productService.getSingleProduct(this.id).subscribe((prod) => {
          this.product = prod;
          if (prod.images !== null) {
            this.thumbimages = prod.images.split(';');
          }
        });

        // Получение комментариев
        this.getComments(this.id);
      });

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.authService.getUser();
    }
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(id: number) {
    this.cartService.AddProductToCart(
      id,
      this.quantityInput.nativeElement.value
    );
  }

  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity >= 1) {
      value++;

      if (value > this.product.quantity) {
        // @ts-ignore
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0) {
      value--;

      if (value <= 0) {
        // @ts-ignore
        value = 0;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }
  getComments(productId: number) {
    this.http
      .get(`${this.serverURL}comments/${productId}`)
      .subscribe((comments: any) => {
        this.comments = comments;
      });
  }
  addComment(event: Event) {
    event.preventDefault();
    if (this.isLoggedIn && this.newComment.trim()) {
      const commentData = {
        user_id: this.user.id,
        product_id: this.id,
        comment: this.newComment,
      };
      this.http
        .post(`${this.serverURL}comments`, commentData)
        .subscribe((response: any) => {
          this.comments.push(response);
          this.newComment = '';
        });
    }

    event.preventDefault();
    const user = this.authService.getUser();
    const from = user.email;

    if (this.isLoggedIn) {
      const emailContent = {
        from: from,
        to: 'danilovvadim.0404@gmail.com',
        subject: 'Новый вопрос с магазина Ring',
        text: `Добрый день!\nВам пришел новый комментарий с магазина Ring\n\nКомментарий: ${this.newComment}\n\nId товара: ${this.id}`,
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
        text: `Добрый день!\nВам пришел новый комментарий с магазина Ring\n\nКомментарий: ${this.newComment}\n\nId товара: ${this.id} \n\n*Анонимно`,
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
}
