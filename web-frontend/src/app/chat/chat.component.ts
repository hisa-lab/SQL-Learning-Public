import { Component, OnChanges, OnDestroy, Input } from '@angular/core';
import { AuthdataService } from '../authdata.service';
import { LoopBackConfig, LoopBackAuth, Lesson, Practice, Chat, LessonApi, ChatApi } from '../../../lb-sdk';
import { Socket } from 'ng-socket-io';
import { isNull, isNumber } from 'util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnChanges, OnDestroy {

  @Input() lesson: Lesson;
  @Input() practice: Practice;
  private chatStreamSubscription;
  public chatLog: Chat[] = [];
  public chattext: string;
  private isSocketInit: Boolean = false;

  constructor(
    private LessonApi: LessonApi,
    private ChatApi: ChatApi,
    private socket: Socket,
    private LoopBackAuth: LoopBackAuth,
    public AuthdataService: AuthdataService
  ) { }

  ngOnChanges() {
    if (isNumber(this.lesson.id) && isNumber(this.practice.id)) {
      this.LessonApi.getPracticeChat(this.lesson.id, this.practice.id, {
        order: 'id DESC',
        limit: 20
      }).subscribe((chatlogs: Chat[]) => {
        this.chatLog.push(...chatlogs);
      });
      if (this.isSocketInit === false) {
        this.initSocket();
      }
    }
  }

  ngOnDestroy() {
    // 切断を通知後切断
    const token = this.LoopBackAuth.getToken();
    this.socket.emit('chatUnSubscribe', {
      lessonId: this.lesson.id,
      practiceId: this.practice.id,
      token: token
    });
    this.socket.disconnect();
  }

  private initSocket() {
    this.socket.connect();
    this.socket.once('connect', () => {
      // 今の課題のチャンネルに接続
      const token = this.LoopBackAuth.getToken();
      this.socket.emit('chatSubscribe', {
        lessonId: this.lesson.id,
        practiceId: this.practice.id,
        token: token
      });

      // 更新を受信
      this.socket.on('chatUpdate', chatlog => {
        this.chatLog.unshift(chatlog);
      });
    });
  }

  public send() {
    const input = this.chattext;
    if (input) {
      this.chattext = '';
      // 質問の送信
      this.LessonApi.createPracticeChat(this.lesson.id, this.practice.id, {
        text: input,
        name: this.AuthdataService.account.email
      }).subscribe(() => {
        console.log('Chat Submit Succsess!');
      });
    }
  }

}
