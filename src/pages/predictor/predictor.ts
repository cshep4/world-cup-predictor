import {Component} from '@angular/core';

import {LoadingController, Platform, PopoverController, ToastController} from 'ionic-angular';
import {MatchService} from "../../providers/match-service";
import MatchUtils from "../../utils/match-utils";
import Utils from "../../utils/utils";
import {GroupPopover} from "../../components/group-popover/group-popover";
import {Prediction} from "../../models/Prediction";
import {Match} from "../../models/Match";
import {AdMobFree} from "@ionic-native/admob-free";
import {WheelSelector} from "@ionic-native/wheel-selector";

@Component({
  selector: 'page-predictor',
  templateUrl: 'predictor.html'
})
export class PredictorPage {
  matches: any;
  loading: any;
  data: any;
  filterargs = {phase: "Group A"};
  phase = "Group A";
  predictions: [Prediction];

  constructor(private matchService: MatchService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private popoverCtrl: PopoverController,
              private admob: AdMobFree,
              private plt: Platform,
              private selector: WheelSelector) {
    Utils.showBanner(this.plt, this.admob);
    if (!this.matches) {
      this.loadMatchesWithPredictions();
    }
  }

  ionViewDidEnter() {
    this.selector.hideSelector();
  }

  selectGoals(match, teamName, isHome) {
    let title = "Goals for " + teamName;
    if (!this.hasDatePassed(match.dateTime)) {
      this.selector.show({
        title: title,
        items: [
          [
            {description: "0"},
            {description: "1"},
            {description: "2"},
            {description: "3"},
            {description: "4"},
            {description: "5"},
            {description: "6"},
            {description: "7"},
            {description: "8"},
            {description: "9"},
            {description: "10"},
            {description: "11"},
            {description: "12"},
            {description: "13"},
            {description: "14"},
            {description: "15"}
          ]
        ],
      }).then(
        result => {
          if (isHome) {
            match.hGoals = result[0].description;
          } else {
            match.aGoals = result[0].description;
          }
        },
        err => console.log('Error: ', err)
      );
    }
  }

  loadMatchesWithPredictions(refresher?) {
      if (!refresher) {
          this.loading = Utils.showLoader('Loading Predictions...', this.loadingCtrl);
      }
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      this.matchService.retrievePredictedMatches(token, userId).then((result) => {
          if (!refresher) {
              this.loading.dismiss();
          } else {
              refresher.complete();
          }
          this.data = result;
          this.matches = this.data.body.map(m => <Match>({
              id : m.id,
              predictionId : m.predictionId,
              played : m.played,
              group : m.group,
              dateTime : m.dateTime,
              matchday : m.matchday,
              hTeam : m.hteam,
              aTeam : m.ateam,
              hGoals : m.hgoals,
              aGoals : m.agoals
          }));
          this.matches.sort(MatchUtils.compareDate);
          this.convertDateToLocalTime();
          let token = this.data.headers.get('X-Auth-Token');
          localStorage.setItem('token', token);
      }, (err) => {
          if (!refresher) {
            this.loading.dismiss();
          } else {
            refresher.complete();
          }
          Utils.presentToast("Error loading predictions", this.toastCtrl);
      });
  }

  convertDateToLocalTime() {
      for(let i=0; i<this.matches.length; i++){
          const originalDate = this.matches[i].dateTime;
          this.matches[i].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
      }
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(GroupPopover);
    popover.present({
        ev: myEvent
    });

    popover.onDidDismiss(data => {
        if (data) {
            this.filterargs = {phase: data};
            this.phase = data;
        }
    })
  }

  save() {
      this.loading = Utils.showLoader('Saving Predictions...', this.loadingCtrl);
      const userId = localStorage.getItem("userId");

      this.predictions = this.matches
        .filter(m => m.hGoals !== undefined && m.aGoals !== undefined)
        .filter(m => m.hGoals !== null && m.aGoals !== null)
        .filter(m => m.hGoals !== '' && m.aGoals !== '')
        .filter(m => !isNaN(m.hGoals) && !isNaN(m.aGoals))
        .map(m => <Prediction>({
            id : m.predictionId,
            hGoals: m.hGoals,
            aGoals: m.aGoals,
            userId: parseInt(userId),
            matchId: m.id
        }));

      const token = localStorage.getItem('token');

      this.matchService.savePredictions(token, this.predictions).then((result) => {
          this.loading.dismiss();
          Utils.presentToast("Predictions stored successfully!", this.toastCtrl);
          MatchUtils.refreshData = true;

          this.data = result;
          const token = this.data.headers.get('X-Auth-Token');
          localStorage.setItem('token', token);
      }, (err) => {
          this.loading.dismiss();
          Utils.presentToast("Error saving predictions, please try again", this.toastCtrl);
      });
  }

  hasDatePassed(dateTime) {
      return Date.parse(dateTime) < Date.now();
  }
}
