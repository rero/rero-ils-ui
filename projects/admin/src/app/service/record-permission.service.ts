/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { I18nPluralPipe, NgLocaleLocalization } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RecordPermissions } from '../classes/permissions';

@Injectable({
  providedIn: 'root'
})
export class RecordPermissionService {

  private httpClient: HttpClient = inject(HttpClient);
  private translateService: TranslateService = inject(TranslateService);

  /** http client options */
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  /**
   * Get Permission by resource with pid
   * @param resource - string : the resource type
   * @param pid - string : the resource pid (optional)
   * @return Return an observable of RecordPermissions
   */
  getPermission(resource: string, pid?: string) {
    const url = (pid == null)
      ? `/api/permissions/${resource}`
      : `/api/permissions/${resource}/${pid}`;
    return this.httpClient.get<RecordPermissions>(url, this.httpOptions);
  }


  /**
   * Get roles that the current user can manage
   * @return an observable on allowed roles management
   */
  getRolesManagementPermissions(): Observable<any> {
    return this.httpClient.get('api/patrons/roles_management_permissions', this.httpOptions);
  }

  /**
   * Generate tooltip messages
   * @param reasons - Object with reasons to insert into the tooltip
   * @param type (optional) - The type of message to display ('delete', 'request')
   * @return string - The message to display
   */
  generateTooltipMessage(reasons: any, type?: string): string {
    const messageType = type || 'delete';
    const translatePlural = new I18nPluralPipe(new NgLocaleLocalization(
      this.translateService.currentLang
    ));
    const messages = [];

    if (reasons) {
      // Links
      if ('links' in reasons) {
        const pluralDict = this.plurialLinksMessages();
        Object.keys(reasons.links).forEach(link => {
          const message = (link in pluralDict)
            ? translatePlural.transform(reasons.links[link], pluralDict[link], this.translateService.currentLang)
            : `${reasons.links[link][link]} ${link}`;
          messages.push('- ' + message);
        });
      }
      // Others
      if ('others' in reasons) {
        const pluralDict = this.othersMessages();
        Object.keys(reasons.others).forEach(other => {
          const message = (other in pluralDict)
            ? pluralDict[other]
            : other;
          messages.push('- ' + message);
        });
      }
    }

    if (messages.length > 0) {
      switch (messageType) {
        case 'delete':
          messages.unshift(
            messages.length === 1
              ? this.translateService.instant('You cannot delete the record for the following reason:')
              : this.translateService.instant('You cannot delete the record for the following reasons:')
          );
          break;
        case 'request':
          messages.unshift(
            messages.length === 1
              ? this.translateService.instant('You cannot request the record for the following reason:')
              : this.translateService.instant('You cannot request the record for the following reasons:')
          );
          break;
        default:
          messages.unshift(
            messages.length === 1
              ? this.translateService.instant('You cannot operate the record for the following reason:')
              : this.translateService.instant('You cannot operate this record for the following reasons:')
          );
      }
    }
    return messages.join('\n');
  }

  /**
   * Generate Delete messages
   * @param reasons - Object
   * @return string
   */
  generateDeleteMessage(reasons: any): string {
    return this.generateTooltipMessage(reasons, 'delete');
  }

  /**
   * Membership
   * @param user - any
   * @param libraryPid - string
   * @param permission - any
   * @param membership - Check record ownership
   * @returns permissions of current record
   */
  membership(user: any, libraryPid: string, permission: any, membership: boolean = true): any {
    if (membership && user.currentLibrary !== libraryPid) {
      const membershipExcludePermission = {
        update: { can: false },
        delete: { can: false, reasons: { others: { record_not_in_current_library : '' }}}
      };
      permission = {...permission, ...membershipExcludePermission};
    }
    return permission;
  }

  /**
   * Plurial links messages
   * @return array
   */
  private plurialLinksMessages() {
    return {
      acq_order_lines: {
        "=1": this.translateService.instant("has 1 acquisition order line attached"),
        other: this.translateService.instant("has # acquisition order lines attached"),
      },
      acq_orders: {
        "=1": this.translateService.instant("has 1 acquisition order attached"),
        other: this.translateService.instant("has # acquisition orders attached"),
      },
      acq_receipt_lines: {
        "=1": this.translateService.instant("has 1 acquisition receipt line attached"),
        other: this.translateService.instant("has # acquisition receipts lines attached"),
      },
      acq_receipt: {
        "=1": this.translateService.instant("has 1 acquisition receipt attached"),
        other: this.translateService.instant("has # acquisition receipts attached"),
      },
      acq_accounts: {
        "=1": this.translateService.instant("has 1 acquisition account attached"),
        other: this.translateService.instant("has # acquisition accounts attached"),
      },
      budgets: {
        "=1": this.translateService.instant("has 1 budget attached"),
        other: this.translateService.instant("has # budgets attached"),
      },
      circ_policies: {
        "=1": this.translateService.instant("has 1 circulation policy attached"),
        other: this.translateService.instant("has # circulation policies attached"),
      },
      collections: {
        "=1": this.translateService.instant("has 1 exhibition/course attached"),
        other: this.translateService.instant("has # exhibitions/courses attached"),
      },
      documents: {
        "=1": this.translateService.instant("has 1 document attached"),
        other: this.translateService.instant("has # documents attached"),
      },
      fees: {
        "=1": this.translateService.instant("has 1 fee attached"),
        other: this.translateService.instant("has # fees attached"),
      },
      files: {
        "=1": this.translateService.instant("has 1 file repository attached"),
        other: this.translateService.instant("has # file repositories attached"),
      },
      holdings: {
        "=1": this.translateService.instant("has 1 holding attached"),
        other: this.translateService.instant("has # holdings attached"),
      },
      item_types: {
        "=1": this.translateService.instant("has 1 item type attached"),
        other: this.translateService.instant("has # item types attached"),
      },
      items: {
        "=1": this.translateService.instant("has 1 item attached"),
        other: this.translateService.instant("has # items attached"),
      },
      libraries: {
        "=1": this.translateService.instant("has 1 library attached"),
        other: this.translateService.instant("has # libraries attached"),
      },
      loans: {
        "=1": this.translateService.instant("has 1 loan attached"),
        other: this.translateService.instant("has # loans attached"),
      },
      locations: {
        "=1": this.translateService.instant("has 1 location attached"),
        other: this.translateService.instant("has # locations attached"),
      },
      organisations: {
        "=1": this.translateService.instant("has 1 organisation attached"),
        other: this.translateService.instant("has # organisations attached"),
      },
      patron_types: {
        "=1": this.translateService.instant("has 1 patron type attached"),
        other: this.translateService.instant("has # patron types attached"),
      },
      patrons: {
        "=1": this.translateService.instant("has 1 patron attached"),
        other: this.translateService.instant("has # patrons attached"),
      },
      reports: {
        "=1": this.translateService.instant("has 1 report attached"),
        other: this.translateService.instant("has # reports attached"),
      },
      rolled_over: {
        other: this.translateService.instant("Fiscal year closed"),
      },
      templates: {
        "=1": this.translateService.instant("has 1 template attached"),
        other: this.translateService.instant("has # templates attached"),
      },
      transactions: {
        "=1": this.translateService.instant("has 1 transaction attached"),
        other: this.translateService.instant("has # transactions attached"),
      },
    };
  }

  /**
   * Others messages
   * @return array
   */
  private othersMessages() {
    return {
      is_default: this.translateService.instant('The default record cannot be deleted'),
      has_settings: this.translateService.instant('The record contains settings'),
      harvested: this.translateService.instant('The record has been harvested'),
      regular_issue_cannot_be_deleted: this.translateService.instant('A regular issue cannot be deleted'),
      record_not_in_current_library: this.translateService.instant('The record does not belong to the current library.')
    };
  }
}
