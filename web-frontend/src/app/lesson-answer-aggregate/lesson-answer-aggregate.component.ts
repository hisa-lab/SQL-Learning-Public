import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoopBackConfig, Lesson, LessonApi, Practice, PracticeApi, Answer } from '../../../lb-sdk';

@Component({
  selector: 'app-lesson-answer-aggregate',
  templateUrl: './lesson-answer-aggregate.component.html',
  styleUrls: ['./lesson-answer-aggregate.component.css']
})
export class LessonAnswerAggregateComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private LessonApi: LessonApi,
  ) { }

  public answers: any[];
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
    const url = LoopBackConfig.getPath() + '/' + LoopBackConfig.getApiVersion() +
      `/Lessons/:lessonId/answerAggregate`;

    this.LessonApi.request('GET', url, { lessonId: LessonID })
      .subscribe((answers: any[]) => {
        this.answers = answers;
      });
  }
}
