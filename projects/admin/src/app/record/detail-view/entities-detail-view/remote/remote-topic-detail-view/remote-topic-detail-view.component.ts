// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'admin-remote-topic-detail-view',
    templateUrl: './remote-topic-detail-view.component.html',
    imports: [TranslateDirective, Bind, Tag, NgTemplateOutlet, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteTopicDetailViewComponent implements OnInit{

  /** Record metadata */
  record = input<any>();

  /** Record source */
  source = input<string>();

  exactMatch = [];
  closeMatch = [];

  ngOnInit(): void {
    this.exactMatch = this.identifiedByUriFilter(this.record().exactMatch);
    this.closeMatch = this.identifiedByUriFilter(this.record().closeMatch);
  }
  identifiedByUriFilter(match: any[]): any[] {
    return match?.map((m: any) => {
      const element = {
        authorized_access_point: m.authorized_access_point,
        source: m.source
      };
      const uris = m.identifiedBy?.filter((id: any) => id.type === 'uri') || [];
      if (uris.length > 0) {
        element['uri'] = uris.shift().value;
      }

      return element;
    });
  }
}
