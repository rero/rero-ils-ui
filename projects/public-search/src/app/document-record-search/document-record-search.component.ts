// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { AppConfigService } from '../app-config.service';
import { RecordSearchPageComponent } from '@rero/ng-core';

@Component({
    selector: 'public-search-document-record-search',
    templateUrl: './document-record-search.component.html',
    imports: [RecordSearchPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentRecordSearchComponent implements OnInit {

  private appConfigService: AppConfigService = inject(AppConfigService);
  private urlSerializer: UrlSerializer = inject(UrlSerializer);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  uriGlobalView: string;

  ngOnInit() {
    this.uriGlobalView = this._convertUrlForGlobalView();
  }

  /** Convert url for global view redirect */
  private _convertUrlForGlobalView() {
    const { queryParams } = this.route.snapshot;
    const segments = this.router.parseUrl(this.router.url)
      .root.children.primary.segments.map(it => it.path);
    segments[0] = this.appConfigService.globalViewName;
    const baseUri = '/' + segments.join('/');
    const tree = this.router.createUrlTree([baseUri], { queryParams });
    return this.urlSerializer.serialize(tree);
  }
}
