// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { MenuItem } from 'primeng/api';

type ReplacementVariableName = keyof MenuTranslateService['REPLACEMENT_VARIABLES'];
type QueryParams = Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class MenuTranslateService {
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);

  // Available variables for menu definitions.
  public REPLACEMENT_VARIABLES = {
    $currentLibrary: () => this.appStore.currentLibraryPid(),
    $currentOrganisation: () => this.appStore.currentOrganisationPid(),
    $symbolName: () => this.appStore.user()?.symbolName,
    $currentBudget: () => this.appStore.currentBudgetPid(),
    $currentDayRange: () => {
      const today = new Date()
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${this.resetDate(today)}--${this.resetDate(tomorrow)}`;
    }
  };

  process(menuItems: MenuItem[]): MenuItem[] {
    const clonedMenuItems = cloneDeep(menuItems);

    clonedMenuItems.forEach((item: MenuItem) => {
      item.label = this.translateLabel(item);
      if (item.routerLink) {
        item.routerLink = this.processRouterLink(item.routerLink);
      }
      if (item.queryParams) {
        item.queryParams = this.processQueryParams(item.queryParams as QueryParams);
      }
      if (item.items) {
        item.items = this.process(item.items);
      }
    });

    return clonedMenuItems;
  }

  private translateLabel(item: MenuItem): string {
    if (item?.translateLabel?.startsWith('$')) {
      if (!this.hasVariableAvailable(item.translateLabel as ReplacementVariableName)) {
        throw new EvalError(`Label exception: This variable "${item.translateLabel}" is not available.`);
      }
      return String(this.REPLACEMENT_VARIABLES[item.translateLabel as ReplacementVariableName]())
    } else {
      return item.translateLabel ? this.translateService.instant(item.translateLabel) : item.label;
    }
  }

  private processRouterLink(routerLink: string[]): string[] {
    return routerLink.map((link: string) => {
      if (link.startsWith('$')) {
        if (!this.hasVariableAvailable(link as ReplacementVariableName)) {
          throw new EvalError(`RouterLink exception: This variable "${link}" is not available.`);
        }
        link = String(this.REPLACEMENT_VARIABLES[link as ReplacementVariableName]());
      }
      return link;
    });
  }

  private processQueryParams(queryParams: QueryParams): QueryParams {
    Object.keys(queryParams)
      .filter((key: string) => String(queryParams[key]).startsWith('$'))
      .forEach((key: string) => {
        if (String(queryParams[key]).startsWith('$')) {
          const replacementName = String(queryParams[key]) as ReplacementVariableName;
          if (!this.hasVariableAvailable(replacementName)) {
            throw new EvalError(`Query Param exception: This variable "${queryParams[key]}" is not available.`);
          }
          queryParams[key] = String(this.REPLACEMENT_VARIABLES[replacementName]());
        }
      });
    return queryParams;
  }

  private hasVariableAvailable(name: ReplacementVariableName): boolean {
    return name in this.REPLACEMENT_VARIABLES;
  }

  /**
   * Reset a date at midnight for the same day. (2022-12-15T13:45:00.123 --> 1671062400000)
   * @param date: the date to transform
   * @returns The epoch of the transformed date in milliseconds.
   */
  private resetDate(date: Date): number {
    const timestamp = date.getTime();
    const millis_from_midnight = timestamp % 86400000;  // 86400000 millis in a day
    return timestamp - millis_from_midnight
  }
}
