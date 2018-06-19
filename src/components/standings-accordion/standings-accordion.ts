import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResultsPage} from "../../pages/results/results";

@Component({
  selector: 'standings-accordion',
  templateUrl: 'standings-accordion.html'
})
export class StandingsAccordion {
  @Input() tables: any;
  @Input() isReal: boolean;

  constructor(private navCtrl: NavController) {}

  toggleSection(i) {
    this.tables[i].open = !this.tables[i].open;
  }

  toggleItem(i, j) {
    this.tables[i].standings[j].open = !this.tables[i].standings[j].open;
  }

  private openResults(group) {
    this.navCtrl.push(ResultsPage, { 'group': group });
  }
}
