import {Component} from '@angular/core';

import {LoadingController, NavController, PopoverController, ToastController} from 'ionic-angular';
import {MatchService} from "../../providers/match-service";
import MatchUtils from "../../utils/match-utils";
import Utils from "../../utils/utils";
import {GroupPopoverPage} from "../group-popover/group-popover";
import {Prediction} from "../../models/Prediction";
import {Match} from "../../models/Match";

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

  constructor(public navCtrl: NavController,
              public matchService: MatchService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public popoverCtrl: PopoverController) {}

  ionViewDidEnter() {
    if (!this.matches) {
      this.loadMatchesWithPredictions();
    }
  }

  loadMatchesWithPredictions() {
      this.loading = Utils.showLoader('Loading Predictions...', this.loadingCtrl);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      this.matchService.retrievePredictedMatches(token, userId).then((result) => {
          this.loading.dismiss();
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
          this.loading.dismiss();
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
    let popover = this.popoverCtrl.create(GroupPopoverPage);
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
      const userId = localStorage.getItem("userId");

      this.predictions = this.matches
        .filter(m => m.hGoals && m.aGoals)
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
