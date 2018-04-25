import {Component} from '@angular/core';

import {NavController, Platform} from 'ionic-angular';
import Utils from "../../utils/utils";
import {AdMobFree} from "@ionic-native/admob-free";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  chats = [
    {
      img: './assets/avatar-cher.png',
      name: 'Cher',
      message: 'Ugh. As if.',
      time: '9:38 pm'
    }, {
      img: './assets/avatar-dionne.png',
      name: 'Dionne',
      message: 'Mr. Hall was way harsh.',
      time: '8:59 pm'
    }, {
      img: './assets/avatar-murray.png',
      name: 'Murray',
      message: 'Excuse me, "Ms. Dione."',
      time: 'Wed'
    }];

  constructor(public navCtrl: NavController,
              public admob: AdMobFree,
              public plt: Platform) {}

  ionViewDidEnter() {
    Utils.showBanner(this.plt, this.admob);
  }

}
