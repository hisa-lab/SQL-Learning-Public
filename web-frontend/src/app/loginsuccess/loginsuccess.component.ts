import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthdataService } from '../authdata.service';
import { LoopBackAuth } from '../../../lb-sdk';

@Component({
  selector: 'app-loginsuccess',
  templateUrl: './loginsuccess.component.html',
  styleUrls: ['./loginsuccess.component.css']
})
export class LoginsuccessComponent implements OnInit {

  constructor(
    private Router: Router,
    private cookieService: CookieService,
    private LoopBackAuth: LoopBackAuth,
    private AuthdataService: AuthdataService
  ) {
  }

  ngOnInit() {
    this.LoopBackAuth.setToken(JSON.parse(this.cookieService.get('authJson')));
    this.cookieService.delete('authJson');
    // ログイン状況が変更されたことを通知
    this.AuthdataService.emitChange();
    // TOPに遷移
    this.Router.navigateByUrl('/');

  }
}
