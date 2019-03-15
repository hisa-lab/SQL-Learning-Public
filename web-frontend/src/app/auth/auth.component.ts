import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthdataService } from '../authdata.service';
import { Account, AccessToken } from '../../../lb-sdk/models';
import { AccountApi } from '../../../lb-sdk/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public account: Account = new Account();
  public rememberMe = false;

  constructor(
    private accountApi: AccountApi,
    private router: Router,
    private AuthdataService: AuthdataService
  ) {
  }

  ngOnInit() {
  }

  login() {
    this.accountApi.login(this.account, 'user', this.rememberMe).subscribe((token: AccessToken) => {
      this.AuthdataService.emitChange();
      this.router.navigate(['/']);
    });
  }

}



