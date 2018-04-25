import {Component} from "@angular/core";

import {ViewController} from "ionic-angular";

@Component({
  templateUrl: 'group-popover.html'
})
export class GroupPopover {
  constructor(public viewCtrl: ViewController) {}

  close(group) {
    this.viewCtrl.dismiss(group);
  }
}
