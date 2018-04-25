import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {PredictorPage} from '../pages/predictor/predictor';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {GroupPopover} from '../components/group-popover/group-popover';
import {AuthService} from '../providers/auth-service';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {TournamentPage} from "../pages/tournament/tournament";
import {AccountPage} from "../pages/account/account";
import {MatchService} from "../providers/match-service";
import {GroupFilter} from "../pipes/group-filter";
import {TournamentService} from "../providers/tournament-service";
import {StandingsAccordion} from "../components/standings-accordion/standings-accordion";
import {AdMobFree} from "@ionic-native/admob-free";
import {ScoreService} from "../providers/score-service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PredictorPage,
    TournamentPage,
    AccountPage,
    ContactPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    GroupPopover,
    GroupFilter,
    StandingsAccordion
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactPage,
    PredictorPage,
    TournamentPage,
    AccountPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    GroupPopover
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    MatchService,
    TournamentService,
    ScoreService,
    AdMobFree]
})
export class AppModule {}
