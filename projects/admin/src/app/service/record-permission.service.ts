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
   * Get Permission by ressource with pid
   * @param resource - string
   * @param pid - string
   */
  getPermission(resource: string, pid: string) {
    return this._httpClient.get<RecordPermission>(
      `/api/permissions/${resource}/${pid}`,
      this._httpOptions
    );
  }

  /**
   * Generate Delete messages
   * @param reasons - Object
   * @return string
   */
  generateDeleteMessage(reasons: any) {
    const translatePlural = new I18nPluralPipe(new NgLocaleLocalization(
      this._translateService.currentLang
    ));
    const messages = [];

    // Links
    if ('links' in reasons) {
      const plurialdict = this.plurialLinksMessages();
      Object.keys(reasons.links).forEach(link => {
        let message = null;
        if ((link in plurialdict)) {
          message = translatePlural.transform(
            reasons.links[link],
            plurialdict[link],
            this._translateService.currentLang
          );
        } else {
          message = reasons.links[link][link] + ' ' + link;
        }
        messages.push('- ' + message);
      });
    }

    // Others
    if ('others' in reasons) {
      const plurialdict = this.othersMessages();
      Object.keys(reasons.others).forEach(other => {
        if ((other in plurialdict)) {
          messages.push('- ' + plurialdict[other]);
        } else {
          messages.push('- ' + other);
        }
      });
    }

    messages.unshift(
      messages.length === 1 ?
        this._translateService.instant('You cannot delete the record for the following reason:') :
        this._translateService.instant('You cannot delete the record for the following reasons:')
    );

    return messages.join('\n');
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
        other: this._translateService.instant('has # acquisition accounts attached')
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
      harvested: this._translateService.instant('The record has been harvested')
    };
  }
}

/**
 * Permission response structure
 */
export interface RecordPermission {
  update: {
    can: boolean,
  };
  delete: {
    can: boolean,
    reasons?: {
      others?: any,
      links?: any
    }
  };
}
