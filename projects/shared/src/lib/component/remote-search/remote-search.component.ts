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

import { ChangeDetectionStrategy, Component, DOCUMENT, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import type { AutoCompleteRecordType } from '@rero/ng-core';
import { SearchAutocompleteComponent, UpperCaseFirstPipe } from '@rero/ng-core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';
import { AppStore } from '../../store/app.store';
import { RemoteSearchConfig } from './remote-search-config.service';

@Component({
  selector: 'shared-remote-search',
  templateUrl: './remote-search.component.html',
  providers: [RemoteSearchConfig],
  imports: [SearchAutocompleteComponent, TranslatePipe, UpperCaseFirstPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteSearchComponent implements OnInit, OnDestroy {

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private remoteSearchBarConfig: RemoteSearchConfig = inject(RemoteSearchConfig);
  private document: Document = inject(DOCUMENT);
  private appStore = inject(AppStore);
  private translateService: TranslateService = inject(TranslateService);

  // You must use lowercase variable names for this to work in a web component.
  // Use @Input in this case, as the web component does not work with input (signal).
  readonly maxlengthsuggestion = input<number | string>(100);
  readonly placeholder = input('search');
  readonly viewcode = input<string | undefined>(undefined);
  readonly language = input(undefined);
  readonly inputstyleclass = input<string | undefined>(undefined);
  readonly styleclass = input<string | undefined>(undefined);
  readonly internalRoutingBaseURL = input<string | undefined>(undefined);

  admin = false;
  hideSearchElement = signal(false);
  recordTypes: AutoCompleteRecordType[] = [];
  value = signal<string | undefined>(undefined);

  /** Resources involved in hiding the search area */
  private hideSearchResources = ['documents'];

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    const language = this.language();
    if (language) {
      this.translateService.use(language);
    }
    this.admin = Boolean(this.internalRoutingBaseURL());
    this.subscription.add(
      this.route.queryParamMap.subscribe((params: any) => this.value.set(params.get('q') ?? undefined))
    );
    this.recordTypes = this.remoteSearchBarConfig.getConfig(
      this.admin,
      this.viewcode(),
      +this.maxlengthsuggestion()
    );
    this.hideSearchElement.set(this.hideSearchInput());
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.hideSearchElement.set(this.hideSearchInput()))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(query: any): void {
    if (!(typeof query === 'string')) {
      query = query.originalLabel;
    }
    const internalRoutingBaseURL = this.internalRoutingBaseURL();
    if (internalRoutingBaseURL) {
      this.router.navigate([internalRoutingBaseURL], {
        queryParams: {
          page: '1',
          size: '10',
          organisation: this.appStore.currentOrganisationPid(),
          q: query,
          simple: 1
        }
      });
    } else {
      this.document.location.href = `/${this.viewcode()}/search/documents?q=${query}&page=1&size=10&sort=bestmatch`;
    }
  }

  private hideSearchInput(): boolean {
    if (!this.admin) {
      return false;
    }
    const paths: string[] = [];
    this.router.parseUrl(this.router.url).root.children.primary?.segments
      .forEach((segment: UrlSegment) => paths.push(segment.path));
    const resourceFlag = paths.some((path: string) => this.hideSearchResources.includes(path));
    if (!resourceFlag) {
      return false;
    }
    const detailFlag = paths.includes('detail') || paths.includes('new');
    return !(resourceFlag && detailFlag);
  }
}
