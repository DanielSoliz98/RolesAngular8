import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_service/authentication.service';
import { CashierService } from '../_service/cashier.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = false;
  currentUser: User;
  userFromApi: User;
  constructor(
    private cashierService: CashierService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loading = true;
    this.cashierService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
      this.loading = false;
      this.userFromApi = user;
    });
  }

}
