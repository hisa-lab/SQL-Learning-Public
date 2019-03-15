import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LoopBackConfig, Lesson, Practice, Chat, LessonApi, ChatApi } from '../../../lb-sdk';

@Component({
  selector: 'app-chat-old-log',
  templateUrl: './chat-old-log.component.html',
  styleUrls: ['./chat-old-log.component.css']
})
export class ChatOldLogComponent implements OnInit {

  public chatLog: Chat[] = [];

  constructor(
    private ChatApi: ChatApi,
    public location: Location,
  ) { }

  ngOnInit() {
    this.ChatApi.find().subscribe((chatlogs: Chat[]) => {
      this.chatLog.push(...chatlogs);
    });
  }

}
