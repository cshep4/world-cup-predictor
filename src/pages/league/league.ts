import {
  AlertController,
  Content,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import {AdMobFree} from "@ionic-native/admob-free";
import {Component, ViewChild} from "@angular/core";
import Utils from "../../utils/utils";
import {StandingsService} from "../../providers/standings-service";
import {LeagueTablePlayer} from "../../models/LeagueTablePlayer";
import {Clipboard} from "@ionic-native/clipboard";
import {StorageUtils} from "../../utils/storage-utils";
import {PredictionSummaryPage} from "../predictionsummary/prediction-summary";

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
  scrolling: boolean = false;
  @ViewChild(Content) content: Content;

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private admob: AdMobFree,
              private plt: Platform,
              private params: NavParams,
              private standingsService: StandingsService,
              private alertCtrl: AlertController,
              private clipboard: Clipboard,
              private storage: StorageUtils) {
    this.leagueOverview = this.params.get('league');
    this.storage.get('userId').then((userId) => {
      this.userId = Number(userId);
    });
    Utils.showBanner(this.plt, this.admob);
    this.loadLeagueTable();
  }

  private loadLeagueTable(refresher?) {
    if (!refresher) {
      this.loading = Utils.showLoader('Loading League Table...', this.loadingCtrl);
    }
    const pin = this.leagueOverview.pin;

    this.storage.get('token').then((token) => {
      this.standingsService.getLeagueTable(token, pin).then((result) => {
        Utils.dismissLoaders(this.loading, refresher);
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
        this.storage.set('token', token);
      }, (err) => {
        Utils.dismissLoaders(this.loading, refresher);
        Utils.presentToast("Error loading league table, please try again", this.toastCtrl);
      });
    }, (error) => {
      Utils.dismissLoaders(this.loading, refresher);
      Utils.presentToast("Error loading league table, please try again", this.toastCtrl);
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

  private copyPin() {
    this.clipboard.copy(this.leagueOverview.pin.toString()).then(result => {
      Utils.presentToast("Pin copied!", this.toastCtrl);
    }).catch( err => {
      Utils.presentToast("Error copying pin", this.toastCtrl);
    });
  }

  private showRemoveUserPrompt() {
    this.storage.get('userId').then(userId => {
      let alert = this.alertCtrl.create();
      alert.setTitle('Remove User');

      let isChecked = true;
      this.leagueTable.forEach(user => {
        let id;
        if (user.id != userId) {
          id = user.id
        } else {
          id = null;
        }

        alert.addInput({
          type: 'radio',
          label: user.firstName + " " + user.surname,
          value: id,
          checked: isChecked
        });

        isChecked = false;
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          this.showLeaveLeaguePrompt(data);
        }
      });
      alert.present();
    });
  }

  private showLeaveLeaguePrompt(userId?) {
    const name = this.leagueOverview.leagueName;

    let message;
    let title;
    if (userId) {
      title = 'Remove User?';
      message = "Are you sure you want to remove this user?";
    } else {
      title = 'Leave ' + name + '?';
      message = "Are you sure you want to leave this league?";
    }

    const prompt = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if (userId) {
              this.removeUser(userId)
            } else {
              this.leaveLeague();
            }
          }
        }
      ]
    });

    prompt.present();
  }

  private leaveLeague() {
    this.loading = Utils.showLoader('Leaving League...', this.loadingCtrl);
    this.storage.get('token').then((token) => {
      this.storage.get('userId').then((userId) => {
        const pin = this.leagueOverview.pin;

        this.standingsService.leaveLeague(token, userId, pin).then((result) => {
          this.loading.dismiss();
          this.data = result;

          Utils.presentToast("League left!", this.toastCtrl);
          Utils.refreshLeagues = true;
          this.navCtrl.popToRoot();

          let token = this.data.headers.get('X-Auth-Token');
          this.storage.set('token', token);
        }, (err) => {
          this.loading.dismiss();
          Utils.presentToast("Error leaving league, please try again", this.toastCtrl);
        });
      }, (error) => {
        this.loading.dismiss();
        Utils.presentToast("Error leaving league, please try again", this.toastCtrl);
      });
    }, (error) => {
      this.loading.dismiss();
      Utils.presentToast("Error leaving league, please try again", this.toastCtrl);
    });
  }

  private removeUser(userId) {
    this.loading = Utils.showLoader('Removing User...', this.loadingCtrl);
    this.storage.get('token').then((token) => {
      const pin = this.leagueOverview.pin;

      this.standingsService.leaveLeague(token, userId, pin).then((result) => {
        this.loading.dismiss();
        this.data = result;

        Utils.presentToast("User Removed!", this.toastCtrl);

        this.leagueTable = this.leagueTable.filter(user => user.id !== userId);
        this.displayedTable = this.displayedTable.filter(user => user.id !== userId);

        let token = this.data.headers.get('X-Auth-Token');
        this.storage.set('token', token);
      }, (err) => {
        this.loading.dismiss();
        Utils.presentToast("Error removing user, please try again", this.toastCtrl);
      });
    }, (error) => {
      this.loading.dismiss();
      Utils.presentToast("Error removing user, please try again", this.toastCtrl);
    });
  }

  private showChangeNamePrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Rename League',
      message: "Enter a new name for the league",
      inputs: [
        {
          name: 'name',
          placeholder: 'League Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Rename',
          handler: data => {
            const name = data.name;
            if(name == "") {
              this.showChangeNamePrompt();
            } else {
              this.changeName(name);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  private changeName(name) {
    this.loading = Utils.showLoader('Renaming League...', this.loadingCtrl);

    const pin = this.leagueOverview.pin;

    this.storage.get('token').then((token) => {
        this.standingsService.renameLeague(token, pin, name).then((result) => {
          this.loading.dismiss();

          Utils.presentToast("League renamed to "+ name + "!", this.toastCtrl);
          this.leagueOverview.leagueName = name;

          let token = this.data.headers.get('X-Auth-Token');
          this.storage.set('token', token);
        }, (err) => {
          this.loading.dismiss();
          Utils.presentToast("Error renaming league, please try again", this.toastCtrl);
        });
    }, (error) => {
      Utils.presentToast("Error renaming league, please try again", this.toastCtrl);
    });
  }

  private jumpToUserPosition() {
    this.storage.get('userId').then((userId) => {
      const position = this.leagueTable.map(e => e.id).indexOf(Number(userId));
      const id = "user" + userId;

      if (position > this.currentIndex) {
        this.displayedTable = this.displayedTable.concat(this.leagueTable.slice(this.currentIndex, position + 1));
        this.currentIndex = this.displayedTable.length;
        let that = this;
        setTimeout(function() {that.scroll(id) }, 100);
      } else {
        this.scroll(id);
      }

    });
  }

  private scroll(element) {
    if (document.getElementById(element)) {
      (<HTMLElement>document.getElementById("scrollButton")).setAttribute("disabled","disabled");

      const yOffset = (<HTMLElement>document.getElementById(element)).offsetTop;
      this.content.scrollTo(0, yOffset, 500).then(() => {
        this.enableScrollButton();
      }, () => {
        this.enableScrollButton();
      });
    }
  }

  private enableScrollButton() {
    (<HTMLElement>document.getElementById("scrollButton")).removeAttribute("disabled");
  }

  private openPredictionSummary(firstName, userId, score) {
    this.navCtrl.push(PredictionSummaryPage, { 'firstName': firstName, 'userId' : userId, 'score' : score });
  }
}
