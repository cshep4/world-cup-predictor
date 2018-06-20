import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AdMobFree} from "@ionic-native/admob-free";
import Utils from "../../utils/utils";
import MatchUtils from "../../utils/match-utils";
import {ScoreService} from "../../providers/score-service";
import {MatchService} from "../../providers/match-service";
import {StorageUtils} from "../../utils/storage-utils";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  displayType;
  data: any;
  score: string;
  rank: string;
  scoreRetrievable = true;
  matchesRetrievable = true;
  rulesDropdown = {open: false};
  scoringDropdown = {open: false};
  upcomingMatches: any;

  constructor(private navCtrl: NavController,
              private admob: AdMobFree,
              private plt: Platform,
              private scoreService: ScoreService,
              private storage: StorageUtils,
              private matchService: MatchService) {
    Utils.showBanner(this.plt, this.admob);
    this.displayType = "scoring";

    if (MatchUtils.refreshData) {
      this.score = null;
      this.rank = null;
    }

    if (!this.score || !this.rank) {
      this.plt.ready().then((readySource) => {
        this.loadData();
      });
    }
  }

  goToStandingsPage() {
    this.navCtrl.parent.select(3);
  }

  goToPredictorPage() {
    this.navCtrl.parent.select(1);
  }

  private loadData(refresher?) {
    this.matchesRetrievable = true;
    this.loadScoreAndRank(refresher);
    this.loadUpcomingMatches(refresher);
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

  toggleSection(section) {
    section.open = !section.open;
  }

  private loadUpcomingMatches(refresher?) {
    this.storage.get('token').then((token) => {
      this.matchService.retrieveUpcomingMatches(token).then((result) => {
        if (refresher) {
          refresher.complete();
        }

        this.data = result;

        let matches = this.data.body;

        this.upcomingMatches = [];

        for (let key of Object.keys(matches)) {
          let value = matches[key];

          let dailyMatches = {
            date: key,
            matches: value
          };

          this.upcomingMatches.push(dailyMatches);
        }

        this.convertDateToLocalTime();

        this.matchesRetrievable = true;

        let token = this.data.headers.get('X-Auth-Token');
        this.storage.set('token', token);
      }, (err) => {
        if (refresher) {
          refresher.complete();
        }

        this.matchesRetrievable = false;
      });
    }, (err) => {
      if (refresher) {
        refresher.complete();
      }
      this.matchesRetrievable = false;
    });
  }

  convertDateToLocalTime() {
    for(let i=0; i<this.upcomingMatches.length; i++){
      for(let j=0; j<this.upcomingMatches[i].matches.length; j++) {
        const originalDate = this.upcomingMatches[i].matches[j].dateTime;
        if (this.plt.is('ios')) {
          this.upcomingMatches[i].matches[j].dateTime = new Date(originalDate);
        } else {
          this.upcomingMatches[i].matches[j].dateTime = MatchUtils.convertUTCDateToLocalDate(new Date(originalDate));
        }
      }
    }
  }
}
