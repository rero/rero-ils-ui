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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
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
  private remoteSearchBarConfig: RemoteSearchConfig = inject(RemoteSearchConfig);

  // You must use lowercase variable names for this to work in a web component.
  // Use @Input in this case, as the web component does not work with input (signal).
  @Input() admin: boolean | string = true;
  @Input() maxlengthsuggestion: number | string = 100;
  @Input() placeholder: string = 'search';
  @Input() viewcode: string | undefined;

  hideSearchElement: boolean = false;
  recordTypes: IRecordType[] = [];
  value: string | undefined;

  /** Resources involved in hiding the search area */
  private hideSearchResources = ['documents'];

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.admin = this.boolean(this.admin);
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

  onSelect(element: any) {
    if (!('link' in element)) {
      throw new Error('Missing parameter link');
    }
    this.value = '';
    this.router.navigateByUrl(element.link);
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
