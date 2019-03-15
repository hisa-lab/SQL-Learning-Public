import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Lesson, LessonApi, Practice, Answer, Account, AccountApi } from '../../../lb-sdk';

@Component({
  selector: 'app-practice-answer-list',
  templateUrl: './practice-answer-list.component.html',
  styleUrls: ['./practice-answer-list.component.css']
})
export class PracticeAnswerListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private AccountApi: AccountApi,
    private LessonApi: LessonApi,
    public location: Location,
  ) { }

  answers: Answer[] = [];
  practice: Practice = new Practice;

  ngOnInit() {
    const LessonID: number = this.route.snapshot.params['id'];
    const PracticeID: number = this.route.snapshot.params['pid'];
    this.LessonApi.findByIdPractice(LessonID, PracticeID).subscribe((practice: Practice) => {
      this.practice = practice;
    });
    this.LessonApi.getPracticeAnswer(LessonID, PracticeID, {
      where: {
        accountId: this.AccountApi.getCurrentId()
      }
    }).subscribe((answers: Answer[]) => {
      this.answers = answers;
    });
  }
}
