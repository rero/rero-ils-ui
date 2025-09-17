/*
 * RERO ILS UI
 * Copyright (C) 2024-2025 RERO
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
import { DOCUMENT } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { IRecordType } from '@rero/ng-core';
import { filter, Subscription } from 'rxjs';
import { UserService } from '../../service/user.service';
import { RemoteSearchConfig } from './remote-search-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'shared-remote-search',
    templateUrl: './remote-search.component.html',
    providers: [RemoteSearchConfig],
    standalone: false
})
export class RemoteSearchComponent implements OnInit, OnDestroy {

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private remoteSearchBarConfig: RemoteSearchConfig = inject(RemoteSearchConfig);
  private document: Document = inject(DOCUMENT);
  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);

  // You must use lowercase variable names for this to work in a web component.
  // Use @Input in this case, as the web component does not work with input (signal).
  @Input() maxlengthsuggestion: number | string = 100;
  @Input() placeholder = 'search';
  @Input() viewcode: string | undefined;
  @Input() language;
  @Input() inputstyleclass: string;
  @Input() styleclass: string;
  @Input() internalRoutingBaseURL: string | undefined;

  admin: boolean;
  hideSearchElement = false;
  recordTypes: IRecordType[] = [];
  value: string | undefined;

  /** Resources involved in hiding the search area */
  private hideSearchResources = ['documents'];

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    if (this.language) {
      this.translateService.use(this.language);
    }
    this.admin = Boolean(this.internalRoutingBaseURL);
    this.subscription.add(this.route.queryParamMap.subscribe((params: any) => {this.value = params.get('q')}));
    this.recordTypes = this.remoteSearchBarConfig.getConfig(
      this.admin,
      this.viewcode,
      +this.maxlengthsuggestion
    );
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.hideSearchElement = this.hideSearchInput())
    );
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  onSearch(query: any) {
    if (!(typeof query === 'string')) {
      query = query.originalLabel;
    }
    if (this.internalRoutingBaseURL) {
      this.router.navigate([this.internalRoutingBaseURL], {
        queryParams: {
          ...{ page: '1', size: '10', organisation: this.userService.user.currentOrganisation },
          q: query
        }
      });
    } else {
      this.document.location.href = `/${this.viewcode}/search/documents?q=${query}&page=1&size=10&sort=bestmatch`;
    }
  }

  private hideSearchInput(): boolean {
    if (!this.admin) {
      return false;
    }
    const paths = [];
    this.router.parseUrl(this.router.url).root.children.primary?.segments
      .some((segment: UrlSegment) => { paths.push(segment.path); });
    const resourceFlag = paths.some((path: string) => this.hideSearchResources.includes(path));
    if (!resourceFlag) {
      return false;
    } else {
      const detailFlag = paths.includes('detail') || paths.includes('new');
      return !(resourceFlag && detailFlag);
    }
  }
}
