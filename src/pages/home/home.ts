import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AdMobFree} from "@ionic-native/admob-free";
import Utils from "../../utils/utils";
import MatchUtils from "../../utils/match-utils";
import {ScoreService} from "../../providers/score-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  score: string;
  rank: string;
  scoreRetrievable = true;

  constructor(public navCtrl: NavController,
              public admob: AdMobFree,
              public plt: Platform,
              private scoreService: ScoreService) {}

  ionViewDidEnter() {
      Utils.showBanner(this.plt, this.admob);

      if (MatchUtils.refreshData) {
        this.score = null;
        this.rank = null;
      }

      if (!this.score || !this.rank) {
        this.loadScoreAndRank();
      }
  }

  goToStandingsPage() {
    this.navCtrl.parent.select(3);
  }

  private loadScoreAndRank() {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      this.scoreService.retrieveScoreAndRank(token, userId).then((result) => {
          this.data = result;

          this.score = "Pts: " + this.data.body.score;
          this.rank = "Rank: " + this.data.body.rank;

          let token = this.data.headers.get('X-Auth-Token');
          localStorage.setItem('token', token);

      }, (err) => {
          this.scoreRetrievable = false;
      });
  }
}
