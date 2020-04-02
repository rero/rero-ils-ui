/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nPluralPipe, NgLocaleLocalization } from '@angular/common';

// TODO: Delete this service after refactoring of resource permission
@Injectable({
  providedIn: 'root'
})
export class RecordPermissionMessageService {

  constructor(private translateService: TranslateService) { }

  public generateMessage(record: any) {
    if (('cannot_delete' in record.permissions)) {
      const translatePlural = new I18nPluralPipe(new NgLocaleLocalization(
        this.translateService.currentLang
      ));
      const messages = [];
      const cannotDelete = record.permissions.cannot_delete;
      if ('links' in cannotDelete) {
        const links = record.permissions.cannot_delete.links;
        const plurialdict = this.plurialLinksMessages();
        Object.keys(links).forEach(link => {
          let message = null;
          if ((link in plurialdict)) {
            message = translatePlural.transform(
              links[link],
              plurialdict[link],
              this.translateService.currentLang
            );
          } else {
            message = links[link][link] + ' ' + link;
          }
          messages.push('- ' + message);
        });
      }
      if ('others' in cannotDelete) {
        const plurialdict = this.othersMessages();
        Object.keys(cannotDelete.others).forEach(other => {
          if ((other in plurialdict)) {
            messages.push('- ' + plurialdict[other]);
          } else {
            messages.push('- ' + other);
          }
        });
      }
      messages.unshift(
        messages.length === 1 ?
          this.translateService.instant('You cannot delete the record for the following reason:') :
          this.translateService.instant('You cannot delete the record for the following reasons:')
      );

      return messages.join('\n');
    }

    return null;
  }

  private plurialLinksMessages() {
    return {
      acq_order_lines: {
        '=1': this.translateService.instant('has 1 acquisition order line attached'),
        other: this.translateService.instant('has # acquisition order lines attached')
      },
      acq_orders: {
        '=1': this.translateService.instant('has 1 acquisition order attached'),
        other: this.translateService.instant('has # acquisition orders attached')
      },
      acq_accounts: {
        '=1': this.translateService.instant('has 1 acquisition account attached'),
        other: this.translateService.instant('has # acquisition accounts attached')
      },
      budgets: {
        '=1': this.translateService.instant('has 1 budget attached'),
        other: this.translateService.instant('has # budgets attached')
      },
      circ_policies: {
        '=1': this.translateService.instant('has 1 circulation policy attached'),
        other: this.translateService.instant('has # circulation policies attached')
      },
      documents: {
        '=1': this.translateService.instant('has 1 document attached'),
        other: this.translateService.instant('has # documents attached')
      },
      item_types: {
        '=1': this.translateService.instant('has 1 item type attached'),
        other: this.translateService.instant('has # item types attached')
      },
      items: {
        '=1': this.translateService.instant('has 1 item attached'),
        other: this.translateService.instant('has # items attached')
      },
      libraries: {
        '=1': this.translateService.instant('has 1 library attached'),
        other: this.translateService.instant('has # libraries attached')
      },
      loans: {
        '=1': this.translateService.instant('has 1 loan attached'),
        other: this.translateService.instant('has # loans attached')
      },
      locations: {
        '=1': this.translateService.instant('has 1 location attached'),
        other: this.translateService.instant('has # locations attached')
      },
      organisations: {
        '=1': this.translateService.instant('has 1 organisation attached'),
        other: this.translateService.instant('has # organisations attached')
      },
      patron_types: {
        '=1': this.translateService.instant('has 1 patron type attached'),
        other: this.translateService.instant('has # patron types attached')
      },
      patrons: {
        '=1': this.translateService.instant('has 1 patron attached'),
        other: this.translateService.instant('has # patrons attached')
      }
    };
  }

  private othersMessages() {
    return {
      is_default: this.translateService.instant('The default record cannot be deleted'),
      has_settings: this.translateService.instant('The record contains settings'),
      harvested: this.translateService.instant('The record has been harvested')
    };
  }
}
