import {Component} from '@angular/core';

import {LoadingController, NavController, ToastController} from 'ionic-angular';
import Utils from "../../utils/utils";
import {TournamentService} from "../../providers/tournament-service";

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

  constructor(public navCtrl: NavController,
              public tournamentService: TournamentService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
    this.standingsType = "current";
  }

  ionViewDidEnter() {
    this.getStandings();
  }

  getStandings() {
    if (this.standingsType == "current") {
      if (!this.currentTables) {
        this.getCurrentLeagueTable();
      }
    } else {
      if (!this.predictedTables) {
        this.getPredictedLeagueTable();
      }
    }
  }

  getCurrentLeagueTable() {
    this.loading = Utils.showLoader('Loading Current Standings...', this.loadingCtrl);
    const token = localStorage.getItem('token');

    this.tournamentService.retrieveCurrentLeagueTable(token).then((result) => {
      this.loading.dismiss();
      this.data = result;
      this.currentTables = this.data.body.standings;
      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);
      console.log(this.currentTables);
    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast("Error loading standings", this.toastCtrl);
    });
  }

  getPredictedLeagueTable() {
    this.loading = Utils.showLoader('Loading Predicted Standings...', this.loadingCtrl);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    this.tournamentService.retrievePredictedLeagueTable(token, userId).then((result) => {
      this.loading.dismiss();
      this.data = result;
      this.predictedTables = this.data.body.standings;
      let token = this.data.headers.get('X-Auth-Token');
      localStorage.setItem('token', token);
      console.log(this.predictedTables);
    }, (err) => {
      this.loading.dismiss();
      Utils.presentToast("Error loading standings", this.toastCtrl);
    });
  }

  toggleSection(i) {
    this.currentTables[i].open = !this.currentTables[i].open;
  }

  toggleItem(i, j) {
    this.currentTables[i].children[j].open = !this.currentTables[i].children[j].open;
  }

}



// this.information =[
//   {
//     "name": "Group",
//     "children": [
//       {
//         "name": "Traditional",
//         "children": [
//           {
//             "name": "Pizza Salami",
//             "information": "Pork chop jowl capicola porchetta, kielbasa prosciutto boudin bacon pork pig.",
//             "price": "$10"
//           },
//           {
//             "name": "Pizza Prosciutto",
//             "information": "Pork chop pastrami landjaeger chuck brisket",
//             "price": "$12"
//           }
//         ]
//       },
//       {
//         "name": "Gourmet",
//         "children": [
//           {
//             "name": "Pizza Bombay",
//             "information": "Pastrami ham hock ball tip, tongue ribeye chuck ham beef bresaola leberkas.",
//             "price": "$13"
//           },
//           {
//             "name": "Pizza Crazy Dog",
//             "information": "Andouille spare ribs meatloaf swine ground round pork loin, brisket chuck bacon tongue.",
//             "price": "$14"
//           },
//           {
//             "name": "Pizza Italia",
//             "information": "Ribeye ham §-bone, tail ground round biltong picanha sausage rump corned beef.",
//             "price": "$11"
//           },
//           {
//             "name": "Pizza Tuna",
//             "information": "Pork chop pastrami landjaeger chuck brisket",
//             "price": "$14"
//           }
//         ]
//       },
//       {
//         "name": "Bestseller",
//         "children": [
//           {
//             "name": "Pizza Academy",
//             "information": "Frankfurter tail capicola cupim shankle salami, beef ribs beef boudin porchetta ball tip leberkas turkey tenderloin.",
//             "price": "$25"
//           },
//           {
//             "name": "Pizza Ionic",
//             "information": "Shank chuck tail, kevin shankle ham hock pork loin pork hamburger beef ribs.",
//             "price": "$19.99"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Knockout",
//     "children": [
//       {
//         "name": "Special Academy Pizza",
//         "information": " Landjaeger fatback shank frankfurter, tongue shoulder ham strip steak pancetta pork short loin corned beef short ribs biltong cow",
//         "price": "$25"
//       },
//       {
//         "name": "Pizza Ionic",
//         "information": "Pork chop pastrami landjaeger chuck brisket",
//         "price": "$19.99"
//       }
//     ]
//   }
// ];
