import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson, LessonApi } from '../../../lb-sdk';
import { AuthdataService } from '../authdata.service';
import { LessonEditDialogComponent } from '../lesson-edit-dialog/lesson-edit-dialog.component';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css']
})
export class LessonListComponent implements OnInit {

  @ViewChild('dialog') dialogComponent: LessonEditDialogComponent;

  constructor(
    private LessonApi: LessonApi,
    public AuthdataService: AuthdataService
  ) {
  }

  lessons: Lesson[];

  loadLessons() {
    this.LessonApi.find().subscribe((lessons: Lesson[]) => {
      this.lessons = lessons;
    });
  }

  ngOnInit() {
    this.loadLessons();
  }

  // 提出確認ダイアログを開く
  openDialog(lesson: Lesson = new Lesson) {
    this.dialogComponent.openDialog(lesson);
  }

  // ダイアログ側で送信された際に呼ばれる
  getDialogData(e) {
    this.loadLessons();
  }
}
