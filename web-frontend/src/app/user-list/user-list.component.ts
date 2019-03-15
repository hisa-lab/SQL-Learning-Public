import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidUser, ValidUserApi } from '../../../lb-sdk';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private ValidUserApi: ValidUserApi
  ) { }

  public users: ValidUser[];
  public form: FormGroup;

  ngOnInit() {
    this.loadValidUserList();
    this.form = new FormGroup({
      ids: new FormControl('', [
        Validators.required
      ]),
      role: new FormControl('student', [
        Validators.required
      ])
    });
  }

  loadValidUserList() {
    this.ValidUserApi.find().subscribe((users: ValidUser[]) => {
      this.users = users;
    });
  }

  Submit() {
    // 回答の送信
    const role = this.form.value.role;
    const newUsers: any[] = [];
    for (const id of this.form.value.ids.split('\n')) {
      if (id === '') { continue; }
      newUsers.push({ role: role, email: id });
    }
    this.ValidUserApi.create(newUsers).subscribe((users: ValidUser[]) => {
      this.form.reset();
      this.loadValidUserList();
    });
  }

  Delete(id: number) {
    this.ValidUserApi.deleteById(id).subscribe(() => {
      this.loadValidUserList();
    });
  }

  Cancel() {
    this.form.reset();
  }
}
