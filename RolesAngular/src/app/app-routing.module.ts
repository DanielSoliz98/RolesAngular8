import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './cashier/cashier.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { NoAccessComponent } from './no-access/no-access.component';
import { AdminAuthGuard } from './_helpers/admin.auth.guard';
import { ExampleComponent } from './example/example.component';
import { TableComponent } from './table/table.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
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
  { 
    path: 'example', 
    component: ExampleComponent 
  },
  { 
    path: 'table', 
    component: TableComponent 
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
