import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lesson, LessonApi, Practice, PracticeApi } from '../../../lb-sdk';
import { AuthdataService } from '../authdata.service';
import { PracticeEditDialogComponent } from '../practice-edit-dialog/practice-edit-dialog.component';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

  @ViewChild('dialog') dialogComponent: PracticeEditDialogComponent;

  constructor(
    private route: ActivatedRoute,
    private LessonApi: LessonApi,
    private PracticeApi: PracticeApi,
    public AuthdataService: AuthdataService
  ) { }

  lesson: Lesson = new Lesson;
  practices: Practice[];

  loadPractice() {
    this.LessonApi.getPractice(this.lesson.id).subscribe((practices: Practice[]) => {
      this.practices = practices;
    });
  }

  ngOnInit() {
    const LessonID: number = this.route.snapshot.params['id'];

    this.LessonApi.findOne({
      where: {
        id: LessonID
      }
    }).subscribe((lesson: Lesson) => {
      this.lesson = lesson;
      this.loadPractice();
    });
  }

  // 提出確認ダイアログを開く
  openDialog(practice: Practice = new Practice) {
    this.dialogComponent.openDialog(this.lesson, practice);
  }

  // ダイアログ側で送信された際に呼ばれる
  getDialogData(e) {
    this.loadPractice();
  }
}
