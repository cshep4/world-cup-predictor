import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {AdMobFree} from "@ionic-native/admob-free";
import Utils from "../../utils/utils";
import MatchUtils from "../../utils/match-utils";
import {ScoreService} from "../../providers/score-service";
import {MatchService} from "../../providers/match-service";
import {StorageUtils} from "../../utils/storage-utils";
import {LocalNotifications} from '@ionic-native/local-notifications';
import {UserLeagueOverview} from "../../models/UserLeagueOverview";
import {OverallLeagueOverview} from "../../models/OverallLeagueOverview";
import {StandingsService} from "../../providers/standings-service";
import {DataProvider} from "../../providers/data-provider";

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
  leaguesRetrievable = true;
  rulesDropdown = {open: false};
  scoringDropdown = {open: false};
  upcomingMatches: any;
  leagues: any;

  constructor(private navCtrl: NavController,
              private admob: AdMobFree,
              private plt: Platform,
              private scoreService: ScoreService,
              private storage: StorageUtils,
              private matchService: MatchService,
              private localNotifications: LocalNotifications,
              private standingsService: StandingsService,
              private dataProvider: DataProvider) {
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

    this.plt.ready().then((readySource) => {
      this.localNotifications.on('click').subscribe(notification => {
        let data = notification.data;
        this.goToPredictorPage(data.match);
      });
    });
  }

  goToStandingsPage() {
    this.navCtrl.parent.select(3);
  }

  goToPredictorPage(match?) {
    if (match) {
      this.dataProvider.predictionGroup = this.getCorrectPhase(match);
    }
    this.navCtrl.parent.select(1);
  }

  private getCorrectPhase(match) {
    if (match.matchday == 4) {
      return "Last 16"
    } else if (match.matchday == 5) {
      return "Quarter Final";
    } else if (match.matchday == 6) {
      return "Semi Final";
    } else if (match.matchday == 7) {
      return "3rd Place Play-Off";
    } else if (match.matchday == 8) {
      return "Final"
    } else {
      return "Group " + match.group;
    }
  }

  private loadData(refresher?) {
    this.matchesRetrievable = true;
    this.leaguesRetrievable = true;
    this.loadScoreAndRank(refresher);
    this.loadUpcomingMatches(refresher);
    this.loadUserLeagues(refresher);
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

        this.createNotifications();

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

  private async createNotifications() {
    await this.storage.keys().then( async (keys) => {
      if (!keys.includes("notify")) {
        console.log("no");
        await this.storage.set("notify", "true");
      }
    });

    this.storage.get("notify").then((isNotified) => {
      if (isNotified !== "false") {
        this.scheduleNotifications();
      }
    }, (err) => {
      this.storage.set("notify", "true");
    });
  }

  private scheduleNotifications() {
    for(let i=0; i<this.upcomingMatches.length; i++) {
      for (let j = 0; j < this.upcomingMatches[i].matches.length; j++) {
        if (this.upcomingMatches[i].matches[j].hteam && this.upcomingMatches[i].matches[j].ateam) {
          let d = new Date(this.upcomingMatches[i].matches[j].dateTime);
          d.setHours(d.getHours() - 1);

          const hTeam = this.upcomingMatches[i].matches[j].hteam;
          const aTeam = this.upcomingMatches[i].matches[j].ateam;

          const id = this.upcomingMatches[i].matches[j].id;
          const title = hTeam + " vs " + aTeam + " - One hour to go!";
          const text = "Make sure you've got your prediction in!";
          const data = this.upcomingMatches[i].matches[j];
          this.localNotifications.schedule({
            id: id,
            title: title,
            text: text,
            trigger: {at: d},
            data: { match : data }
          });
          //new Date(new Date().getTime() + 5 * 1000)
        }
      }
    }
  }

  private loadUserLeagues(refresher?) {
    this.storage.get('token').then((token) => {
      this.storage.get('userId').then((userId) => {
        this.standingsService.retrieveUserLeagues(token, userId).then((result) => {
          if (refresher) {
            refresher.complete();
          }
          this.data = result;

          this.leagues = this.data.body.userLeagues.map(l => <UserLeagueOverview>({
            leagueName: l.leagueName,
            pin: l.pin,
            rank: Utils.getRankWithSuffix(l.rank)
          }));

          let overallLeague = <OverallLeagueOverview> ({
            leagueName: "Overall",
            rank: Utils.getRankWithSuffix(this.data.body.overallLeagueOverview.rank),
            userCount: this.data.body.overallLeagueOverview.userCount,
          });

          this.leagues.unshift(overallLeague);

          this.leaguesRetrievable = true;

          let token = this.data.headers.get('X-Auth-Token');
          this.storage.set('token', token);
        }, (err) => {
          if (refresher) {
            refresher.complete();
          }

          this.leaguesRetrievable = false;
        });
      }, (error) => {
        this.leaguesRetrievable = false;
      });
    }, (error) => {
      this.leaguesRetrievable = false;
    });
  }

  private openLeague(league) {
    this.dataProvider.league = league;
    this.navCtrl.parent.select(3);
  }
}
