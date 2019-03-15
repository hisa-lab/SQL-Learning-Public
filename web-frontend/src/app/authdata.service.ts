import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Account } from '../../lb-sdk';
import { AccountApi, LoopBackAuth, LessonApi, PracticeApi } from '../../lb-sdk/services';
@Injectable()
export class AuthdataService {
  private emitChangeSource = new Subject<any>();
  public changeEmitted$ = this.emitChangeSource.asObservable();
  public isAuth: Boolean = false;
  public isAdmin: Boolean = false;
  public account: Account = new Account;

  constructor(
    private AccountApi: AccountApi,
  ) {
  }

  emitChange() {
    this.AccountApi.getCurrent({ include: 'ValidUser' }).subscribe((account: Account) => {
      this.isAuth = this.AccountApi.isAuthenticated();
      this.account = account;
      this.isAdmin = account.ValidUser.role === 'admin';
      this.emitChangeSource.next();
    }, err => {
      // ログイン失敗時は認証情報等を消す
      this.logout();
    });
  }

  logout() {
    this.AccountApi.logout();
    this.isAuth = false;
    this.isAdmin = false;
    this.account = new Account;
    this.emitChangeSource.next();
  }
}
