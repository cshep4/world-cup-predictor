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

    return items.filter(item => item.group == filters.group);
  }
}
