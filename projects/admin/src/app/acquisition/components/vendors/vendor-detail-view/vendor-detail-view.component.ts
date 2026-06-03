/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { AddressTypeComponent } from '../../address-type/address-type.component';
import { TranslateLanguagePipe } from '@rero/ng-core';

@Component({
    selector: 'admin-vendor-detail-view',
    templateUrl: './vendor-detail-view.component.html',
    imports: [TranslateDirective, Bind, Tag, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, AddressTypeComponent, TranslateLanguagePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorDetailViewComponent {

  private translateService: TranslateService = inject(TranslateService);

  /** Record data */
  readonly record = input<any>();

  /** Resource type */
  readonly type = input<string>('');

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this.translateService.getCurrentLang();
  }

  filterContact(contacts: any[], type: string): any {
    const contact = contacts.filter((contact: any) => contact.type === type);
    return contact.length === 0 ? undefined : contact[0];
  }

  tabSelected(record: any): string {
    if (record.contacts.some((contact: any) => contact.type === 'default')) {
      return 'default';
    }
    if (record.contacts.some((contact: any) => contact.type === 'order')) {
      return 'order';
    }
    if (record.contacts.some((contact: any) => contact.type === 'serial')) {
      return 'serial';
    }
  }
}
