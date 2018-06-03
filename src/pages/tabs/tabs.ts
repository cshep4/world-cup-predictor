import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
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
              private storage: Storage,
              private toastCtrl: ToastController) {
    // code to migrate from old storage to new
    if(localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      storage.set("token", token);
      localStorage.removeItem("token");
    }
    if(localStorage.getItem("userId")) {
      const userId = localStorage.getItem("userId");
      storage.set("userId", userId);
      localStorage.removeItem("userId");
    }

    storage.get('token').then((token) => {}, (error) => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
