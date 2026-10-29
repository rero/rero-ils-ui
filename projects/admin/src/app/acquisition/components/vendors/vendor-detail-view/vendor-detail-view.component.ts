// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@openng/optimus-ui/tabs';
import { Tag } from '@openng/optimus-ui/tag';
import { TranslateLanguagePipe } from '@rero/ng-core';

import { AddressTypeComponent } from '../../address-type/address-type.component';

@Component({
  selector: 'admin-vendor-detail-view',
  templateUrl: './vendor-detail-view.component.html',
  imports: [
    Bind,
    Tag,
    Tabs,
    TabList,
    Ripple,
    Tab,
    TabPanels,
    TabPanel,
    AddressTypeComponent,
    TranslateLanguagePipe,
    TranslatePipe,
  ],
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
