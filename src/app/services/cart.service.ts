import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject } from 'rxjs';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { OrderService } from './order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  ServerURL = environment.serverURL; // URL сервера, взятый из конфигурации окружения

  // Данные корзины для клиента, которые будут отправлены на сервер
  private cartDataClient: CartModelPublic = {
    prodData: [{ incart: 0, id: 0 }],
    total: 0,
  };

  // Данные корзины для сервера
  private cartDataServer: CartModelServer = {
    data: [
      {
        product: undefined,
        numInCart: 0,
      },
    ],
    total: 0,
  };

  cartTotal$ = new BehaviorSubject<number>(0); // Объект для хранения общей суммы корзины, который наблюдается другими компонентами
  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer); // Объект для хранения данных корзины, который наблюдается другими компонентами

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private httpClient: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    this.cartTotal$.next(this.cartDataServer.total); // Устанавливаем начальное значение общей суммы корзины
    this.cartDataObs$.next(this.cartDataServer); // Устанавливаем начальное значение данных корзины

    let cartItem = localStorage.getItem('cart'); // Получаем данные корзины из локального хранилища
    let info: CartModelPublic | null = cartItem ? JSON.parse(cartItem) : null; // Парсим данные корзины или устанавливаем null, если данных нет
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // Если данные корзины существуют и содержат товары, восстанавливаем их
      this.cartDataClient = info; // Присваиваем данные корзины клиенту
      // Проходим по каждому товару в корзине
      this.cartDataClient.prodData.forEach((p) => {
        // Получаем информацию о товаре с сервера
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProdInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              // Если корзина на сервере пуста, добавляем товар
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = actualProdInfo;
              this.CalculateTotal(); // Пересчитываем общую сумму корзины
              this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные корзины клиента
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем обновленные данные в локальном хранилище
            } else {
              // Если корзина на сервере не пуста, добавляем товар в конец массива
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProdInfo,
              });
              this.CalculateTotal(); // Пересчитываем общую сумму корзины
              this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные корзины клиента
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем обновленные данные в локальном хранилище
            }
            this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
          });
      });
    }
  }

  // Метод для вычисления общей суммы для товара по индексу
  CalculateSubTotal(index: any): number {
    let subTotal = 0;
    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart; // Вычисляем сумму для данного товара

    return subTotal; // Возвращаем сумму
  }

  // Метод для добавления товара в корзину
  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      // Если корзина пуста
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod; // Добавляем товар
        this.cartDataServer.data[0].numInCart =
          quantity !== undefined ? quantity : 1; // Устанавливаем количество товара
        this.CalculateTotal(); // Пересчитываем общую сумму корзины
        this.cartDataClient.prodData[0].incart =
          this.cartDataServer.data[0].numInCart; // Обновляем данные клиента
        this.cartDataClient.prodData[0].id = prod.id; // Обновляем данные клиента
        this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
        this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
        // Показываем сообщение об успешном добавлении товара в корзину
        this.toast.success(`${prod.name} added to the cart.`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right',
        });
      } else {
        // Если корзина не пуста
        let index = this.cartDataServer.data.findIndex(
          (p) => p.product?.id === prod.id
        );

        // Если выбранный товар уже в корзине
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart =
              this.cartDataServer.data[index].numInCart < prod.quantity
                ? quantity
                : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart < prod.quantity
              ? this.cartDataServer.data[index].numInCart++
              : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart =
            this.cartDataServer.data[index].numInCart;
          // Показываем сообщение об обновлении количества товара в корзине
          this.toast.info(
            `${prod.name} quantity updated in the cart.`,
            'Product Updated',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        } else {
          // Если выбранный товар не в корзине
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1,
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id,
          });
          // Показываем сообщение об успешном добавлении товара в корзину
          this.toast.success(
            `${prod.name} added to the cart.`,
            'Product Added',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
        this.CalculateTotal(); // Пересчитываем общую сумму корзины
        this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
        this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
      }
    });
  }

  // Метод для обновления данных корзины
  UpdateCartData(index: any, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      // Увеличиваем количество товара в корзине
      // @ts-ignore
      data.numInCart < data.product.quantity
        ? data.numInCart++
        : data.product?.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart; // Обновляем данные клиента
      this.CalculateTotal(); // Пересчитываем общую сумму корзины
      this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента
      this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
    } else {
      // Уменьшаем количество товара в корзине
      data.numInCart--;

      if (data.numInCart < 1) {
        // Удаляем товар из корзины, если его количество меньше 1
        this.cartDataServer.data.splice(index, 1);
        this.cartDataClient.prodData.splice(index, 1);
        this.CalculateTotal(); // Пересчитываем общую сумму корзины
        this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента
        if (this.cartDataClient.total === 0) {
          // Если корзина пуста, сбрасываем данные
          this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
        } else {
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
        }

        if (this.cartDataServer.total === 0) {
          // Если корзина пуста, сбрасываем данные
          this.cartDataServer = {
            data: [
              {
                product: undefined,
                numInCart: 0,
              },
            ],
            total: 0,
          };
          this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
        } else {
          this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
        }
      } else {
        this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
        this.cartDataClient.prodData[index].incart = data.numInCart; // Обновляем данные клиента
        this.CalculateTotal(); // Пересчитываем общую сумму корзины
        this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
      }
    }
  }

  // Метод для удаления товара из корзины
  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1); // Удаляем товар из данных сервера
      this.cartDataClient.prodData.splice(index, 1); // Удаляем товар из данных клиента
      this.CalculateTotal(); // Пересчитываем общую сумму корзины
      this.cartDataClient.total = this.cartDataServer.total; // Обновляем данные клиента

      if (this.cartDataClient.total === 0) {
        // Если корзина пуста, сбрасываем данные
        this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); // Сохраняем данные клиента в локальное хранилище
      }

      if (this.cartDataServer.total === 0) {
        // Если корзина пуста, сбрасываем данные
        this.cartDataServer = {
          data: [
            {
              product: undefined,
              numInCart: 0,
            },
          ],
          total: 0,
        };
        this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
      } else {
        this.cartDataObs$.next({ ...this.cartDataServer }); // Обновляем наблюдаемые данные корзины
      }
    }
  }

  // Метод для проверки корзины (для переадресации и проверки наличия товаров)

  CheckoutFromCart(userId: number) {
    const orderPayload = {
      userId: userId,
      products: this.cartDataClient.prodData.map((prod) => ({
        id: prod.id,
        quantity: prod.incart,
      })),
    };

    console.log('Order Payload:', orderPayload);

    this.httpClient
      .post(`${this.ServerURL}orders/payment`, null)
      .subscribe((res: any) => {
        console.clear();

        if (res.success) {
          this.resetServerData(); // Сбрасываем данные корзины на сервере
          this.httpClient
            .post(`${this.ServerURL}orders/new`, orderPayload)
            .subscribe((data: any) => {
              this.orderService.getSingleOrder(data.order_id).then((prods) => {
                if (data.success) {
                  const navigationExtras: NavigationExtras = {
                    state: {
                      message: data.message,
                      products: prods,
                      orderId: data.order_id,
                      total: this.cartDataClient.total,
                    },
                  };
                  // Навигация на страницу благодарности после успешного заказа

                  this.spinner.hide().then();
                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      this.cartDataClient = {
                        prodData: [{ incart: 0, id: 0 }],
                        total: 0,
                      };
                      this.cartTotal$.next(0);
                      localStorage.setItem(
                        'cart',
                        JSON.stringify(this.cartDataClient)
                      );
                    });
                }
              });
            });
        } else {
          this.spinner.hide().then();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          });
        }
      });
  }

  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      // @ts-ignore
      const { price } = p.product;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  // Метод для сброса данных корзины на сервере

  private resetServerData() {
    this.cartDataServer = {
      data: [
        {
          numInCart: 0,
          product: undefined,
        },
      ],
      total: 0,
    };
    this.cartDataObs$.next({ ...this.cartDataServer });
  }
}
