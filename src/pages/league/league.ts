import {AlertController, LoadingController, NavController, NavParams, Platform, ToastController} from "ionic-angular";
import {AdMobFree} from "@ionic-native/admob-free";
import {Component} from "@angular/core";
import Utils from "../../utils/utils";
import {StandingsService} from "../../providers/standings-service";
import {LeagueTablePlayer} from "../../models/LeagueTablePlayer";
import {Clipboard} from "@ionic-native/clipboard";

@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class LeaguePage {
  loading: any;
  data: any;
  leagueOverview: any;
  leagueTable: any;
  displayedTable: any;
  currentIndex = 0;
  numberToBeDisplayed = 60;
  userId: number;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private params: NavParams,
              private standingsService: StandingsService,
              private alertCtrl: AlertController,
              private clipboard: Clipboard) {
    this.leagueOverview = this.params.get('league');
    this.userId = Number(localStorage.getItem('userId'));
    Utils.showBanner(this.plt, this.admob);
    this.loadLeagueTable();
  }

  private copyPin() {
    this.clipboard.copy(this.leagueOverview.pin.toString()).then(result => {
      Utils.presentToast("Pin copied!", this.toastCtrl);
    }).catch( err => {
      Utils.presentToast("Error copying pin", this.toastCtrl);
    });
  }

  private loadLeagueTable(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading League Table...', this.loadingCtrl);
    }
    const pin = this.leagueOverview.pin;
    const token = localStorage.getItem('token');

    this.standingsService.getLeagueTable(token, pin).then((result) => {
      if (!refresher) {
        this.loading.dismiss();
      } else {
        refresher.complete();
      }
      this.data = result;

      this.leagueTable = this.data.body.map(l => <LeagueTablePlayer>({
        id: l.id,
        firstName: l.firstName,
        surname: l.surname,
        predictedWinner: l.predictedWinner,
        score: l.score
      }));

      this.displayedTable = this.leagueTable.slice(0, this.numberToBeDisplayed);
      this.currentIndex = this.displayedTable.length;


      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);
    }, (err) => {
      if (!refresher) {
        this.loading.dismiss();
      } else {
        refresher.complete();
      }
      Utils.presentToast("Error loading league table", this.toastCtrl);
    });
  }

  private doInfinite(infiniteScroll) {
      setTimeout(() => {
        this.displayedTable = this.displayedTable.concat(this.leagueTable.slice(this.currentIndex, this.currentIndex+this.numberToBeDisplayed));
        this.currentIndex = this.displayedTable.length;

        infiniteScroll.complete();

        if (this.displayedTable.length === this.leagueTable.length) {
          infiniteScroll.enable(false);
        }
      }, 500);
  }

  private showLeaveLeaguePrompt() {
    const name = this.leagueOverview.leagueName;
    const prompt = this.alertCtrl.create({
      title: 'Leave ' + name + '?',
      message: "Are you sure you want to leave this league?",
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            this.leaveLeague();
          }
        }
      ]
    });

    prompt.present();
  }

  private leaveLeague() {
    this.loading = Utils.showLoader('Leaving League...', this.loadingCtrl);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const pin = this.leagueOverview.pin;

    this.standingsService.leaveLeague(token, userId, pin).then((result) => {
      this.loading.dismiss();
      this.data = result;

      Utils.presentToast("League left!", this.toastCtrl);
      this.navCtrl.popToRoot();
      Utils.refreshLeagues = true;

      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);
    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast("Error leaving league", this.toastCtrl);
    });
  }
}
