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
import { EventEmitter, Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuTranslateService {
  private translateService = inject(TranslateService);
  private userService = inject(UserService);

  private onProcess = new EventEmitter<MenuItem[]>();

  get onProcess$(): Observable<MenuItem[]> {
    return this.onProcess.asObservable();
  }

  // Available variables for menu definitions.
  private REPLACEMENT_VARIABLES = {
    $currentLibrary: () => this.userService.user.currentLibrary,
    $currentOrganisation: () => this.userService.user.currentOrganisation,
    $symbolName: () => this.userService.user.symbolName,
    $currentBudget: () => this.userService.user.currentBudget,
    $currentDayRange: () => {
      const today = new Date()
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${this.resetDate(today)}--${this.resetDate(tomorrow)}`;
    }
  };

  process(menuItems: MenuItem[]): MenuItem[] {
    menuItems.map((item: MenuItem) => {
      item.label = this.translateLabel(item);
      if (item.routerLink) {
        item.routerLink = this.processRouterLink(item.routerLink);
      }
      if (item.queryParams) {
        item.queryParams = this.processQueryParams(item.queryParams);
      }
      if (item.items) {
        item.items = this.process(item.items);
      }
    });

    this.onProcess.emit(menuItems);

    return menuItems;
  }

  private translateLabel(item: MenuItem): string {
    if (item?.translateLabel?.startsWith('$')) {
      if (!this.hasVariableAvailable(item.translateLabel)) {
        throw new EvalError(`Label exception: This variable "${item.translateLabel}" is not available.`);
      }
      return String(this.REPLACEMENT_VARIABLES[item.translateLabel]())
    } else {
      return item.translateLabel ? this.translateService.instant(item.translateLabel) : item.label;
    }
  }

  private processRouterLink(routerLink: string[]): string[] {
    return routerLink.map((link: string) => {
      if (link.startsWith('$')) {
        if (!this.hasVariableAvailable(link)) {
          throw new EvalError(`RouterLink exception: This variable "${link}" is not available.`);
        }
        link = String(this.REPLACEMENT_VARIABLES[link]());
      }
      return link;
    });
  }

  private processQueryParams(queryParams: object): object {
    Object.keys(queryParams)
      .filter((key: string) => String(queryParams[key]).startsWith('$'))
      .map((key: string) => {
        if (String(queryParams[key]).startsWith('$')) {
          if (!this.hasVariableAvailable(queryParams[key])) {
            throw new EvalError(`Query Param exception: This variable "${queryParams[key]}" is not available.`);
          }
          queryParams[key] = String(this.REPLACEMENT_VARIABLES[queryParams[key]]());
        }
      });
    return queryParams;
  }

  private hasVariableAvailable(name: string): boolean {
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
