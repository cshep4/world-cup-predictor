import {Component, Input} from "@angular/core";

@Component({
  selector: 'standings-accordion',
  templateUrl: 'standings-accordion.html'
})
export class StandingsAccordion {
  @Input() tables: any;

  toggleSection(i) {
    this.tables[i].open = !this.tables[i].open;
  }

  toggleItem(i, j) {
    this.tables[i].standings[j].open = !this.tables[i].standings[j].open;
  }
}
