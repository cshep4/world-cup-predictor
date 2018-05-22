import {Component} from '@angular/core';

import {App, LoadingController, Platform, ToastController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AuthService} from "../../providers/auth-service";
import Utils from "../../utils/utils";
import {AdMobFree} from "@ionic-native/admob-free";
import UserUtils from "../../utils/user-utils";
import {AccountService} from "../../providers/account-service";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  loading: any;
  data: any;
  accountData = { id: 0, firstName: '', surname: '', email:''};
  passwordData = { id: 0, oldPassword:'', newPassword:'', confirmPassword: '' };
  isLoggedIn: boolean = false;
  isPasswordBetween6And20Characters = UserUtils.isPasswordBetween6And20Characters;
  doesPasswordContainUppercaseLetters = UserUtils.doesPasswordContainUppercaseLetters;
  doesPasswordContainLowercaseLetters = UserUtils.doesPasswordContainLowercaseLetters;
  doesPasswordContainNumbers = UserUtils.doesPasswordContainNumbers;
  doPasswordsMatch = UserUtils.doPasswordsMatch;

  constructor(private app: App,
              private authService: AuthService,
              private accountService: AccountService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform) {
    if(localStorage.getItem("token")) {
      this.isLoggedIn = true;
    }
    Utils.showBanner(this.plt, this.admob);
    this.loadAccountDetails();
  }

  loadAccountDetails() {
    this.loading = Utils.showLoader('Retrieving account details...', this.loadingCtrl);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    this.accountService.retrieveAccount(userId, token).then((result) => {
      this.loading.dismiss();
      this.data = result;

      this.accountData.email = this.data.body.email;
      this.accountData.firstName = this.data.body.firstName;
      this.accountData.surname = this.data.body.surname;

      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);

    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast(err, this.toastCtrl);
    });
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

  updateUserDetails() {
    this.loading = Utils.showLoader('Updating details...', this.loadingCtrl);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.accountData.id = parseInt(userId);

    this.accountService.updateUserDetails(this.accountData, token).then((result) => {
      this.loading.dismiss();
      this.data = result;

      Utils.presentToast("Details updated!", this.toastCtrl);

      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);

    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast(err, this.toastCtrl);
    });
  }

  updatePassword() {
    this.loading = Utils.showLoader('Updating password...', this.loadingCtrl);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.passwordData.id = parseInt(userId);

    this.accountService.updateUserPassword(this.passwordData, token).then((result) => {
      this.loading.dismiss();
      this.data = result;

      this.passwordData = { id: 0, oldPassword:'', newPassword:'', confirmPassword: '' };

      Utils.presentToast("Password updated!", this.toastCtrl);

      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);

    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast(err, this.toastCtrl);
    });
  }
}
