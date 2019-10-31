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
import { ActionStatus } from '@rero/ng-core';
import { Observable, Subscriber, of } from 'rxjs';
import { I18nPluralPipe, NgLocaleLocalization } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export class RecordStatus {

  static translateService: TranslateService;

  static canUpdate(record: any) {
    if (
      record.permissions
      && record.permissions.cannot_update
    ) {
      return of(false);
    }
    return of(true);
  }

  static canDelete(record: any): Observable<ActionStatus> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      if (
        record.permissions
        && record.permissions.cannot_delete
        && record.permissions.cannot_delete.permission
        && record.permissions.cannot_delete.permission === 'permission denied') {
        observer.next({ can: false, message: '' });
      } else {
        observer.next({ can: !RecordStatus.generateMessage(record), message: RecordStatus.generateMessage(record) });
        RecordStatus.translateService.onLangChange.subscribe(() => {
          observer.next({ can: !RecordStatus.generateMessage(record), message: RecordStatus.generateMessage(record) });
        });
      }
    });

    return obs;
  }

  private static generateMessage(record: any) {
    if (('cannot_delete' in record.permissions)) {
      const translatePlural = new I18nPluralPipe(new NgLocaleLocalization(
        RecordStatus.translateService.currentLang
      ));
      const messages = [];
      const cannotDelete = record.permissions.cannot_delete;
      if ('links' in cannotDelete) {
        const links = record.permissions.cannot_delete.links;
        const plurialdict = RecordStatus.plurialLinksMessages();
        Object.keys(links).forEach(link => {
          let message = null;
          if ((link in plurialdict)) {
            message = translatePlural.transform(
              links[link],
              plurialdict[link],
              RecordStatus.translateService.currentLang
            );
          } else {
            message = links[link][link] + ' ' + link;
          }
          messages.push('- ' + message);
        });
      }
      if ('others' in cannotDelete) {
        const plurialdict = RecordStatus.othersMessages();
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
          RecordStatus.translateService.instant('You cannot delete the record for the following reason:') :
          RecordStatus.translateService.instant('You cannot delete the record for the following reasons:')
      );

      return messages.join('\n');
    }

    return null;
  }

  private static plurialLinksMessages() {
    return {
      circ_policies: {
        '=1': RecordStatus.translateService.instant(_('has 1 circulation policy attached')),
        other: RecordStatus.translateService.instant(_('has # circulation policies attached'))
      },
      documents: {
        '=1': RecordStatus.translateService.instant(_('has 1 document attached')),
        other: RecordStatus.translateService.instant(_('has # documents attached'))
      },
      item_types: {
        '=1': RecordStatus.translateService.instant(_('has 1 item type attached')),
        other: RecordStatus.translateService.instant(_('has # item types attached'))
      },
      items: {
        '=1': RecordStatus.translateService.instant(_('has 1 item attached')),
        other: RecordStatus.translateService.instant(_('has # items attached'))
      },
      libraries: {
        '=1': RecordStatus.translateService.instant(_('has 1 library attached')),
        other: RecordStatus.translateService.instant(_('has # libraries attached'))
      },
      loans: {
        '=1': RecordStatus.translateService.instant(_('has 1 loan attached')),
        other: RecordStatus.translateService.instant(_('has # loans attached'))
      },
      locations: {
        '=1': RecordStatus.translateService.instant(_('has 1 location attached')),
        other: RecordStatus.translateService.instant(_('has # locations attached'))
      },
      organisations: {
        '=1': RecordStatus.translateService.instant(_('has 1 organisation attached')),
        other: RecordStatus.translateService.instant(_('has # organisations attached'))
      },
      patron_types: {
        '=1': RecordStatus.translateService.instant(_('has 1 patron type attached')),
        other: RecordStatus.translateService.instant(_('has # patron types attached'))
      },
      patrons: {
        '=1': RecordStatus.translateService.instant(_('has 1 patron attached')),
        other: RecordStatus.translateService.instant(_('has # patrons attached'))
      }
    };
  }

  private static othersMessages() {
    return {
      is_default: RecordStatus.translateService.instant(_('The default record cannot be deleted')),
      has_settings: RecordStatus.translateService.instant(_('The record contains settings')),
      harvested: RecordStatus.translateService.instant(_('The record has been harvested'))
    };
  }
}
