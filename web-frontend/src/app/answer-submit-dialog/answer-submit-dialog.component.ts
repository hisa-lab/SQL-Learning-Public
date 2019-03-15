import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Lesson, LessonApi, Practice, PracticeApi, Answer } from '../../../lb-sdk';

@Component({
  selector: 'app-answer-submit-dialog',
  templateUrl: './answer-submit-dialog.component.html',
  styleUrls: ['./answer-submit-dialog.component.css']
})
export class AnswerSubmitDialogComponent implements OnInit {

  @ViewChild('lgModal') modalRef: ModalDirective;
  @Output('onSubmit') onSubmit = new EventEmitter<any>();

  lesson: Lesson = new Lesson;
  practice: Practice = new Practice;
  answer: Answer = new Answer;
  isSubmit: Boolean = false;
  submitDisable: Boolean = false;

  constructor(
    private LessonApi: LessonApi,
  ) { }

  ngOnInit() {
  }

  // ダイアログが開かれた際に呼ばれる
  openDialog(lesson: Lesson, practice: Practice, answer: string) {
    if (answer.length !== 0) {
      this.lesson = lesson;
      this.practice = practice;
      this.answer.answer = answer;
      this.isSubmit = false;
      this.modalRef.show();
    }
  }

  // 送信された際に呼ばれる
  Submit() {
    // 回答の送信
    if (!this.submitDisable) {
      this.submitDisable = true;
      this.LessonApi.createPracticeAnswer(this.lesson.id, this.practice.id, {
        answer: this.answer.answer
      }).subscribe((answer: Answer) => {
        this.submitDisable = false;
        this.isSubmit = true;
        this.answer = answer;
        this.onSubmit.emit(answer);
      });
    }
  }

  // キャンセルされた場合
  Cancel() {
    // 閉じる
    this.submitDisable = false;
    this.isSubmit = false;
    this.modalRef.hide();
  }
}
