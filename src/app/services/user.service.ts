import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth = false;
  private SERVER_URL = environment.serverURL;
  private user!: any;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | ResponseModel | null>(null);


  constructor(private authService: SocialAuthService,
              private httpClient: HttpClient) {

    authService.authState.subscribe((user: SocialUser) => {
      if( user == null){
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user)
      }
    })


  }
  loginUser(email: string, password: string){
    this.httpClient.post(`${this.SERVER_URL}/auth/login`, {email, password})
  .subscribe((data: any) => {
    this.auth = data.auth;
    this.authState$.next(this.auth);
    this.userData$.next(data);

  })
  }

  googleLogin(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  logout(){
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

interface ResponseModel{
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number
}
