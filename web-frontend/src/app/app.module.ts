import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { route } from './app.route';
import { AceEditorModule } from 'ng2-ace-editor';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgForage, NgForageConfig, NgForageModule, NgForageOptions } from '@ngforage/ngforage-ng5';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { LoopBackConfig, SDKBrowserModule } from '../../lb-sdk';
import { AuthGuard } from './auth.guard';
import { AuthdataService } from './authdata.service';
import { SqliteService } from './sqlite.service';
import { ForgeConfService } from './forgeconf.service';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginsuccessComponent } from './loginsuccess/loginsuccess.component';
import { LoginfailedComponent } from './loginfailed/loginfailed.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { SqlexecComponent } from './sqlexec/sqlexec.component';
import { OrmexecComponent } from './ormexec/ormexec.component';
import { IndexComponent } from './index/index.component';
import { TableListComponent } from './table-list/table-list.component';
import { PracticeDetailComponent } from './practice-detail/practice-detail.component';
import { AnswerSubmitDialogComponent } from './answer-submit-dialog/answer-submit-dialog.component';
import { PracticeEditDialogComponent } from './practice-edit-dialog/practice-edit-dialog.component';
import { LessonEditDialogComponent } from './lesson-edit-dialog/lesson-edit-dialog.component';
import { PracticeAnswerListComponent } from './practice-answer-list/practice-answer-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ChatComponent } from './chat/chat.component';
import { ChatOldLogComponent } from './chat-old-log/chat-old-log.component';
import { ClickStopPropagation } from './clickStopPropagation';
import { BbsComponent } from './bbs/bbs.component';
import { PracticeAnswerAggregateComponent } from './practice-answer-aggregate/practice-answer-aggregate.component';
import { LessonAnswerAggregateComponent } from './lesson-answer-aggregate/lesson-answer-aggregate.component';

const config: SocketIoConfig = {
  url: window.location.protocol + '//' + window.location.host, options: {
    path: '/ws',
    autoConnect: false
  }
};

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginsuccessComponent,
    LoginfailedComponent,
    LessonListComponent,
    PracticeListComponent,
    SqlexecComponent,
    OrmexecComponent,
    IndexComponent,
    TableListComponent,
    PracticeDetailComponent,
    AnswerSubmitDialogComponent,
    PracticeEditDialogComponent,
    LessonEditDialogComponent,
    PracticeAnswerListComponent,
    UserListComponent,
    ChatComponent,
    ChatOldLogComponent,
    ClickStopPropagation,
    BbsComponent,
    PracticeAnswerAggregateComponent,
    LessonAnswerAggregateComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(route, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AceEditorModule,
    NgForageModule,
    ModalModule.forRoot(),
    SDKBrowserModule.forRoot(),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    AuthGuard,
    AuthdataService,
    SqliteService,
    CookieService,
    ForgeConfService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    LoopBackConfig.setBaseURL(window.location.protocol + '//' + window.location.host);
    LoopBackConfig.setApiVersion('api');
    LoopBackConfig.filterOnUrl();
    LoopBackConfig.filterOnHeaders();
  }
}
