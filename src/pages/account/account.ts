import {Component} from '@angular/core';

import {App, LoadingController, NavController, Platform, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthService} from "../../providers/auth-service";
import Utils from "../../utils/utils";
import {AdMobFree} from "@ionic-native/admob-free";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  loading: any;
  isLoggedIn: boolean = false;

  constructor(public app: App,
              public navCtrl: NavController,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public admob: AdMobFree,
              public plt: Platform) {
    if(localStorage.getItem("token")) {
      this.isLoggedIn = true;
    }
  }

  ionViewDidEnter() {
    Utils.showBanner(this.plt, this.admob);
  }

  logout() {
    this.loading = Utils.showLoader('Logging out...', this.loadingCtrl);
    this.authService.logout().then((result) => {
      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();
    });
    let nav = this.app.getRootNav();
    nav.setRoot(LoginPage);
  }
}
