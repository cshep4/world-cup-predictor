import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';

@Component({
    selector: 'page-reset-password',
    templateUrl: 'resetpassword.html'
})
export class ResetPasswordPage {
    loading: any;
    resetData = { email:'' };

    constructor(private navCtrl: NavController,
                private authService: AuthService,
                private alertCtrl: AlertController) {
    }

    resetPassword() {
        this.authService.resetPassword(this.resetData.email).then((result) => {}, (err) => {});
        this.doCheckEmailAlert();
    }

    private doCheckEmailAlert() {
      let alert = this.alertCtrl.create({
        title: 'Check your email',
        subTitle: '<p>An email has been sent with instructions on how to change your password.</p>' +
        '<p>If the email has not appeared in your inbox after a few minutes please check your Junk folder.</p>' +
        '<p>If you still cannot see the email, please try again.</p>',
        buttons: ['Ok']
      });

      alert.present();
    }
}
