import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {StandingsPage} from '../pages/standings/standings';
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
import {StandingsService} from "../providers/standings-service";
import {LeaguePage} from "../pages/league/league";
import {Clipboard} from "@ionic-native/clipboard";
import {AccountService} from "../providers/account-service";
import {Keyboard} from "ionic-native";
import {WheelSelector} from "@ionic-native/wheel-selector";
import {IonicStorageModule} from "@ionic/storage";
import {ResetPasswordPage} from "../pages/resetpassword/resetpassword";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PredictorPage,
    TournamentPage,
    AccountPage,
    StandingsPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    GroupPopover,
    GroupFilter,
    StandingsAccordion,
    ResetPasswordPage,
    LeaguePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StandingsPage,
    PredictorPage,
    TournamentPage,
    AccountPage,
    TabsPage,
    LoginPage,
    RegisterPage,
    GroupPopover,
    ResetPasswordPage,
    LeaguePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    MatchService,
    TournamentService,
    ScoreService,
    StandingsService,
    AdMobFree,
    AccountService,
    Clipboard,
    Keyboard,
    WheelSelector]
})
export class AppModule {}
