// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectionStrategy, Component, DOCUMENT, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import type { AutoCompleteRecordType } from '@rero/ng-core';
import { SearchAutocompleteComponent, UpperCaseFirstPipe } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';
import { AppStore } from '../../store/app.store';
import { RemoteSearchConfig } from './remote-search-config.service';

@Component({
  selector: 'shared-remote-search',
  templateUrl: './remote-search.component.html',
  providers: [RemoteSearchConfig],
  imports: [SearchAutocompleteComponent, UpperCaseFirstPipe],
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
  readonly inputstyleclass = input<string|undefined>();
  readonly styleclass = input<string | undefined>(undefined);
  readonly internalRoutingBaseURL = input<string | undefined>(undefined);

  /** Bumped on every language switch so the placeholder re-resolves. */
  private languageChange = toSignal(this.translateService.onLangChange, { initialValue: null });

  /**
   * The placeholder can be provided as a translation key (the default `search`
   * used in the admin view) or as an already-localized string coming from the DB
   * (public homepage config). `instant()` handles both — known keys are translated,
   * unknown strings are returned verbatim — and, unlike the `translate` pipe's async
   * `get()`, it never yields an empty value while the web component is still loading.
   */
  readonly translatedPlaceholder = computed(() => {
    this.languageChange();
    const value = this.placeholder();
    return value ? this.translateService.instant(value) : value;
  });

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
