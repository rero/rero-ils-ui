/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RecordPermissions } from '../classes/permissions';

@Injectable({
  providedIn: 'root'
})
export class RecordPermissionService {

  /** http client options */
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  /**
   * Constructor
   * @param _httpClient - HttpClient
   * @param _translateService - TranslateService
   */
  constructor(
    private _httpClient: HttpClient,
    private _translateService: TranslateService
  ) { }

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
    return this._httpClient.get<RecordPermissions>(url, this._httpOptions);
  }


  /**
   * Get roles that the current user can manage
   * @return an observable on allowed roles management
   */
  getRolesManagementPermissions(): Observable<any> {
    return this._httpClient.get('api/patrons/roles_management_permissions', this._httpOptions);
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
      this._translateService.currentLang
    ));
    const messages = [];
    // Links
    if ('links' in reasons) {
      const pluralDict = this.plurialLinksMessages();
      Object.keys(reasons.links).forEach(link => {
        const message = (link in pluralDict)
          ? translatePlural.transform(reasons.links[link], pluralDict[link], this._translateService.currentLang)
          : reasons.links[link][link] + ' ' + link;
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

    if (messages.length > 0) {
      switch (messageType) {
        case 'delete':
          messages.unshift(
            messages.length === 1
              ? this._translateService.instant('You cannot delete the record for the following reason:')
              : this._translateService.instant('You cannot delete the record for the following reasons:')
          );
          break;
        case 'request':
          messages.unshift(
            messages.length === 1
              ? this._translateService.instant('You cannot request the record for the following reason:')
              : this._translateService.instant('You cannot request the record for the following reasons:')
          );
          break;
        default:
          messages.unshift(
            messages.length === 1
              ? this._translateService.instant('You cannot operate the record for the following reason:')
              : this._translateService.instant('You cannot operate this record for the following reasons:')
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
   * @returns permissions of current record
   */
  membership(user: any, libraryPid: string, permission: any): any {
    if (user.isSystemLibrarian && user.currentLibrary !== libraryPid) {
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
        '=1': this._translateService.instant('has 1 acquisition order line attached'),
        other: this._translateService.instant('has # acquisition order lines attached')
      },
      acq_orders: {
        '=1': this._translateService.instant('has 1 acquisition order attached'),
        other: this._translateService.instant('has # acquisition orders attached')
      },
      acq_accounts: {
        '=1': this._translateService.instant('has 1 acquisition account attached'),
        other: this._translateService.instant('has # acquisition account attached')
      },
      budgets: {
        '=1': this._translateService.instant('has 1 budget attached'),
        other: this._translateService.instant('has # budgets attached')
      },
      circ_policies: {
        '=1': this._translateService.instant('has 1 circulation policy attached'),
        other: this._translateService.instant('has # circulation policies attached')
      },
      documents: {
        '=1': this._translateService.instant('has 1 document attached'),
        other: this._translateService.instant('has # documents attached')
      },
      fees: {
        '=1': this._translateService.instant('has 1 fee attached'),
        other: this._translateService.instant('has # fees attached')
      },
      holdings: {
        '=1': this._translateService.instant('has 1 holding attached'),
        other: this._translateService.instant('has # holdings attached')
      },
      item_types: {
        '=1': this._translateService.instant('has 1 item type attached'),
        other: this._translateService.instant('has # item types attached')
      },
      items: {
        '=1': this._translateService.instant('has 1 item attached'),
        other: this._translateService.instant('has # items attached')
      },
      libraries: {
        '=1': this._translateService.instant('has 1 library attached'),
        other: this._translateService.instant('has # libraries attached')
      },
      loans: {
        '=1': this._translateService.instant('has 1 loan attached'),
        other: this._translateService.instant('has # loans attached')
      },
      locations: {
        '=1': this._translateService.instant('has 1 location attached'),
        other: this._translateService.instant('has # locations attached')
      },
      organisations: {
        '=1': this._translateService.instant('has 1 organisation attached'),
        other: this._translateService.instant('has # organisations attached')
      },
      patron_types: {
        '=1': this._translateService.instant('has 1 patron type attached'),
        other: this._translateService.instant('has # patron types attached')
      },
      patrons: {
        '=1': this._translateService.instant('has 1 patron attached'),
        other: this._translateService.instant('has # patrons attached')
      }
    };
  }

  /**
   * Others messages
   * @return array
   */
  private othersMessages() {
    return {
      is_default: this._translateService.instant('The default record cannot be deleted'),
      has_settings: this._translateService.instant('The record contains settings'),
      harvested: this._translateService.instant('The record has been harvested'),
      regular_issue_cannot_be_deleted: this._translateService.instant('A regular issue cannot be deleted'),
      record_not_in_current_library: this._translateService.instant('The record does not belong to the current library.')
    };
  }
}
