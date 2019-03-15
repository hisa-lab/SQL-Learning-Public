// ルーティング定義ファイル
import { Routes } from '@angular/router';

// ページのコンポーネントをインポート
import { AuthGuard } from './auth.guard';
import { IndexComponent } from './index/index.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthComponent } from './auth/auth.component';
import { LoginsuccessComponent } from './loginsuccess/loginsuccess.component';
import { LoginfailedComponent } from './loginfailed/loginfailed.component';
import { LessonListComponent } from './lesson-list/lesson-list.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { SqlexecComponent } from './sqlexec/sqlexec.component';
import { OrmexecComponent } from './ormexec/ormexec.component';
import { PracticeAnswerListComponent } from './practice-answer-list/practice-answer-list.component';
import { PracticeAnswerAggregateComponent } from './practice-answer-aggregate/practice-answer-aggregate.component';
import { LessonAnswerAggregateComponent } from './lesson-answer-aggregate/lesson-answer-aggregate.component';
import { ChatOldLogComponent } from './chat-old-log/chat-old-log.component';
import { BbsComponent } from './bbs/bbs.component';

// ルーティング定義
export const route: Routes = [
    {
        // /auth
        component: IndexComponent,
        path: ''
    },
    {
        // /user
        component: UserListComponent,
        path: 'user',
        canActivate: [AuthGuard]
    },
    {
        // /auth
        component: AuthComponent,
        path: 'auth'
    },
    {
        // /loginsuccess
        component: LoginsuccessComponent,
        path: 'login/Success'
    },
    {
        // /loginfailed
        component: LoginfailedComponent,
        path: 'login/failed',
        // canActivate: [AuthGuard]
    },
    {
        // /Lesson
        component: LessonListComponent,
        path: 'Lesson',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id
        component: PracticeListComponent,
        path: 'Lesson/:id',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/:pid/sqlexec
        component: SqlexecComponent,
        path: 'Lesson/:id/:pid/sqlexec',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/:pid/ormexec
        component: OrmexecComponent,
        path: 'Lesson/:id/:pid/ormexec',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/:pid/answer
        component: PracticeAnswerListComponent,
        path: 'Lesson/:id/:pid/answer',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/:pid/answerAggregate
        component: PracticeAnswerAggregateComponent,
        path: 'Lesson/:id/:pid/answerAggregate',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/answerAggregate
        component: LessonAnswerAggregateComponent,
        path: 'Lesson/:id/answerAggregate',
        canActivate: [AuthGuard]
    },
    {
        // /Lesson/:id/:pid/chatlog
        component: ChatOldLogComponent,
        path: 'Lesson/:id/:pid/chatlog',
        canActivate: [AuthGuard]
    },
    {
        // /bbs
        component: BbsComponent,
        path: 'bbs',
        canActivate: [AuthGuard]
    },

];
