import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {HomePage} from '../home/home';
import {PredictorPage} from '../predictor/predictor';
import {StandingsPage} from '../standings/standings';
import {LoginPage} from '../login/login';
import {TournamentPage} from "../tournament/tournament";
import {AccountPage} from "../account/account";
import {Storage} from '@ionic/storage';
import {NativeStorage} from "@ionic-native/native-storage";

@Component({
  selector: 'page-tabs',
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
              private nativeStorage: NativeStorage,
              private plt: Platform) {
    this.plt.ready().then((readySource) => {
      this.checkLoggedIn();
    });
  }

  private async checkLoggedIn() {
    this.nativeStorage.getItem("token").then((token) => {
      if (!token) {
        this.setRootIfNotUsingOldSystem(token);
      }
    }, (error) => {
      this.setRootIfNotUsingOldSystem(error);
    });
  }

  private async setRootIfNotUsingOldSystem(error) {
    console.log(error);
    let isOldSystem = false;
    await this.storage.get('token').then((token) => {
      if (!token) {
        if(localStorage.getItem("token")) {
          const token = localStorage.getItem("token");
          this.nativeStorage.setItem("token", token);
          localStorage.removeItem("token");
          isOldSystem = true;
        }
      } else {
        this.nativeStorage.setItem("token", token);
        isOldSystem = true;
        this.storage.remove("token");
      }
    }, (error) => {
      if(localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        this.nativeStorage.setItem("token", token);
        localStorage.removeItem("token");
        isOldSystem = true;
      }
    });

    await this.storage.get('userId').then((userId) => {
      if (!userId) {
        if(localStorage.getItem("userId")) {
          const uId = localStorage.getItem("userId");
          this.nativeStorage.setItem("userId", uId);
          localStorage.removeItem("userId");
          isOldSystem = true;
        }
      } else {
        this.nativeStorage.setItem("userId", userId);
        isOldSystem = true;
        this.storage.remove("userId")
      }
    }, (error) => {
      if(localStorage.getItem("userId")) {
        const userId = localStorage.getItem("userId");
        this.nativeStorage.setItem("userId", userId);
        localStorage.removeItem("userId");
        isOldSystem = true;
      }
    });

    if (!isOldSystem) {
      this.navCtrl.setRoot(LoginPage);
    }
  }
}
