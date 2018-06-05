import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {PredictorPage} from '../predictor/predictor';
import {StandingsPage} from '../standings/standings';
import {LoginPage} from '../login/login';
import {TournamentPage} from "../tournament/tournament";
import {AccountPage} from "../account/account";
import {Storage} from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = PredictorPage;
  tab3Root: any = TournamentPage;
  tab4Root: any = StandingsPage;
  tab5Root: any = AccountPage;
  tabs: any;

  constructor(private navCtrl: NavController,
              private storage: Storage) {
    storage.get('token').then((token) => {
      if (!token) {
        this.setRootIfNotUsingOldSystem();
      }
    }, (error) => {
      this.setRootIfNotUsingOldSystem();
    });
  }

  private setRootIfNotUsingOldSystem() {
    let isOldSystem = false;
    if(localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      this.storage.set("token", token);
      localStorage.removeItem("token");
      isOldSystem = true;
    }
    if(localStorage.getItem("userId")) {
      const userId = localStorage.getItem("userId");
      this.storage.set("userId", userId);
      localStorage.removeItem("userId");
      isOldSystem = true;
    }

    if (!isOldSystem) {
      this.navCtrl.setRoot(LoginPage);
    }
  }
}
