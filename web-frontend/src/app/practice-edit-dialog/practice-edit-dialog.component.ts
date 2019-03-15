import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Lesson, LessonApi, Practice, PracticeApi, Answer } from '../../../lb-sdk';

@Component({
  selector: 'app-practice-edit-dialog',
  templateUrl: './practice-edit-dialog.component.html',
  styleUrls: ['./practice-edit-dialog.component.css']
})
export class PracticeEditDialogComponent implements OnInit {

  @ViewChild('lgModal') modalRef: ModalDirective;
  @ViewChild('fileUpload') fileUpload: any;
  @Output('onSubmit') onSubmit = new EventEmitter<any>();

  form: FormGroup;
  practice: Practice = new Practice;
  lesson: Lesson = new Lesson;

  // ヴァリデーション設定
  setValidator() {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required
      ]),
      number: new FormControl('', [
        Validators.required
      ]),
      body: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', [
        Validators.required
      ]),
      markingType: new FormControl('', [
        Validators.required
      ]),
      sampleAnswer: new FormControl('', [
        Validators.required
      ]),
      file: new FormControl('', [
        Validators.required
      ])
    });
  }

  constructor(
    private LessonApi: LessonApi,
  ) {
    // ヴァリデーション
    this.setValidator();
  }

  ngOnInit() {
  }

  // ダイアログが開かれた際に呼ばれる
  openDialog(lesson: Lesson, practice: Practice) {
    // ヴァリデーションを再設定
    this.setValidator();
    // フォーム初期化
    this.fileUpload.nativeElement.value = '';
    this.form.reset();
    // 初期データ
    this.form.controls['type'].setValue('sqlexec', { onlySelf: true });
    this.form.controls['markingType'].setValue('resultCompare', { onlySelf: true });
    this.practice = practice;
    this.lesson = lesson;
    if (this.practice.id) {
      // 編集の場合はファイルのアップロードをしなくてもよい
      this.form.controls['file'].clearValidators();
      this.form.setValue({
        title: practice.title,
        number: practice.number,
        body: practice.body,
        type: practice.type,
        markingType: practice.markingType,
        sampleAnswer: practice.sampleAnswer,
        file: ''
      });
    }
    this.modalRef.show();
  }

  // 送信された際に呼ばれる
  Submit() {
    // 回答の送信
    for (const key in this.form.value) {
      if (this.form.value.hasOwnProperty(key)) {
        if (key === 'file') {
          this.practice[key] = this.form.value[key].value;
          continue;
        }
        if (key !== 'id' && key !== 'lessonId') {
          this.practice[key] = this.form.value[key];
        }
      }
    }
    if (this.practice.id) {
      // 編集の場合
      this.LessonApi.updateByIdPractice(this.practice.lessonId, this.practice.id, this.practice).subscribe((lesson: Lesson) => {
        this.onSubmit.emit();
        this.modalRef.hide();
      });
    } else {
      // 新規作成の場合
      this.LessonApi.createPractice(this.lesson.id, this.practice).subscribe((lesson: Lesson) => {
        this.onSubmit.emit();
        this.modalRef.hide();
      });
    }
  }
  // キャンセルされた場合
  Cancel() {
    // 閉じる
    this.modalRef.hide();
  }
  // ファイルの変更時に呼ばれる
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('file').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }
  // 問題・採点タイプの変更時に呼ばれる
  onSelectChange(name, value) {
    // ここでヴァリデーションの切り替えをする予定
  }
}
