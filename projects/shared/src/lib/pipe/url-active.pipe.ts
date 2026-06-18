// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'urlActive' })
export class UrlActivePipe implements PipeTransform {

  transform(text: string, target = '_self'): any {
    let output = text;
    const re = new RegExp(/(https?:\/\/[\w|.|\-|/]+)/, 'gm');
    let match: RegExpExecArray;
       while ((match = re.exec(text)) !== null) {
      const url = match[0];
      output = output.replace(url, `<a href="${url}" target="${target}">${url}</a>`);
    }
    return output;
  }

}
