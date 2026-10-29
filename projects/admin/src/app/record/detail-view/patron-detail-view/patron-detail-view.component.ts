// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, I18nPluralPipe, NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from '@openng/optimus-ui/accordion';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { Message } from '@openng/optimus-ui/message';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import {
  AppStore,
  IPermissions,
  JoinPipe,
  LinkPermissionsDirective,
  PERMISSIONS,
  PermissionsDirective,
} from '@rero/shared';

import { roleTagSeverity } from '../../../utils/roles';
import { PatronPermissionsComponent } from './patron-permissions/patron-permissions.component';

type PatronPhone = {
  value: string;
  type?: string;
  weight: number;
};

@Component({
  selector: 'admin-patron-detail-view',
  templateUrl: './patron-detail-view.component.html',
  imports: [
    Bind,
    ButtonDirective,
    PermissionsDirective,
    RouterLink,
    Accordion,
    AccordionPanel,
    Ripple,
    AccordionHeader,
    AccordionContent,
    NgClass,
    Tag,
    LinkPermissionsDirective,
    PatronPermissionsComponent,
    AsyncPipe,
    I18nPluralPipe,
    TranslatePipe,
    DateTranslatePipe,
    GetRecordPipe,
    JoinPipe,
    Nl2brPipe,
    Message,
  ],
})
export class PatronDetailViewComponent {
  private appStore = inject(AppStore);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly permissions: IPermissions = PERMISSIONS;

  readonly patron = computed(() => this.record()?.metadata ?? null);
  readonly phones = computed(() => {
    const meta = this.record()?.metadata;
    return meta ? this._processPhones(meta) : [];
  });

  readonly canAccessDisplayPermissions = computed(() => this.appStore.canAccess(PERMISSIONS.PERM_MANAGEMENT));

  getRoleTagSeverity(role: string): string {
    return roleTagSeverity(role);
  }

  getNoteBadgeColor(noteType: string): string {
    switch (noteType) {
      case 'public_note':
        return 'info';
      case 'staff_note':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  private _processPhones(record: any): PatronPhone[] {
    const data: PatronPhone[] = [];
    if (record.mobile_phone) {
      data.push({ value: record.mobile_phone, type: 'Mobile', weight: 10 });
    }
    if (record.home_phone) {
      data.push({ value: record.home_phone, type: 'Home', weight: 7 });
    }
    if (record.business_phone) {
      data.push({ value: record.business_phone, type: 'Business', weight: 7 });
    }
    if (record.other_phone) {
      data.push({ value: record.other_phone, type: 'Other', weight: -1 });
    }
    return data.sort((a, b) => b.weight - a.weight);
  }
}
