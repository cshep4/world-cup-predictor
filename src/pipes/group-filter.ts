import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'matchfilter',
  pure: false
})
export class GroupFilter implements PipeTransform {
  transform(items: any[], filters: any): any {
    if (!items || !filters) {
      return items;
    }

    let phase;
    let groupStage;
    if (filters.phase.indexOf('Group ') >= 0){
      groupStage = true;
      phase = filters.phase.slice(-1);
    } else {
      groupStage = false;
      phase = filters.phase;
    }

    if (groupStage) {
      return items.filter(item => item.group == phase);
    } else {
      return items.filter(item => this.isCorrectPhase(item, phase))
    }
  }

  isCorrectPhase(item, phase) {
    if (phase == "Last 16") {
      return item.matchday == 4;
    } else if (phase == "Quarter Final") {
      return item.matchday == 5;
    } else if (phase == "Semi Final") {
      return item.matchday == 6;
    } else if (phase == "3rd Place Play-Off") {
      return item.matchday == 7;
    } else if (phase == "Final") {
      return item.matchday == 8;
    }

    return false;
  }
}
