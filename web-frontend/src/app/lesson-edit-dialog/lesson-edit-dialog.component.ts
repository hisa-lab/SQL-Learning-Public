import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Lesson, LessonApi, Practice, PracticeApi, Answer } from '../../../lb-sdk';

@Component({
  selector: 'app-lesson-edit-dialog',
  templateUrl: './lesson-edit-dialog.component.html',
  styleUrls: ['./lesson-edit-dialog.component.css']
})
export class LessonEditDialogComponent implements OnInit {

  @ViewChild('lgModal') modalRef: ModalDirective;
  @Output('onSubmit') onSubmit = new EventEmitter<any>();

  form: FormGroup;
  lesson: Lesson = new Lesson;

  constructor(
    private LessonApi: LessonApi,
  ) {
    // ヴァリデーション
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required
      ]),
      number: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {
  }

  // ダイアログが開かれた際に呼ばれる
  openDialog(lesson: Lesson) {
    this.form.reset();
    this.lesson = lesson;
    if (lesson.id) {
      this.form.setValue({
        title: lesson.title,
        number: lesson.number
      });
    }
    this.modalRef.show();
  }

  // 送信された際に呼ばれる
  Submit() {
    // 回答の送信
    this.lesson.title = this.form.value.title;
    this.lesson.number = this.form.value.number;
    this.LessonApi.patchOrCreate(this.lesson).subscribe((lesson: Lesson) => {
      this.onSubmit.emit();
      this.modalRef.hide();
    });
  }

  // キャンセルされた場合
  Cancel() {
    // 閉じる
    this.modalRef.hide();
  }
}
