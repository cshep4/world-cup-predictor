import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-standings',
  templateUrl: 'standings.html'
})
export class StandingsPage {
  standingsType;

  constructor(public navCtrl: NavController) {
    this.standingsType = "current";
  }

}
