import 'rxjs/add/operator/mergeMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerSubmitDialogComponent } from '../answer-submit-dialog/answer-submit-dialog.component';
import { LoopBackConfig, Lesson, LessonApi, Practice, PracticeApi } from '../../../lb-sdk';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/beautify';
import 'brace/keybinding/vim';
import 'brace/theme/eclipse';
import 'brace/mode/text';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';

@Component({
  selector: 'app-ormexec',
  templateUrl: './ormexec.component.html',
  styleUrls: ['./ormexec.component.css']
})
export class OrmexecComponent implements OnInit {

  @ViewChild('dialog') dialogComponent: AnswerSubmitDialogComponent;

  constructor(
    private route: ActivatedRoute,
    private LessonApi: LessonApi,
    private PracticeApi: PracticeApi,
  ) { }


  lesson: Lesson = new Lesson;
  practice: Practice = new Practice;
  stdOut: String = '';
  stdErr: String = '';

  @ViewChild('ormEditor') ormEditor;

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
      });

    this.ormEditor.setMode('javascript');
    this.ormEditor.setTheme('eclipse');
    this.ormEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    });
  }

  public ormRun() {
    const url: string = LoopBackConfig.getPath() + '/' + LoopBackConfig.getApiVersion() +
      '/Lessons/:lessonId/practice/:practiceId/ormExec';
    this.LessonApi.request('POST', url, {
      lessonId: this.lesson.id,
      practiceId: this.practice.id
    }, {}, JSON.stringify({ code: this.ormEditor.text }), null)
      .subscribe((data: any) => {
        console.log(data);
        this.stdErr = data.stderr;
        this.stdOut = data.stdout;
      });
  }

  public ormSubmit() {
    this.dialogComponent.openDialog(this.lesson, this.practice, this.ormEditor.text);
  }

  // ダイアログ側で送信された際に呼ばれる
  getDialogData(e) {
    // this.parentData = e.data;
  }
}
