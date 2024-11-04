/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Component, Inject, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { IRecordType } from '@rero/ng-core';
import { filter, Subscription } from 'rxjs';
import { RemoteSearchConfig } from './remote-search-config.service';

@Component({
  selector: 'shared-remote-search',
  templateUrl: './remote-search.component.html',
  providers: [RemoteSearchConfig]
})
export class RemoteSearchComponent implements OnInit, OnDestroy {

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private remoteSearchBarConfig: RemoteSearchConfig = inject(RemoteSearchConfig);
  private document: Document = inject(DOCUMENT);

  // You must use lowercase variable names for this to work in a web component.
  // Use @Input in this case, as the web component does not work with input (signal).
  @Input() admin: boolean | string = true;
  @Input() maxlengthsuggestion: number | string = 100;
  @Input() placeholder: string = 'search';
  @Input() viewcode: string | undefined;
  @Input() inputstyleclass: string;
  @Input() internalRouting = false;

  hideSearchElement: boolean = false;
  recordTypes: IRecordType[] = [];
  value: string | undefined;

  /** Resources involved in hiding the search area */
  private hideSearchResources = ['documents'];

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.admin = this.boolean(this.admin);
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

  onSearch(query) {
    if (this.internalRouting) {
      // TODO: internal navigation for the professional interface
    } else {
      this.document.location.href = `/${this.viewcode}/search/documents?q=${query}&page=1&size=10&sort=bestmatch`;
    }
  }

  onSelect(element: any) {
    if (!('link' in element)) {
      throw new Error('Missing parameter link');
    }
    this.value = '';
    if(this.internalRouting === true) {
      this.router.navigateByUrl(element.link);
    } else {
      this.document.location.href = element.link;
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

  private boolean(value: string | boolean): boolean {
    if (typeof value === 'string') {
      return 'true' === value;
    }

    return value;
  }
}
