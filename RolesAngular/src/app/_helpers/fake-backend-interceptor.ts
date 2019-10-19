import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { JwtHelperService } from "@auth0/angular-jwt";


const users: User[] = [
    { id: 1, email: "cinemastudio_admin@gmail.com", password:"admin123", username: 'admin', role: Role.Admin },
    { id: 2, email: "cinemastudio_cashier1@gmail.com", password:"cashier1", username: 'cashier1', role: Role.Cashier },
    { id: 3, email: "cinemastudio_cashier2@gmail.com", password:"cashier2", username: 'cashier2', role: Role.Cashier },
    { id: 4, email: "cinemastudio_cashier3@gmail.com", password:"cashier3", username: 'cashier3', role: Role.Cashier },
    { id: 5, email: "cinemastudio_cashier4@gmail.com", password:"cashier4", username: 'cashier4', role: Role.Cashier },
    { id: 6, email: "cinemastudio_cashier5@gmail.com", password:"cashier5", username: 'cashier5', role: Role.Cashier }
];
const tokens = [
    { id: 1, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJjaW5lbWFzdHVkaW9fYWRtaW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBZG1pbiJ9.iJVPKy7Aitxh09xmGi8n00AkCy6PxSn6sa6EIeN8Yx8"},
    { id: 2, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJjaW5lbWFzdHVkaW9fY2FzaGllcjFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjYXNoaWVyMSIsInJvbGUiOiJDYXNoaWVyIn0.VyuH0IIGKZDfBW9S_Gn60n0c2Layu8doABNdLhz8Zxw"},
    { id: 3, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJjaW5lbWFzdHVkaW9fY2FzaGllcjJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjYXNoaWVyMiIsInJvbGUiOiJDYXNoaWVyIn0.a8OlkvMLWMSlMFOIbuBZ_6xb4cBXpZ4KU9SiVw61TCc"},
    { id: 4, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjaW5lbWFzdHVkaW9fY2FzaGllcjNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjYXNoaWVyMyIsInJvbGUiOiJDYXNoaWVyIn0.DgY64kVoeiSty0tEKJ-6Xo-Qh3N7hPTbru7VHrtbkik"},
    { id: 5, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJjaW5lbWFzdHVkaW9fY2FzaGllcjRAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjYXNoaWVyNCIsInJvbGUiOiJDYXNoaWVyIn0.av20HjMGPkGvUjmwL4yS9K3vmS0nKFRM8JabICzDOp0"},
    { id: 6, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJjaW5lbWFzdHVkaW9fY2FzaGllcjVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJjYXNoaWVyNSIsInJvbGUiOiJDYXNoaWVyIn0.B0u22GK4ThYV7DhAYiPPNb_waIbFI77qwL4ZkvC4Fqs"}
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/cashiers') && method === 'GET':
                    return getCashiers();
                case url.match(/\/cashiers\/\d+$/) && method === 'GET':
                    return getCashierById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if(user){
                const token = tokens.find(x => x.id === user.id);
                return ok({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    token: token.token
                });
            }else{
                return error('Email or password is incorrect')
            }
        }

        function getCashiers() {
            if (!isAdmin()) return unauthorized();
            const cashiers = users.filter(x => x.role === Role.Cashier);
            return ok(cashiers);
        }
        function getCashierById() {
            if (!isLoggedIn()) return unauthorized();

            if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        // helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message: string) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer');
        }

        function isAdmin() {
            const decodedToken = decodeToken();
            return isLoggedIn() && decodedToken.role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const decodedToken = decodeToken();
            return users.find(x => x.id === decodedToken.id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function decodeToken(){
            const helper = new JwtHelperService();
            return helper.decodeToken(headers.get('Authorization'));
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};