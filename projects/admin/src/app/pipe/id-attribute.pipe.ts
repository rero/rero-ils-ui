import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idAttribute'
})

export class IdAttributePipe implements PipeTransform {

  transform(value: any, options?: {prefix?: string|null, suffix?: string|null}, ...args: any[]): any {
    // If no options, return only value
    if (!options) {
      return value;
    }

    let parts = [options.prefix || null, value, options.suffix || null];
    parts = parts.filter(v => v !== null);
    return parts.join('-');
  }

}
