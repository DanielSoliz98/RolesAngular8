import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_service/authentication.service';
import { Role } from '../_models/role';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate() {
        let result = false;
        if (this.authenticationService.currentUserValue.role === Role.Admin) {
            result = true;
        } else {
            this.router.navigate(['/no-access']);
        }
        return result;
    }
} 