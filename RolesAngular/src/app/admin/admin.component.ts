import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { CashierService } from '../_service/cashier.service';


@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    loading = false;
    cashiers: User[] = [];

    constructor(private cashierService: CashierService) { }

    ngOnInit() {
        this.loading = true;
        this.cashierService.getAll().pipe(first()).subscribe(cashiers => {
            this.loading = false;
            this.cashiers = cashiers;
        });
    }
}
