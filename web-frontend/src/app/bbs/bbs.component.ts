import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BBSPost, BBSPostApi } from '../../../lb-sdk';


@Component({
  selector: 'app-bbs',
  templateUrl: './bbs.component.html',
  styleUrls: ['./bbs.component.css']
})
export class BbsComponent implements OnInit {

  constructor(
    private BBSPostApi: BBSPostApi
  ) { }

  public posts: BBSPost[];
  public form: FormGroup;

  ngOnInit() {
    this.loadBBSPosts();
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required
      ]),
      body: new FormControl('', [
        Validators.required
      ]),
    });
  }

  loadBBSPosts() {
    this.BBSPostApi.find({include: 'account'}).subscribe((posts: BBSPost[]) => {
      this.posts = posts;
    });
  }

  Submit() {
    // 送信
    this.BBSPostApi.create({
      title: this.form.value.title,
      body: this.form.value.body,
    }).subscribe(() => {
      this.form.reset();
      this.loadBBSPosts();
    });
  }

  Cancel() {
    this.form.reset();
  }
}
