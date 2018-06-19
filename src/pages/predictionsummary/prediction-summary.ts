import {Component} from '@angular/core';

import {LoadingController, NavParams, Platform, ToastController} from 'ionic-angular';
import Utils from "../../utils/utils";
import MatchUtils from "../../utils/match-utils";
import {AdMobFree} from "@ionic-native/admob-free";
import {StorageUtils} from "../../utils/storage-utils";
import {MatchService} from "../../providers/match-service";

@Component({
  selector: 'page-predictions-summary',
  templateUrl: 'prediction-summary.html'
})
export class PredictionSummaryPage {
  predictions: any[];
  loading: any;
  data: any;
  userId: Number;
  firstName: String;
  score: Number;

  constructor(private matchService: MatchService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private storage: StorageUtils,
              private params: NavParams) {

    this.firstName = this.params.get('firstName');
    this.userId = this.params.get('userId');
    this.score = this.params.get('score');

    let predictions = [{
      name: "Group Stage",
      standings: null
    }, {
      name: "Knockout Stage",
      standings: null
    }];

    this.predictions = JSON.parse(JSON.stringify(predictions));

    Utils.showBanner(this.plt, this.admob);
  }

  ionViewDidEnter() {
    this.getPredictionSummary();
  }

  getPredictionSummary(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading Prediction Summary...', this.loadingCtrl);
    }
    this.storage.get('token').then((token) => {
      this.matchService.retrievePredictionSummary(token, this.userId).then((result) => {
        Utils.dismissLoaders(this.loading, refresher);
        this.data = result;

        this.predictions[0].standings = this.data.body.group;
        this.predictions[1].standings = this.data.body.knockout;

        this.convertDateToLocalTime();
        this.predictions[0].standings.forEach(s => s.matches.sort(MatchUtils.compareDate));
        this.predictions[1].standings.forEach(s => s.matches.sort(MatchUtils.compareDate));

        console.log(this.predictions);

        let token = this.data.headers.get('X-Auth-Token');
        this.storage.set('token', token);
      }, (err) => {
        Utils.dismissLoaders(this.loading, refresher);
        Utils.presentToast("Error loading predictions, please try again", this.toastCtrl);
      });
    }, (err) => {
      Utils.dismissLoaders(this.loading, refresher);
      Utils.presentToast("Error loading predictions, please try again", this.toastCtrl);
    });
  }

  private convertDateToLocalTime() {
    for(let i=0; i<this.predictions[0].standings.length; i++) {
      for (let j = 0; j < this.predictions[0].standings[i].matches.length; j++) {
        const originalDate = this.predictions[0].standings[i].matches[j].dateTime;
        if (this.plt.is('ios')) {
          this.predictions[0].standings[i].matches[j].dateTime = new Date(originalDate);
        } else {
          this.predictions[0].standings[i].matches[j].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
        }
      }
    }

    for(let i=0; i<this.predictions[1].standings.length; i++) {
      for (let i = 0; i < this.predictions[1].standings[i].matches.length; i++) {
        const originalDate = this.predictions[1].standings[i].matches[i].dateTime;
        if (this.plt.is('ios')) {
          this.predictions[1].standings[i].matches[i].dateTime = new Date(originalDate);
        } else {
          this.predictions[1].standings[i].matches[i].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
        }
      }
    }
  }
}
