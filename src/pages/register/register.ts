import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {TabsPage} from "../tabs/tabs";
import Utils from "../../utils/utils";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    loading: any;
    regData = { firstName: '', surname: '', email:'', password:'', confirmPassword: '',  };
    data: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public authService: AuthService,
                public loadingCtrl: LoadingController,
                private toastCtrl: ToastController) {}

    doSignup() {
        this.loading = Utils.showLoader('Registering...', this.loadingCtrl);

        this.authService.register(this.regData).then((result) => {
            const loginData = {
                email: this.regData.email,
                password: this.regData.password
            };

            this.authService.login(loginData).then((result) => {
                this.loading.dismiss();

                this.data = result;
                localStorage.setItem('token', this.data.headers.get('X-Auth-Token'));

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
