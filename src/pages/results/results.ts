import {LoadingController, NavParams, Platform, ToastController} from "ionic-angular";
import {AdMobFree} from "@ionic-native/admob-free";
import {Component} from "@angular/core";
import Utils from "../../utils/utils";
import {StorageUtils} from "../../utils/storage-utils";
import {MatchService} from "../../providers/match-service";
import MatchUtils from "../../utils/match-utils";

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {
  loading: any;
  data: any;
  group: any;
  matches: any;

  constructor(private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private params: NavParams,
              private storage: StorageUtils,
              private matchService: MatchService) {
    this.group = this.params.get('group');
    Utils.showBanner(this.plt, this.admob);
  }

  ionViewDidEnter() {
    this.loadResults();
  }

  private loadResults(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading Results...', this.loadingCtrl);
    }

    this.storage.get('token').then((token) => {
      this.matchService.retrieveMatches(token).then((result) => {
        Utils.dismissLoaders(this.loading, refresher);
        this.data = result;

        this.matches = this.data.body
          .filter(m => m.group === this.group)
          .sort(MatchUtils.compareDate);
        this.convertDateToLocalTime();

        let token = this.data.headers.get('X-Auth-Token');
        this.storage.set('token', token);
      }, (err) => {
        Utils.dismissLoaders(this.loading, refresher);
        Utils.presentToast("Error loading results, please try again", this.toastCtrl);
      });
    }, (error) => {
      Utils.dismissLoaders(this.loading, refresher);
      Utils.presentToast("Error loading results, please try again", this.toastCtrl);
    });
  }

  convertDateToLocalTime() {
    for(let i=0; i<this.matches.length; i++){
      const originalDate = this.matches[i].dateTime;
      if (this.plt.is('ios')) {
        this.matches[i].dateTime = new Date(originalDate);
      } else {
        this.matches[i].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
      }
    }
  }
}
