import {Component, Input} from "@angular/core";

@Component({
  selector: 'predictions-accordion',
  templateUrl: 'predictions-accordion.html'
})
export class PredictionsAccordion {
  @Input() predictions: any;

  toggleSection(i) {
    this.predictions[i].open = !this.predictions[i].open;
  }

  toggleItem(i, j) {
    this.predictions[i].standings[j].open = !this.predictions[i].standings[j].open;
  }
}
