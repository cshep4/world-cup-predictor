import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {PredictorPage} from '../predictor/predictor';
import {StandingsPage} from '../standings/standings';
import {LoginPage} from '../login/login';
import {TournamentPage} from "../tournament/tournament";
import {AccountPage} from "../account/account";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = PredictorPage;
  tab3Root: any = TournamentPage;
  tab4Root: any = StandingsPage;
  tab5Root: any = AccountPage;

  constructor(public navCtrl: NavController) {
    if(!localStorage.getItem("token")) {
      navCtrl.setRoot(LoginPage);
    }
  }
}
