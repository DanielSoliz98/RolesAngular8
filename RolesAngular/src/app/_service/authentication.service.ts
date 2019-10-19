import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(this.decodeToken());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public decodeToken(){
        const helper = new JwtHelperService();
        return helper.decodeToken(localStorage.getItem('token'));
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    localStorage.setItem('token', JSON.stringify(user.token));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }
}