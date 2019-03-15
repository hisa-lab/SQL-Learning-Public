import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountApi } from '../../lb-sdk/services';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private AccountApi: AccountApi,
    ) { }

    canActivate(): boolean {
        if (this.AccountApi.isAuthenticated()) {
            return true;
        } else {
            window.location.href = 'auth/google';
            return false;
        }
    }

}
