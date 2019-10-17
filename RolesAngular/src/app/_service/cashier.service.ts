import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CashierService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/cashiers`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/cashiers/${id}`);
    }
}