import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoopBackConfig, Lesson, LessonApi, Practice, PracticeApi, Answer } from '../../../lb-sdk';

interface AnswerAggregate {
  accountId: number;
  count: number;
  point: number;
  email: string;
}

@Component({
  selector: 'app-practice-answer-aggregate',
  templateUrl: './practice-answer-aggregate.component.html',
  styleUrls: ['./practice-answer-aggregate.component.css']
})
export class PracticeAnswerAggregateComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private LessonApi: LessonApi,
  ) { }

  public answers: AnswerAggregate[];
  private timer: number;

  ngOnInit() {
    this.load();
    this.timer = window.setInterval(() => {
      this.load();
    }, 3000);
  }

  ngOnDestroy() {
    window.clearInterval(this.timer);
  }

  load() {
    const LessonID: number = this.route.snapshot.params['id'];
    const PracticeID: number = this.route.snapshot.params['pid'];
    console.log(LessonID, PracticeID);
    const url = LoopBackConfig.getPath() + '/' + LoopBackConfig.getApiVersion() +
      `/Lessons/:lessonId/practice/:practiceId/answerAggregate`;

    this.LessonApi.request('GET', url, { lessonId: LessonID, practiceId: PracticeID })
      .subscribe((answers: AnswerAggregate[]) => {
        this.answers = answers;
      });
  }

}
