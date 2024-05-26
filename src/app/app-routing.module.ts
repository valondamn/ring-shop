import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { RingsComponent } from './components/rings/rings.component';
import { EarringsComponent } from './components/earrings/earrings.component';
import { ChainsComponent } from './components/chains/chains.component';
import { SuspensionsComponent } from './components/suspensions/suspensions.component';
import { NecklaceComponent } from './components/necklace/necklace.component';
import { PiercingComponent } from './components/piercing/piercing.component';
import { BraceletsComponent } from './components/bracelets/bracelets.component';
import { BroochesComponent } from './components/brooches/brooches.component';
import { CrossesComponent } from './components/crosses/crosses.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'rings',
    component: RingsComponent,
  },
  {
    path: 'earrings',
    component: EarringsComponent,
  },
  {
    path: 'suspensions',
    component: SuspensionsComponent,
  },
  {
    path: 'necklace',
    component: NecklaceComponent,
  },
  {
    path: 'bracelets',
    component: BraceletsComponent,
  },
  {
    path: 'brooches',
    component: BroochesComponent,
  },
  {
    path: 'crosses',
    component: CrossesComponent,
  },
  {
    path: 'piercing',
    component: PiercingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'product/:id',
    component: ProductComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'thankyou',
    component: ThankyouComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
