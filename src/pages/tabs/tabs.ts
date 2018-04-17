import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {PredictorPage} from '../predictor/predictor';
import {ContactPage} from '../contact/contact';
import {LoginPage} from '../login/login';
import {StandingsPage} from "../standings/standings";
import {AccountPage} from "../account/account";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = PredictorPage;
  tab3Root: any = StandingsPage;
  tab4Root: any = ContactPage;
  tab5Root: any = AccountPage;

  constructor(public navCtrl: NavController) {
    if(!localStorage.getItem("token")) {
      navCtrl.setRoot(LoginPage);
    }
  }
}
