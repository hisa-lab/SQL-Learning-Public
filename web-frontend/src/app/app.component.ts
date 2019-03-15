import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { AuthdataService } from './authdata.service';
import { Account, Practice, Lesson } from '../../lb-sdk';
import { AccountApi, LoopBackAuth, LessonApi, PracticeApi } from '../../lb-sdk/services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isAuth: Boolean = false;
  isAdmin: Boolean = false;
  account: Account = new Account;

  constructor(
    private Router: Router,
    private AccountApi: AccountApi,
    public AuthdataService: AuthdataService
  ) {
  }

  lesson: Practice[];

  ngOnInit() {
    if (this.AccountApi.isAuthenticated()) {
      this.AuthdataService.emitChange();
    }

    this.AuthdataService.changeEmitted$.subscribe(() => {
      // ログイン状況が変更されたときに呼び出される
      this.isAuth = this.AuthdataService.isAuth;
      this.isAdmin = this.AuthdataService.isAdmin;
      this.account = this.AuthdataService.account;
    });
  }
}
