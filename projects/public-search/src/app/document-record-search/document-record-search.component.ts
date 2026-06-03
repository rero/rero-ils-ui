/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
 * Copyright (C) 2020-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
