import { Component, OnInit, Input } from '@angular/core';
import { Lesson, Practice } from '../../../lb-sdk';

@Component({
  selector: 'app-practice-detail',
  templateUrl: './practice-detail.component.html',
  styleUrls: ['./practice-detail.component.css']
})
export class PracticeDetailComponent implements OnInit {

  @Input() lesson: Lesson;
  @Input() practice: Practice;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
