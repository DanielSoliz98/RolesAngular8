import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { error } from 'util';
import { ok } from 'assert';


const users: User[] = [
    { id: 1, email: "cinemastudio_admin@gmail.com", password:"admin123", username: 'admin', role: Role.Admin },
    { id: 2, email: "cinemastudio_cashier1@gmail.com", password:"cashier1", username: 'cashier1', role: Role.Cashier },
    { id: 3, email: "cinemastudio_cashier2@gmail.com", password:"cashier2", username: 'cashier2', role: Role.Cashier },
    { id: 4, email: "cinemastudio_cashier3@gmail.com", password:"cashier3", username: 'cashier3', role: Role.Cashier },
    { id: 5, email: "cinemastudio_cashier4@gmail.com", password:"cashier4", username: 'cashier4', role: Role.Cashier },
    { id: 6, email: "cinemastudio_cashier5@gmail.com", password:"cashier5", username: 'cashier5', role: Role.Cashier }
];
const tokens = [
    { id: 1, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19hZG1pbkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIn0.bP52QqrjPpIFsnMKG7NQQ9InLVLKt9pcSabNkCMgCdA"},
    { id: 2, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19jYXNoaWVyMUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImNhc2hpZXIxIiwicm9sZSI6IkNhc2hpZXIifQ.rR3euH8BpJZbdsevgy9i_R-V17D4Cl-TAHaLh212szc"},
    { id: 3, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19jYXNoaWVyMkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImNhc2hpZXIyIiwicm9sZSI6IkNhc2hpZXIifQ.bv4dzu0p36ih0PUPT4Zjigt7-DuErlkmvBokBDxxsCU"},
    { id: 4, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19jYXNoaWVyM0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImNhc2hpZXIzIiwicm9sZSI6IkNhc2hpZXIifQ.cN9uugj0coJgkMHGfJXFgKuCjuD9kyLpFR1_6Z8z2qk"},
    { id: 5, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19jYXNoaWVyNEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImNhc2hpZXI0Iiwicm9sZSI6IkNhc2hpZXIifQ.nhmiFywvg71gT6kyCF2FDVTjJF6RPR5pubQYkhgWPX8"},
    { id: 6, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNpbmVtYXN0dWRpb19jYXNoaWVyNUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImNhc2hpZXI1Iiwicm9sZSI6IkNhc2hpZXIifQ.VJepI2fp_QrzzDeGr35dWqGWXEH1EIoktomBjH68NdM"}
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
            const token = tokens.find(x => x.id === user.id);
            if (!user) return error('Email or password is incorrect');
            return ok({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                token: token.token
            });
        }

        function getCashiers() {
            if (!isAdmin()) return unauthorized();
            const cashier = users.filter(x => x.role === Role.Cashier);
            return ok(cashier);
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

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};