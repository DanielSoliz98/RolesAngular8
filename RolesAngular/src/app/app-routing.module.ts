import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './cashier/cashier.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { NoAccessComponent } from './no-access/no-access.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cashier',
    component: CashierComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Cashier] }
  },
  { 
    path: 'no-access', 
    component: NoAccessComponent 
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
