import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SqliteService, SqliteOutputInterface } from '../sqlite.service';
import { Lesson, LessonApi, Practice, PracticeApi } from '../../../lb-sdk';
import { AnswerSubmitDialogComponent } from '../answer-submit-dialog/answer-submit-dialog.component';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-sqlexec',
  templateUrl: './sqlexec.component.html',
  styleUrls: ['./sqlexec.component.css']
})
export class SqlexecComponent implements OnInit {

  @ViewChild('dialog') dialogComponent: AnswerSubmitDialogComponent;

  constructor(
    private route: ActivatedRoute,
    private LessonApi: LessonApi,
    private PracticeApi: PracticeApi,
    private Sqlite: SqliteService
  ) { }


  lesson: Lesson = new Lesson;
  practice: Practice = new Practice;
  inputsql: string;

  outputs: Array<SqliteOutputInterface> = [];

  ngOnInit() {
    const LessonID: number = this.route.snapshot.params['id'];
    const PracticeID: number = this.route.snapshot.params['pid'];

    this.LessonApi.findOne({
      where: {
        id: LessonID
      }
    }).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
    });

    this.LessonApi.findByIdPractice(LessonID, PracticeID)
      .subscribe((practice: Practice) => {
        this.practice = practice;
        // tslint:disable-next-line:quotemark
        this.Sqlite.execSql(this.practice.file, "select name from sqlite_master where type='table'").then(res => console.log(res));
      });
  }

  public sqlrun() {
    const sql = this.inputsql;
    this.inputsql = '';
    if (sql[sql.length - 1] !== ';') {
      this.outputs.unshift({
        sql: sql,
        columns: null,
        values: [['セミコロンが抜けていませんか？']]
      });
      return;
    }
    this.Sqlite.execSql(this.practice.file, sql).then(res => {
      if (res) {
        this.outputs.unshift(res);
      }
    }).catch(err => {
      this.outputs.unshift({
        sql: sql,
        columns: null,
        values: [[err.toString()]]
      });
    });
  }

  // 提出確認ダイアログを開く
  openDialog(sql) {
    this.dialogComponent.openDialog(this.lesson, this.practice, sql);
  }

  // ダイアログ側で送信された際に呼ばれる
  getDialogData(e) {
    // this.parentData = e.data;
  }
}
