import {Component} from '@angular/core';

import {LoadingController, NavController, PopoverController, ToastController} from 'ionic-angular';
import {MatchService} from "../../providers/match-service";
import MatchUtils from "../../utils/match-utils";
import Utils from "../../utils/utils";
import {GroupPopoverPage} from "../group-popover/group-popover";

@Component({
  selector: 'page-predictor',
  templateUrl: 'predictor.html'
})
export class PredictorPage {
  matches: any;
  loading: any;
  data: any;
  filterargs = {group: "A"};

  constructor(public navCtrl: NavController, public matchService: MatchService, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public popoverCtrl: PopoverController) {}

  ionViewDidEnter() {
    this.loadMatchesWithPredictions();
  }

  loadMatchesWithPredictions() {
    this.loading = Utils.showLoader('Loading Predictions...', this.loadingCtrl);
    const token = localStorage.getItem('token');
    this.matchService.retrievePredictedMatches(token, 1).then((result) => {
      this.loading.dismiss();
      this.data = result;
      this.matches = this.data.body;
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
        this.filterargs = {group: data};
      }
    })
  }
}
