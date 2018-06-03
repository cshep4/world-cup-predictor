import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AdMobFree} from "@ionic-native/admob-free";
import Utils from "../../utils/utils";
import MatchUtils from "../../utils/match-utils";
import {ScoreService} from "../../providers/score-service";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  score: string;
  rank: string;
  scoreRetrievable = true;

  constructor(private navCtrl: NavController,
              private admob: AdMobFree,
              private plt: Platform,
              private scoreService: ScoreService,
              private storage: Storage) {
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

  private loadScoreAndRank(refresher?) {
      this.storage.get('token').then((token) => {
          this.storage.get('userId').then((userId) => {
              this.scoreService.retrieveScoreAndRank(token, userId).then((result) => {
                  if (refresher) {
                    refresher.complete();
                  }

                  this.data = result;

                  this.score = "Pts: " + this.data.body.score;
                  this.rank = "Rank: " + this.data.body.rank;
                  this.scoreRetrievable = true;

                  let token = this.data.headers.get('X-Auth-Token');
                  this.storage.set('token', token);
                }, (err) => {
                  if (refresher) {
                    refresher.complete();
                  }
                  this.scoreRetrievable = false;
              });
          }, (err) => {
            if (refresher) {
              refresher.complete();
            }
            this.scoreRetrievable = false;
          });
      }, (err) => {
        if (refresher) {
          refresher.complete();
        }
        this.scoreRetrievable = false;
      });
  }
}
