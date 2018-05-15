import {HttpHeaders} from "@angular/common/http";
import {AdMobFreeBannerConfig} from "@ionic-native/admob-free";

export default class Utils {
  static refreshLeagues = false;

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

  static getRankWithSuffix(rank) {
    return rank + this.getSuffix(rank)
  }

  private static getSuffix(rank) {
    if (rank >= 11 && rank <= 13) {
      return "th"
    }

    let i = rank % 10;

    switch(i) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th"
    }
  }

  static compareLeague(a, b) {
    if (a.pin < b.pin)
      return -1;
    if (a.pin > b.pin)
      return 1;
    return 0;
  }
}

// export const apiUrl = 'http://localhost:8080/';
export const apiUrl = 'https://wcpredictor.herokuapp.com/';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
}
