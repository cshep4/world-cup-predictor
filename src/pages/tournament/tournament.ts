import {Component} from '@angular/core';

import {LoadingController, Platform, ToastController} from 'ionic-angular';
import Utils from "../../utils/utils";
import {TournamentService} from "../../providers/tournament-service";
import MatchUtils from "../../utils/match-utils";
import {AdMobFree} from "@ionic-native/admob-free";
import {StorageUtils} from "../../utils/storage-utils";

@Component({
  selector: 'page-tournament',
  templateUrl: 'tournament.html'
})
export class TournamentPage {
  standingsType;
  currentTables: any[];
  predictedTables: any[];
  loading: any;
  data: any;
  overlayHidden: boolean = true;

  constructor(private tournamentService: TournamentService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private storage: StorageUtils) {
    this.standingsType = "current";

    let standings = [{
      name: "Group Stage",
      standings: null
    }, {
      name: "Knockout Stage",
      standings: null
    }];

    this.predictedTables = JSON.parse(JSON.stringify(standings));
    this.currentTables = JSON.parse(JSON.stringify(standings));

    Utils.showBanner(this.plt, this.admob);
  }

  ionViewDidEnter() {
    this.getStandings();
  }

  toggleOverlay() {
    this.overlayHidden = !this.overlayHidden;
  }

  getStandings(refresher?) {
    if (this.standingsType == "current") {
      if (!this.currentTables[0].standings || refresher) {
        this.getCurrentLeagueTable(refresher);
      }
    } else {
      if (!this.predictedTables[0].standings || MatchUtils.refreshData  || refresher) {
        this.getPredictedLeagueTable(refresher);
      }
    }
  }

  getCurrentLeagueTable(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading Current Standings...', this.loadingCtrl);
    }
    this.storage.get('token').then((token) => {
      this.tournamentService.retrieveCurrentLeagueTable(token).then((result) => {
        Utils.dismissLoaders(this.loading, refresher);
        this.data = result;

        this.currentTables[0].standings = this.data.body.standings;
        this.currentTables[1].standings = this.data.body.knockoutStandings;
        this.convertDateToLocalTime();
        this.currentTables[1].standings.matches.sort(MatchUtils.compareDate);

        let token = this.data.headers.get('X-Auth-Token');
        this.storage.set('token', token);
      }, (err) => {
        Utils.dismissLoaders(this.loading, refresher);
        Utils.presentToast("Error loading standings", this.toastCtrl);
      });
    }, (err) => {
      Utils.dismissLoaders(this.loading, refresher);
      Utils.presentToast("Error loading standings", this.toastCtrl);
    });
  }

  getPredictedLeagueTable(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading Predicted Standings...', this.loadingCtrl);
    }
    this.storage.get('token').then((token) => {
      this.storage.get('userId').then((userId) => {
        this.tournamentService.retrievePredictedLeagueTable(token, userId).then((result) => {
          Utils.dismissLoaders(this.loading, refresher);
          this.data = result;

          this.predictedTables[0].standings = this.data.body.standings;
          this.predictedTables[1].standings = this.data.body.knockoutStandings;
          this.convertPredictionsDateToLocalTime();
          this.predictedTables[1].standings.forEach(s => s.matches.sort(MatchUtils.compareDate));
          MatchUtils.refreshData = false;

          let token = this.data.headers.get('X-Auth-Token');
          this.storage.set('token', token);
        }, (err) => {
          Utils.dismissLoaders(this.loading, refresher);
          Utils.presentToast("Error loading standings", this.toastCtrl);
        });
      }, (err) => {
        Utils.dismissLoaders(this.loading, refresher);
        Utils.presentToast("Error loading standings", this.toastCtrl);
      });
    }, (err) => {
      Utils.dismissLoaders(this.loading, refresher);
      Utils.presentToast("Error loading standings", this.toastCtrl);
    });
  }

  private convertPredictionsDateToLocalTime() {
    for(let i=0; i<this.predictedTables[1].standings.length; i++) {
      for (let i = 0; i < this.predictedTables[1].standings[i].matches.length; i++) {
        const originalDate = this.predictedTables[1].standings[i].matches[i].dateTime;
        if (this.plt.is('ios')) {
          this.predictedTables[1].standings[i].matches[i].dateTime = new Date(originalDate);
        } else {
          this.predictedTables[1].standings[i].matches[i].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
        }
      }
    }
  }

  private convertDateToLocalTime() {
    for(let i=0; i<this.currentTables[1].standings.length; i++) {
      for (let j = 0; j < this.currentTables[1].standings[i].matches.length; j++) {
        const originalDate = this.currentTables[1].standings[i].matches[j].dateTime;
        if (this.plt.is('ios')) {
          this.currentTables[1].standings[i].matches[j].dateTime = new Date(originalDate);
        } else {
          this.currentTables[1].standings[i].matches[j].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
        }
      }
    }
  }
}
