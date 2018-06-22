import {Component} from '@angular/core';
import {LoadingController, NavController, Platform, ToastController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {TabsPage} from "../tabs/tabs";
import Utils from "../../utils/utils";
import {AdMobFree} from "@ionic-native/admob-free";
import UserUtils from "../../utils/user-utils";
import {StorageUtils} from "../../utils/storage-utils";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    loading: any;
    regData = { firstName: '', surname: '', email:'', password:'', confirmPassword: '', predictedWinner: '' };
    data: any;
    isPasswordBetween6And20Characters = UserUtils.isPasswordBetween6And20Characters;
    doesPasswordContainUppercaseLetters = UserUtils.doesPasswordContainUppercaseLetters;
    doesPasswordContainLowercaseLetters = UserUtils.doesPasswordContainLowercaseLetters;
    doesPasswordContainNumbers = UserUtils.doesPasswordContainNumbers;
    doPasswordsMatch = UserUtils.doPasswordsMatch;

    constructor(private navCtrl: NavController,
                private authService: AuthService,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private admob: AdMobFree,
                private plt: Platform,
                private storage: StorageUtils) {
      Utils.showBanner(this.plt, this.admob);
    }

    doSignup() {
        this.loading = Utils.showLoader('Registering...', this.loadingCtrl);

        this.authService.register(this.regData).then((result) => {
            const loginData = {
                email: this.regData.email,
                password: this.regData.password
            };

            this.authService.login(loginData).then(async (result) => {
                this.loading.dismiss();

                this.data = result;
                const token = this.data.headers.get('X-Auth-Token');
                await this.storage.set('token', token);
                const userId = this.data.headers.get('userId');
                await this.storage.set('userId', userId);

                this.navCtrl.setRoot(TabsPage);
                this.navCtrl.popToRoot();

            }, (err) => {
                this.loading.dismiss();
                Utils.presentToast("Error logging in", this.toastCtrl);
            });

        }, (err) => {
            this.loading.dismiss();
            Utils.presentToast(err, this.toastCtrl);
        });
    }
}
