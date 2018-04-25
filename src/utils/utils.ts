import {HttpHeaders} from "@angular/common/http";
import {AdMobFreeBannerConfig} from "@ionic-native/admob-free";

export default class Utils {
  static showLoader(message, loadingCtrl) {
    let loading = loadingCtrl.create({
      content: message
    });

    loading.present();

    return loading;
  }

  static presentToast(msg, toastCtrl) {
    let toast = toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  static showBanner(plt, admob) {
    let id;
    if (plt.is('ios')) {
      id = 'ca-app-pub-8783352058311313/2155818570';
    } else {
      id = 'ca-app-pub-8783352058311313/3760544283';
    }

    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: id
    };

    admob.banner.config(bannerConfig);

    admob.banner.prepare().then(() => {
      // success
    }).catch(e => console.log(e));

  }
}

export const apiUrl = 'http://localhost:8080/';
// export const apiUrl = 'https://wcpredictor.herokuapp.com/';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
}
