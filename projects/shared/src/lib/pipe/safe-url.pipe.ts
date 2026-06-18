// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {

  protected domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(url: any) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
