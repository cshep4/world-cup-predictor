import {Component} from '@angular/core';

import {App, LoadingController, NavController, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthService} from "../../providers/auth-service";
import Utils from "../../utils/utils";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  loading: any;
  isLoggedIn: boolean = false;

  constructor(public app: App, public navCtrl: NavController, public authService: AuthService, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    if(localStorage.getItem("token")) {
      this.isLoggedIn = true;
    }
  }

  logout() {
    this.loading = Utils.showLoader('Logging out...', this.loadingCtrl);
    this.authService.logout().then((result) => {
      this.loading.dismiss();
      let nav = this.app.getRootNav();
      nav.setRoot(LoginPage);
    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast(err, this.toastCtrl);
    });
  }
}
