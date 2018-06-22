import {Component} from '@angular/core';
import {LoadingController, NavController, Platform, ToastController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {TabsPage} from '../tabs/tabs';
import {RegisterPage} from '../register/register';
import Utils from "../../utils/utils";
import {AdMobFree} from "@ionic-native/admob-free";
import {ResetPasswordPage} from "../resetpassword/resetpassword";
import {StorageUtils} from "../../utils/storage-utils";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: any;
  loginData = { email:'', password:'' };
  data: any;

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private storage: StorageUtils) {
    Utils.showBanner(this.plt, this.admob);
  }

  doLogin() {
      this.loading = Utils.showLoader('Logging in...', this.loadingCtrl);
      this.authService.login(this.loginData).then(async (result) => {
          this.loading.dismiss();

          this.data = result;
          const token = this.data.headers.get('X-Auth-Token');
          await this.storage.set('token', token);
          const userId = this.data.headers.get('userId');
          await this.storage.set('userId', userId);

          this.navCtrl.insert(0,TabsPage);
          this.navCtrl.popToRoot();
      }, (err) => {
          this.loading.dismiss();
          Utils.presentToast("Error logging in", this.toastCtrl);
      });
  }

  register() {
      this.navCtrl.push(RegisterPage);
  }

  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

}
